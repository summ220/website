import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { AmbientPointerLight } from './AmbientPointerLight';

export const ClosingSection: React.FC = () => {
  const { lighting, openReservation } = useAtmosphere();
  const isDark = lighting.lightTextBlend > 0.52;
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="closing"
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-44 transition-colors duration-700 ease-architect"
      style={{ color: isDark ? '#F5F1EA' : '#23201D' }}
    >
      {/* 柔和渐变光晕背景衬托 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(223, 198, 155, 0.14) 0%, rgba(42, 53, 72, 0.25) 45%, transparent 78%)'
            : 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(236, 198, 138, 0.28) 0%, rgba(245, 241, 234, 0.6) 48%, transparent 80%)',
        }}
      />

      <AmbientPointerLight
        contained
        containerRef={sectionRef}
        size={520}
        color={isDark ? 'rgba(223, 198, 155, 0.16)' : 'rgba(223, 188, 136, 0.24)'}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className={`mb-5 text-xs uppercase tracking-[0.3em] font-medium ${
              isDark ? 'text-champagne-300' : 'text-walnut-600'
            }`}
          >
            Lumina Experience Atelier
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.16] mb-6">
            科技隐入墙面之后，
            <br />
            生活才真正开始。
          </h2>
          <p
            className={`mx-auto max-w-xl text-sm sm:text-base md:text-[17px] leading-relaxed font-light mb-11 ${
              isDark ? 'text-[#D6CEC2]/85' : 'text-warmgrey-600'
            }`}
          >
            没有说明书，也没有冷冰冰的按键阵。欢迎走进线下光影体验馆，在真实的一杯咖啡与午后阳光之间，感受家自己呼吸的样子。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openReservation('预约线下空间体验')}
              className={`group flex items-center gap-3 rounded-full px-8 py-4 text-sm tracking-wider transition-all duration-500 ease-architect ${
                isDark
                  ? 'bg-champagne-200 text-[#23201D] hover:bg-[#FAF8F4] shadow-[0_16px_40px_-12px_rgba(223,198,155,0.4)]'
                  : 'bg-[#23201D] text-[#FAF8F4] hover:bg-walnut-700 shadow-[0_16px_40px_-12px_rgba(35,32,29,0.3)]'
              }`}
            >
              <span>预约线下空间体验</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-architect group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={() => openReservation('定制你的专属空间')}
              className={`rounded-full px-8 py-4 text-sm tracking-wider transition-all duration-500 ease-architect border ${
                isDark
                  ? 'frosted-surface-dark border-white/20 bg-white/5 text-[#FAF8F4] hover:border-champagne-300/60 hover:bg-white/10'
                  : 'frosted-surface border-warmgrey-400/40 bg-[#FAF8F4]/70 text-[#23201D] hover:border-walnut-600/50 hover:bg-white'
              }`}
            >
              定制你的家
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
