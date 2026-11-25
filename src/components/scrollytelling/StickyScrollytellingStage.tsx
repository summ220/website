import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Sun,
  Video,
  Mic,
  Moon,
  Sparkles,
  ArrowRight,
  Terminal,
  RotateCcw,
} from 'lucide-react';
import { SCENES, SceneId, SceneState } from './sceneConfig';
import { RoomBaseLayer } from './RoomBaseLayer';
import { LightingOverlayLayer } from './LightingOverlayLayer';
import { DeviceEffectsLayer } from './DeviceEffectsLayer';

const dockIcons: Record<SceneId, React.ReactNode> = {
  wake: <Sun className="h-3.5 w-3.5" />,
  meeting: <Video className="h-3.5 w-3.5" />,
  voice: <Mic className="h-3.5 w-3.5" />,
  sleep: <Moon className="h-3.5 w-3.5" />,
};

const dockShortLabels: Record<SceneId, string> = {
  wake: '日常唤醒',
  meeting: '视频会议',
  voice: '语音指令',
  sleep: '晚安休眠',
};

export const StickyScrollytellingStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollSceneIdx, setScrollSceneIdx] = useState<number>(0);
  const [manualOverride, setManualOverride] = useState<Partial<SceneState> | null>(
    null
  );
  const [manualSceneIdx, setManualSceneIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextIdx =
      latest < 0.25 ? 0 : latest < 0.5 ? 1 : latest < 0.75 ? 2 : 3;
    if (nextIdx !== scrollSceneIdx) {
      setScrollSceneIdx(nextIdx);
      setManualSceneIdx(null);
      setManualOverride(null);
    }
  });

  const activeIdx = manualSceneIdx !== null ? manualSceneIdx : scrollSceneIdx;
  const baseScene = SCENES[activeIdx];
  const currentScene: SceneState = manualOverride
    ? { ...baseScene, ...manualOverride }
    : baseScene;

  const isManuallyControlled = manualSceneIdx !== null || manualOverride !== null;

  const handleSelectScene = (idx: number) => {
    setManualSceneIdx(idx);
    setManualOverride(null);
  };

  const handleResetToScroll = () => {
    setManualSceneIdx(null);
    setManualOverride(null);
  };

  const handleToggleLamp = () => {
    const isOn = currentScene.lampBrightness > 0.05;
    setManualOverride((prev) => ({
      ...prev,
      lampBrightness: isOn ? 0 : 0.85,
      lampTone: isOn ? currentScene.lampTone : 'warm',
    }));
  };

  const handleToggleAc = () => {
    setManualOverride((prev) => ({
      ...prev,
      acOn: !currentScene.acOn,
      acTemp: !currentScene.acOn ? 24 : 26,
    }));
  };

  const handleToggleHomePod = () => {
    const nextMode =
      currentScene.homePodMode === 'playing'
        ? 'muted'
        : currentScene.homePodMode === 'muted'
        ? 'idle'
        : 'playing';
    setManualOverride((prev) => ({
      ...prev,
      homePodMode: nextMode,
    }));
  };

  const lampKelvin =
    currentScene.lampBrightness <= 0.05
      ? 'OFF'
      : currentScene.lampTone === 'warm'
      ? '2700K'
      : currentScene.lampTone === 'neutral'
      ? '5000K'
      : '5600K';

  return (
    <section
      id="sandbox"
      ref={containerRef}
      className="relative z-10 h-[400vh]"
    >
      {/* 固定舞台容器 */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden px-4 pt-20 pb-5 sm:px-6 sm:pt-24 sm:pb-7">
        {/* 舞台外围：随 4 章节联动变换的全屏科技空间光场 */}
        <motion.div
          animate={{
            background:
              currentScene.id === 'wake'
                ? 'radial-gradient(ellipse 70% 55% at 62% 48%, rgba(148, 163, 184, 0.16), transparent 72%)'
                : currentScene.id === 'meeting'
                ? 'radial-gradient(ellipse 68% 58% at 62% 48%, rgba(129, 140, 248, 0.22), rgba(244, 63, 94, 0.08) 55%, transparent 78%)'
                : currentScene.id === 'voice'
                ? 'radial-gradient(ellipse 72% 58% at 60% 50%, rgba(245, 158, 11, 0.14), rgba(129, 140, 248, 0.16) 52%, transparent 78%)'
                : 'radial-gradient(ellipse 50% 45% at 58% 52%, rgba(99, 102, 241, 0.1), transparent 72%)',
          }}
          transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-0"
        />
        {/* 监视器微扫描线纹理与局部暗角 */}
        <div className="scanline-overlay pointer-events-none absolute inset-0 opacity-[0.16]" />

        {/* 语音/音乐阶段的跨屏对称极光声波地平线 */}
        <AnimatePresence>
          {(currentScene.id === 'voice' || currentScene.homePodMode === 'playing') && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              viewBox="0 0 1440 160"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 bottom-12 h-32 w-full"
            >
              <motion.path
                d="M0 80 Q 180 20, 360 80 T 720 80 T 1080 80 T 1440 80"
                fill="none"
                stroke="rgba(129, 140, 248, 0.45)"
                strokeWidth="1.5"
                animate={{
                  d: [
                    'M0 80 Q 180 25, 360 80 T 720 80 T 1080 80 T 1440 80',
                    'M0 80 Q 180 135, 360 80 T 720 80 T 1080 80 T 1440 80',
                    'M0 80 Q 180 25, 360 80 T 720 80 T 1080 80 T 1440 80',
                  ],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.path
                d="M0 80 Q 240 120, 480 80 T 960 80 T 1440 80"
                fill="none"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="1.2"
                animate={{
                  d: [
                    'M0 80 Q 240 120, 480 80 T 960 80 T 1440 80',
                    'M0 80 Q 240 40, 480 80 T 960 80 T 1440 80',
                    'M0 80 Q 240 120, 480 80 T 960 80 T 1440 80',
                  ],
                }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* 顶部极细滚动进度指示条 */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-indigo-400 via-sky-300 to-zinc-200"
              style={{ scaleX: progressScaleX }}
            />
          </div>
        </div>

        {/* 中央主舞台：左侧垂直刻度叙事 + 右侧精密 HUD 房间舞台 */}
        <div className="mx-auto my-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-12 lg:gap-10">
          {/* 左侧：带发光时间线轨道的大号叙事文案 */}
          <div className="order-2 flex gap-4 lg:order-1 lg:col-span-4">
            {/* 4 章节垂直进度指示轨道 */}
            <div className="hidden flex-col items-center justify-center gap-3 py-2 sm:flex">
              {SCENES.map((s, idx) => {
                const active = activeIdx === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectScene(idx)}
                    aria-label={`跳转到 ${s.badge}`}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      active
                        ? 'h-8 bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.85)]'
                        : 'h-2.5 bg-white/[0.15] hover:bg-white/[0.3]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3.5"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/[0.08] px-3 py-1 font-mono text-[11px] text-indigo-300">
                    <span>{currentScene.stepLabel}</span>
                    <span className="text-zinc-600">|</span>
                    <span className="text-zinc-200">{currentScene.badge}</span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.18]">
                    {currentScene.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                    {currentScene.description}
                  </p>

                  {currentScene.id === 'sleep' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="pt-2"
                    >
                      <div className="mb-3 font-mono text-xs text-indigo-300/90">
                        本地优先 · 断网可用 · 隐私零出户
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <a
                          href="#deploy"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-[0_0_24px_rgba(255,255,255,0.12)] transition hover:bg-white"
                        >
                          <Terminal className="h-3.5 w-3.5" />
                          <span>一键部署中枢</span>
                        </a>
                        <a
                          href="#hardware-waitlist"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.08]"
                        >
                          <span>预约硬件盒子</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧：精密全息取景器式分层渲染舞台（带 1px 巡航极光流光边框） */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#09090D] shadow-[0_28px_100px_rgba(0,0,0,0.85)]">
              {/* 1px 巡航极光流光边框 */}
              <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl p-px [mask-composite:exclude] [-webkit-mask-composite:xor] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_285deg,rgba(129,140,248,0.2)_330deg,rgba(125,211,252,0.2)_352deg,transparent_360deg)]"
                />
              </div>
              {/* 精密 HUD 顶部遥测栏 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] bg-[#0C0C12]/95 px-3.5 py-2 font-mono text-[10px] text-zinc-400 sm:px-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-zinc-300">STUDIO_MESH // CAM_01</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    LAMP:{' '}
                    <strong className="text-zinc-200">
                      {lampKelvin} · {Math.round(currentScene.lampBrightness * 100)}%
                    </strong>
                  </span>
                  <span className="hidden sm:inline">
                    AC:{' '}
                    <strong className={currentScene.acOn ? 'text-sky-300' : 'text-zinc-500'}>
                      {currentScene.acOn ? `${currentScene.acTemp}°C ON` : 'OFF'}
                    </strong>
                  </span>
                  <span>
                    AUDIO:{' '}
                    <strong
                      className={
                        currentScene.homePodMode === 'playing'
                          ? 'text-indigo-300'
                          : currentScene.homePodMode === 'muted'
                          ? 'text-amber-300'
                          : 'text-zinc-500'
                      }
                    >
                      {currentScene.homePodMode.toUpperCase()}
                    </strong>
                  </span>
                </div>
              </div>

              {/* 舞台核心画布 */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0A0E]">
                {/* Layer 1: 精细 2.5D 建筑感书房底座 */}
                <RoomBaseLayer scene={currentScene} />

                {/* Layer 2: 独立物理光影混合层 */}
                <LightingOverlayLayer scene={currentScene} />

                {/* Layer 3: 设备微动效 + 可点击热点 */}
                <DeviceEffectsLayer
                  scene={currentScene}
                  onToggleLamp={handleToggleLamp}
                  onToggleAc={handleToggleAc}
                  onToggleHomePod={handleToggleHomePod}
                />

                {/* Layer 4: Dynamic Island 语音指令动态岛 */}
                <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3 sm:top-4">
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="flex items-center gap-2.5 rounded-full border border-white/[0.15] bg-[#08080B]/88 px-3.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                  >
                    {currentScene.voiceTranscript ? (
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-3.5 items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((bar) => (
                            <motion.span
                              key={bar}
                              className="w-0.5 rounded-full bg-indigo-400"
                              animate={{ height: ['25%', '100%', '35%'] }}
                              transition={{
                                duration: 0.65,
                                repeat: Infinity,
                                delay: bar * 0.1,
                              }}
                            />
                          ))}
                        </div>
                        <span className="max-w-[200px] truncate text-[11px] font-medium text-zinc-100 sm:max-w-none sm:text-xs">
                          {currentScene.voiceTranscript}
                        </span>
                        <span className="hidden rounded-full bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] text-indigo-200 md:inline-block">
                          {currentScene.voiceActionSummary}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 sm:text-[11px]">
                        <Sparkles className="h-3 w-3 text-indigo-400" />
                        <span>
                          向下滚动切换叙事 · 或直接点击台灯 / 空调 / HomePod 热点
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* 四角取景准星 */}
                <span className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-white/20" />
                <span className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-white/20" />
                <span className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-white/20" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-white/20" />
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* 底部：Apple 风格悬浮毛玻璃控制栏 (Floating Dock) */}
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-2xl border border-white/[0.12] bg-[#101016]/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            {SCENES.map((sceneItem, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={sceneItem.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:px-4 ${
                    isActive
                      ? 'text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dockActivePill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-zinc-100 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{dockIcons[sceneItem.id]}</span>
                  <span className="relative z-10">
                    {dockShortLabels[sceneItem.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {isManuallyControlled && (
            <button
              type="button"
              onClick={handleResetToScroll}
              title="恢复随滚动自动叙事"
              className="hidden items-center gap-1 rounded-xl border border-white/[0.1] bg-[#101016]/85 px-3 py-2 font-mono text-[11px] text-zinc-400 backdrop-blur-xl transition hover:text-zinc-100 sm:inline-flex"
            >
              <RotateCcw className="h-3 w-3" />
              <span>恢复滚动</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
