import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Sun, Volume2, Wind, Sparkles, X } from 'lucide-react';
import { SPATIAL_ROOMS, SpatialHotspot, HotspotEffectType, SpatialRoomId } from '../data/luminaData';
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

  const [activeRoomId, setActiveRoomId] = useState<SpatialRoomId>('living');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const currentRoom = SPATIAL_ROOMS.find((r) => r.id === activeRoomId) || SPATIAL_ROOMS[0];
  const focusedHotspot: SpatialHotspot | undefined = currentRoom.hotspots.find(
    (h) => h.id === activeHotspotId
  );

  // 计算以中心为原点的平滑聚焦位移（仅点击打开弹框时聚焦）
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const focusOffsetX = focusedHotspot ? clamp((50 - focusedHotspot.xPercent) * 0.08, -2.5, 2.5) : 0;
  const focusOffsetY = focusedHotspot ? clamp((50 - focusedHotspot.yPercent) * 0.08, -2.5, 2.5) : 0;

  // 三层视差物理追踪 (前景 / 中景 / 背景)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 24 });

  // 背景远景光晕位移 (最小)
  const bgX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const bgY = useTransform(smoothY, [-1, 1], [-4, 4]);
  // 中景建筑空间位移 (恒定映射域，避免点击瞬间突变跳动)
  const midX = useTransform(smoothX, [-1, 1], [8, -8]);
  const midY = useTransform(smoothY, [-1, 1], [5, -5]);
  // 前景微光与景深光斑位移 (最大、反向形成强烈空间纵深感)
  const fgX = useTransform(smoothX, [-1, 1], [-22, 22]);
  const fgY = useTransform(smoothY, [-1, 1], [-16, 16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeHotspotId) {
      // 弹框打开查看期间缓缓回正中景，保证按钮与弹框纹丝不动
      pointerX.set(0);
      pointerY.set(0);
      return;
    }
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

  const handleRoomSwitch = (id: SpatialRoomId) => {
    setActiveRoomId(id);
    setHoveredId(null);
    setActiveHotspotId(null);
  };

  return (
    <section
      id="spatial-roam"
      className="relative py-24 md:py-36 transition-colors duration-700 ease-architect"
      style={{ color: isDark ? '#F5F1EA' : '#23201D' }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* 标题与空间切换胶囊 */}
        <div className="mb-10 md:mb-14 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
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

          {/* 六大居住空间切换条 */}
          <div
            className={`inline-flex flex-wrap xl:flex-nowrap self-start xl:self-auto gap-1 rounded-2xl sm:rounded-full p-1.5 transition-all duration-500 ${
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
                  className={`relative whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-[13px] tracking-wide transition-colors duration-300 ${
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
          onClick={() => setActiveHotspotId(null)}
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
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              {/* 【第1层：背景远景层】窗外柔焦天光光晕（轻微视差） */}
              <motion.div
                style={{ x: bgX, y: bgY, background: currentRoom.fallbackGradient }}
                className="pointer-events-none absolute -inset-6 opacity-90 will-change-transform"
              />

              {/* 【第2层：中景建筑空间与点击聚焦缩放层】 */}
              <motion.div
                style={{ x: midX, y: midY }}
                className="absolute -inset-4 will-change-transform"
              >
                <motion.div
                  animate={{
                    scale: focusedHotspot ? 1.07 : 1.02,
                    x: `${focusOffsetX}%`,
                    y: `${focusOffsetY}%`,
                  }}
                  transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full origin-center will-change-transform"
                >
                  <img
                    src={currentRoom.imageUrl}
                    alt={currentRoom.name}
                    className="h-full w-full object-cover object-center select-none"
                  />

                  {/* 点击聚焦时四周景深虚化 + 柔和暗角（仅留焦点区域通透明晰） */}
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

                  {/* 热区点击激活时的局部物理光效 / 声波涟漪（外层纯定位居中） */}
                  {focusedHotspot && (
                    <div
                      style={{
                        left: `${focusedHotspot.xPercent}%`,
                        top: `${focusedHotspot.yPercent}%`,
                      }}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${focusedHotspot.id}-effect`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                      </AnimatePresence>
                    </div>
                  )}

                  {/* 空间微光热区点（悬停仅轻提示，点击才会聚焦打开弹框） */}
                  {currentRoom.hotspots.map((hotspot) => {
                    const isActive = activeHotspotId === hotspot.id;
                    const isHovered = hoveredId === hotspot.id;
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
                          aria-expanded={isActive}
                          onMouseEnter={() => setHoveredId(hotspot.id)}
                          onMouseLeave={() =>
                            setHoveredId((prev) => (prev === hotspot.id ? null : prev))
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspotId((prev) =>
                              prev === hotspot.id ? null : hotspot.id
                            );
                          }}
                          className="group relative flex h-11 w-11 items-center justify-center rounded-full focus:outline-none"
                        >
                          {/* 常驻柔和呼吸光圈 */}
                          <span
                            className={`pointer-events-none absolute h-9 w-9 rounded-full border border-white/55 bg-white/10 animate-soft-ring transition-opacity duration-500 ${
                              isActive ? 'opacity-0' : 'opacity-100'
                            }`}
                          />
                          {/* 点击聚焦高亮外环 */}
                          <span
                            className={`pointer-events-none absolute h-10 w-10 rounded-full border border-champagne-200/80 bg-champagne-300/20 transition-all duration-500 ease-architect ${
                              isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                            }`}
                          />
                          {/* 固定宽高锚定容器 + 纯 GPU 缩放，点击零跳动 */}
                          <span
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 ease-architect will-change-transform ${
                              isActive
                                ? 'scale-100 bg-[#FAF8F4] text-[#23201D] shadow-[0_0_24px_rgba(255,232,190,0.9)]'
                                : 'scale-50 bg-[#FAF8F4]/95 shadow-[0_0_20px_rgba(255,236,204,0.9)] group-hover:scale-[0.68]'
                            }`}
                          >
                            {isActive ? (
                              <Icon className="h-3.5 w-3.5" />
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-champagne-600" />
                            )}
                          </span>
                        </button>

                        {/* 桌面端悬停轻巧小标签提示（未点击打开时才显示，不弹大卡片） */}
                        <div className="hidden md:block pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20">
                          <AnimatePresence>
                            {isHovered && !isActive && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 2 }}
                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                className="whitespace-nowrap rounded-full border border-white/20 bg-[#151B26]/80 px-3 py-1 text-[11px] tracking-wide text-[#FAF8F4] shadow-lg backdrop-blur-md"
                              >
                                {hotspot.label}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* 桌面端：点击后在物件旁浮现的轻盈磨砂生活卡片（外层纯静态定位并防边界裁剪） */}
                        <div
                          className={`hidden md:block absolute z-30 w-72 pointer-events-none ${
                            hotspot.yPercent > 72
                              ? 'bottom-0'
                              : hotspot.yPercent < 25
                              ? 'top-0'
                              : 'top-1/2 -translate-y-1/2'
                          } ${showOnRight ? 'left-14' : 'right-14'}`}
                        >
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, x: showOnRight ? -8 : 8, scale: 0.96 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: showOnRight ? -4 : 4, scale: 0.97 }}
                                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                                onClick={(e) => e.stopPropagation()}
                                className="pointer-events-auto rounded-2xl border border-white/20 bg-[#171D28]/80 p-4 text-[#FAF8F4] frosted-surface-dark"
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
                                  <button
                                    type="button"
                                    aria-label="关闭卡片"
                                    onClick={() => setActiveHotspotId(null)}
                                    className="shrink-0 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <p className="text-xs leading-relaxed font-light text-[#E7E1D8]/95">
                                  {hotspot.story}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* 【第3层：前景视差光晕与微空气感层】 */}
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

          {/* 空间副标题指示（移动端置顶避免与底部热区重叠，桌面端左下角） */}
          <div className="pointer-events-none absolute top-3 left-3 sm:top-auto sm:bottom-7 sm:left-7 z-20 max-w-[calc(100%-24px)]">
            <div className="frosted-surface-dark rounded-full border border-white/15 bg-[#141A24]/55 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs text-[#FAF8F4]/90 truncate">
              <span className="font-medium text-champagne-200">{currentRoom.name}</span>
              <span className="mx-2 opacity-40">·</span>
              <span className="font-light opacity-85">{currentRoom.subtitle}</span>
            </div>
          </div>

          <div className="pointer-events-none hidden sm:block absolute bottom-4 right-4 md:bottom-7 md:right-7 z-20">
            <div className="frosted-surface-dark rounded-full border border-white/15 bg-[#141A24]/55 px-3.5 py-1.5 text-[11px] tracking-wider text-[#E7E1D8]/80">
              点击微光点，揭晓生活细节
            </div>
          </div>
        </motion.div>

        {/* 移动端专属平滑详情卡（手机上点击热区后在下方优雅展开） */}
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
                  aria-label="关闭卡片"
                  onClick={() => setActiveHotspotId(null)}
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
