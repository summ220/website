import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderBeam?: boolean;
}

/**
 * 通用聚光灯微光边框卡片容器：
 * 支持鼠标追踪光晕 + 可选 1px 巡航极光流光边框 (Border Beam) + 精密工程角标
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(129, 140, 248, 0.16)',
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
      className={`relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0B0B10]/85 backdrop-blur-xl transition-colors duration-300 hover:border-indigo-400/30 ${className}`}
    >

      {/* 可选 1px 巡航极光流光边框 */}
      {borderBeam && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl p-px [mask-composite:exclude] [-webkit-mask-composite:xor] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,rgba(129,140,248,0.2)_325deg,rgba(125,211,252,0.2)_350deg,transparent_360deg)]"
          />
        </div>
      )}

      {/* 鼠标悬停聚光灯径向光晕 */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(520px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />

      {/* 顶部 1px 极细高光折线 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/25 to-transparent" />

      {/* 四角微科技装饰角标 */}
      <span className="pointer-events-none absolute left-2.5 top-2.5 h-1.5 w-1.5 border-l border-t border-white/20" />
      <span className="pointer-events-none absolute right-2.5 top-2.5 h-1.5 w-1.5 border-r border-t border-white/20" />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
