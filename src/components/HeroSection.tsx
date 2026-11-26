import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { VolumetricLightCanvas } from './VolumetricLightCanvas';
import { AmbientPointerLight } from './AmbientPointerLight';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  const { heroIlluminated, setHeroIlluminated } = useAtmosphere();
  const containerRef = useRef<HTMLElement>(null);

  // 极其克制的视差微移
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 24 });

  const bgMoveX = useTransform(smoothX, [-1, 1], [10, -10]);
  const bgMoveY = useTransform(smoothY, [-1, 1], [7, -7]);

  // 1.2s 内室内暖光由远及近缓缓点亮
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroIlluminated(true);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [setHeroIlluminated]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[#111722] text-[#FAF8F4]"
    >
      {/* 建筑客厅背景层 + 缓慢呼吸微视差 */}
      <motion.div
        style={{ x: bgMoveX, y: bgMoveY }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-[-18px] will-change-transform"
      >
        {/* 初始归家前微暗暮色 -> 点亮后过渡至真实通透质感 */}
        <motion.img
          src="/images/hero-living.jpg"
          alt="Lumina Home 未来智能家居客厅光影空间"
          initial={{ filter: 'brightness(0.32) saturate(0.75) contrast(1.05)' }}
          animate={{
            filter: heroIlluminated
              ? 'brightness(0.96) saturate(1.02) contrast(1)'
              : 'brightness(0.32) saturate(0.75) contrast(1.05)',
          }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover object-center select-none"
        />
      </motion.div>

      {/* 归家前深邃暮色遮罩（随点亮淡出） */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.78 }}
        animate={{ opacity: heroIlluminated ? 0.14 : 0.78 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 bg-[#101622]"
      />

      {/* 第1重光影（最远端）：落地窗边极简落地灯首先在 0.25s 亮起 */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{
          opacity: heroIlluminated ? 0.92 : 0,
          scale: heroIlluminated ? 1 : 0.75,
        }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'radial-gradient(circle at 32.5% 49%, rgba(255, 224, 174, 0.62) 0%, rgba(223, 198, 155, 0.22) 14%, transparent 34%)',
        }}
        className="pointer-events-none absolute inset-0 mix-blend-screen will-change-transform"
      />

      {/* 第2重光影（中景）：中央线性雕塑吊灯在 0.45s 亮起并向下漫射至沙发茶几 */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{
          opacity: heroIlluminated ? 0.95 : 0,
          scale: heroIlluminated ? 1 : 0.86,
        }}
        transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'radial-gradient(ellipse 38% 24% at 50% 34%, rgba(255, 234, 194, 0.58) 0%, rgba(223, 198, 155, 0.22) 48%, transparent 82%), radial-gradient(ellipse 46% 36% at 50% 62%, rgba(255, 223, 176, 0.24) 0%, transparent 72%)',
        }}
        className="pointer-events-none absolute inset-0 mix-blend-screen will-change-transform"
      />

      {/* 第3重光影（近景）：右侧胡桃木护墙壁龛与左侧微水泥墙面环境漫反射 */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: heroIlluminated ? 0.88 : 0 }}
        transition={{ duration: 0.95, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'radial-gradient(ellipse 32% 52% at 92% 45%, rgba(236, 184, 118, 0.32) 0%, transparent 74%), radial-gradient(ellipse 28% 48% at 8% 55%, rgba(245, 228, 202, 0.16) 0%, transparent 72%)',
        }}
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      />

      {/* Canvas 实时体积光与微尘粒子 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: heroIlluminated ? 0.72 : 0.1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <VolumetricLightCanvas
          intensity={heroIlluminated ? 0.42 : 0.08}
          rayColor={[248, 220, 174]}
          angleDeg={-16}
          dustCount={36}
        />
      </motion.div>

      {/* 指针暖光抚触层 */}
      <AmbientPointerLight
        contained
        containerRef={containerRef}
        size={620}
        color="rgba(235, 198, 144, 0.18)"
      />

      {/* 底部及左下方极轻护眼渐变，保持文字清透同时不掩盖画册感 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#111620]/75 via-[#111620]/15 to-[#111620]/25"
      />

      {/* 电影感叙事文字层 */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 md:px-14 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            {/* 眉题遮罩揭幕 */}
            <div className="overflow-hidden mb-4">
              <motion.p
                initial={{ y: '110%', opacity: 0 }}
                animate={{
                  y: heroIlluminated ? '0%' : '110%',
                  opacity: heroIlluminated ? 0.85 : 0,
                }}
                transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-champagne-200 font-medium"
              >
                Lumina Home · 会呼吸的未来居所
              </motion.p>
            </div>

            {/* 主标题遮罩揭幕 */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: heroIlluminated ? '0%' : '110%' }}
                transition={{ duration: 1.05, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal tracking-tight leading-[1.12] text-[#FAF8F4]"
              >
                推门那一刻，灯先懂你。
              </motion.h1>
            </div>

            {/* 副标题遮罩揭幕 */}
            <div className="overflow-hidden mt-4 md:mt-5">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                animate={{
                  y: heroIlluminated ? '0%' : '100%',
                  opacity: heroIlluminated ? 0.82 : 0,
                }}
                transition={{ duration: 0.95, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl text-sm sm:text-base md:text-[17px] leading-relaxed font-light text-[#ECE7DF]"
              >
                不用找开关，房间自己会呼吸。光影、微风与声音，在你落座之前，早已变得刚刚好。
              </motion.p>
            </div>
          </div>

          {/* 底部极克制的单引导按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: heroIlluminated ? 1 : 0,
              y: heroIlluminated ? 0 : 16,
            }}
            transition={{ duration: 0.9, delay: 0.92, ease: [0.22, 1, 0.36, 1] }}
            className="flex shrink-0 items-center"
          >
            <button
              type="button"
              onClick={onExplore}
              className="group frosted-surface-dark flex items-center gap-3.5 rounded-full border border-white/20 bg-[#1B2230]/45 px-6 py-3.5 text-sm tracking-wider text-[#FAF8F4] transition-all duration-500 ease-architect hover:border-champagne-300/60 hover:bg-[#232C3D]/65"
            >
              <span>探索空间</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-champagne-300/15 text-champagne-200 transition-transform duration-500 ease-architect group-hover:translate-y-0.5">
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.6} />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
