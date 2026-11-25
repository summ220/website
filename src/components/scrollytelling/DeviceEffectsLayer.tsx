import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX, Wind, Lightbulb, Speaker, DoorClosed } from 'lucide-react';
import { SceneState } from './sceneConfig';

interface DeviceEffectsLayerProps {
  scene: SceneState;
  onToggleLamp: () => void;
  onToggleAc: () => void;
  onToggleHomePod: () => void;
}

/**
 * 居家设备动效与大白话可点击热点层：
 * 包含空调送风、HomePod 音浪/静音提醒、门口“开会勿扰”提醒、小盒子呼吸灯及直接点击控制按钮
 */
export const DeviceEffectsLayer: React.FC<DeviceEffectsLayerProps> = ({
  scene,
  onToggleLamp,
  onToggleAc,
  onToggleHomePod,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 可选：外部 3D 渲染图层 */}
      {scene.layers?.acOnLayerUrl && (
        <motion.img
          src={scene.layers.acOnLayerUrl}
          alt="空调开启"
          animate={{ opacity: scene.acOn ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* 1. 墙面空调动效区 */}
      <div className="absolute left-[60.8%] top-[12.2%] h-[11%] w-[22.4%]">
        <AnimatePresence>
          {scene.acOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-[13%] top-[30%] rounded bg-sky-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-xs"
            >
              {scene.acTemp}°C
            </motion.div>
          )}
        </AnimatePresence>

        {/* 导风板 */}
        <motion.div
          animate={{ rotateX: scene.acOn ? 48 : 0, y: scene.acOn ? 3 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[10%] left-[7%] right-[7%] h-[5px] origin-top rounded-full bg-stone-400/90 shadow-sm"
        />

        {/* 清爽冷气送风动效 */}
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
                  className="absolute top-0 h-20 w-[26%] rounded-full bg-gradient-to-b from-sky-400/35 via-sky-300/15 to-transparent blur-md"
                  style={{ left: `${8 + idx * 22}%` }}
                  animate={{
                    y: [0, 42, 76],
                    opacity: [0, 0.85, 0],
                    scaleY: [0.8, 1.3, 1.5],
                  }}
                  transition={{
                    duration: 2.3,
                    repeat: Infinity,
                    delay: idx * 0.45,
                    ease: 'easeOut',
                  }}
                />
              ))}
              {[0, 1, 2, 3, 4, 5].map((p) => (
                <motion.span
                  key={`p-${p}`}
                  className="absolute top-1 h-1.5 w-1.5 rounded-full bg-sky-400/80 shadow-[0_0_6px_rgba(56,189,248,0.8)]"
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

      {/* 2. 右侧房门“开会勿扰”友好小牌 */}
      <AnimatePresence>
        {scene.doorAlertOn && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="absolute right-[2.5%] top-[28%] flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg"
          >
            <DoorClosed className="h-3 w-3" />
            <span>开会勿扰</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HomePod 音箱极光灯环与音浪 */}
      <div className="absolute left-[72.3%] top-[51.5%] h-[16%] w-[7.4%]">
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
                  className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-amber-400 opacity-95 blur-[3px]"
                />
                {[0, 1, 2].map((ring) => (
                  <motion.div
                    key={ring}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-400/45"
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
            <div className="h-full w-full rounded-full bg-indigo-400/20 blur-[1px]" />
          )}
        </div>

        <AnimatePresence>
          {scene.homePodMode === 'muted' && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="absolute -top-8 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800 shadow-md"
            >
              <VolumeX className="h-3 w-3 text-amber-600" />
              <span>开会已静音</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. AuraHub 小盒子安心呼吸灯 */}
      <div className="absolute left-[22.9%] top-[62.8%] flex h-[4.4%] w-[5.3%] items-center justify-center">
        {scene.hubBreathOn && (
          <>
            <motion.div
              animate={{
                scale: [0.8, 2.6],
                opacity: [0.55, 0],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
              className="pointer-events-none absolute h-4 w-4 rounded-full border border-indigo-400/60"
            />
            <motion.div
              animate={{
                opacity: scene.id === 'sleep' ? [0.35, 1, 0.35] : [0.55, 1, 0.55],
                scale: scene.id === 'sleep' ? [0.95, 1.25, 0.95] : [1, 1.1, 1],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)]"
            />
          </>
        )}
      </div>

      {/* 5. 高对比度可点击设备控制胶囊（白天夜晚都清晰好点） */}
      {/* 台灯热点 */}
      <button
        type="button"
        onClick={onToggleLamp}
        title="点一下试试开关台灯"
        className="pointer-events-auto group absolute left-[22%] top-[36%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-md backdrop-blur-md transition hover:scale-105 hover:border-amber-400"
      >
        <Lightbulb
          className={`h-3.5 w-3.5 ${
            scene.lampBrightness > 0.05 ? 'text-amber-500 fill-amber-400/30' : 'text-stone-400'
          }`}
        />
        <span className="hidden sm:inline">
          {scene.lampBrightness > 0.05
            ? `台灯 ${Math.round(scene.lampBrightness * 100)}%`
            : '台灯 已关'}
        </span>
      </button>

      {/* 空调热点 */}
      <button
        type="button"
        onClick={onToggleAc}
        title="点一下试试开关空调"
        className="pointer-events-auto group absolute left-[72%] top-[9%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-md backdrop-blur-md transition hover:scale-105 hover:border-sky-400"
      >
        <Wind className={`h-3.5 w-3.5 ${scene.acOn ? 'text-sky-600' : 'text-stone-400'}`} />
        <span className="hidden sm:inline">
          {scene.acOn ? `空调 ${scene.acTemp}°C` : '空调 关闭'}
        </span>
      </button>

      {/* HomePod 热点 */}
      <button
        type="button"
        onClick={onToggleHomePod}
        title="点一下试试切换音箱状态"
        className="pointer-events-auto group absolute left-[76%] top-[72%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 shadow-md backdrop-blur-md transition hover:scale-105 hover:border-indigo-400"
      >
        <Speaker
          className={`h-3.5 w-3.5 ${
            scene.homePodMode === 'playing'
              ? 'text-indigo-600'
              : scene.homePodMode === 'muted'
              ? 'text-amber-600'
              : 'text-stone-400'
          }`}
        />
        <span className="hidden sm:inline">
          {scene.homePodMode === 'playing'
            ? 'HomePod 播放中'
            : scene.homePodMode === 'muted'
            ? 'HomePod 已静音'
            : 'HomePod 待机'}
        </span>
      </button>
    </div>
  );
};
