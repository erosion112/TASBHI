import React, { useRef, useEffect, useCallback, useState } from 'react';
import { BeadStyle, ThemeMode, StrandPosition } from '../types';
import { THEMES } from '../utils/theme';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface CyberBeadsCanvasProps {
  theme: ThemeMode;
  beadStyle: BeadStyle;
  dragSensitivity: number; // e.g. 45
  currentCount: number;
  strandPosition?: StrandPosition;
  onIncrement: () => void;
  onTapHint?: () => void;
  disabled?: boolean;
}

export const CyberBeadsCanvas: React.FC<CyberBeadsCanvasProps> = ({
  theme,
  beadStyle,
  dragSensitivity,
  currentCount,
  strandPosition = 'left',
  onIncrement,
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Drag and glide physics state
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const currentDragYRef = useRef(0);
  const smoothedDragYRef = useRef(0);
  const recoilVelocityRef = useRef(0);
  const glideOffsetRef = useRef(0);
  const prevCountRef = useRef(currentCount);
  const hasTriggeredSnapRef = useRef(false);
  const lastSnapTimeRef = useRef(0);

  // Dynamic particle systems
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const ambientStarsRef = useRef<{ x: number; y: number; r: number; alpha: number; speed: number }[]>([]);

  // Drag indicator display for user guidance
  const [pullProgress, setPullProgress] = useState(0); // 0 to 1

  const currentTheme = THEMES[theme] || THEMES['cyber-emerald'];

  // Spawn explosive neon burst
  const triggerBurst = useCallback((x: number, y: number) => {
    const pCount = 28;
    const colors = [
      currentTheme.primaryNeon,
      currentTheme.secondaryNeon,
      '#FFFFFF',
      currentTheme.beadFillTop
    ];

    for (let i = 0; i < pCount; i++) {
      const angle = (Math.PI * 2 * i) / pCount + (Math.random() - 0.5) * 0.5;
      const speed = 2.5 + Math.random() * 5.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 1.0, // slight downward bias
        size: 2.2 + Math.random() * 3.5,
        alpha: 1,
        life: 0,
        maxLife: 35 + Math.random() * 25,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    shockwavesRef.current.push({
      x,
      y,
      radius: 12,
      maxRadius: 110,
      alpha: 0.9,
      color: currentTheme.primaryNeon
    });
  }, [currentTheme]);

  // Trigger physical glide animation whenever count advances on tap, button press, or free-hand auto mode
  useEffect(() => {
    if (currentCount !== prevCountRef.current) {
      if (currentCount > prevCountRef.current || (currentCount === 0 && prevCountRef.current > 0)) {
        if (!isDraggingRef.current) {
          glideOffsetRef.current = -68; // Smooth kinetic bead glide displacement
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const cx = strandPosition === 'center'
              ? rect.width / 2
              : strandPosition === 'right'
              ? (rect.width >= 768 ? rect.width * 0.78 : rect.width * 0.78)
              : (rect.width >= 768 ? Math.max(130, rect.width * 0.22) : Math.max(50, rect.width * 0.20));
            triggerBurst(cx, rect.height * 0.54);
          }
        }
      }
      prevCountRef.current = currentCount;
    }
  }, [currentCount, strandPosition, triggerBurst]);

  // Main canvas rendering & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;

    // Resize handler
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Initialize ambient digital star particles
      if (ambientStarsRef.current.length === 0) {
        ambientStarsRef.current = Array.from({ length: 45 }).map(() => ({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: 0.6 + Math.random() * 1.4,
          alpha: 0.15 + Math.random() * 0.45,
          speed: 0.2 + Math.random() * 0.5
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Spring physics constants
    const springK = 0.22;
    const damping = 0.72;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.save();

      // 1. Draw Deep Cybernetic Canvas Background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height * 0.5, 20,
        width / 2, height * 0.5, Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, currentTheme.bgDark === '#050D0A' ? '#0b261e' : currentTheme.bgDark === '#0E0904' ? '#281706' : currentTheme.bgDark === '#090510' ? '#240a3a' : '#0e1f38');
      bgGrad.addColorStop(0.5, currentTheme.bgDark);
      bgGrad.addColorStop(1, '#020306');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient floating starlight particles
      ambientStarsRef.current.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 225, 255, ${star.alpha * 0.5})`;
        ctx.fill();
      });

      // 3. Update spring physics for drag displacement
      if (isDraggingRef.current) {
        // Direct tracking with elastic smoothing
        smoothedDragYRef.current += (currentDragYRef.current - smoothedDragYRef.current) * 0.35;
      } else {
        // Spring recoil to resting position (0)
        const force = -springK * smoothedDragYRef.current;
        recoilVelocityRef.current = (recoilVelocityRef.current + force) * damping;
        smoothedDragYRef.current += recoilVelocityRef.current;

        // Damp small jitter
        if (Math.abs(smoothedDragYRef.current) < 0.1 && Math.abs(recoilVelocityRef.current) < 0.1) {
          smoothedDragYRef.current = 0;
          recoilVelocityRef.current = 0;
        }
      }

      // Smooth downward kinetic glide recovery on tap or automated free-hand progression
      glideOffsetRef.current += (0 - glideOffsetRef.current) * 0.22;
      if (Math.abs(glideOffsetRef.current) < 0.1) {
        glideOffsetRef.current = 0;
      }

      const activeDrag = smoothedDragYRef.current + glideOffsetRef.current;
      
      // Calculate horizontal strand anchor based on strandPosition ('left' | 'center' | 'right')
      const centerX = strandPosition === 'center'
        ? width / 2
        : strandPosition === 'right'
        ? (width >= 768 ? width * 0.78 : width * 0.78)
        : (width >= 768 ? Math.max(130, width * 0.22) : Math.max(50, width * 0.20));

      const centerY = height * 0.54; // Ergonomic thumb zone sweet spot

      // Draw subtle ambient vertical cyber track lane behind beads when shifted left or right
      if (strandPosition !== 'center') {
        const laneGlow = ctx.createLinearGradient(centerX - 50, 0, centerX + 50, 0);
        laneGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
        laneGlow.addColorStop(0.5, currentTheme.primaryNeon === '#00FF87' ? 'rgba(0, 255, 135, 0.05)' : 'rgba(0, 242, 254, 0.05)');
        laneGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = laneGlow;
        ctx.fillRect(centerX - 50, 0, 100, height);
      }

      // 4. Draw Misbaha Strand line with luminous glow
      ctx.save();
      ctx.beginPath();
      // Draw a gentle curved loop representing the woven cyber strand
      ctx.moveTo(centerX, -40);
      ctx.bezierCurveTo(
        centerX - 35, centerY * 0.5,
        centerX - 30, centerY + 180,
        centerX, height + 80
      );
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Glowing core line
      ctx.beginPath();
      ctx.moveTo(centerX, -40);
      ctx.bezierCurveTo(
        centerX - 35, centerY * 0.5,
        centerX - 30, centerY + 180,
        centerX, height + 80
      );
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = currentTheme.primaryNeon;
      ctx.shadowColor = currentTheme.primaryNeon;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // 5. Draw Beads along the strand
      // We calculate a sequence of visible beads around the center
      const beadSpacing = 68;
      const totalVisibleBeads = 13;
      const halfCount = Math.floor(totalVisibleBeads / 2);

      for (let i = -halfCount; i <= halfCount; i++) {
        // Index along the virtual string
        const beadVirtualIndex = (currentCount + i + 999999) % 33;
        const isSeparator = beadVirtualIndex === 0 || beadVirtualIndex === 11 || beadVirtualIndex === 22;

        // Base Y position along the strand + current drag offset
        const rawY = centerY + (i * beadSpacing) + activeDrag;
        
        // Gentle curve offset X along the strand
        const distFromCenterY = (rawY - centerY) / height;
        const beadX = centerX - Math.sin(distFromCenterY * Math.PI) * 28;
        const beadY = rawY;

        // Scale & alpha based on distance from focal thumb center
        const distToFocal = Math.abs(beadY - centerY);
        const focalRatio = Math.max(0, 1 - distToFocal / (height * 0.45));
        const beadRadius = (i === 0 ? 30 : 20) * (0.65 + focalRatio * 0.35);

        // Alpha fade at extreme edges
        const alpha = Math.min(1, Math.max(0.12, 1 - distToFocal / (height * 0.48)));

        // Skip rendering outside canvas bounds
        if (beadY < -50 || beadY > height + 50) continue;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Render Bead based on style
        drawBead(
          ctx,
          beadX,
          beadY,
          beadRadius,
          i === 0, // is center active bead
          isSeparator,
          beadStyle,
          currentTheme,
          focalRatio
        );

        ctx.restore();
      }

      // 6. Draw Shockwaves
      shockwavesRef.current = shockwavesRef.current.filter(sw => {
        sw.radius += 4.5;
        sw.alpha *= 0.91;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = sw.color;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 18;
        ctx.globalAlpha = sw.alpha;
        ctx.stroke();
        ctx.restore();

        return sw.alpha > 0.02 && sw.radius < sw.maxRadius;
      });

      // 7. Draw Burst Particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - (p.life / p.maxLife) * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();

        return p.life < p.maxLife;
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, beadStyle, currentTheme, currentCount, triggerBurst]);

  // Helper to draw single bead according to styling tokens
  const drawBead = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    isActive: boolean,
    isSeparator: boolean,
    style: BeadStyle,
    thm: typeof THEMES['cyber-emerald'],
    focal: number
  ) => {
    ctx.save();

    // Separator marker / Disc bead (traditional minaret or divider bead)
    if (isSeparator && !isActive) {
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.25, r * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = thm.secondaryNeon;
      ctx.shadowColor = thm.primaryNeon;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
      return;
    }

    // Outer luminescent aura for active center bead
    if (isActive) {
      const auraGrad = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.4);
      auraGrad.addColorStop(0, thm.beadGlow);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    switch (style) {
      case 'luminescent-crystal': {
        // Faceted refractive crystal bead
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, thm.beadFillTop);
        grad.addColorStop(0.8, thm.beadFillBottom);
        grad.addColorStop(1, '#051815');
        ctx.fillStyle = grad;
        ctx.shadowColor = thm.primaryNeon;
        ctx.shadowBlur = isActive ? 22 : 8 * focal;
        ctx.fill();

        // Crystal facet cuts
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Facet lines inside
        ctx.beginPath();
        ctx.moveTo(x - r * 0.6, y);
        ctx.lineTo(x, y - r * 0.7);
        ctx.lineTo(x + r * 0.6, y);
        ctx.lineTo(x, y + r * 0.7);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.stroke();
        break;
      }

      case 'metallic-core': {
        // High-tech brushed metallic sphere with neon seam
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        const metalGrad = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
        metalGrad.addColorStop(0, '#CBD5E1');
        metalGrad.addColorStop(0.5, '#475569');
        metalGrad.addColorStop(0.8, '#1E293B');
        metalGrad.addColorStop(1, '#0F172A');
        ctx.fillStyle = metalGrad;
        ctx.fill();

        // Glowing neon equatorial band
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.95, r * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = thm.primaryNeon;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = thm.primaryNeon;
        ctx.shadowBlur = isActive ? 16 : 6;
        ctx.stroke();
        break;
      }

      case 'neon-ring': {
        // Holographic toroid / ring bead
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.lineWidth = r * 0.28;
        ctx.strokeStyle = thm.primaryNeon;
        ctx.shadowColor = thm.primaryNeon;
        ctx.shadowBlur = isActive ? 20 : 8;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.fill();
        break;
      }

      case 'cyber-orb':
      default: {
        // High-end 3D glossy cyber orb with radiant core & specular highlight
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(
          x - r * 0.3, y - r * 0.35, r * 0.08,
          x, y, r
        );
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.2, thm.beadFillTop);
        grad.addColorStop(0.7, thm.beadFillBottom);
        grad.addColorStop(1, '#03080c');
        ctx.fillStyle = grad;
        ctx.shadowColor = thm.primaryNeon;
        ctx.shadowBlur = isActive ? 24 : 10 * focal;
        ctx.fill();

        // Rim highlight
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = thm.beadRim;
        ctx.lineWidth = isActive ? 2.0 : 1.2;
        ctx.stroke();

        // Specular gleam on top-left
        ctx.beginPath();
        ctx.ellipse(x - r * 0.32, y - r * 0.32, r * 0.32, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  };

  // Pointer event handlers for vertical drag-to-pull
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    currentDragYRef.current = 0;
    hasTriggeredSnapRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || disabled) return;

    const deltaY = e.clientY - startYRef.current;

    // We only care about downward pulling (positive deltaY)
    if (deltaY > 0) {
      // Elastic spring resistance formula
      const resistanceFactor = 0.85;
      const dampenedY = Math.pow(deltaY, resistanceFactor) * 2.2;
      currentDragYRef.current = dampenedY;

      const threshold = dragSensitivity || 48;
      const progress = Math.min(1, dampenedY / threshold);
      setPullProgress(progress);

      // Snap trigger threshold reached!
      const now = performance.now();
      if (dampenedY >= threshold && !hasTriggeredSnapRef.current && (now - lastSnapTimeRef.current > 180)) {
        hasTriggeredSnapRef.current = true;
        lastSnapTimeRef.current = now;

        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const cx = strandPosition === 'center'
            ? rect.width / 2
            : strandPosition === 'right'
            ? (rect.width >= 768 ? rect.width * 0.75 : rect.width * 0.72)
            : (rect.width >= 768 ? Math.max(130, rect.width * 0.22) : Math.max(54, rect.width * 0.26));
          triggerBurst(cx, rect.height * 0.54 + threshold);
        }

        onIncrement();

        // Small recoil impulse back up
        recoilVelocityRef.current = -12;
      }
    } else {
      // Gentle resistance for pulling up
      currentDragYRef.current = deltaY * 0.2;
      setPullProgress(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    // Check if it was a quick stationary tap (delta < 8px)
    const deltaY = Math.abs(e.clientY - startYRef.current);
    if (deltaY < 8 && !hasTriggeredSnapRef.current) {
      const now = performance.now();
      if (now - lastSnapTimeRef.current > 120) {
        lastSnapTimeRef.current = now;
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const cx = strandPosition === 'center'
            ? rect.width / 2
            : strandPosition === 'right'
            ? (rect.width >= 768 ? rect.width * 0.78 : rect.width * 0.78)
            : (rect.width >= 768 ? Math.max(130, rect.width * 0.22) : Math.max(50, rect.width * 0.20));
          triggerBurst(cx, rect.height * 0.54);
        }
        glideOffsetRef.current = -68; // Smooth kinetic bead glide on canvas tap
        onIncrement();
      }
    }

    isDraggingRef.current = false;
    currentDragYRef.current = 0;
    hasTriggeredSnapRef.current = false;
    setPullProgress(0);
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    currentDragYRef.current = 0;
    hasTriggeredSnapRef.current = false;
    setPullProgress(0);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none touch-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Subtle visual guide for downward drag tension */}
      {pullProgress > 0.05 && (
        <div
          className="absolute -translate-x-1/2 pointer-events-none transition-opacity duration-150 flex flex-col items-center"
          style={{
            left: strandPosition === 'center'
              ? '50%'
              : strandPosition === 'right'
              ? '78%'
              : '20%',
            top: '64%',
            opacity: Math.min(1, pullProgress * 1.5)
          }}
        >
          <div 
            className="w-1.5 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(12, pullProgress * 44)}px`,
              background: `linear-gradient(to bottom, transparent, ${currentTheme.primaryNeon})`,
              boxShadow: `0 0 10px ${currentTheme.primaryNeon}`
            }}
          />
          <span 
            className="text-[11px] font-mono-tabular tracking-wider mt-1.5 uppercase font-medium"
            style={{ color: currentTheme.primaryNeon }}
          >
            {pullProgress >= 1 ? 'RELEASE / SNAP' : `${Math.round(pullProgress * 100)}%`}
          </span>
        </div>
      )}
    </div>
  );
};
