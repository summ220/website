import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneState } from './sceneConfig';

interface RoomBaseLayerProps {
  scene: SceneState;
}

/**
 * 温馨居家 2.5D 书房实景底座：
 * 将底色与固定透明明暗层分离，实现清晨、白天、傍晚、深夜全屋色调 0.7s 平滑渐变过渡
 */
export const RoomBaseLayer: React.FC<RoomBaseLayerProps> = ({ scene }) => {
  if (scene.layers?.baseImageUrl) {
    return (
      <img
        src={scene.layers.baseImageUrl}
        alt="AuraHub 居家书房实景"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />
    );
  }

  const isDay = scene.isDaylight;
  const isVoice = scene.id === 'voice';
  const isSleep = scene.id === 'sleep';
  const isMeeting = scene.monitorMode === 'meeting';

  // 平滑日夜基色表（通过 CSS duration-700 过渡所有 fill/stroke/opacity）
  const wallBase = isDay ? '#EDE8DF' : isVoice ? '#322D3C' : '#141620';
  const slatFillA = isDay ? '#D6B894' : isVoice ? '#59463A' : '#262121';
  const slatFillB = isDay ? '#CCA982' : isVoice ? '#4E3D32' : '#201C1C';
  const deskBase = isDay ? '#DFCBB2' : isVoice ? '#544237' : '#201D21';
  const deskEdge = isDay ? '#C5AB89' : isVoice ? '#3D3028' : '#1E1B1F';
  const acBase = isDay ? '#F8F7F5' : isVoice ? '#C2BDB7' : '#3A3734';
  const homepodBase = isDay ? '#EAE8E4' : '#2E2E35';
  const doorBg = isDay ? '#DED7CA' : isVoice ? '#2A2633' : '#111219';

  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      <svg
        viewBox="0 0 1200 720"
        className="h-full w-full object-cover [&_circle]:transition-all [&_circle]:duration-700 [&_ellipse]:transition-all [&_ellipse]:duration-700 [&_g]:transition-opacity [&_g]:duration-700 [&_line]:transition-all [&_line]:duration-700 [&_path]:transition-all [&_path]:duration-700 [&_polygon]:transition-all [&_polygon]:duration-700 [&_rect]:transition-all [&_rect]:duration-700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* 固定明暗深度遮罩（与底层纯色分离以便 CSS 渐变） */}
          <linearGradient id="wallDepthShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
          </linearGradient>

          <linearGradient id="deskDepthShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
          </linearGradient>

          <linearGradient id="acDepthShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
          </linearGradient>

          <linearGradient id="homepodShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>

          {/* HomePod 编织质感 */}
          <pattern
            id="homepodMesh"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 4 L 4 0 L 8 4 L 4 8 Z"
              fill="none"
              stroke={isDay ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)'}
              strokeWidth="0.7"
            />
          </pattern>

          {/* 显示器铝制支架 */}
          <linearGradient id="standGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4D4D8" />
            <stop offset="45%" stopColor="#FAFAFA" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>

          {/* 屏幕桌面倒影 */}
          <linearGradient id="deskReflectGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={
                scene.monitorMode === 'meeting'
                  ? 'rgba(99,102,241,0.18)'
                  : scene.monitorMode === 'music'
                  ? 'rgba(245,158,11,0.22)'
                  : scene.monitorMode === 'standby'
                  ? 'rgba(255,255,255,0.22)'
                  : 'rgba(0,0,0,0)'
              }
            />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        {/* 1. 房间背景墙 */}
        <rect x="0" y="0" width="1200" height="720" fill={wallBase} />
        <rect x="0" y="0" width="1200" height="720" fill="url(#wallDepthShade)" />

        {/* 左侧温馨木格栅背景墙 */}
        <g opacity={isSleep ? 0.55 : 0.92}>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={`slat-${i}`}
              x={38 + i * 13}
              y={0}
              width="7.5"
              height="465"
              rx="1"
              fill={i % 2 === 0 ? slatFillA : slatFillB}
            />
          ))}
        </g>

        {/* 左上角窗户百叶暖阳投影（平滑淡入淡出） */}
        <g opacity={isDay ? 0.28 : 0}>
          <polygon points="240,0 430,0 590,460 320,460" fill="#FFFBEB" />
          <line x1="250" y1="90" x2="465" y2="90" stroke="#E6DDD0" strokeWidth="5" />
          <line x1="275" y1="180" x2="495" y2="180" stroke="#E6DDD0" strokeWidth="5" />
          <line x1="300" y1="270" x2="525" y2="270" stroke="#E6DDD0" strokeWidth="5" />
        </g>

        {/* 墙面踢脚线与空间分隔 */}
        <line
          x1="0"
          y1="456"
          x2="1060"
          y2="456"
          stroke={isDay ? 'rgba(120,113,108,0.16)' : 'rgba(255,255,255,0.08)'}
          strokeWidth="1.5"
        />

        {/* 右侧客厅房门与门框 */}
        <rect x="1060" y="38" width="140" height="530" fill={doorBg} />
        <rect
          x="1084"
          y="62"
          width="116"
          height="495"
          fill={isDay ? '#CFC7B8' : isVoice ? '#1E1B26' : '#0B0C11'}
          stroke={isDay ? 'rgba(120,113,108,0.2)' : 'rgba(255,255,255,0.07)'}
        />
        <rect
          x="1096"
          y="315"
          width="20"
          height="5"
          rx="2.5"
          fill={isDay ? '#78716C' : '#52525B'}
        />

        {/* 装饰壁画框 */}
        <g transform="translate(260, 95)" opacity={isSleep ? 0.4 : 0.95}>
          <rect
            x="0"
            y="0"
            width="86"
            height="112"
            rx="4"
            fill={isDay ? '#FAF9F6' : '#2E2A38'}
            stroke={isDay ? '#B89774' : '#4B4453'}
            strokeWidth="4"
          />
          <circle cx="43" cy="48" r="20" fill={isDay ? '#FDE68A' : '#92400E'} opacity="0.85" />
          <path d="M 14 92 Q 43 60 72 92 Z" fill={isDay ? '#A5B4FC' : '#4338CA'} opacity="0.6" />
        </g>

        {/* 2. 墙面雅致挂机空调 */}
        <g transform="translate(730, 88)">
          <rect
            x="4"
            y="10"
            width="268"
            height="78"
            rx="14"
            fill={isDay ? 'rgba(28,25,23,0.1)' : 'rgba(0,0,0,0.45)'}
          />
          <rect
            x="0"
            y="0"
            width="268"
            height="76"
            rx="14"
            fill={acBase}
            stroke={isDay ? 'rgba(168,162,158,0.4)' : 'rgba(255,255,255,0.14)'}
            strokeWidth="1.2"
          />
          <rect x="0" y="0" width="268" height="76" rx="14" fill="url(#acDepthShade)" />
          <line
            x1="16"
            y1="48"
            x2="252"
            y2="48"
            stroke={isDay ? 'rgba(120,113,108,0.15)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="1"
          />
          <rect
            x="18"
            y="54"
            width="232"
            height="13"
            rx="4"
            fill={isDay ? '#57534E' : '#09090B'}
          />
        </g>

        {/* 3. 温馨原木桌面结构 */}
        <g>
          <rect
            x="92"
            y="525"
            width="980"
            height="195"
            fill={isDay ? '#C9B9A6' : isVoice ? '#261F1C' : '#0C0B0E'}
            opacity="0.35"
          />
          <rect
            x="150"
            y="525"
            width="20"
            height="195"
            fill={isDay ? '#A8A29E' : '#27272A'}
          />
          <rect
            x="985"
            y="525"
            width="20"
            height="195"
            fill={isDay ? '#A8A29E' : '#27272A'}
          />
          {/* 桌面主体 */}
          <polygon
            points="92,465 1068,465 1114,526 52,526"
            fill={deskBase}
            stroke={isDay ? 'rgba(168,140,108,0.45)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="1"
          />
          <polygon
            points="92,465 1068,465 1114,526 52,526"
            fill="url(#deskDepthShade)"
          />
          <polygon
            points="395,466 805,466 835,518 365,518"
            fill="url(#deskReflectGrad)"
          />
          {/* 浅灰羊毛毡桌垫 */}
          <polygon
            points="355,478 845,478 862,516 338,516"
            fill={isDay ? '#D6D3CD' : isVoice ? '#3B363C' : '#1A1A20'}
            stroke={isDay ? 'rgba(120,113,108,0.2)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="0.8"
          />
          {/* 无线键盘与触控板 */}
          <polygon
            points="455,486 675,486 682,506 448,506"
            fill={isDay ? '#FAF9F6' : '#27272A'}
            stroke={isDay ? 'rgba(120,113,108,0.22)' : 'rgba(255,255,255,0.12)'}
            strokeWidth="0.8"
          />
          <polygon
            points="700,487 765,487 769,506 696,506"
            fill={isDay ? '#F5F5F4' : '#27272A'}
            stroke={isDay ? 'rgba(120,113,108,0.2)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="0.8"
          />
          <rect
            x="52"
            y="526"
            width="1062"
            height="12"
            rx="2"
            fill={deskEdge}
          />
        </g>

        {/* 4. 中央窄边框桌面显示器 */}
        <g transform="translate(385, 212)">
          <ellipse
            cx="215"
            cy="272"
            rx="68"
            ry="6"
            fill={isDay ? 'rgba(28,25,23,0.18)' : 'rgba(0,0,0,0.6)'}
          />
          <polygon points="178,262 252,262 264,272 166,272" fill="#D4D4D8" />
          <rect x="206" y="198" width="18" height="66" fill="url(#standGrad)" />
          <rect
            x="0"
            y="0"
            width="430"
            height="220"
            rx="12"
            fill="#1C1917"
            stroke={isDay ? '#A8A29E' : '#3F3F46'}
            strokeWidth="2.2"
          />
          <rect x="8" y="8" width="414" height="204" rx="6" fill="#09090B" />
          <circle cx="215" cy="4.5" r="1.8" fill="#44403C" />
          {isMeeting && (
            <circle cx="223" cy="4.5" r="2.2" fill="#22C55E" />
          )}
        </g>

        {/* 5. 左侧护眼悬浮台灯 */}
        <g transform="translate(175, 224)">
          <ellipse
            cx="46"
            cy="256"
            rx="36"
            ry="8"
            fill={isDay ? '#E7E5E4' : '#27272A'}
            stroke={isDay ? '#D6D3D1' : '#3F3F46'}
            strokeWidth="1"
          />
          <line
            x1="46"
            y1="252"
            x2="22"
            y2="128"
            stroke={isDay ? '#A8A29E' : '#52525B'}
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle
            cx="22"
            cy="128"
            r="6"
            fill={isDay ? '#D6D3D1' : '#71717A'}
          />
          <line
            x1="22"
            y1="128"
            x2="110"
            y2="54"
            stroke={isDay ? '#A8A29E' : '#52525B'}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <g transform="translate(96, 46) rotate(22)">
            <rect
              x="0"
              y="0"
              width="68"
              height="16"
              rx="8"
              fill={isDay ? '#F5F5F4' : '#3F3F46'}
              stroke={isDay ? '#D6D3D1' : '#52525B'}
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
                    : '#FFFFFF'
                  : '#71717A'
              }
            />
          </g>
        </g>

        {/* 6. 右侧 HomePod 音箱 */}
        <g transform="translate(868, 372)">
          <ellipse
            cx="44"
            cy="112"
            rx="42"
            ry="8"
            fill={isDay ? 'rgba(28,25,23,0.16)' : 'rgba(0,0,0,0.65)'}
          />
          <rect
            x="4"
            y="8"
            width="80"
            height="102"
            rx="28"
            fill={homepodBase}
            stroke={isDay ? 'rgba(168,162,158,0.45)' : 'rgba(255,255,255,0.16)'}
            strokeWidth="1"
          />
          <rect x="4" y="8" width="80" height="102" rx="28" fill="url(#homepodShade)" />
          <rect x="4" y="8" width="80" height="102" rx="28" fill="url(#homepodMesh)" />
          <ellipse
            cx="44"
            cy="18"
            rx="28"
            ry="8"
            fill={isDay ? '#E7E5E4' : '#18181B'}
            stroke={isDay ? '#D6D3D1' : 'rgba(255,255,255,0.16)'}
            strokeWidth="0.8"
          />
        </g>

        {/* 7. 桌面小盆栽装饰 */}
        <g transform="translate(960, 425)" opacity={isSleep ? 0.5 : 1}>
          <path d="M 8 24 L 38 24 L 34 46 L 12 46 Z" fill={isDay ? '#E7E5E4' : '#3F3F46'} />
          <ellipse cx="18" cy="14" rx="9" ry="14" transform="rotate(-18 18 14)" fill="#4D7C0F" opacity="0.85" />
          <ellipse cx="28" cy="15" rx="8" ry="13" transform="rotate(20 28 15)" fill="#65A30D" opacity="0.85" />
          <ellipse cx="23" cy="10" rx="6" ry="14" fill="#84CC16" opacity="0.8" />
        </g>

        {/* 8. 桌面 AuraHub 白色圆润小盒子 */}
        <g transform="translate(272, 450)">
          <ellipse
            cx="34"
            cy="36"
            rx="38"
            ry="6"
            fill={isDay ? 'rgba(28,25,23,0.15)' : 'rgba(0,0,0,0.65)'}
          />
          <rect
            x="0"
            y="8"
            width="68"
            height="26"
            rx="8"
            fill={isDay ? '#FFFFFF' : '#27272F'}
            stroke={isDay ? '#D6D3D1' : 'rgba(255,255,255,0.2)'}
            strokeWidth="1.2"
          />
          <rect
            x="16"
            y="12"
            width="36"
            height="5"
            rx="2.5"
            fill={isDay ? '#EEF2FF' : '#1E1B4B'}
          />
        </g>
      </svg>

      {/* 显示器屏幕 UI 内容叠加层 */}
      <div className="pointer-events-none absolute left-1/2 top-[30.5%] h-[27.5%] w-[34.2%] -translate-x-1/2 overflow-hidden rounded-[4px]">
        <AnimatePresence mode="wait">
          {scene.monitorMode === 'standby' && (
            <motion.div
              key="standby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-sky-100 to-indigo-100 p-3 text-center"
            >
              <div className="text-xl font-bold tracking-tight text-stone-800 sm:text-2xl">
                08:30
              </div>
              <div className="mt-1 text-[10px] font-medium text-stone-600">
                早安 · 全屋设备已就绪
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
              className="flex h-full w-full flex-col justify-between bg-slate-900 p-2.5 text-white"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  视频会议中 · 摄像头已开启
                </span>
                <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[8px] text-indigo-200">
                  自动静音音箱
                </span>
              </div>
              <div className="my-1.5 grid flex-1 grid-cols-2 gap-1.5">
                {[
                  { bg: 'bg-indigo-400/25', dot: 'bg-indigo-300' },
                  { bg: 'bg-sky-400/25', dot: 'bg-sky-300' },
                  { bg: 'bg-amber-400/20', dot: 'bg-amber-300' },
                  { bg: 'bg-emerald-400/20', dot: 'bg-emerald-300' },
                ].map((tile, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center rounded-md ${tile.bg}`}
                  >
                    <div className={`h-4 w-4 rounded-full ${tile.dot} opacity-80`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-slate-600" />
                <span className="h-1.5 w-6 rounded-full bg-rose-500/80" />
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
              className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#2C1F1D] via-[#1C1917] to-[#1E1B2E] p-3 text-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium text-amber-300">
                  正在用 HomePod 播放
                </span>
                <span className="text-[8px] text-stone-400">无损音质</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-500 shadow-sm" />
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-semibold text-stone-100">
                    午夜爵士轻音乐
                  </div>
                  <div className="truncate text-[8px] text-stone-400">
                    客厅音箱同步播放中
                  </div>
                </div>
              </div>
              <div className="flex h-3 items-end gap-0.5">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="w-full rounded-full bg-amber-300/85"
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
              className="h-full w-full bg-[#09090B]"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
