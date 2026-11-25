import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

/**
 * 全站科技空间背景层：
 * - 高性能 Canvas 动态 Mesh 粒子拓扑网络（带鼠标微距感应连线）
 * - 鼠标全局冷光手电筒点亮底层点阵网格
 * - 动态穿梭水平总线光束 + 斜向极光光学光束
 */
export const AmbientBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollPx, setScrollPx] = useState(0);
  const [cursor, setCursor] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onScroll = () => setScrollPx(Math.round(window.scrollY));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999 };
    const count = width < 768 ? 28 : 58;
    const maxDist = width < 768 ? 120 : 168;

    const particles: Particle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: 1.1 + Math.random() * 1.4,
      alpha: 0.32 + Math.random() * 0.48,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setCursor({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      setCursor({ x: -999, y: -999 });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 210) {
          const mAlpha = (1 - mdist / 210) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(125, 211, 252, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. 点阵坐标基底 */}
      <div className="absolute inset-0 dot-matrix opacity-[0.3] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_92%)]" />

      {/* 2. 鼠标全局冷光手电筒点亮（让交互触感立即可见） */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(360px circle at ${cursor.x}px ${cursor.y}px, rgba(129, 140, 248, 0.12), rgba(56, 189, 248, 0.04) 40%, transparent 72%)`,
        }}
      />

      {/* 3. Canvas 实时 Mesh 星尘网络 */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-95" />

      {/* 4. 水平扫频数据总线脉冲光束 */}
      <motion.div
        animate={{ y: ['-10vh', '110vh'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/35 to-transparent shadow-[0_0_24px_rgba(129,140,248,0.45)]"
      />

      {/* 5. 斜向极光光学光束 */}
      <div className="absolute -top-32 left-[16%] h-[800px] w-[280px] rotate-[28deg] bg-gradient-to-b from-indigo-400/[0.16] via-sky-300/[0.05] to-transparent blur-3xl" />
      <div className="absolute -top-24 right-[12%] h-[700px] w-[220px] -rotate-[22deg] bg-gradient-to-b from-sky-400/[0.12] via-indigo-400/[0.04] to-transparent blur-3xl" />

      {/* 6. 缓慢游动的深空极光星云 */}
      <motion.div
        animate={{
          x: [0, 70, -40, 0],
          y: [0, -45, 35, 0],
          scale: [1, 1.1, 0.96, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-24 -top-28 h-[520px] w-[520px] rounded-full bg-indigo-500/[0.18] blur-[130px]"
      />
      <motion.div
        animate={{
          x: [0, -60, 45, 0],
          y: [0, 55, -35, 0],
          scale: [1, 0.94, 1.08, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-24 top-[35%] h-[480px] w-[480px] rounded-full bg-sky-400/[0.12] blur-[130px]"
      />

      {/* 7. 胶片噪点纹理 */}
      <div className="noise-overlay absolute inset-0 opacity-[0.035]" />

      {/* 8. 宽屏左右工程 HUD 标尺刻度 */}
      <div className="mx-auto hidden h-full max-w-[1440px] justify-between px-6 xl:flex">
        <div className="relative h-full w-px bg-gradient-to-b from-transparent via-indigo-400/25 to-transparent">
          <div className="sticky top-32 flex flex-col items-start gap-2 pl-2 font-mono text-[9px] tracking-widest text-zinc-500">
            <span className="text-indigo-300/90">SYS // MESH_01</span>
            <span>Y:{String(scrollPx).padStart(4, '0')}PX</span>
            <div className="mt-1 flex flex-col gap-1.5 opacity-70">
              <span className="h-px w-3 bg-indigo-400/70" />
              <span className="h-px w-1.5 bg-zinc-600" />
              <span className="h-px w-1.5 bg-zinc-600" />
              <span className="h-px w-3 bg-indigo-400/70" />
            </div>
          </div>
        </div>
        <div className="relative h-full w-px bg-gradient-to-b from-transparent via-sky-400/25 to-transparent">
          <div className="sticky top-32 flex flex-col items-end gap-2 pr-2 font-mono text-[9px] tracking-widest text-zinc-500">
            <span className="text-sky-300/90">LOCAL_AI</span>
            <span>1.8MS</span>
            <div className="mt-1 flex flex-col items-end gap-1.5 opacity-70">
              <span className="h-px w-3 bg-sky-400/70" />
              <span className="h-px w-1.5 bg-zinc-600" />
              <span className="h-px w-1.5 bg-zinc-600" />
              <span className="h-px w-3 bg-sky-400/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
