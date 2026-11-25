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
  wake: '早上起床',
  meeting: '视频开会',
  voice: '回家听歌',
  sleep: '晚安睡觉',
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

  const lampLabel =
    currentScene.lampBrightness <= 0.05
      ? '已关灯'
      : currentScene.lampTone === 'warm'
      ? `温馨暖光 ${Math.round(currentScene.lampBrightness * 100)}%`
      : currentScene.lampTone === 'neutral'
      ? `护眼补光 ${Math.round(currentScene.lampBrightness * 100)}%`
      : `微亮 ${Math.round(currentScene.lampBrightness * 100)}%`;

  return (
    <section
      id="sandbox"
      ref={containerRef}
      className="relative z-10 h-[400vh]"
    >
      {/* 吸顶全屏演示舞台（保持柔和浅色居家背景包裹） */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden px-4 pt-20 pb-5 sm:px-6 sm:pt-24 sm:pb-7">
        {/* 随场景微调的柔和外部氛围光 */}
        <motion.div
          animate={{
            background:
              currentScene.id === 'wake'
                ? 'radial-gradient(ellipse 70% 55% at 62% 48%, rgba(251, 191, 36, 0.14), transparent 72%)'
                : currentScene.id === 'meeting'
                ? 'radial-gradient(ellipse 68% 58% at 62% 48%, rgba(99, 102, 241, 0.12), rgba(14, 165, 233, 0.08) 55%, transparent 78%)'
                : currentScene.id === 'voice'
                ? 'radial-gradient(ellipse 72% 58% at 60% 50%, rgba(245, 158, 11, 0.16), rgba(99, 102, 241, 0.1) 52%, transparent 78%)'
                : 'radial-gradient(ellipse 55% 48% at 58% 52%, rgba(79, 70, 229, 0.1), transparent 72%)',
          }}
          transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-0"
        />

        {/* 顶部细进度指示条 */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-stone-200/80">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-amber-400 via-indigo-500 to-sky-500"
              style={{ scaleX: progressScaleX }}
            />
          </div>
        </div>

        {/* 中央主舞台：左侧故事说明 + 右侧日夜居家房间交互画布 */}
        <div className="mx-auto my-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-12 lg:gap-10">
          {/* 左侧：大白话生活故事叙述 */}
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
                    aria-label={`切换到 ${s.badge}`}
                    className={`w-2 rounded-full transition-all duration-300 ${
                      active
                        ? 'h-9 bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.35)]'
                        : 'h-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                );
              })}
            </div>

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3.5"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                    <span>{currentScene.stepLabel}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-700">{currentScene.badge}</span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl lg:text-[2.05rem] lg:leading-[1.2]">
                    {currentScene.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                    {currentScene.description}
                  </p>

                  {currentScene.id === 'sleep' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="pt-2"
                    >
                      <div className="mb-3 text-xs font-medium text-indigo-700">
                        断网也能顺畅使用 · 对话和隐私永远不出门
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <a
                          href="#hardware-waitlist"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          <span>预约 ¥150 小盒子</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href="#deploy"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
                        >
                          <span>免费下载软件版</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧：明亮通透的书房实景画布 */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_24px_70px_rgba(28,25,23,0.12)]">
              {/* 顶部友好状态提示栏 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 bg-white/95 px-4 py-2.5 text-[11px] text-stone-600 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-stone-800">
                    居家书房实景演示
                  </span>
                  <span className="hidden text-stone-400 sm:inline">
                    · 点图中设备也能单独开关
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>
                    台灯：
                    <strong className="font-semibold text-stone-900">
                      {lampLabel}
                    </strong>
                  </span>
                  <span className="hidden sm:inline">
                    空调：
                    <strong className={currentScene.acOn ? 'font-semibold text-sky-700' : 'text-stone-400'}>
                      {currentScene.acOn ? `${currentScene.acTemp}°C 制冷` : '已关'}
                    </strong>
                  </span>
                  <span>
                    音箱：
                    <strong
                      className={
                        currentScene.homePodMode === 'playing'
                          ? 'font-semibold text-indigo-700'
                          : currentScene.homePodMode === 'muted'
                          ? 'font-semibold text-amber-700'
                          : 'text-stone-400'
                      }
                    >
                      {currentScene.homePodMode === 'playing'
                        ? '放歌中'
                        : currentScene.homePodMode === 'muted'
                        ? '静音中'
                        : currentScene.homePodMode === 'idle'
                        ? '待机'
                        : '关闭'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* 房间交互舞台 */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <RoomBaseLayer scene={currentScene} />
                <LightingOverlayLayer scene={currentScene} />
                <DeviceEffectsLayer
                  scene={currentScene}
                  onToggleLamp={handleToggleLamp}
                  onToggleAc={handleToggleAc}
                  onToggleHomePod={handleToggleHomePod}
                />

                {/* 顶部浮动语音指令 / 操作提示气泡 */}
                <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3 sm:top-4">
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="flex items-center gap-2.5 rounded-full border border-stone-200/90 bg-white/92 px-3.5 py-1.5 shadow-lg backdrop-blur-xl"
                  >
                    {currentScene.voiceTranscript ? (
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-3.5 items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((bar) => (
                            <motion.span
                              key={bar}
                              className="w-0.5 rounded-full bg-indigo-600"
                              animate={{ height: ['25%', '100%', '35%'] }}
                              transition={{
                                duration: 0.65,
                                repeat: Infinity,
                                delay: bar * 0.1,
                              }}
                            />
                          ))}
                        </div>
                        <span className="max-w-[190px] truncate text-[11px] font-semibold text-stone-900 sm:max-w-none sm:text-xs">
                          {currentScene.voiceTranscript}
                        </span>
                        <span className="hidden rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 md:inline-block">
                          {currentScene.voiceActionSummary}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        <span>
                          向下滑动看一天变化 · 或直接点击图中台灯 / 空调 / HomePod
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部：消费级柔和场景切换胶囊 Dock */}
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-2xl border border-stone-200/90 bg-white/95 p-1.5 shadow-[0_10px_30px_rgba(28,25,23,0.08)] backdrop-blur-xl">
            {SCENES.map((sceneItem, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={sceneItem.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors sm:px-4 ${
                    isActive
                      ? 'text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dockActivePill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-indigo-600 shadow-sm"
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
              title="恢复跟随页面滚动自动切换场景"
              className="hidden items-center gap-1 rounded-xl border border-stone-200 bg-white/90 px-3 py-2 text-xs font-medium text-stone-600 shadow-sm backdrop-blur-xl transition hover:text-stone-900 sm:inline-flex"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>跟随滚动</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
