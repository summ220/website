import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX, Wind, Lightbulb, Speaker } from 'lucide-react';
import { SceneState } from './sceneConfig';

interface DeviceEffectsLayerProps {
  scene: SceneState;
  onToggleLamp: () => void;
  onToggleAc: () => void;
  onToggleHomePod: () => void;
}

/**
 * 独立设备微动效层与交互热点层：
 * 包含空调导风板+冷气粒子、HomePod 极光球+声波涟漪、中枢呼吸灯以及可直接点击的热点控件
 */
export const DeviceEffectsLayer: React.FC<DeviceEffectsLayerProps> = ({
  scene,
  onToggleLamp,
  onToggleAc,
  onToggleHomePod,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 可选：如果外部传入了 3D 渲染的空调开启图层 PNG，直接叠加渲染 */}
      {scene.layers?.acOnLayerUrl && (
        <motion.img
          src={scene.layers.acOnLayerUrl}
          alt="AC On Layer"
          animate={{ opacity: scene.acOn ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* 1. 墙面挂机空调动效区 (对齐 SVG 730,88 区域) */}
      <div className="absolute left-[60.8%] top-[12.2%] h-[11%] w-[22.4%]">
        {/* LED 温度显示屏 */}
        <AnimatePresence>
          {scene.acOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-[14%] top-[34%] font-mono text-[10px] font-semibold tracking-wider text-sky-300 drop-shadow-[0_0_8px_rgba(125,211,252,0.8)] sm:text-xs"
            >
              {scene.acTemp}°C
            </motion.div>
          )}
        </AnimatePresence>

        {/* 导风板角度旋转动画 */}
        <motion.div
          animate={{ rotateX: scene.acOn ? 48 : 0, y: scene.acOn ? 3 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[10%] left-[7%] right-[7%] h-[5px] origin-top rounded-full bg-zinc-500/80 shadow-sm"
        />

        {/* 飘动的冷气丝带 / SVG 气流流线 + 晶莹微粒 */}
        <AnimatePresence>
          {scene.acOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-1 top-[96%] h-36 overflow-hidden"
            >
              {[0, 1, 2, 3].map((idx) => (
                <motion.div
                  key={idx}
                  className="absolute top-0 h-20 w-[26%] rounded-full bg-gradient-to-b from-sky-300/25 via-sky-200/10 to-transparent blur-md"
                  style={{ left: `${8 + idx * 22}%` }}
                  animate={{
                    y: [0, 42, 76],
                    opacity: [0, 0.8, 0],
                    scaleY: [0.8, 1.3, 1.5],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: idx * 0.45,
                    ease: 'easeOut',
                  }}
                />
              ))}
              {/* 细腻气流微粒 */}
              {[0, 1, 2, 3, 4, 5].map((p) => (
                <motion.span
                  key={`p-${p}`}
                  className="absolute top-1 h-1 w-1 rounded-full bg-sky-200/80 shadow-[0_0_6px_rgba(125,211,252,0.9)]"
                  style={{ left: `${14 + p * 14}%` }}
                  animate={{
                    y: [0, 75, 115],
                    x: [0, p % 2 === 0 ? 8 : -8, p % 2 === 0 ? 14 : -14],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 1.9 + (p % 3) * 0.3,
                    repeat: Infinity,
                    delay: p * 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. HomePod 顶部极光灯环与声波涟漪 (对齐 SVG 868,372 区域) */}
      <div className="absolute left-[72.3%] top-[51.5%] h-[16%] w-[7.4%]">
        {/* 顶部触控面极光光球 */}
        <div className="relative mx-auto mt-[8%] h-[16%] w-[58%]">
          <AnimatePresence>
            {scene.homePodMode === 'playing' && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{
                    opacity: { duration: 0.4 },
                    rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                  }}
                  className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-400 via-sky-300 to-amber-300 opacity-90 blur-[3px]"
                />
                {/* 3 层同心圆声波扩散涟漪 */}
                {[0, 1, 2].map((ring) => (
                  <motion.div
                    key={ring}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/40"
                    animate={{
                      scale: [0.5, 2.2, 3.0],
                      opacity: [0.65, 0.25, 0],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: ring * 0.7,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {scene.homePodMode === 'idle' && (
            <div className="h-full w-full rounded-full bg-white/15 blur-[1px]" />
          )}
        </div>

        {/* 已静音浮标 */}
        <AnimatePresence>
          {scene.homePodMode === 'muted' && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="absolute -top-7 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-amber-400/30 bg-[#121218]/90 px-2 py-0.5 font-mono text-[10px] text-amber-300 shadow-lg backdrop-blur-md"
            >
              <VolumeX className="h-3 w-3" />
              <span>已静音</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. AuraHub 中枢小盒子呼吸状态灯与全向微脉冲 */}
      <div className="absolute left-[22.9%] top-[62.8%] flex h-[4.4%] w-[5.3%] items-center justify-center">
        {scene.hubBreathOn && (
          <>
            <motion.div
              animate={{
                scale: [0.8, 2.8],
                opacity: [0.55, 0],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
              className="pointer-events-none absolute h-4 w-4 rounded-full border border-indigo-400/50"
            />
            <motion.div
              animate={{
                opacity: scene.id === 'sleep' ? [0.35, 1, 0.35] : [0.5, 0.95, 0.5],
                scale: scene.id === 'sleep' ? [0.95, 1.25, 0.95] : [1, 1.1, 1],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.95)]"
            />
          </>
        )}
      </div>

      {/* 4. 可点击设备热点层（双向交互） */}
      {/* 台灯热点 */}
      <button
        type="button"
        onClick={onToggleLamp}
        title="点击切换台灯状态"
        className="pointer-events-auto group absolute left-[22%] top-[36%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-[#0C0C0F]/75 px-2.5 py-1 text-[11px] text-zinc-200 backdrop-blur-md transition hover:scale-105 hover:border-indigo-400/50 hover:bg-[#13131C]"
      >
        <Lightbulb
          className={`h-3 w-3 ${
            scene.lampBrightness > 0.05 ? 'text-amber-300' : 'text-zinc-500'
          }`}
        />
        <span className="hidden font-mono text-[10px] sm:inline">
          {scene.lampBrightness > 0.05
            ? `${Math.round(scene.lampBrightness * 100)}%`
            : '关灯'}
        </span>
      </button>

      {/* 空调热点 */}
      <button
        type="button"
        onClick={onToggleAc}
        title="点击开关空调"
        className="pointer-events-auto group absolute left-[72%] top-[10%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-[#0C0C0F]/75 px-2.5 py-1 text-[11px] text-zinc-200 backdrop-blur-md transition hover:scale-105 hover:border-sky-400/50 hover:bg-[#13131C]"
      >
        <Wind className={`h-3 w-3 ${scene.acOn ? 'text-sky-300' : 'text-zinc-500'}`} />
        <span className="hidden font-mono text-[10px] sm:inline">
          {scene.acOn ? `${scene.acTemp}°C` : '待机'}
        </span>
      </button>

      {/* HomePod 热点 */}
      <button
        type="button"
        onClick={onToggleHomePod}
        title="点击切换 HomePod 播放/静音"
        className="pointer-events-auto group absolute left-[76%] top-[71%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-[#0C0C0F]/75 px-2.5 py-1 text-[11px] text-zinc-200 backdrop-blur-md transition hover:scale-105 hover:border-indigo-400/50 hover:bg-[#13131C]"
      >
        <Speaker
          className={`h-3 w-3 ${
            scene.homePodMode === 'playing'
              ? 'text-indigo-300'
              : scene.homePodMode === 'muted'
              ? 'text-amber-300'
              : 'text-zinc-500'
          }`}
        />
        <span className="hidden font-mono text-[10px] sm:inline">
          {scene.homePodMode === 'playing'
            ? '播放中'
            : scene.homePodMode === 'muted'
            ? '静音'
            : 'HomePod'}
        </span>
      </button>
    </div>
  );
};
