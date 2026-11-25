import React from 'react';
import { motion } from 'framer-motion';

/**
 * 柔和居家科技背景层：
 * 以暖白基底搭配缓慢流动的日光暖晕与天蓝/靛蓝呼吸光球，去掉了压抑的黑客网格与扫描线
 */
export const AmbientBackdrop: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. 顶部柔和自然光晕 */}
      <div className="home-sunlight-radial absolute inset-0" />

      {/* 2. 极轻亚麻点阵肌理 */}
      <div className="warm-dots absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />

      {/* 3. 左上角：清晨暖阳呼吸光团 */}
      <motion.div
        animate={{
          x: [0, 45, -20, 0],
          y: [0, -25, 25, 0],
          scale: [1, 1.06, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-28 -top-24 h-[520px] w-[520px] rounded-full bg-amber-200/35 blur-[130px]"
      />

      {/* 4. 右上角：清透天蓝光团 */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 35, -20, 0],
          scale: [1, 0.96, 1.05, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-24 top-[12%] h-[480px] w-[480px] rounded-full bg-indigo-200/35 blur-[130px]"
      />

      {/* 5. 中下部：柔和浅青极光云团 */}
      <motion.div
        animate={{
          x: [0, 35, -35, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] left-[25%] h-[420px] w-[420px] rounded-full bg-sky-200/25 blur-[140px]"
      />
    </div>
  );
};
