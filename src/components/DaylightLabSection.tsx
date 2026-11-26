import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, BookOpen, Film, Moon } from 'lucide-react';
import { LIGHTING_KEYFRAMES } from '../data/luminaData';
import { useAtmosphere } from '../context/AtmosphereContext';
import { VolumetricLightCanvas } from './VolumetricLightCanvas';
import { AmbientPointerLight } from './AmbientPointerLight';

const PRESET_ICONS = [Sun, BookOpen, Film, Moon];

export const DaylightLabSection: React.FC = () => {
  const { labProgress, setLabProgress, lighting } = useAtmosphere();
  const stageRef = useRef<HTMLDivElement>(null);

  const isDark = lighting.lightTextBlend > 0.52;

  // 提取太阳光束颜色 RGB 用于 Canvas
  const rayRgbNums = lighting.sunbeamCss
    .replace(/[^\d,]/g, '')
    .split(',')
    .map((n) => Number(n.trim())) as [number, number, number];

  // 计算室内底图物理光影参数
  const brightness = 1 - lighting.dimOverlayAlpha * 0.62;
  const warmthSepia = lighting.interiorWarmAlpha * 0.14;

  return (
    <section
      id="daylight-lab"
      className="relative py-24 md:py-36 transition-colors duration-700 ease-architect"
      style={{
        color: isDark ? '#F5F1EA' : '#23201D',
      }}
    >
      {/* 全局氛围响应光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 65% 45% at 50% 42%, rgba(200, 168, 120, 0.08), transparent 70%)'
            : 'radial-gradient(ellipse 65% 45% at 50% 42%, rgba(255, 226, 178, 0.28), transparent 72%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* 板块标题与诗意副标 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="max-w-xl">
            <p
              className={`mb-3 text-xs uppercase tracking-[0.26em] font-medium transition-colors duration-700 ${
                isDark ? 'text-champagne-300/85' : 'text-walnut-600'
              }`}
            >
              Daylight &amp; Evening Atelier · 光影昼夜实验室
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.18]">
              从晨曦第一缕光，到深夜的一盏微温。
            </h2>
          </div>

          <p
            className={`max-w-sm text-sm md:text-[15px] leading-relaxed font-light transition-colors duration-700 ${
              isDark ? 'text-[#D6CEC2]/80' : 'text-warmgrey-600'
            }`}
          >
            拖动时间标尺，感受窗外天光角度、百叶斜影与室内灯光如何随着太阳与心境默契流转。
          </p>
        </motion.div>

        {/* 建筑感空间渲染舞台 */}
        <motion.div
          ref={stageRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/20 shadow-[0_32px_90px_-24px_rgba(24,20,16,0.28)] select-none bg-[#1B2028]"
        >
          {/* 1. 建筑实景底图 */}
          <img
            src="/images/daylight-studio.jpg"
            alt="Lumina Home 光影昼夜变化阅读角空间"
            style={{
              filter: `brightness(${brightness.toFixed(3)}) sepia(${warmthSepia.toFixed(3)}) contrast(1.02)`,
            }}
            className="h-full w-full object-cover object-center transition-[filter] duration-150"
          />

          {/* 2. 左侧落地窗与百叶窗实时天光染层 */}
          <div
            aria-hidden="true"
            style={{
              background: `linear-gradient(90deg, ${lighting.windowSkyCss} 0%, ${lighting.windowSkyCss} 24%, transparent 46%)`,
            }}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          />

          {/* 2b. 夜间玻璃窗深邃暮色蓝静夜映照 */}
          <div
            aria-hidden="true"
            style={{
              opacity: Math.max(0, (lighting.lightTextBlend - 0.15) * 0.9),
              background:
                'linear-gradient(90deg, rgba(16, 26, 44, 0.86) 0%, rgba(18, 28, 46, 0.78) 36%, transparent 44%)',
            }}
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
          />

          {/* 3. 动态窗格斜射日光与百叶投射光影（投射在正中石灰泥墙面上！） */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.sunbeamAlpha,
              transform: `perspective(900px) rotateY(-8deg) skewY(${lighting.sunbeamAngle * 0.55}deg) translateX(${
                lighting.sunbeamAngle * 0.65
              }px)`,
              backgroundImage: `repeating-linear-gradient(
                ${104 + lighting.sunbeamAngle * 0.35}deg,
                ${lighting.sunbeamCss} 0px,
                ${lighting.sunbeamCss} 16px,
                transparent 16px,
                transparent 30px
              )`,
              maskImage:
                'radial-gradient(ellipse 48% 58% at 54% 48%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 55%, transparent 82%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 48% 58% at 54% 48%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 55%, transparent 82%)',
            }}
            className="pointer-events-none absolute inset-0 mix-blend-soft-light will-change-transform"
          />

          {/* 3b. 主墙面柔光洗墙反光 */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.sunbeamAlpha * 0.8,
              background: `radial-gradient(ellipse 52% 60% at 52% 48%, ${lighting.sunbeamCss}, transparent 75%)`,
            }}
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
          />

          {/* 4. 室内暗夜压暗与全局氛围调色 */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.dimOverlayAlpha * 0.72,
              background:
                'radial-gradient(ellipse 85% 80% at 56% 52%, rgba(16, 22, 34, 0.45) 0%, rgba(12, 17, 27, 0.92) 100%)',
            }}
            className="pointer-events-none absolute inset-0"
          />

          {/* 5. 室内局部人工光源精准亮起（影院微醺时开启） */}
          {/* 5a. 洞石边几上的黑色台灯锥形暖光 (x: 60.8%, y: 65%) */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.interiorWarmAlpha,
              background:
                'radial-gradient(circle at 60.8% 65%, rgba(255, 226, 170, 0.9) 0%, rgba(236, 178, 102, 0.42) 10%, transparent 25%), radial-gradient(ellipse 22% 28% at 62% 76%, rgba(255, 206, 138, 0.48) 0%, transparent 72%)',
            }}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
          />

          {/* 5b. 右侧胡桃木书架壁龛洗墙暖光 + 天花嵌入式微光 (x: 88%, y: 45%) */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.interiorWarmAlpha * 0.92,
              background:
                'radial-gradient(ellipse 24% 62% at 91% 48%, rgba(245, 186, 112, 0.56) 0%, rgba(223, 162, 92, 0.18) 52%, transparent 80%), radial-gradient(circle at 80% 7%, rgba(255, 225, 178, 0.65) 0%, transparent 16%)',
            }}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
          />

          {/* 6. 影院模式银幕漫反射光（微弱冷蓝与琥珀对比，营造电影氛围） */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.cinemaBounceAlpha,
              background:
                'radial-gradient(ellipse 55% 42% at 46% 52%, rgba(132, 165, 220, 0.18) 0%, transparent 72%)',
            }}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
          />

          {/* 7. 深夜 23:30 贴地微光踢脚线夜灯 */}
          <div
            aria-hidden="true"
            style={{
              opacity: lighting.floorNightlightAlpha,
              background:
                'radial-gradient(ellipse 58% 12% at 64% 87%, rgba(255, 198, 125, 0.62) 0%, rgba(235, 166, 90, 0.22) 48%, transparent 78%)',
            }}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
          />

          {/* 8. Canvas 实时同步体积光与空气微尘 */}
          <div className="pointer-events-none absolute inset-0">
            <VolumetricLightCanvas
              intensity={Math.max(0.08, lighting.sunbeamAlpha * 1.15)}
              rayColor={rayRgbNums.length === 3 ? rayRgbNums : [255, 226, 178]}
              angleDeg={lighting.sunbeamAngle * 0.85}
              dustCount={32}
            />
          </div>

          {/* 9. 指针暖光交互 */}
          <AmbientPointerLight
            contained
            containerRef={stageRef}
            size={440}
            color={
              isDark
                ? 'rgba(232, 184, 118, 0.22)'
                : 'rgba(255, 240, 212, 0.22)'
            }
          />

          {/* 场景左上角极简实时光影标注 */}
          <div className="pointer-events-none absolute left-5 top-5 md:left-8 md:top-8 flex items-center gap-3">
            <div className="frosted-surface-dark rounded-full border border-white/15 bg-[#151B26]/45 px-4 py-1.5 text-xs tracking-wider text-[#FAF8F4] flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor:
                    lighting.kelvin > 4500
                      ? '#E8F1FF'
                      : lighting.kelvin > 3200
                      ? '#FFE2AF'
                      : '#F2A95E',
                  boxShadow: '0 0 10px currentColor',
                }}
              />
              <span className="font-serif text-sm tabular-nums">{lighting.timeLabel}</span>
              <span className="opacity-45">·</span>
              <span>{lighting.sceneName}</span>
            </div>
          </div>

          {/* 右上角生活感受标签（仅极简 3 个微状态胶囊） */}
          <div className="pointer-events-none hidden sm:flex absolute right-5 top-5 md:right-8 md:top-8 flex-wrap justify-end gap-2">
            {lighting.ambientTags.map((tag) => (
              <span
                key={tag}
                className="frosted-surface-dark rounded-full border border-white/15 bg-[#151B26]/45 px-3.5 py-1.5 text-[11px] tracking-wide text-[#EFE8DC]/90"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 画面左下角诗意解读 */}
          <div className="pointer-events-none absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 flex items-end justify-between gap-4">
            <div className="frosted-surface-dark max-w-lg rounded-2xl border border-white/15 bg-[#141A24]/50 px-5 py-3.5 text-[#FAF8F4]">
              <p className="text-xs sm:text-sm font-light leading-relaxed text-[#F3ECE0]/95">
                {lighting.poeticLine}
              </p>
            </div>

            <div className="hidden md:block frosted-surface-dark rounded-full border border-white/15 bg-[#141A24]/50 px-4 py-2 text-xs tracking-widest text-champagne-200/90 tabular-nums">
              色温 {lighting.kelvin}K
            </div>
          </div>
        </motion.div>

        {/* 时间 / 场景光影滑块控制台 */}
        <div
          className={`mt-6 md:mt-8 rounded-[24px] p-5 md:p-7 transition-all duration-700 ease-architect ${
            isDark
              ? 'frosted-surface-dark border border-white/10 bg-[#1B2331]/65 text-[#FAF8F4]'
              : 'frosted-surface border border-warmgrey-300/35 bg-[#FAF8F4]/80 text-[#23201D]'
          }`}
        >
          <div className="surface-grain pointer-events-none absolute inset-0 rounded-[24px]" />

          <div className="relative z-10 flex flex-col gap-5">
            {/* 滑块轨道 */}
            <div className="relative flex items-center py-2">
              <div
                aria-hidden="true"
                className="h-2 w-full rounded-full overflow-hidden"
                style={{
                  background:
                    'linear-gradient(90deg, #F6D8A4 0%, #FFF7EA 33%, #C89254 67%, #29354B 100%)',
                  opacity: 0.85,
                }}
              />
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={labProgress}
                aria-label="昼夜光影时间调节滑块"
                onChange={(e) => setLabProgress(parseFloat(e.target.value))}
                className="lumina-slider absolute inset-0 w-full h-full"
              />
            </div>

            {/* 四个可直达时刻锚点 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {LIGHTING_KEYFRAMES.map((kf, idx) => {
                const Icon = PRESET_ICONS[idx];
                const isActive = lighting.nearestIndex === idx;
                return (
                  <button
                    key={kf.timeLabel}
                    type="button"
                    onClick={() => setLabProgress(kf.progress)}
                    className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-left transition-all duration-500 ease-architect border ${
                      isActive
                        ? isDark
                          ? 'bg-white/10 border-champagne-300/45 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)]'
                          : 'bg-[#FAF8F4] border-champagne-400/60 shadow-[0_12px_28px_-12px_rgba(92,64,48,0.18)]'
                        : isDark
                        ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06]'
                        : 'bg-white/35 border-warmgrey-300/25 hover:bg-white/65'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                        isActive
                          ? 'bg-champagne-400/20 text-champagne-500'
                          : isDark
                          ? 'bg-white/5 text-warmgrey-300'
                          : 'bg-warmgrey-200/50 text-warmgrey-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base font-medium tabular-nums">
                          {kf.timeLabel}
                        </span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full transition-opacity duration-300 ${
                            isActive ? 'bg-champagne-400 opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xs transition-colors ${
                          isActive
                            ? isDark
                              ? 'text-[#FAF8F4]'
                              : 'text-[#23201D]'
                            : isDark
                            ? 'text-[#B8AFA3]'
                            : 'text-warmgrey-600'
                        }`}
                      >
                        {kf.sceneName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
