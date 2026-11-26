import React, { useEffect, useRef } from 'react';

interface VolumetricLightCanvasProps {
  /** 体积光强度 0-1 */
  intensity?: number;
  /** 光线色温 RGB */
  rayColor?: [number, number, number];
  /** 光束倾角 (-45 ~ 45 deg) */
  angleDeg?: number;
  /** 微尘数量 */
  dustCount?: number;
  className?: string;
}

interface DustMote {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  phase: number;
  phaseSpeed: number;
  alphaBase: number;
}

export const VolumetricLightCanvas: React.FC<VolumetricLightCanvasProps> = ({
  intensity = 0.5,
  rayColor = [255, 224, 178],
  angleDeg = -20,
  dustCount = 42,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ intensity, rayColor, angleDeg });

  // 平滑更新目标参数，避免重渲染重建 Canvas
  useEffect(() => {
    stateRef.current = { intensity, rayColor, angleDeg };
  }, [intensity, rayColor, angleDeg]);

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

    const motes: DustMote[] = Array.from({ length: dustCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.7 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -0.0001 - Math.random() * 0.00018,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.008 + Math.random() * 0.014,
      alphaBase: 0.2 + Math.random() * 0.55,
    }));

    // 平滑内部插值状态
    let curIntensity = stateRef.current.intensity;
    let curAngle = stateRef.current.angleDeg;
    let curR = stateRef.current.rayColor[0];
    let curG = stateRef.current.rayColor[1];
    let curB = stateRef.current.rayColor[2];

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

    const drawShaft = (
      originX: number,
      originY: number,
      topWidth: number,
      bottomWidth: number,
      length: number,
      angleRad: number,
      r: number,
      g: number,
      b: number,
      alpha: number
    ) => {
      if (alpha <= 0.005) return;
      ctx.save();
      ctx.translate(originX, originY);
      ctx.rotate(angleRad);

      const grad = ctx.createLinearGradient(0, 0, 0, length);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.48})`);
      grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.22})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-topWidth / 2, 0);
      ctx.lineTo(topWidth / 2, 0);
      ctx.lineTo(bottomWidth / 2, length);
      ctx.lineTo(-bottomWidth / 2, length);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let tick = 0;

    const render = () => {
      tick += 1;
      const target = stateRef.current;

      // 物理阻尼平滑插值
      curIntensity += (target.intensity - curIntensity) * 0.06;
      curAngle += (target.angleDeg - curAngle) * 0.06;
      curR += (target.rayColor[0] - curR) * 0.06;
      curG += (target.rayColor[1] - curG) * 0.06;
      curB += (target.rayColor[2] - curB) * 0.06;

      ctx.clearRect(0, 0, width, height);

      if (width > 0 && height > 0) {
        const r = Math.round(curR);
        const g = Math.round(curG);
        const b = Math.round(curB);
        const rad = (curAngle * Math.PI) / 180;
        const breathe = prefersReducedMotion ? 1 : 0.92 + Math.sin(tick * 0.012) * 0.08;

        ctx.globalCompositeOperation = 'screen';

        // 三束交叠的柔和窗景体积光
        drawShaft(
          width * 0.22,
          -height * 0.1,
          width * 0.14,
          width * 0.42,
          height * 1.25,
          rad,
          r,
          g,
          b,
          curIntensity * 0.42 * breathe
        );
        drawShaft(
          width * 0.42,
          -height * 0.08,
          width * 0.1,
          width * 0.34,
          height * 1.15,
          rad * 0.92,
          r,
          g,
          b,
          curIntensity * 0.3 * breathe
        );
        drawShaft(
          width * 0.68,
          -height * 0.12,
          width * 0.16,
          width * 0.44,
          height * 1.2,
          rad * 0.85,
          r,
          g,
          b,
          curIntensity * 0.2 * breathe
        );

        // 空气中缓慢浮动的微尘光粒
        const dustVisibility = 0.22 + curIntensity * 0.78;
        for (let i = 0; i < motes.length; i++) {
          const m = motes[i];
          if (!prefersReducedMotion) {
            m.x += m.vx + Math.sin(tick * 0.005 + m.phase) * 0.00008;
            m.y += m.vy;
            m.phase += m.phaseSpeed;
            if (m.y < -0.05) {
              m.y = 1.05;
              m.x = Math.random();
            }
            if (m.x < -0.05) m.x = 1.05;
            if (m.x > 1.05) m.x = -0.05;
          }

          const px = m.x * width;
          const py = m.y * height;
          const shimmer = 0.5 + 0.5 * Math.sin(m.phase);
          const alpha = m.alphaBase * shimmer * dustVisibility * 0.7;

          if (alpha > 0.02) {
            const halo = ctx.createRadialGradient(px, py, 0, px, py, m.radius * 3.5);
            halo.addColorStop(0, `rgba(${Math.min(255, r + 25)}, ${Math.min(255, g + 25)}, ${Math.min(255, b + 25)}, ${alpha})`);
            halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(px, py, m.radius * 3.5, 0, Math.PI * 2);
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
  }, [dustCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
};
