import React from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';

export const Footer: React.FC = () => {
  const { lighting } = useAtmosphere();
  const isDark = lighting.lightTextBlend > 0.52;

  return (
    <footer
      className={`border-t py-12 transition-colors duration-700 ease-architect ${
        isDark
          ? 'border-white/10 text-[#B8AFA3]'
          : 'border-warmgrey-300/40 text-warmgrey-600'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-12 text-xs tracking-wider">
        <div className="flex items-center gap-3">
          <span
            className={`font-serif text-base ${
              isDark ? 'text-[#FAF8F4]' : 'text-[#23201D]'
            }`}
          >
            Lumina Home
          </span>
          <span className="opacity-40">·</span>
          <span>光栖之境</span>
        </div>

        <p className="font-light opacity-75">
          上海 · 北京 · 深圳 · 成都 ｜ Light that knows you before you speak.
        </p>
      </div>
    </footer>
  );
};
