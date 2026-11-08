import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  SceneStep,
  SparkParticle,
  MarigoldPetal,
  FireworkParticle,
  FireworkRocket,
  FountainParticle,
  ChakriParticle,
  SparklerParticle,
} from '../types';
import { audioService } from '../utils/audio';

export interface CinematicCanvasHandle {
  triggerAnar: (xRatio?: number) => void;
  triggerChakri: (xRatio?: number) => void;
  triggerLadi: (xRatio?: number) => void;
  triggerRocket: (x?: number, y?: number) => void;
  toggleSparkler: () => void;
}

interface CinematicCanvasProps {
  currentScene: SceneStep;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  isRecording?: boolean;
}

export const CinematicCanvas = forwardRef<CinematicCanvasHandle, CinematicCanvasProps>(({
  currentScene,
  canvasRef: externalCanvasRef,
}, ref) => {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;

  const animationFrameId = useRef<number | null>(null);

  // Particle systems
  const sparkParticles = useRef<SparkParticle[]>([]);
  const marigoldPetals = useRef<MarigoldPetal[]>([]);
  const fireworkRockets = useRef<FireworkRocket[]>([]);
  const fireworkParticles = useRef<FireworkParticle[]>([]);
  const stars = useRef<{ x: number; y: number; size: number; alpha: number; speed: number }[]>([]);

  // Crackers particle systems
  const fountainParticles = useRef<FountainParticle[]>([]);
  const chakriParticles = useRef<ChakriParticle[]>([]);
  const sparklerParticles = useRef<SparklerParticle[]>([]);
  const ladiFlashes = useRef<{ x: number; y: number; alpha: number; radius: number; color: string }[]>([]);

  // Cracker Active States
  const anarTimers = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const chakriTimers = useRef<{ left: number; right: number; angleL: number; angleR: number }>({
    left: 0,
    right: 0,
    angleL: 0,
    angleR: 0,
  });

  // Sparkler interactive cursor mode
  const [sparklerActive, setSparklerActive] = useState<boolean>(false);
  const sparklerPos = useRef<{ x: number; y: number; isInteracting: boolean }>({
    x: 0,
    y: 0,
    isInteracting: false,
  });

  // Fireworks auto-launcher timer
  const lastFireworkTime = useRef<number>(0);
  const rangoliRotation = useRef<number>(0);

  // Initialize background stars
  useEffect(() => {
    const starCount = 85;
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.6 + Math.random() * 1.4,
        alpha: 0.2 + Math.random() * 0.7,
        speed: 0.005 + Math.random() * 0.015,
      });
    }
    stars.current = newStars;
  }, []);

  // Launch Firework Rocket
  const launchFirework = (targetX?: number, targetY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startX = targetX ?? (canvas.width * 0.15 + Math.random() * (canvas.width * 0.7));
    const startY = canvas.height;
    const destY = targetY ?? (canvas.height * 0.12 + Math.random() * (canvas.height * 0.35));

    const colors = [
      '#f59e0b', // Amber Gold
      '#fbbf24', // Radiant Gold
      '#ef4444', // Vermilion Red
      '#ec4899', // Festive Pink
      '#10b981', // Emerald
      '#06b6d4', // Cyan
      '#a855f7', // Royal Purple
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    fireworkRockets.current.push({
      x: startX,
      y: startY,
      targetY: destY,
      vy: - (10 + Math.random() * 4),
      color,
      trail: [],
      exploded: false,
    });
  };

  // Explode Firework into particles
  const explodeFirework = (x: number, y: number, color: string) => {
    audioService.playFireworkBurst(0.35);

    const count = 70 + Math.floor(Math.random() * 45);
    const isRing = Math.random() > 0.6;
    const isWillow = Math.random() > 0.5;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.2 - 0.1);
      const speed = isRing
        ? 3.5 + Math.random() * 0.8
        : 1.5 + Math.random() * 5.5;

      fireworkParticles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: isWillow ? '#fef08a' : color,
        alpha: 1,
        decay: isWillow ? 0.012 + Math.random() * 0.008 : 0.018 + Math.random() * 0.015,
        trail: [],
        size: isWillow ? 1.8 : 2.2 + Math.random() * 1.5,
        gravity: isWillow ? 0.06 : 0.045,
        flicker: Math.random() > 0.3,
      });
    }

    // Add bright flash / center sparkle
    for (let i = 0; i < 15; i++) {
      fireworkParticles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: '#ffffff',
        alpha: 1,
        decay: 0.05,
        trail: [],
        size: 2.5,
        gravity: 0.02,
        flicker: true,
      });
    }
  };

  // Trigger Anar (Flowerpot Fountain)
  const triggerAnar = (side: 'left' | 'right' | 'both' = 'both') => {
    audioService.playAnarFountainSound(4.5);
    const now = Date.now();
    if (side === 'left' || side === 'both') anarTimers.current.left = now + 4500;
    if (side === 'right' || side === 'both') anarTimers.current.right = now + 4500;
  };

  // Trigger Chakri (Ground Spinner)
  const triggerChakri = (side: 'left' | 'right' | 'both' = 'both') => {
    audioService.playChakriSpinSound(3.8);
    const now = Date.now();
    if (side === 'left' || side === 'both') chakriTimers.current.left = now + 3800;
    if (side === 'right' || side === 'both') chakriTimers.current.right = now + 3800;
  };

  // Trigger Diwali Ladi (String of Crackers)
  const triggerLadi = (xRatio = 0.5) => {
    audioService.playLadiFirecrackers(14);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const baseX = canvas.width * xRatio;
    const baseY = canvas.height * 0.88;

    // Schedule flash bursts
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        ladiFlashes.current.push({
          x: baseX + (Math.random() - 0.5) * 120,
          y: baseY + (Math.random() - 0.5) * 35,
          alpha: 1,
          radius: 20 + Math.random() * 25,
          color: Math.random() > 0.4 ? '#fde047' : '#ef4444',
        });

        // Eject tiny crackling red/gold debris
        for (let s = 0; s < 8; s++) {
          sparkParticles.current.push({
            x: baseX + (Math.random() - 0.5) * 60,
            y: baseY,
            vx: (Math.random() - 0.5) * 6,
            vy: - (2 + Math.random() * 5),
            size: 1.5 + Math.random() * 1.5,
            alpha: 1,
            maxAlpha: 1,
            color: Math.random() > 0.5 ? '#ef4444' : '#fbbf24',
            decay: 0.04,
            life: 0,
          });
        }
      }, i * 90);
    }
  };

  // Expose Imperative Handle for Controls
  useImperativeHandle(ref, () => ({
    triggerAnar: (_ratio?: number) => triggerAnar('both'),
    triggerChakri: (_ratio?: number) => triggerChakri('both'),
    triggerLadi: (ratio?: number) => triggerLadi(ratio ?? 0.5),
    triggerRocket: (x?: number, y?: number) => launchFirework(x, y),
    toggleSparkler: () => {
      setSparklerActive((prev) => {
        const next = !prev;
        if (next) {
          audioService.playSparklerSizzle(3);
        }
        return next;
      });
    },
  }));

  // Auto-trigger Grand Crackers during Scene 4 & 5
  useEffect(() => {
    if (currentScene === 4) {
      // Grand Diwali reveal: Ignite Anars & Chakris!
      setTimeout(() => {
        triggerAnar('both');
      }, 600);
      setTimeout(() => {
        triggerChakri('both');
      }, 1500);
    }
  }, [currentScene]);

  // Spawn Marigold Petal
  const spawnPetal = (canvasWidth: number) => {
    const colors = ['#ff8800', '#ffa200', '#ffbb00', '#ffdd00', '#e65100'];
    return {
      x: Math.random() * canvasWidth,
      y: -20 - Math.random() * 30,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1.2 + Math.random() * 1.6,
      size: 9 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.035,
      swingAngle: Math.random() * Math.PI * 2,
      swingSpeed: 0.02 + Math.random() * 0.03,
      swingRadius: 0.8 + Math.random() * 1.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.75 + Math.random() * 0.25,
      aspectRatio: 0.45 + Math.random() * 0.25,
    };
  };

  // Spawn Spark Particle
  const spawnSpark = (centerX: number, centerY: number, upward = true) => {
    const colors = ['#fff7ed', '#fef08a', '#fde047', '#fbbf24', '#f59e0b', '#fb923c'];
    return {
      x: centerX + (Math.random() - 0.5) * 70,
      y: centerY + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 1.2,
      vy: upward ? - (0.8 + Math.random() * 2.2) : (Math.random() - 0.5) * 2,
      size: 1.2 + Math.random() * 2.4,
      alpha: 0.8 + Math.random() * 0.2,
      maxAlpha: 0.8 + Math.random() * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      decay: 0.008 + Math.random() * 0.014,
      life: 0,
    };
  };

  // Pointer & Touch handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sparklerPos.current = { x, y, isInteracting: true };

    if (sparklerActive) {
      audioService.playSparklerSizzle(1.5);
    } else if (currentScene >= 4) {
      // In Scene 4 & 5, tap launches fireworks or sparkles
      launchFirework(x * (window.devicePixelRatio || 1), y * (window.devicePixelRatio || 1));
    } else {
      for (let i = 0; i < 25; i++) {
        sparkParticles.current.push(spawnSpark(x, y, false));
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    sparklerPos.current.x = e.clientX - rect.left;
    sparklerPos.current.y = e.clientY - rect.top;
  };

  const handlePointerUp = () => {
    sparklerPos.current.isInteracting = false;
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Night Sky & Atmospheric Glow
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.68,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.95
      );

      if (currentScene === 0) {
        bgGradient.addColorStop(0, '#0a0214');
        bgGradient.addColorStop(0.5, '#05010b');
        bgGradient.addColorStop(1, '#020005');
      } else if (currentScene === 1) {
        bgGradient.addColorStop(0, '#24083a');
        bgGradient.addColorStop(0.3, '#130324');
        bgGradient.addColorStop(0.7, '#07010f');
        bgGradient.addColorStop(1, '#020005');
      } else {
        bgGradient.addColorStop(0, '#380e54');
        bgGradient.addColorStop(0.35, '#1e0533');
        bgGradient.addColorStop(0.75, '#0c0217');
        bgGradient.addColorStop(1, '#040008');
      }

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Distant Twinkling Stars
      stars.current.forEach((star) => {
        const x = star.x * width;
        const y = star.y * height;
        const alpha = star.alpha * (0.6 + 0.4 * Math.sin(time * star.speed));

        ctx.fillStyle = `rgba(254, 240, 138, ${alpha * (currentScene >= 2 ? 0.35 : 0.7)})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Central Diya Ambient Radial Bloom
      if (currentScene >= 1) {
        const diyaY = height * 0.72;
        const diyaX = width * 0.5;

        const pulse = 1 + 0.05 * Math.sin(time * 0.0035);
        const radius = (currentScene === 1 ? 160 : currentScene === 2 ? 300 : 420) * pulse;

        const diyaGlow = ctx.createRadialGradient(diyaX, diyaY, 15, diyaX, diyaY, radius);
        diyaGlow.addColorStop(0, 'rgba(254, 215, 170, 0.55)');
        diyaGlow.addColorStop(0.2, 'rgba(245, 158, 11, 0.35)');
        diyaGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.15)');
        diyaGlow.addColorStop(0.85, 'rgba(124, 45, 18, 0.05)');
        diyaGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = diyaGlow;
        ctx.fillRect(diyaX - radius, diyaY - radius, radius * 2, radius * 2);
      }

      // 4. Glowing Sacred Rangoli Mandala (Scene 3, 4, 5)
      if (currentScene >= 3) {
        rangoliRotation.current += 0.001;
        const rangoliX = width * 0.5;
        const rangoliY = height * 0.73;
        const maxRadius = Math.min(width * 0.42, 280);

        ctx.save();
        ctx.translate(rangoliX, rangoliY);
        ctx.scale(1, 0.38);
        ctx.rotate(rangoliRotation.current);

        const rangoliAlpha = currentScene === 3 ? 0.25 : 0.65;
        ctx.strokeStyle = `rgba(251, 191, 36, ${rangoliAlpha})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 0.85, 0, Math.PI * 2);
        ctx.stroke();

        const petals = 12;
        for (let i = 0; i < petals; i++) {
          const angle = (Math.PI * 2 * i) / petals;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(maxRadius * 0.45, maxRadius * 0.25, maxRadius * 0.85, 0);
          ctx.quadraticCurveTo(maxRadius * 0.45, -maxRadius * 0.25, 0, 0);
          ctx.stroke();

          ctx.fillStyle = `rgba(245, 158, 11, ${rangoliAlpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(maxRadius * 0.55, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * maxRadius * 0.35, Math.sin(a) * maxRadius * 0.35, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 5. Firework Rockets & Sky Explosions (Scenes 4 & 5)
      if (currentScene >= 4) {
        if (time - lastFireworkTime.current > 1800 + Math.random() * 1400) {
          launchFirework();
          lastFireworkTime.current = time;
        }

        for (let i = fireworkRockets.current.length - 1; i >= 0; i--) {
          const r = fireworkRockets.current[i];
          r.trail.push({ x: r.x, y: r.y, alpha: 1 });
          if (r.trail.length > 8) r.trail.shift();

          r.y += r.vy;
          r.vy += 0.08;

          ctx.strokeStyle = r.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let t = 0; t < r.trail.length; t++) {
            const pt = r.trail[t];
            if (t === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          if (r.y <= r.targetY || r.vy >= 0) {
            explodeFirework(r.x, r.y, r.color);
            fireworkRockets.current.splice(i, 1);
          }
        }

        for (let i = fireworkParticles.current.length - 1; i >= 0; i--) {
          const p = fireworkParticles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.alpha -= p.decay;

          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 4) p.trail.shift();

          if (p.alpha <= 0) {
            fireworkParticles.current.splice(i, 1);
            continue;
          }

          const currentAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.4 : p.alpha;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.trail.length > 1) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * 0.7;
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
      }

      // 6. CRACKERS: ANAR (FLOWERPOT FOUNTAINS)
      const now = Date.now();
      const anarPositions = [
        { key: 'left' as const, x: width * 0.14, y: height * 0.84 },
        { key: 'right' as const, x: width * 0.86, y: height * 0.84 },
      ];

      anarPositions.forEach(({ key, x, y }) => {
        // Draw Anar Vessel on Floor
        ctx.save();
        ctx.fillStyle = '#7c2d12'; // Terracotta cone
        ctx.beginPath();
        ctx.moveTo(x - 18, y + 15);
        ctx.lineTo(x + 18, y + 15);
        ctx.lineTo(x + 5, y - 14);
        ctx.lineTo(x - 5, y - 14);
        ctx.closePath();
        ctx.fill();

        // Gold decorative stripe
        ctx.strokeStyle = '#fcd34d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 12, y + 5);
        ctx.lineTo(x + 12, y + 5);
        ctx.stroke();
        ctx.restore();

        const isAnarActive = anarTimers.current[key] > now;

        if (isAnarActive) {
          // Intense golden nozzle glow
          const anarGlow = ctx.createRadialGradient(x, y - 15, 2, x, y - 15, 90);
          anarGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          anarGlow.addColorStop(0.3, 'rgba(253, 224, 71, 0.7)');
          anarGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.3)');
          anarGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = anarGlow;
          ctx.fillRect(x - 90, y - 105, 180, 180);

          // Eject fountain sparks (high initial speed, upward cone)
          const sparkCount = 12;
          const fountainColors = ['#ffffff', '#fef08a', '#fde047', '#fbbf24', '#f59e0b', '#fb923c'];

          for (let s = 0; s < sparkCount; s++) {
            const spreadAngle = (Math.random() - 0.5) * 0.45; // narrow vertical spray cone
            const speed = 14 + Math.random() * 12;

            fountainParticles.current.push({
              x: x + (Math.random() - 0.5) * 6,
              y: y - 14,
              vx: Math.sin(spreadAngle) * speed + (Math.random() - 0.5) * 2,
              vy: - Math.cos(spreadAngle) * speed,
              color: fountainColors[Math.floor(Math.random() * fountainColors.length)],
              alpha: 1,
              size: 1.4 + Math.random() * 2.2,
              decay: 0.016 + Math.random() * 0.018,
              gravity: 0.42,
              branch: Math.random() > 0.7,
            });
          }
        }
      });

      // Update & Render Fountain Particles
      for (let i = fountainParticles.current.length - 1; i >= 0; i--) {
        const fp = fountainParticles.current[i];
        fp.x += fp.vx;
        fp.y += fp.vy;
        fp.vy += fp.gravity;
        fp.vx *= 0.98;
        fp.alpha -= fp.decay;

        if (fp.alpha <= 0 || fp.y > height) {
          fountainParticles.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = fp.color;
        ctx.globalAlpha = fp.alpha;
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
        ctx.fill();

        // Shimmer sparkle cross on large sparks
        if (fp.size > 2.2 && Math.random() > 0.4) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(fp.x - 3, fp.y);
          ctx.lineTo(fp.x + 3, fp.y);
          ctx.moveTo(fp.x, fp.y - 3);
          ctx.lineTo(fp.x, fp.y + 3);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // 7. CRACKERS: CHAKRI (GROUND SPINNERS)
      const chakriPositions = [
        { key: 'left' as const, x: width * 0.28, y: height * 0.88 },
        { key: 'right' as const, x: width * 0.72, y: height * 0.88 },
      ];

      chakriPositions.forEach(({ key, x, y }) => {
        const isChakriActive = chakriTimers.current[key] > now;

        // Draw Chakri base disc on floor
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(1, 0.4); // perspective tilt

        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (isChakriActive) {
          // Rapid spinning rotation
          const spinSpeed = 0.45;
          if (key === 'left') chakriTimers.current.angleL += spinSpeed;
          else chakriTimers.current.angleR += spinSpeed;

          const currentAngle = key === 'left' ? chakriTimers.current.angleL : chakriTimers.current.angleR;
          ctx.rotate(currentAngle);

          // Glowing spiral arms
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(14, 0);
          ctx.moveTo(0, 0);
          ctx.lineTo(-14, 0);
          ctx.stroke();

          // Spawn centrifugal sparks along spiral arms
          const arms = 2;
          for (let a = 0; a < arms; a++) {
            const ejectAngle = currentAngle + (Math.PI * 2 * a) / arms;
            const tangentialSpeed = 6 + Math.random() * 6;

            chakriParticles.current.push({
              x: x + Math.cos(ejectAngle) * 12,
              y: y + Math.sin(ejectAngle) * 5,
              vx: Math.cos(ejectAngle + Math.PI / 2) * tangentialSpeed + (Math.random() - 0.5) * 2,
              vy: Math.sin(ejectAngle + Math.PI / 2) * (tangentialSpeed * 0.4) + (Math.random() - 0.5) * 2,
              color: Math.random() > 0.4 ? '#fde047' : '#10b981', // Gold & Emerald sparks
              alpha: 1,
              size: 1.5 + Math.random() * 1.8,
              decay: 0.035 + Math.random() * 0.02,
            });
          }
        }
        ctx.restore();
      });

      // Update & Render Chakri Particles
      for (let i = chakriParticles.current.length - 1; i >= 0; i--) {
        const cp = chakriParticles.current[i];
        cp.x += cp.vx;
        cp.y += cp.vy;
        cp.vx *= 0.96;
        cp.vy *= 0.96;
        cp.alpha -= cp.decay;

        if (cp.alpha <= 0) {
          chakriParticles.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = cp.color;
        ctx.globalAlpha = cp.alpha;
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 8. CRACKERS: PHOOLJHADI (SPARKLER)
      if (sparklerActive && (sparklerPos.current.x > 0 || sparklerPos.current.isInteracting)) {
        const sx = sparklerPos.current.x;
        const sy = sparklerPos.current.y;

        // Sparkler Rod
        ctx.strokeStyle = '#a1a1aa';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 35, sy + 65);
        ctx.stroke();

        // Molten burning bead
        const beadGlow = ctx.createRadialGradient(sx, sy, 2, sx, sy, 25);
        beadGlow.addColorStop(0, '#ffffff');
        beadGlow.addColorStop(0.4, '#fde047');
        beadGlow.addColorStop(0.8, '#f97316');
        beadGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = beadGlow;
        ctx.beginPath();
        ctx.arc(sx, sy, 25, 0, Math.PI * 2);
        ctx.fill();

        // Spawn branching starburst sparks
        for (let s = 0; s < 6; s++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 2 + Math.random() * 5.5;

          sparklerParticles.current.push({
            x: sx,
            y: sy,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            color: Math.random() > 0.3 ? '#ffffff' : '#fef08a',
            alpha: 1,
            size: 1.4 + Math.random() * 1.6,
            decay: 0.045,
            branchAngle: angle,
            hasBranched: false,
          });
        }
      }

      // Update & Render Sparkler Particles
      for (let i = sparklerParticles.current.length - 1; i >= 0; i--) {
        const sp = sparklerParticles.current[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        // Branching starburst effect
        if (!sp.hasBranched && sp.alpha < 0.65) {
          sp.hasBranched = true;
          // Spawn 2 sub-sparks
          for (let b = 0; b < 2; b++) {
            const bAngle = sp.branchAngle + (Math.random() - 0.5) * 1.5;
            sparklerParticles.current.push({
              x: sp.x,
              y: sp.y,
              vx: Math.cos(bAngle) * 2,
              vy: Math.sin(bAngle) * 2,
              color: '#fef08a',
              alpha: sp.alpha,
              size: 1.0,
              decay: 0.07,
              branchAngle: bAngle,
              hasBranched: true,
            });
          }
        }

        if (sp.alpha <= 0) {
          sparklerParticles.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 9. CRACKERS: LADI FLASHES & PUFFS
      for (let i = ladiFlashes.current.length - 1; i >= 0; i--) {
        const lf = ladiFlashes.current[i];
        lf.alpha -= 0.12;

        if (lf.alpha <= 0) {
          ladiFlashes.current.splice(i, 1);
          continue;
        }

        const ladiGlow = ctx.createRadialGradient(lf.x, lf.y, 2, lf.x, lf.y, lf.radius);
        ladiGlow.addColorStop(0, '#ffffff');
        ladiGlow.addColorStop(0.3, lf.color);
        ladiGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = ladiGlow;
        ctx.globalAlpha = lf.alpha;
        ctx.beginPath();
        ctx.arc(lf.x, lf.y, lf.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 10. Marigold Petals Shower (Scenes 2, 3, 4, 5)
      if (currentScene >= 2) {
        const maxPetals = currentScene >= 4 ? 65 : 40;
        if (marigoldPetals.current.length < maxPetals && Math.random() > 0.4) {
          marigoldPetals.current.push(spawnPetal(width));
        }

        for (let i = marigoldPetals.current.length - 1; i >= 0; i--) {
          const petal = marigoldPetals.current[i];
          petal.swingAngle += petal.swingSpeed;
          petal.x += petal.vx + Math.sin(petal.swingAngle) * petal.swingRadius;
          petal.y += petal.vy;
          petal.rotation += petal.rotationSpeed;

          if (petal.y > height + 30) {
            marigoldPetals.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rotation);
          const flutter = Math.sin(petal.swingAngle * 1.5);
          ctx.scale(1, petal.aspectRatio * (0.4 + 0.6 * Math.abs(flutter)));

          ctx.fillStyle = petal.color;
          ctx.globalAlpha = petal.opacity;

          ctx.beginPath();
          ctx.moveTo(0, -petal.size);
          ctx.bezierCurveTo(petal.size * 0.7, -petal.size * 0.5, petal.size * 0.7, petal.size * 0.5, 0, petal.size);
          ctx.bezierCurveTo(-petal.size * 0.7, petal.size * 0.5, -petal.size * 0.7, -petal.size * 0.5, 0, -petal.size);
          ctx.fill();

          ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -petal.size * 0.7);
          ctx.lineTo(0, petal.size * 0.7);
          ctx.stroke();

          ctx.restore();
          ctx.globalAlpha = 1;
        }
      }

      // 11. Rising Golden Diya Sparkles (Scenes 1 - 5)
      if (currentScene >= 1) {
        const diyaX = width * 0.5;
        const diyaY = height * 0.71;

        if (Math.random() > 0.3) {
          sparkParticles.current.push(spawnSpark(diyaX, diyaY, true));
        }

        for (let i = sparkParticles.current.length - 1; i >= 0; i--) {
          const sp = sparkParticles.current[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= sp.decay;
          sp.life += 1;

          if (sp.alpha <= 0) {
            sparkParticles.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sp.alpha;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();

          if (sp.size > 2.0 && sp.life % 2 === 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(sp.x - sp.size * 1.8, sp.y);
            ctx.lineTo(sp.x + sp.size * 1.8, sp.y);
            ctx.moveTo(sp.x, sp.y - sp.size * 1.8);
            ctx.lineTo(sp.x, sp.y + sp.size * 1.8);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [currentScene, sparklerActive]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 w-full h-full z-0 touch-none ${
        sparklerActive ? 'cursor-crosshair' : 'cursor-pointer'
      }`}
    />
  );
});

CinematicCanvas.displayName = 'CinematicCanvas';
