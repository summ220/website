import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderBeam?: boolean;
}

/**
 * 消费级浅色磨砂卡片容器：
 * 柔和圆角、温润边框与轻量鼠标追光，适合明亮居家风格展示
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.08)',
  borderBeam = false,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 shadow-[0_8px_30px_rgba(28,25,23,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_14px_40px_rgba(79,70,229,0.08)] ${className}`}
    >
      {/* 可选柔和流光高亮边框 */}
      {borderBeam && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl p-[1.5px] [mask-composite:exclude] [-webkit-mask-composite:xor] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,rgba(99,102,241,0.38)_325deg,rgba(245,158,11,0.35)_350deg,transparent_360deg)]"
          />
        </div>
      )}

      {/* 鼠标悬停柔和光晕 */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(460px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 50%)`,
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
