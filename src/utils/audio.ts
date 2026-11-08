import { SoundPack } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTickSound(pack: SoundPack, volume = 0.8) {
  if (pack === 'silent' || volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), now);
  masterGain.connect(ctx.destination);

  switch (pack) {
    case 'mechanical-snap': {
      // Futuristic cybernetic snap: click impulse + bandpass resonance
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      clickGain.gain.setValueAtTime(1.0, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      // Add a subtle high-frequency neon click transient
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.01, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      noiseSource.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start(now);

      osc.connect(clickGain);
      clickGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'wooden-misbaha': {
      // Warm, tactile wooden knock
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.035);

      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      // Low pass filter to keep it woody
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
      break;
    }

    case 'crystal-chime': {
      // Ethereal crystal bead chime
      const freqs = [1760, 2640]; // A6 and harmonic
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (idx * 15), now);
        
        gain.gain.setValueAtTime(idx === 0 ? 0.6 : 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
      });
      break;
    }

    case 'soft-pulse': {
      // Minimalist deep sub-pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
      break;
    }
  }
}

export function playTargetCompletedChord(volume = 0.8) {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume * 0.7, now);
  masterGain.connect(ctx.destination);

  // Celebratory cybernetic chord: C5, E5, G5, B5, C6
  const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];

  chord.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + index * 0.06;
    const duration = 0.85;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.5 / (index + 1), startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  });
}

export function playSubThud(volume = 0.8) {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Deep resonant sub-frequency thud for heavy feedback
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

  gain.gain.setValueAtTime(volume * 0.9, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

export function triggerHaptic(type: 'tap' | 'snap' | 'complete' | 'heavy' = 'snap') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    if (type === 'tap') {
      navigator.vibrate(18);
    } else if (type === 'snap') {
      navigator.vibrate(35);
    } else if (type === 'heavy') {
      // Heavy deep tactile vibration pattern for Free Hand Mode
      navigator.vibrate([70, 40, 95]);
    } else if (type === 'complete') {
      navigator.vibrate([45, 55, 45, 55, 110]);
    }
  } catch {
    // Ignore unsupported browser environments
  }
}
