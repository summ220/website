import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
import { AtmosphereProvider, useAtmosphere } from './context/AtmosphereContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DaylightLabSection } from './components/DaylightLabSection';
import { SpatialRoamSection } from './components/SpatialRoamSection';
import { ScrollytellingSection } from './components/ScrollytellingSection';
import { ClosingSection } from './components/ClosingSection';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { AmbientPointerLight } from './components/AmbientPointerLight';

const LuminaExperience: React.FC = () => {
  const { lighting } = useAtmosphere();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const syncBodyBackground = () => {
      const midY = window.innerHeight * 0.5;
      const heroEl = document.getElementById('hero');
      const storyEl = document.getElementById('scrollytelling');
      const inHero = heroEl ? heroEl.getBoundingClientRect().bottom > midY : false;
      const inStory = storyEl
        ? storyEl.getBoundingClientRect().top <= midY &&
          storyEl.getBoundingClientRect().bottom > midY
        : false;
      const bg = inHero || inStory ? '#111620' : lighting.pageBgCss;
      document.documentElement.style.backgroundColor = bg;
      document.body.style.backgroundColor = bg;
    };

    syncBodyBackground();
    window.addEventListener('scroll', syncBodyBackground, { passive: true });
    return () => window.removeEventListener('scroll', syncBodyBackground);
  }, [lighting.pageBgCss]);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        duration: 1.35,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToY = (targetY: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, {
        duration: 0.95,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        backgroundColor: lighting.pageBgCss,
      }}
      className="relative min-h-screen transition-[background-color] duration-300 ease-out"
    >
      {/* 全局极克制指针暖光抚触 */}
      <AmbientPointerLight
        size={640}
        color={
          lighting.lightTextBlend > 0.52
            ? 'rgba(223, 190, 138, 0.09)'
            : 'rgba(255, 226, 178, 0.16)'
        }
      />

      <Navbar onScrollTo={handleScrollTo} />

      <main className="relative z-10">
        {/* 板块一：电影感开场 Hero */}
        <HeroSection onExplore={() => handleScrollTo('daylight-lab')} />

        {/* 板块二：光影昼夜实验室 */}
        <DaylightLabSection />

        {/* 板块三：全屋空间漫游（三层视差 + 热区聚焦） */}
        <SpatialRoamSection />

        {/* 板块四：粘性滚动叙事（Scrollytelling） */}
        <ScrollytellingSection onScrollToY={handleScrollToY} />

        {/* 板块五：温暖的结尾与轻交互预约 */}
        <ClosingSection />
      </main>

      <Footer />
      <ReservationModal />
    </div>
  );
};

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AtmosphereProvider>
        <LuminaExperience />
      </AtmosphereProvider>
    </MotionConfig>
  );
}

export default App;
