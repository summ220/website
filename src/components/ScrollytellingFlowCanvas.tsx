import React, { useEffect, useRef } from 'react';
import { MotionValue } from 'framer-motion';

interface ScrollytellingFlowCanvasProps {
  /** 直接订阅 Framer Motion 连续滚动进度 0 ~ 1，避免触发 React 重渲染 */
  progressMotionValue: MotionValue<number>;
  className?: string;
}

interface FloatingParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  phase: number;
  alpha: number;
}

export const ScrollytellingFlowCanvas: React.FC<ScrollytellingFlowCanvasProps> = ({
  progressMotionValue,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progressMotionValue.get());

  useEffect(() => {
    progressRef.current = progressMotionValue.get();
    const unsubscribe = progressMotionValue.on('change', (latest) => {
      progressRef.current = latest;
    });
    return () => unsubscribe();
  }, [progressMotionValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let smoothP = progressRef.current;

    const particles: FloatingParticle[] = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.8 + Math.random() * 1.8,
      speedX: (Math.random() - 0.5) * 0.00025,
      speedY: -0.00012 - Math.random() * 0.00022,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.55,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const drawAirflowRibbon = (
      yBase: number,
      amplitude: number,
      freq: number,
      phase: number,
      thickness: number,
      r: number,
      g: number,
      b: number,
      alpha: number
    ) => {
      if (alpha <= 0.01) return;
      ctx.save();
      const grad = ctx.createLinearGradient(0, yBase, width, yBase);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
      grad.addColorStop(0.28, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`);
      grad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad.addColorStop(0.85, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const steps = 36;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = t * width;
        const y =
          yBase +
          Math.sin(t * Math.PI * freq + phase) * amplitude +
          Math.cos(t * Math.PI * 1.4 - phase * 0.6) * (amplitude * 0.45);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    let tick = 0;

    const render = () => {
      tick += 1;
      smoothP += (progressRef.current - smoothP) * 0.08;
      ctx.clearRect(0, 0, width, height);

      if (width > 0 && height > 0) {
        ctx.globalCompositeOperation = 'screen';

        // 按 5 幕时间轴动态计算各物理光效权重
        // 0.00-0.20 晨光 | 0.20-0.40 岛台 | 0.40-0.60 归家 | 0.60-0.80 观影 | 0.80-1.00 入眠
        const morningWeight = Math.max(0, 1 - Math.abs(smoothP - 0.1) / 0.16);
        const kitchenWeight = Math.max(0, 1 - Math.abs(smoothP - 0.3) / 0.15);
        const homecomingWeight = Math.max(0, 1 - Math.abs(smoothP - 0.5) / 0.16);
        const cinemaWeight = Math.max(0, 1 - Math.abs(smoothP - 0.7) / 0.16);
        const sleepWeight = Math.max(0, 1 - Math.abs(smoothP - 0.9) / 0.16);

        // 1) 晨光斜射体积光束 (晨光唤醒 + 晨间岛台)
        const rayAlpha = morningWeight * 0.32 + kitchenWeight * 0.2;
        if (rayAlpha > 0.01) {
          ctx.save();
          ctx.translate(width * 0.18, -height * 0.08);
          ctx.rotate((-24 + smoothP * 32) * (Math.PI / 180));
          const rayGrad = ctx.createLinearGradient(0, 0, 0, height * 1.25);
          rayGrad.addColorStop(0, `rgba(255, 224, 174, ${rayAlpha})`);
          rayGrad.addColorStop(0.55, `rgba(255, 212, 152, ${rayAlpha * 0.35})`);
          rayGrad.addColorStop(1, 'rgba(255, 212, 152, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(-width * 0.09, 0);
          ctx.lineTo(width * 0.14, 0);
          ctx.lineTo(width * 0.42, height * 1.25);
          ctx.lineTo(-width * 0.22, height * 1.25);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // 2) 归家 & 唤醒微风流体光带 (在晨风与归家时刻轻柔吹拂)
        const ribbonAlpha = homecomingWeight * 0.24 + morningWeight * 0.14;
        if (ribbonAlpha > 0.01 && !prefersReducedMotion) {
          const phase = tick * 0.018;
          drawAirflowRibbon(
            height * 0.46,
            height * 0.045,
            2.2,
            phase,
            2.2,
            255,
            224,
            174,
            ribbonAlpha
          );
          drawAirflowRibbon(
            height * 0.56,
            height * 0.035,
            2.8,
            phase + 1.4,
            1.4,
            223,
            198,
            155,
            ribbonAlpha * 0.72
          );
        }

        // 3) 空气流动光尘 / 咖啡升腾微粒 / 睡前贴地星光
        const r = Math.round(255 - sleepWeight * 25 - cinemaWeight * 20);
        const g = Math.round(228 - sleepWeight * 52 - cinemaWeight * 34);
        const b = Math.round(180 - sleepWeight * 78 - cinemaWeight * 36);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!prefersReducedMotion) {
            const windBoost = 1 + homecomingWeight * 1.4 - sleepWeight * 0.55;
            p.x += (p.speedX + homecomingWeight * 0.00035) * windBoost;
            p.y += p.speedY * (1 + kitchenWeight * 0.85 - sleepWeight * 0.6);
            p.phase += 0.014;
            if (p.y < -0.05) p.y = 1.05;
            if (p.x > 1.05) p.x = -0.05;
            if (p.x < -0.05) p.x = 1.05;
          }

          // 睡前模式粒子更聚拢于下半屏幕，像低矮的安眠微尘
          const yFactor = sleepWeight > 0.4 ? 0.45 + p.y * 0.52 : p.y;
          const px = p.x * width;
          const py = yFactor * height;
          const shimmer = 0.45 + 0.55 * Math.sin(p.phase);
          const visibility = 0.28 + morningWeight * 0.4 + kitchenWeight * 0.35 + homecomingWeight * 0.42;
          const a = p.alpha * shimmer * visibility * (1 - cinemaWeight * 0.35);

          if (a > 0.02) {
            const halo = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3.6);
            halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
            halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(px, py, p.size * 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalCompositeOperation = 'source-over';
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
};
