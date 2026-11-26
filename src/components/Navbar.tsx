import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAtmosphere } from '../context/AtmosphereContext';

interface NavbarProps {
  onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollTo }) => {
  const { heroIlluminated, lighting, openReservation } = useAtmosphere();
  const [scrolled, setScrolled] = useState(false);
  const [overDarkSection, setOverDarkSection] = useState(true);

  useEffect(() => {
    const checkPosition = () => {
      const y = window.scrollY;
      setScrolled(y > 48);

      const probeY = 44; // 导航栏中心高度所在位置
      const heroEl = document.getElementById('hero');
      const storyEl = document.getElementById('scrollytelling');

      const isOverHero = heroEl
        ? heroEl.getBoundingClientRect().bottom > probeY
        : false;
      const isOverStory = storyEl
        ? storyEl.getBoundingClientRect().top <= probeY &&
          storyEl.getBoundingClientRect().bottom > probeY
        : false;

      setOverDarkSection(isOverHero || isOverStory);
    };

    checkPosition();
    window.addEventListener('scroll', checkPosition, { passive: true });
    window.addEventListener('resize', checkPosition, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, []);

  const useDarkPill = overDarkSection || lighting.lightTextBlend > 0.52;

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{
        opacity: heroIlluminated ? 1 : 0,
        y: heroIlluminated ? 0 : -16,
      }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-8 md:pt-6 pointer-events-none"
    >
      <nav
        aria-label="主导航"
        className={`pointer-events-auto flex items-center justify-between gap-6 rounded-full px-5 py-2.5 md:px-7 md:py-3 transition-all duration-700 ease-architect ${
          !scrolled
            ? 'bg-[#141B27]/45 backdrop-blur-md border border-white/15 text-[#FAF8F4] w-full max-w-6xl'
            : useDarkPill
            ? 'frosted-surface-dark bg-[#161E2B]/80 border border-white/15 text-[#FAF8F4] w-full max-w-4xl'
            : 'frosted-surface bg-[#FAF8F4]/85 border border-[#23201D]/10 text-[#23201D] w-full max-w-4xl'
        }`}
      >
        {/* 极简品牌标志 */}
        <button
          type="button"
          onClick={() => onScrollTo('hero')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-champagne-300 opacity-60 animate-soft-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-champagne-300 shadow-[0_0_10px_rgba(223,198,155,0.85)]" />
          </span>
          <span className="font-serif text-lg md:text-xl tracking-wide font-medium">
            Lumina <span className="font-light opacity-80">Home</span>
          </span>
        </button>

        {/* 克制的空间导航锚点 */}
        <div className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.06em] font-normal">
          <button
            type="button"
            onClick={() => onScrollTo('daylight-lab')}
            className="opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            光影实验室
          </button>
          <button
            type="button"
            onClick={() => onScrollTo('spatial-roam')}
            className="opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            全屋漫游
          </button>
          <button
            type="button"
            onClick={() => onScrollTo('scrollytelling')}
            className="opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            无感日常
          </button>
        </div>

        {/* 右侧极简预约入口 */}
        <button
          type="button"
          onClick={() => openReservation('线下空间光影体验')}
          className={`rounded-full px-4 py-1.5 text-xs md:text-[13px] tracking-wide transition-all duration-500 ease-architect ${
            scrolled && !useDarkPill
              ? 'bg-[#23201D] text-[#FAF8F4] hover:bg-[#3A261B]'
              : 'bg-[#FAF8F4]/95 text-[#23201D] hover:bg-white'
          }`}
        >
          预约体验
        </button>
      </nav>
    </motion.header>
  );
};
