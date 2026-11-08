import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface UseVoiceCountingOptions {
  enabled: boolean;
  onIncrement: () => void;
}

export function useVoiceCounting({ enabled, onIncrement }: UseVoiceCountingOptions) {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 1 for visualizer
  const [lastHeardWord, setLastHeardWord] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onIncrementRef = useRef(onIncrement);
  onIncrementRef.current = onIncrement;

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      cleanupAudio();
      setIsListening(false);
      return;
    }

    let isCancelled = false;

    // Start Audio Spectrum Visualizer via getUserMedia
    const initAudioStream = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        let lastVolumePeakTime = 0;

        const checkAudio = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          // Calculate average energy
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(1, avg / 128);
          setAudioLevel(normalized);

          // Voice Syllable Fallback Peak Detector (if speech recognition has delay)
          // When vocal amplitude spikes above threshold with rhythm
          const now = performance.now();
          if (!recognitionRef.current && normalized > 0.45 && now - lastVolumePeakTime > 650) {
            lastVolumePeakTime = now;
            onIncrementRef.current();
            setLastHeardWord('Voice Pulse');
          }

          animFrameRef.current = requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (err: any) {
        console.warn('Microphone stream access unavailable:', err);
      }
    };

    // Initialize Web Speech Recognition
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechClass) {
      try {
        const recognition = new SpeechClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ar-SA, en-US';

        let lastRecognizedTime = 0;

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMsg(null);
        };

        recognition.onresult = (event: any) => {
          const results = event.results;
          if (!results || results.length === 0) return;

          const lastIndex = results.length - 1;
          const transcript = results[lastIndex][0]?.transcript?.trim().toLowerCase() || '';

          // Recognized Dhikr phrases
          const dhikrKeywords = [
            'subhanallah', 'subhan allah', 'سبحان الله',
            'alhamdulillah', 'alhamdu lillah', 'الحمد لله',
            'allahu akbar', 'allah akbar', 'الله أكبر', 'الله اكبر',
            'astaghfirullah', 'أستغفر الله', 'astagfirullah',
            'la ilaha illallah', 'لا إله إلا الله',
            'allah', 'الله', 'one', 'two', 'click', 'next'
          ];

          const hasKeyword = dhikrKeywords.some(keyword => transcript.includes(keyword));

          const now = performance.now();
          if ((hasKeyword || results[lastIndex].isFinal) && (now - lastRecognizedTime > 400)) {
            lastRecognizedTime = now;
            setLastHeardWord(transcript.slice(-20));
            onIncrementRef.current();
          }
        };

        recognition.onerror = (e: any) => {
          if (e.error !== 'no-speech') {
            setErrorMsg(e.error);
          }
        };

        recognition.onend = () => {
          // Restart if still enabled
          if (!isCancelled && enabled) {
            try {
              recognition.start();
            } catch {
              // ignore
            }
          } else {
            setIsListening(false);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e: any) {
        console.warn('SpeechRecognition failed to start:', e);
      }
    } else {
      setIsListening(true);
    }

    initAudioStream();

    return () => {
      isCancelled = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
      cleanupAudio();
      setIsListening(false);
    };
  }, [enabled, cleanupAudio]);

  return {
    isListening,
    audioLevel,
    lastHeardWord,
    errorMsg
  };
}
