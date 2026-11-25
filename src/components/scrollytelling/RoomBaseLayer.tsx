import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneState } from './sceneConfig';

interface RoomBaseLayerProps {
  scene: SceneState;
}

/**
 * 高精度分层建筑感 2.5D 书房/桌面底座
 * 包含声学木格栅墙面、百叶透光剪影、桌面光影倒影、HomePod 编织网面、CNC 中枢视窗等细节
 * 预留 scene.layers?.baseImageUrl，可直接替换为 3D 渲染 PNG 底图
 */
export const RoomBaseLayer: React.FC<RoomBaseLayerProps> = ({ scene }) => {
  if (scene.layers?.baseImageUrl) {
    return (
      <img
        src={scene.layers.baseImageUrl}
        alt="AuraHub Smart Room"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />
    );
  }

  const isMeeting = scene.monitorMode === 'meeting';
  const isSleep = scene.id === 'sleep';

  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {/* 2.5D 精密建筑感书房 SVG */}
      <svg
        viewBox="0 0 1200 720"
        className="h-full w-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* 后墙深邃渐变 */}
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16161E" />
            <stop offset="60%" stopColor="#0E0E14" />
            <stop offset="100%" stopColor="#08080B" />
          </linearGradient>

          {/* 桌面碳黑岩板渐变 */}
          <linearGradient id="deskTopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F1F28" />
            <stop offset="45%" stopColor="#14141B" />
            <stop offset="100%" stopColor="#0D0D12" />
          </linearGradient>

          {/* 门框纵深走廊 */}
          <linearGradient id="doorFrameGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#07070A" />
            <stop offset="100%" stopColor="#13131B" />
          </linearGradient>

          {/* 空调磨砂机身渐变 */}
          <linearGradient id="acBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2A36" />
            <stop offset="70%" stopColor="#1B1B24" />
            <stop offset="100%" stopColor="#14141B" />
          </linearGradient>

          {/* HomePod 菱形编织网面纹理 */}
          <pattern
            id="homepodMesh"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 4 L 4 0 L 8 4 L 4 8 Z"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.7"
            />
          </pattern>

          {/* HomePod 立体渐变 */}
          <linearGradient id="homepodGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#262632" />
            <stop offset="35%" stopColor="#1A1A23" />
            <stop offset="100%" stopColor="#0C0C11" />
          </linearGradient>

          {/* 显示器铝制支架 */}
          <linearGradient id="standGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="45%" stopColor="#71717A" />
            <stop offset="100%" stopColor="#18181B" />
          </linearGradient>

          {/* 屏幕桌面反射倒影 */}
          <linearGradient id="deskReflectGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={
                scene.monitorMode === 'meeting'
                  ? 'rgba(129,140,248,0.22)'
                  : scene.monitorMode === 'music'
                  ? 'rgba(245,158,11,0.18)'
                  : scene.monitorMode === 'standby'
                  ? 'rgba(148,163,184,0.1)'
                  : 'rgba(0,0,0,0)'
              }
            />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        {/* 1. 房间背景墙 */}
        <rect x="0" y="0" width="1200" height="720" fill="url(#wallGrad)" />

        {/* 左侧声学吸音木格栅阵列 (Acoustic Slats) */}
        <g opacity="0.75">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={`slat-${i}`}
              x={38 + i * 13}
              y={0}
              width="7"
              height="465"
              fill={i % 2 === 0 ? '#121218' : '#15151C'}
              stroke="rgba(255,255,255,0.025)"
              strokeWidth="0.6"
            />
          ))}
        </g>

        {/* 顶部吊顶隐形洗墙灯槽 */}
        <rect x="220" y="0" width="840" height="10" fill="#08080C" />
        <line
          x1="230"
          y1="10"
          x2="1050"
          y2="10"
          stroke={isSleep ? 'rgba(255,255,255,0.03)' : 'rgba(148,163,184,0.22)'}
          strokeWidth="1.5"
        />

        {/* 墙面建筑护墙板与纵深分隔线 */}
        <line x1="0" y1="455" x2="1060" y2="455" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="225" y1="0" x2="225" y2="465" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        <line x1="885" y1="0" x2="885" y2="465" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* 右侧门框透视结构与门缝 */}
        <rect x="1060" y="38" width="140" height="530" fill="url(#doorFrameGrad)" />
        <line x1="1060" y1="38" x2="1060" y2="568" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
        <line x1="1060" y1="38" x2="1200" y2="38" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
        {/* 门内纵深边框与极简把手 */}
        <rect x="1085" y="64" width="115" height="495" fill="#0B0B10" stroke="rgba(255,255,255,0.04)" />
        <rect x="1096" y="315" width="18" height="4" rx="2" fill="#3F3F46" />

        {/* 2. 墙面极简挂机空调 */}
        <g transform="translate(730, 88)">
          <rect x="6" y="12" width="268" height="78" rx="12" fill="rgba(0,0,0,0.5)" />
          <rect
            x="0"
            y="0"
            width="268"
            height="76"
            rx="12"
            fill="url(#acBodyGrad)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
          {/* 面板顶部高光折线 */}
          <line x1="16" y1="12" x2="252" y2="12" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="12" y1="48" x2="256" y2="48" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
          {/* 底部出风口内腔 */}
          <rect x="18" y="54" width="232" height="14" rx="4" fill="#070709" />
        </g>

        {/* 3. 桌面透视结构与阴影 */}
        <g>
          <rect x="105" y="525" width="955" height="195" fill="#060608" />
          {/* 金属桌腿 */}
          <rect x="150" y="525" width="20" height="195" fill="#121218" />
          <rect x="985" y="525" width="20" height="195" fill="#121218" />
          {/* 桌面主体 */}
          <polygon
            points="92,465 1068,465 1114,526 52,526"
            fill="url(#deskTopGrad)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          {/* 桌面屏前倒影区域 */}
          <polygon
            points="395,466 805,466 835,518 365,518"
            fill="url(#deskReflectGrad)"
          />
          {/* 桌面桌垫 (Desk Mat) */}
          <polygon
            points="355,478 845,478 862,516 338,516"
            fill="#0D0D12"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />
          {/* 机械键盘与触控板剪影 */}
          <polygon
            points="455,486 675,486 682,506 448,506"
            fill="#181820"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
          />
          {/* 键盘底部微弱背光 */}
          {!isSleep && (
            <line
              x1="452"
              y1="506"
              x2="678"
              y2="506"
              stroke="rgba(129,140,248,0.28)"
              strokeWidth="1.2"
            />
          )}
          <polygon
            points="700,487 765,487 769,506 696,506"
            fill="#16161D"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
          />
          {/* 桌沿厚度高光 */}
          <rect
            x="52"
            y="526"
            width="1062"
            height="10"
            rx="2"
            fill="#13131A"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.8"
          />
        </g>

        {/* 4. 中央 Pro Display 风格超窄边框显示器 */}
        <g transform="translate(385, 212)">
          {/* 支架投影 */}
          <ellipse cx="215" cy="272" rx="68" ry="6" fill="rgba(0,0,0,0.65)" />
          <polygon points="178,262 252,262 264,272 166,272" fill="#27272A" />
          <rect x="206" y="198" width="18" height="66" fill="url(#standGrad)" />
          {/* 铝合金外框 */}
          <rect
            x="0"
            y="0"
            width="430"
            height="220"
            rx="10"
            fill="#0A0A0D"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
          {/* 内层面板 */}
          <rect x="8" y="8" width="414" height="204" rx="5" fill="#060608" />
          {/* 顶部前置摄像头与绿色隐私指示灯 */}
          <circle cx="215" cy="4.5" r="1.8" fill="#18181B" />
          {isMeeting && (
            <circle cx="222" cy="4.5" r="1.8" fill="#34D399" />
          )}
        </g>

        {/* 5. 左侧建筑感悬浮悬臂台灯 */}
        <g transform="translate(175, 224)">
          <ellipse cx="46" cy="256" rx="36" ry="8" fill="#181820" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <line x1="46" y1="252" x2="22" y2="128" stroke="#3F3F46" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="22" cy="128" r="6" fill="#52525B" stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
          <line x1="22" y1="128" x2="110" y2="54" stroke="#52525B" strokeWidth="4.5" strokeLinecap="round" />
          {/* 灯头 */}
          <g transform="translate(96, 46) rotate(22)">
            <rect
              x="0"
              y="0"
              width="68"
              height="16"
              rx="8"
              fill="#27272F"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />
            <rect
              x="8"
              y="13"
              width="52"
              height="3.5"
              rx="1.5"
              fill={
                scene.lampBrightness > 0.05
                  ? scene.lampTone === 'warm'
                    ? '#FBBF24'
                    : '#F8FAFC'
                  : '#27272A'
              }
            />
          </g>
        </g>

        {/* 6. 右侧 HomePod 编织柱体 */}
        <g transform="translate(868, 372)">
          <ellipse cx="44" cy="112" rx="42" ry="8" fill="rgba(0,0,0,0.7)" />
          <rect
            x="4"
            y="8"
            width="80"
            height="102"
            rx="28"
            fill="url(#homepodGrad)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
          {/* 编织网格纹理叠加 */}
          <rect x="4" y="8" width="80" height="102" rx="28" fill="url(#homepodMesh)" />
          {/* 顶部触控玻璃凹面 */}
          <ellipse
            cx="44"
            cy="18"
            rx="28"
            ry="8"
            fill="#0A0A0F"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="0.8"
          />
        </g>

        {/* 7. 桌面 AuraHub 开源中枢盒子 (CNC 铝金属+透明芯片视窗) */}
        <g transform="translate(272, 450)">
          <ellipse cx="34" cy="36" rx="38" ry="6" fill="rgba(0,0,0,0.7)" />
          <rect
            x="0"
            y="8"
            width="68"
            height="26"
            rx="6"
            fill="#1D1D26"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
          {/* 顶部透明视窗框 */}
          <rect
            x="10"
            y="11"
            width="48"
            height="7"
            rx="2"
            fill="#0A0A10"
            stroke="rgba(129,140,248,0.28)"
            strokeWidth="0.6"
          />
          {/* 侧边散热开孔 */}
          <line x1="8" y1="27" x2="22" y2="27" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        </g>
      </svg>

      {/* 显示器屏幕 UI 内容叠加层（精准对齐中央显示器内屏） */}
      <div className="pointer-events-none absolute left-1/2 top-[30.5%] h-[27.5%] w-[34.2%] -translate-x-1/2 overflow-hidden rounded-[4px]">
        <AnimatePresence mode="wait">
          {scene.monitorMode === 'standby' && (
            <motion.div
              key="standby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#09090B] to-[#111827] p-3 text-center"
            >
              <div className="font-mono text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                08:30
              </div>
              <div className="mt-1 font-mono text-[9px] text-zinc-400">
                AuraHub Desktop · Standby
              </div>
            </motion.div>
          )}

          {scene.monitorMode === 'meeting' && (
            <motion.div
              key="meeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex h-full w-full flex-col justify-between bg-[#0B0F1A] p-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-mono text-[8px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Zoom · Camera ON
                </span>
                <span className="rounded bg-rose-500/20 px-1 py-0.5 font-mono text-[7px] text-rose-300">
                  LIVE
                </span>
              </div>
              <div className="my-1.5 grid flex-1 grid-cols-2 gap-1.5">
                {[0, 1, 2, 3].map((tile) => (
                  <div
                    key={tile}
                    className="flex items-center justify-center rounded bg-white/[0.04] ring-1 ring-white/[0.06]"
                  >
                    <div className="h-4 w-4 rounded-full bg-indigo-400/30 ring-1 ring-indigo-300/40" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-zinc-700" />
                <span className="h-1.5 w-6 rounded-full bg-rose-500/70" />
              </div>
            </motion.div>
          )}

          {scene.monitorMode === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#1C1410] via-[#0C0A09] to-[#11121B] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] text-amber-300">
                  AirPlay 2 → HomePod
                </span>
                <span className="font-mono text-[8px] text-zinc-500">24-bit</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-tr from-amber-500/50 to-indigo-400/40 ring-1 ring-white/20" />
                <div className="min-w-0">
                  <div className="truncate text-[10px] font-medium text-zinc-100">
                    Midnight Blue Jazz
                  </div>
                  <div className="truncate font-mono text-[8px] text-zinc-400">
                    Kenny Burrell · Hi-Res
                  </div>
                </div>
              </div>
              <div className="flex h-3 items-end gap-0.5">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="w-full rounded-full bg-amber-300/80"
                    animate={{
                      height: ['25%', `${45 + ((idx * 19) % 55)}%`, '20%'],
                    }}
                    transition={{
                      duration: 0.8 + (idx % 4) * 0.15,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {scene.monitorMode === 'off' && (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full bg-[#040406]"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
