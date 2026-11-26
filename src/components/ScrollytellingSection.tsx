import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { Sun, Volume2, Wind, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { STORY_CHAPTERS, StorySensoryBadge } from '../data/luminaData';
import { ScrollytellingFlowCanvas } from './ScrollytellingFlowCanvas';

interface ScrollytellingSectionProps {
  onScrollToY?: (targetY: number) => void;
}

const BADGE_ICONS: Record<StorySensoryBadge['icon'], React.FC<{ className?: string }>> = {
  light: Sun,
  sound: Volume2,
  air: Wind,
  curtain: Sparkles,
};

export const ScrollytellingSection: React.FC<ScrollytellingSectionProps> = ({
  onScrollToY,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 物理阻尼缓冲，让镜头推进与交叉淡化如电影轨道般顺滑跟手
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 26,
    mass: 0.6,
  });

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    let next = 0;
    if (v < 0.2) next = 0;
    else if (v < 0.4) next = 1;
    else if (v < 0.6) next = 2;
    else if (v < 0.8) next = 3;
    else next = 4;

    if (next !== activeIndex) setActiveIndex(next);
  });

  // --- 5 幕平滑交叉透明度权重 (邻幕重叠交融，零生硬切换) ---
  const opacityMorning = useTransform(smoothProgress, [0, 0.16, 0.25], [1, 1, 0]);
  const opacityKitchen = useTransform(smoothProgress, [0.15, 0.24, 0.36, 0.45], [0, 1, 1, 0]);
  const opacityHomecoming = useTransform(smoothProgress, [0.35, 0.44, 0.56, 0.65], [0, 1, 1, 0]);
  const opacityCinema = useTransform(smoothProgress, [0.55, 0.64, 0.76, 0.85], [0, 1, 1, 0]);
  const opacitySleep = useTransform(smoothProgress, [0.75, 0.84, 1], [0, 1, 1]);

  // --- 各幕专属电影运镜（推镜 / 轻移）---
  const scaleMorning = useTransform(smoothProgress, [0, 0.25], [1.02, 1.1]);
  const xMorning = useTransform(smoothProgress, [0, 0.25], ['0%', '-1.8%']);

  const scaleKitchen = useTransform(smoothProgress, [0.15, 0.45], [1.03, 1.11]);
  const scaleHomecoming = useTransform(smoothProgress, [0.35, 0.65], [1.0, 1.13]);
  const yHomecoming = useTransform(smoothProgress, [0.35, 0.65], ['0%', '-1.5%']);

  const scaleCinema = useTransform(smoothProgress, [0.55, 0.85], [1.04, 1.11]);
  const xCinema = useTransform(smoothProgress, [0.55, 0.85], ['1%', '-1.2%']);

  const scaleSleep = useTransform(smoothProgress, [0.75, 1], [1.0, 1.11]);

  // --- 各幕专属物理光效叠加参数 ---
  // 幕1：清晨窗帘缝隙随进度让开，金桃色朝霞渐盛
  const morningCurtainPart = useTransform(smoothProgress, [0, 0.14, 0.24], [0.2, 1, 1]);
  const morningSunlightGlow = useTransform(smoothProgress, [0, 0.12, 0.24], [0.4, 0.95, 0.4]);

  // 幕2：岛台线性吊灯与手冲台面微聚光点亮
  const kitchenPendantGlow = useTransform(smoothProgress, [0.18, 0.28, 0.42], [0.2, 0.95, 0.5]);

  // 幕3：推门归家，玄关两侧胡桃木洗墙暖光与顶部灯槽渐亮
  const homecomingGlow = useTransform(smoothProgress, [0.38, 0.48, 0.6], [0.2, 0.96, 0.35]);

  // 幕4：观影时刻，左侧落地窗帘合拢 + 屏幕墙面与格栅氛围微光
  const cinemaCurtainClose = useTransform(smoothProgress, [0.58, 0.72, 0.82], [0.08, 1, 1]);
  const cinemaGlow = useTransform(smoothProgress, [0.6, 0.7, 0.82], [0.25, 0.95, 0.4]);

  // 幕5：深夜安眠，沿着踢脚线与远方床底铺开的 1800K 贴地微暖夜灯呼吸点亮
  const sleepFloorGlow = useTransform(smoothProgress, [0.78, 0.9, 1], [0.25, 0.96, 1]);

  // 底部进度光丝宽度
  const progressBarScaleX = useTransform(smoothProgress, [0, 1], [0.06, 1]);

  const currentChapter = STORY_CHAPTERS[activeIndex];

  const jumpToChapter = (idx: number) => {
    const safeIdx = Math.max(0, Math.min(STORY_CHAPTERS.length - 1, idx));
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const scrollable = rect.height - window.innerHeight;
    const targets = [0.08, 0.3, 0.5, 0.7, 0.92];
    const targetY = top + scrollable * targets[safeIdx];

    if (onScrollToY) {
      onScrollToY(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="scrollytelling"
      ref={containerRef}
      className="relative h-[480vh] w-full bg-[#111620] text-[#FAF8F4]"
    >
      {/* 粘性全屏电影观景舞台 */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* ================= 幕 01：07:15 晨光唤醒 ================= */}
        <motion.div
          style={{ opacity: opacityMorning }}
          className="absolute inset-0 will-change-[opacity]"
        >
          <motion.div
            style={{ scale: scaleMorning, x: xMorning }}
            className="relative h-full w-full will-change-transform"
          >
            <img
              src="/images/story-morning.jpg"
              alt="清晨第一抹阳光穿过卧室薄纱窗帘"
              className="h-full w-full object-cover object-center select-none"
            />
            {/* 中央落地窗晨曦金桃色耀斑 */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: morningSunlightGlow }}
              className="pointer-events-none absolute inset-0 mix-blend-screen"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    'radial-gradient(ellipse 36% 48% at 43% 44%, rgba(255, 224, 178, 0.55), rgba(255, 198, 146, 0.18) 52%, transparent 80%), radial-gradient(ellipse 40% 30% at 72% 68%, rgba(255, 228, 194, 0.28), transparent 72%)',
                }}
              />
            </motion.div>
            {/* 中央纱帘左右微微让开缝隙动效 */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: morningCurtainPart }}
              className="pointer-events-none absolute left-[35%] top-[13%] h-[55%] w-[22%]"
            >
              <div className="h-full w-full bg-gradient-to-b from-amber-100/20 via-amber-50/10 to-transparent blur-md mix-blend-screen" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= 幕 02：08:40 晨间岛台 ================= */}
        <motion.div
          style={{ opacity: opacityKitchen }}
          className="absolute inset-0 will-change-[opacity]"
        >
          <motion.div
            style={{ scale: scaleKitchen }}
            className="relative h-full w-full will-change-transform"
          >
            <img
              src="/images/story-kitchen.jpg"
              alt="晨间洞石岛台与手冲咖啡光影"
              className="h-full w-full object-cover object-center select-none"
            />
            {/* 线性吊灯点亮 + 洞石手冲台面微聚光 (x: 54%~67%, y: 23.5% -> 52%) */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: kitchenPendantGlow }}
              className="pointer-events-none absolute inset-0 mix-blend-screen"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    'radial-gradient(ellipse 38% 12% at 67% 23.5%, rgba(255, 240, 210, 0.62), transparent 75%), radial-gradient(ellipse 26% 24% at 56% 52%, rgba(255, 232, 194, 0.42), transparent 72%)',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= 幕 03：18:50 推门归家 ================= */}
        <motion.div
          style={{ opacity: opacityHomecoming }}
          className="absolute inset-0 will-change-[opacity]"
        >
          <motion.div
            style={{ scale: scaleHomecoming, y: yHomecoming }}
            className="relative h-full w-full will-change-transform"
          >
            <img
              src="/images/story-sanctuary.jpg"
              alt="推门步入温暖点亮的玄关与客厅"
              className="h-full w-full object-cover object-center select-none"
            />
            {/* 玄关两侧胡桃木墙面迎宾暖光与入户灯槽 */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: homecomingGlow }}
              className="pointer-events-none absolute inset-0 mix-blend-screen"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    'radial-gradient(ellipse 30% 62% at 14% 55%, rgba(255, 208, 142, 0.46), transparent 72%), radial-gradient(ellipse 28% 58% at 88% 52%, rgba(255, 202, 134, 0.36), transparent 72%), radial-gradient(ellipse 52% 20% at 50% 8%, rgba(255, 230, 186, 0.48), transparent 76%)',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= 幕 04：21:00 观影时刻 ================= */}
        <motion.div
          style={{ opacity: opacityCinema }}
          className="absolute inset-0 will-change-[opacity]"
        >
          <motion.div
            style={{ scale: scaleCinema, x: xCinema }}
            className="relative h-full w-full will-change-transform"
          >
            <img
              src="/images/story-cinema.jpg"
              alt="深邃暮色中的家庭沉浸观影客厅"
              className="h-full w-full object-cover object-center select-none"
            />
            {/* 左侧落地窗缝隙纱帘静静合拢 (精确对齐图片 11%..21.5%, top 2%..63%) */}
            <motion.div
              aria-hidden="true"
              style={{ scaleX: cinemaCurtainClose }}
              className="pointer-events-none absolute left-[11%] top-[2%] h-[61%] w-[10.8%] origin-right bg-gradient-to-l from-[#1A212E]/95 via-[#212A38]/85 to-[#161D28]/95 backdrop-blur-[1.5px]"
            />
            {/* 屏幕墙体柔光反射 + 两侧胡桃木格栅灯带增亮 + 沙发环绕声波 */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: cinemaGlow }}
              className="pointer-events-none absolute inset-0"
            >
              <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  background:
                    'radial-gradient(ellipse 28% 32% at 68% 40%, rgba(182, 206, 240, 0.25), rgba(235, 182, 118, 0.24) 55%, transparent 80%), radial-gradient(ellipse 14% 64% at 87% 46%, rgba(255, 198, 126, 0.42), transparent 74%), radial-gradient(ellipse 12% 52% at 53% 44%, rgba(255, 192, 118, 0.34), transparent 72%)',
                }}
              />
              {/* 环绕声场涟漪中心位于沙发包裹区 */}
              <div className="absolute left-[34%] top-[66%] -translate-x-1/2 -translate-y-1/2">
                <span className="block h-52 w-52 rounded-full border border-champagne-300/35 animate-sound-ripple" />
                <span
                  className="block absolute inset-0 rounded-full border border-champagne-200/20 animate-sound-ripple"
                  style={{ animationDelay: '1.1s' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================= 幕 05：23:30 安然入眠 ================= */}
        <motion.div
          style={{ opacity: opacitySleep }}
          className="absolute inset-0 will-change-[opacity]"
        >
          <motion.div
            style={{ scale: scaleSleep }}
            className="relative h-full w-full will-change-transform"
          >
            <img
              src="/images/story-sleep.jpg"
              alt="整屋熄灯后留一缕贴地感应夜灯守护入眠"
              className="h-full w-full object-cover object-center select-none"
            />
            {/* 贴地 1800K 感应暖光沿走廊木地板及远端悬浮床底柔和呼吸 */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: sleepFloorGlow }}
              className="pointer-events-none absolute inset-0 mix-blend-screen"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    'radial-gradient(ellipse 26% 18% at 32% 84%, rgba(255, 178, 96, 0.46), transparent 72%), radial-gradient(ellipse 26% 18% at 70% 84%, rgba(255, 178, 96, 0.42), transparent 72%), radial-gradient(ellipse 24% 12% at 50% 60%, rgba(255, 186, 108, 0.36), transparent 72%)',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 全程物理同步 Canvas：体积晨光束 / 归家微风流体光带 / 空气光尘粒子 */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <ScrollytellingFlowCanvas progressMotionValue={smoothProgress} />
        </div>

        {/* 电影级柔和护眼渐变遮罩（确保浅色晨光场景与深色夜光场景的文字皆清晰可读） */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0D1119]/85 via-[#0D1119]/15 to-[#0D1119]/50"
        />

        {/* 前景叙事浮层 */}
        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-24 md:px-14 md:py-28">
          {/* 顶部总标题与右侧 5 幕时间轴索引 */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-champagne-300/95">
                Effortless Living · 无感生活的一天
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#FAF8F4]">
                无感，才是最高级的智能。
              </h2>
            </div>

            {/* 桌面端右侧垂直 5 幕时间轴 */}
            <div className="hidden md:flex flex-col items-end gap-2.5 pt-1">
              {STORY_CHAPTERS.map((chap, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => jumpToChapter(idx)}
                    className="group flex items-center gap-3 text-right focus:outline-none py-0.5"
                  >
                    <span
                      className={`text-[11px] font-serif tabular-nums transition-opacity duration-500 ${
                        active ? 'text-champagne-300 opacity-95' : 'text-white/40 opacity-60'
                      }`}
                    >
                      {chap.timeLabel}
                    </span>
                    <span
                      className={`text-xs tracking-wider transition-all duration-500 ${
                        active
                          ? 'text-champagne-200 opacity-100 font-medium'
                          : 'text-white/55 opacity-75 group-hover:opacity-100'
                      }`}
                    >
                      {chap.timeHint}
                    </span>
                    <span
                      className={`h-2 rounded-full transition-all duration-500 ease-architect ${
                        active
                          ? 'w-8 bg-champagne-300 shadow-[0_0_12px_rgba(223,198,155,0.85)]'
                          : 'w-2 bg-white/30 group-hover:bg-white/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 底部当前生活瞬间叙事卡与控制 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChapter.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="frosted-surface-dark max-w-2xl rounded-[24px] border border-white/15 bg-[#131924]/65 p-6 md:p-8"
                >
                  {/* 序号 + 时刻 + 场景名 */}
                  <div className="mb-3 flex items-center gap-3 text-xs tracking-[0.2em] text-champagne-300">
                    <span className="font-serif text-base">{currentChapter.indexLabel}</span>
                    <span className="h-px w-6 bg-champagne-300/45" />
                    <span className="font-serif text-sm tabular-nums opacity-90">
                      {currentChapter.timeLabel}
                    </span>
                    <span className="opacity-40">·</span>
                    <span>{currentChapter.timeHint}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#FAF8F4] mb-3">
                    {currentChapter.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] leading-relaxed font-light text-[#ECE7DF]/90 mb-5">
                    {currentChapter.description}
                  </p>

                  {/* 3 个生活感受微徽章 */}
                  <div className="flex flex-wrap gap-2">
                    {currentChapter.sensoryBadges.map((badge) => {
                      const BadgeIcon = BADGE_ICONS[badge.icon];
                      return (
                        <span
                          key={badge.label}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] tracking-wide text-champagne-200/95"
                        >
                          <BadgeIcon className="h-3 w-3 text-champagne-300" />
                          <span>{badge.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 上一幕 / 下一幕优雅切换控制（桌面 + 手机通用） */}
              <div className="flex items-center gap-2.5 self-start md:self-end">
                <button
                  type="button"
                  aria-label="上一幕生活瞬间"
                  disabled={activeIndex === 0}
                  onClick={() => jumpToChapter(activeIndex - 1)}
                  className="frosted-surface-dark flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#141A24]/60 text-[#FAF8F4] transition-all duration-300 hover:border-champagne-300/60 hover:bg-[#1E2736]/80 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="frosted-surface-dark rounded-full border border-white/15 bg-[#141A24]/60 px-4 py-2 text-xs font-serif tracking-widest text-champagne-200 tabular-nums">
                  {currentChapter.indexLabel} / 05
                </div>
                <button
                  type="button"
                  aria-label="下一幕生活瞬间"
                  disabled={activeIndex === STORY_CHAPTERS.length - 1}
                  onClick={() => jumpToChapter(activeIndex + 1)}
                  className="frosted-surface-dark flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#141A24]/60 text-[#FAF8F4] transition-all duration-300 hover:border-champagne-300/60 hover:bg-[#1E2736]/80 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 移动端横排 5 幕快捷胶囊 + 全局流光进度线 */}
            <div className="flex md:hidden flex-wrap items-center gap-1.5">
              {STORY_CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  className={`rounded-full px-3 py-1 text-[11px] transition-all ${
                    idx === activeIndex
                      ? 'bg-champagne-300 text-[#23201D] font-medium'
                      : 'bg-white/15 text-white/80'
                  }`}
                >
                  {chap.timeHint}
                </button>
              ))}
            </div>

            {/* 极简底部一天时间流逝光丝 */}
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
              <motion.div
                style={{ scaleX: progressBarScaleX }}
                className="h-full w-full origin-left bg-gradient-to-r from-champagne-200 via-champagne-300 to-champagne-400"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
