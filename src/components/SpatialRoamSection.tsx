import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Sun, Volume2, Wind, Sparkles, X } from 'lucide-react';
import { SPATIAL_ROOMS, SpatialHotspot, HotspotEffectType } from '../data/luminaData';
import { useAtmosphere } from '../context/AtmosphereContext';

const EFFECT_ICONS: Record<HotspotEffectType, React.FC<{ className?: string }>> = {
  light: Sun,
  sound: Volume2,
  curtain: Wind,
  comfort: Sparkles,
};

export const SpatialRoamSection: React.FC = () => {
  const { lighting } = useAtmosphere();
  const isDark = lighting.lightTextBlend > 0.52;

  const [activeRoomId, setActiveRoomId] = useState<'living' | 'study' | 'bedroom'>('living');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const currentRoom = SPATIAL_ROOMS.find((r) => r.id === activeRoomId) || SPATIAL_ROOMS[0];
  const focusedId = lockedId ?? hoveredId;
  const focusedHotspot: SpatialHotspot | undefined = currentRoom.hotspots.find(
    (h) => h.id === focusedId
  );

  // 三层视差物理追踪 (前景 / 中景 / 背景)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 24 });

  // 背景远景光晕位移 (最小)
  const bgX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const bgY = useTransform(smoothY, [-1, 1], [-4, 4]);
  // 中景建筑空间位移 (适中)
  const midX = useTransform(smoothX, [-1, 1], [12, -12]);
  const midY = useTransform(smoothY, [-1, 1], [8, -8]);
  // 前景微光与景深光斑位移 (最大、反向形成强烈空间纵深感)
  const fgX = useTransform(smoothX, [-1, 1], [-22, 22]);
  const fgY = useTransform(smoothY, [-1, 1], [-16, 16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handleMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    setHoveredId(null);
  };

  const handleRoomSwitch = (id: 'living' | 'study' | 'bedroom') => {
    setActiveRoomId(id);
    setHoveredId(null);
    setLockedId(null);
  };

  return (
    <section
      id="spatial-roam"
      className="relative py-24 md:py-36 transition-colors duration-700 ease-architect"
      style={{ color: isDark ? '#F5F1EA' : '#23201D' }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* 标题与空间切换胶囊 */}
        <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p
              className={`mb-3 text-xs uppercase tracking-[0.26em] font-medium ${
                isDark ? 'text-champagne-300/85' : 'text-walnut-600'
              }`}
            >
              Spatial Sanctuary · 全屋空间漫游
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.18]">
              每件器物都有情绪，在角落静静照顾你。
            </h2>
          </motion.div>

          {/* 客厅 / 书房 / 卧室 空间切换 */}
          <div
            className={`inline-flex self-start lg:self-auto rounded-full p-1.5 transition-all duration-500 ${
              isDark
                ? 'frosted-surface-dark border border-white/15 bg-[#1A2230]/60'
                : 'frosted-surface border border-warmgrey-300/40 bg-[#FAF8F4]/80'
            }`}
          >
            {SPATIAL_ROOMS.map((room) => {
              const active = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleRoomSwitch(room.id)}
                  className={`relative rounded-full px-5 py-2 text-xs sm:text-sm tracking-wide transition-colors duration-300 ${
                    active
                      ? isDark
                        ? 'text-[#23201D]'
                        : 'text-[#FAF8F4]'
                      : isDark
                      ? 'text-[#D6CEC2] hover:text-white'
                      : 'text-warmgrey-600 hover:text-[#23201D]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="spatial-room-pill"
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute inset-0 rounded-full ${
                        isDark ? 'bg-champagne-200' : 'bg-[#23201D]'
                      }`}
                    />
                  )}
                  <span className="relative z-10">{room.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 三层视差空间漫游主舞台 */}
        <motion.div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setLockedId(null)}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/20 shadow-[0_32px_90px_-24px_rgba(24,20,16,0.28)] bg-[#23201D]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoom.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              {/* 【第1层：背景远景层】窗外柔焦天光光晕（轻微视差） */}
              <motion.div
                style={{ x: bgX, y: bgY, background: currentRoom.fallbackGradient }}
                className="pointer-events-none absolute -inset-6 opacity-90 will-change-transform"
              />

              {/* 【第2层：中景建筑空间与物理聚焦缩放层】 */}
              <motion.div
                style={{
                  x: midX,
                  y: midY,
                  transformOrigin: focusedHotspot
                    ? `${focusedHotspot.xPercent}% ${focusedHotspot.yPercent}%`
                    : '50% 50%',
                }}
                animate={{
                  scale: focusedHotspot ? 1.08 : 1.02,
                }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -inset-4 will-change-transform"
              >
                <img
                  src={currentRoom.imageUrl}
                  alt={currentRoom.name}
                  className="h-full w-full object-cover object-center select-none"
                />

                {/* 聚焦时四周景深虚化 + 柔和暗角（仅留焦点区域通透明晰） */}
                <motion.div
                  aria-hidden="true"
                  animate={{ opacity: focusedHotspot ? 1 : 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={
                    focusedHotspot
                      ? {
                          background: `radial-gradient(circle 220px at ${focusedHotspot.xPercent}% ${focusedHotspot.yPercent}%, transparent 18%, rgba(16, 20, 28, 0.52) 100%)`,
                          backdropFilter: 'blur(2.5px)',
                          WebkitBackdropFilter: 'blur(2.5px)',
                          maskImage: `radial-gradient(circle 210px at ${focusedHotspot.xPercent}% ${focusedHotspot.yPercent}%, transparent 32%, black 85%)`,
                          WebkitMaskImage: `radial-gradient(circle 210px at ${focusedHotspot.xPercent}% ${focusedHotspot.yPercent}%, transparent 32%, black 85%)`,
                        }
                      : undefined
                  }
                  className="pointer-events-none absolute inset-0"
                />

                {/* 热区激活时的局部物理光效 / 声波涟漪 */}
                <AnimatePresence>
                  {focusedHotspot && (
                    <motion.div
                      key={`${focusedHotspot.id}-effect`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        left: `${focusedHotspot.xPercent}%`,
                        top: `${focusedHotspot.yPercent}%`,
                      }}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      {focusedHotspot.effectType === 'light' && (
                        <div className="h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,222,168,0.68)_0%,rgba(223,182,118,0.22)_42%,transparent_72%)] mix-blend-screen" />
                      )}
                      {focusedHotspot.effectType === 'sound' && (
                        <div className="relative flex h-52 w-52 items-center justify-center">
                          <span className="absolute h-20 w-20 rounded-full border border-champagne-200/75 animate-sound-ripple" />
                          <span
                            className="absolute h-20 w-20 rounded-full border border-champagne-300/60 animate-sound-ripple"
                            style={{ animationDelay: '0.7s' }}
                          />
                          <span
                            className="absolute h-20 w-20 rounded-full border border-champagne-200/45 animate-sound-ripple"
                            style={{ animationDelay: '1.4s' }}
                          />
                        </div>
                      )}
                      {focusedHotspot.effectType === 'curtain' && (
                        <div className="h-56 w-48 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,248,235,0.48)_0%,rgba(232,216,188,0.16)_52%,transparent_75%)] blur-md mix-blend-screen" />
                      )}
                      {focusedHotspot.effectType === 'comfort' && (
                        <div className="h-56 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,214,186,0.42)_0%,rgba(195,216,228,0.16)_55%,transparent_75%)] blur-md mix-blend-screen" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 空间微光热区点（与中景坐标严格绑定） */}
                {currentRoom.hotspots.map((hotspot) => {
                  const isFocused = focusedId === hotspot.id;
                  const Icon = EFFECT_ICONS[hotspot.effectType];
                  const showOnRight = hotspot.xPercent < 55;

                  return (
                    <div
                      key={hotspot.id}
                      style={{
                        left: `${hotspot.xPercent}%`,
                        top: `${hotspot.yPercent}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        type="button"
                        aria-label={`探索 ${hotspot.label}`}
                        onMouseEnter={() => setHoveredId(hotspot.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLockedId((prev) => (prev === hotspot.id ? null : hotspot.id));
                        }}
                        className="group relative flex h-11 w-11 items-center justify-center rounded-full focus:outline-none"
                      >
                        {/* 柔和呼吸光圈 */}
                        <span
                          className={`absolute h-9 w-9 rounded-full border transition-all duration-500 ${
                            isFocused
                              ? 'scale-125 border-champagne-200 bg-champagne-300/25'
                              : 'border-white/55 bg-white/10 animate-soft-ring'
                          }`}
                        />
                        {/* 热区核心发光体 */}
                        <span
                          className={`relative flex h-4 w-4 items-center justify-center rounded-full transition-all duration-500 ease-architect ${
                            isFocused
                              ? 'h-8 w-8 bg-[#FAF8F4] text-[#23201D] shadow-[0_0_24px_rgba(255,232,190,0.9)]'
                              : 'bg-[#FAF8F4]/95 shadow-[0_0_14px_rgba(255,236,204,0.85)] group-hover:scale-125'
                          }`}
                        >
                          {isFocused ? (
                            <Icon className="h-3.5 w-3.5" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-champagne-600" />
                          )}
                        </span>
                      </button>

                      {/* 桌面端：就在物件旁浮现的轻盈磨砂生活卡片 */}
                      <AnimatePresence>
                        {isFocused && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className={`hidden md:block absolute top-1/2 -translate-y-1/2 z-30 w-72 rounded-2xl border border-white/20 bg-[#171D28]/80 p-4 text-[#FAF8F4] frosted-surface-dark ${
                              showOnRight ? 'left-14' : 'right-14'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-300">
                                  {hotspot.subLabel}
                                </p>
                                <h3 className="font-serif text-lg font-medium text-[#FAF8F4]">
                                  {hotspot.label}
                                </h3>
                              </div>
                              {lockedId === hotspot.id && (
                                <button
                                  type="button"
                                  aria-label="关闭卡片"
                                  onClick={() => setLockedId(null)}
                                  className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed font-light text-[#E7E1D8]/95">
                              {hotspot.story}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>

              {/* 【第3层：前景视差光晕与微空气感层】（比中景位移更快，形成立体错位） */}
              <motion.div
                style={{ x: fgX, y: fgY }}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-10 z-10 will-change-transform"
              >
                <div
                  className="h-full w-full opacity-45 mix-blend-screen"
                  style={{
                    background:
                      'radial-gradient(ellipse 35% 30% at 15% 18%, rgba(255, 240, 214, 0.24), transparent 70%), radial-gradient(ellipse 30% 28% at 88% 85%, rgba(223, 198, 155, 0.16), transparent 68%)',
                  }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* 右下角空间副标题指示 */}
          <div className="pointer-events-none absolute bottom-4 left-4 md:bottom-7 md:left-7 z-20">
            <div className="frosted-surface-dark rounded-full border border-white/15 bg-[#141A24]/55 px-4 py-2 text-xs text-[#FAF8F4]/90">
              <span className="font-medium text-champagne-200">{currentRoom.name}</span>
              <span className="mx-2 opacity-40">·</span>
              <span className="font-light opacity-85">{currentRoom.subtitle}</span>
            </div>
          </div>

          <div className="pointer-events-none hidden sm:block absolute bottom-4 right-4 md:bottom-7 md:right-7 z-20">
            <div className="frosted-surface-dark rounded-full border border-white/15 bg-[#141A24]/55 px-3.5 py-1.5 text-[11px] tracking-wider text-[#E7E1D8]/80">
              轻触或悬停微光点探索
            </div>
          </div>
        </motion.div>

        {/* 移动端专属平滑详情卡（手机上点选热区时避免遮挡画面，在下方优雅展开） */}
        <AnimatePresence>
          {focusedHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-4 md:hidden rounded-2xl p-5 border ${
                isDark
                  ? 'frosted-surface-dark border-white/15 bg-[#18202E]/80 text-[#FAF8F4]'
                  : 'frosted-surface border-warmgrey-300/40 bg-[#FAF8F4]/90 text-[#23201D]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-champagne-500 uppercase">
                    {focusedHotspot.subLabel}
                  </p>
                  <h3 className="font-serif text-lg font-medium mt-0.5">
                    {focusedHotspot.label}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLockedId(null)}
                  className="rounded-full p-1 opacity-60 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm font-light leading-relaxed opacity-85">
                {focusedHotspot.story}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
