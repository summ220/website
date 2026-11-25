import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Laptop,
  Monitor,
  Smartphone,
  Speaker,
  Lightbulb,
  ArrowRight,
  Play,
  Home,
  ShieldCheck,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

interface NodeItem {
  id: string;
  label: string;
  sub: string;
  routeText: string;
  side: 'left' | 'right';
  yPercent: number;
  icon: React.ReactNode;
}

const leftNodes: NodeItem[] = [
  {
    id: 'windows',
    label: 'Windows 电脑',
    sub: '无线连 HomePod',
    routeText: '用 Windows 看剧打游戏，不用蓝牙线，声音直接无线传给客厅 HomePod！',
    side: 'left',
    yPercent: 18,
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: 'mac',
    label: 'Mac 电脑',
    sub: '开会自动联动',
    routeText: 'Mac 一打开视频会议，桌面台灯自动提亮补光，音箱静音、门口亮勿扰灯。',
    side: 'left',
    yPercent: 39,
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    id: 'ios',
    label: '苹果手机',
    sub: '回家自动开灯',
    routeText: '下班刚到家门口，手机自动感知触发回家模式：玄关灯亮起，空调调至 24°C。',
    side: 'left',
    yPercent: 61,
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: 'android',
    label: '安卓手机',
    sub: '桌面上统一遥控',
    routeText: '不用翻找五六个品牌 App，手机桌面一点就能控制 HomePod、小米灯和华为音箱。',
    side: 'left',
    yPercent: 82,
    icon: <Smartphone className="h-4 w-4" />,
  },
];

const rightNodes: NodeItem[] = [
  {
    id: 'homepod',
    label: '苹果 HomePod',
    sub: '不止配 iPhone',
    routeText: '打破苹果限制：家里人用 Windows 或安卓手机，也能随时随地给 HomePod 放歌。',
    side: 'right',
    yPercent: 18,
    icon: <Speaker className="h-4 w-4" />,
  },
  {
    id: 'xiaomi',
    label: '小米台灯 / 空调',
    sub: '跨品牌协同工作',
    routeText: '说一句“有点热，灯暗一点”，小米台灯与空调立刻配合，同时音箱放起轻音乐。',
    side: 'right',
    yPercent: 39,
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: 'huawei',
    label: '华为 Sound 音箱',
    sub: '全屋一起响',
    routeText: '把华为音箱和卧室小米音箱、客厅 HomePod 串到一起，全屋同步播放背景音乐。',
    side: 'right',
    yPercent: 61,
    icon: <Speaker className="h-4 w-4" />,
  },
  {
    id: 'matter',
    label: '灯具 · 窗帘 · 空调',
    sub: '旧家电也能连',
    routeText: '不用花大钱把家里家电全换成同一牌子，老设备连上 Wi-Fi 就能统一听指挥。',
    side: 'right',
    yPercent: 82,
    icon: <Home className="h-4 w-4" />,
  },
];

const AUTO_DEMO_ORDER = ['windows', 'mac', 'homepod', 'xiaomi', 'ios', 'huawei'];

export const HeroSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>('windows');
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const allNodes = [...leftNodes, ...rightNodes];
  const activeNodeObj = allNodes.find((n) => n.id === activeNode) || null;

  useEffect(() => {
    if (!autoPlay || isHovered) return;
    const timer = window.setInterval(() => {
      setActiveNode((prev) => {
        const idx = prev ? AUTO_DEMO_ORDER.indexOf(prev) : -1;
        return AUTO_DEMO_ORDER[(idx + 1) % AUTO_DEMO_ORDER.length];
      });
    }, 3800);
    return () => window.clearInterval(timer);
  }, [autoPlay, isHovered]);

  const handleSelectNode = (id: string) => {
    setAutoPlay(false);
    setActiveNode((prev) => (prev === id ? null : id));
  };

  const handleToggleCenter = () => {
    if (autoPlay || activeNode !== null) {
      setAutoPlay(false);
      setActiveNode(null);
    } else {
      setAutoPlay(true);
      setActiveNode('windows');
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 左侧：大白话核心价值与清晰行动引导 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/90 px-3.5 py-1.5 text-xs font-medium text-indigo-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
              </span>
              <span>家里不同牌子的设备，终于能一起配合了</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.15]">
              苹果、小米、华为各自为战？
              <span className="mt-1.5 block bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-600 bg-clip-text text-transparent">
                一个 AuraHub，全屋听你指挥
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              不用再在手机里来回翻四五个智能家居 App。不管你用的是{' '}
              <span className="font-semibold text-stone-800">
                Windows 电脑、Mac 还是苹果/安卓手机
              </span>
              ，AuraHub 都能让家里的 HomePod、小米、华为音箱与灯光空调默契联动。
            </p>

            {/* 面向大众的主次按钮 */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#hardware-waitlist"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(79,70,229,0.28)] transition-all hover:bg-indigo-700 hover:shadow-[0_14px_34px_rgba(79,70,229,0.34)]"
              >
                <span className="animate-shimmer pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <Sparkles className="relative z-10 h-4 w-4" />
                <span className="relative z-10">预约 ¥150 插电即用盒子</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="#sandbox"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-semibold text-stone-800 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-indigo-700"
              >
                <Play className="h-4 w-4 fill-indigo-600 text-indigo-600 transition-transform group-hover:scale-110" />
                <span>看看一天怎么帮你忙</span>
              </a>
            </div>

            <div className="mt-4">
              <a
                href="#deploy"
                className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 underline-offset-4 transition hover:text-indigo-600 hover:underline"
              >
                <span>家里已有闲置电脑或 NAS？软件版永久免费下载使用 →</span>
              </a>
            </div>

            {/* 三项大众关心的安心承诺 */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs font-medium text-stone-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                不用换掉老家电
              </span>
              <span className="inline-flex items-center gap-1.5">
                <WifiOff className="h-4 w-4 text-indigo-600" />
                家里断网也能用
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                对话不上云端，隐私更安全
              </span>
            </div>
          </motion.div>

          {/* 右侧：直观交互式“跨品牌互联演示卡” */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-6"
          >
            <SpotlightCard borderBeam className="bg-white/95 p-4 sm:p-6">
              {/* 顶部友好导览栏 */}
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-stone-800 sm:text-sm">
                    跨品牌互联演示
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoPlay((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200/80 transition hover:bg-amber-100"
                >
                  {autoPlay && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  <span>
                    {autoPlay ? '自动轮播中 · 点设备可固定' : '点一点设备 · 开启自动轮播'}
                  </span>
                </button>
              </div>

              {/* 互动连接画布 */}
              <div className="relative h-[340px] w-full select-none overflow-hidden rounded-2xl border border-stone-200/70 bg-gradient-to-br from-[#FAF8F4] via-[#F7F6FA] to-[#F3F6FB] px-2 sm:h-[380px]">
                {/* 中心柔和呼吸光圈 */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [0.85, 1.45], opacity: [0.38, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                    className="h-36 w-36 rounded-full border-2 border-indigo-300/60"
                  />
                </div>

                {/* SVG 动态柔和流光连线 */}
                <svg
                  viewBox="0 0 600 380"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="warmLineLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
                      <stop offset="50%" stopColor="rgba(79,70,229,0.75)" />
                      <stop offset="100%" stopColor="rgba(245,158,11,0.85)" />
                    </linearGradient>
                    <linearGradient id="warmLineRight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(245,158,11,0.85)" />
                      <stop offset="50%" stopColor="rgba(79,70,229,0.75)" />
                      <stop offset="100%" stopColor="rgba(14,165,233,0.25)" />
                    </linearGradient>
                  </defs>

                  {leftNodes.map((node, idx) => {
                    const startY = (node.yPercent / 100) * 380;
                    const d = `M 150 ${startY} C 225 ${startY}, 230 190, 290 190`;
                    const isHighlighted = activeNode === node.id || activeNode === null;
                    return (
                      <g key={node.id}>
                        <path
                          d={d}
                          fill="none"
                          stroke={isHighlighted ? 'rgba(99,102,241,0.28)' : 'rgba(120,113,108,0.1)'}
                          strokeWidth={isHighlighted ? 2.2 : 1.2}
                        />
                        {isHighlighted && (
                          <>
                            <motion.path
                              d={d}
                              fill="none"
                              stroke="url(#warmLineLeft)"
                              strokeWidth="2.8"
                              strokeDasharray="20 110"
                              initial={{ strokeDashoffset: 130 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{
                                duration: 2.1,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: idx * 0.25,
                              }}
                            />
                            <circle r="3.6" fill="#4F46E5">
                              <animateMotion
                                dur="2.1s"
                                repeatCount="indefinite"
                                begin={`${idx * 0.25}s`}
                                path={d}
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    );
                  })}

                  {rightNodes.map((node, idx) => {
                    const endY = (node.yPercent / 100) * 380;
                    const d = `M 310 190 C 370 190, 375 ${endY}, 450 ${endY}`;
                    const isHighlighted = activeNode === node.id || activeNode === null;
                    return (
                      <g key={node.id}>
                        <path
                          d={d}
                          fill="none"
                          stroke={isHighlighted ? 'rgba(14,165,233,0.28)' : 'rgba(120,113,108,0.1)'}
                          strokeWidth={isHighlighted ? 2.2 : 1.2}
                        />
                        {isHighlighted && (
                          <>
                            <motion.path
                              d={d}
                              fill="none"
                              stroke="url(#warmLineRight)"
                              strokeWidth="2.8"
                              strokeDasharray="20 110"
                              initial={{ strokeDashoffset: 130 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{
                                duration: 2.1,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: idx * 0.25 + 0.45,
                              }}
                            />
                            <circle r="3.6" fill="#0284C7">
                              <animateMotion
                                dur="2.1s"
                                repeatCount="indefinite"
                                begin={`${idx * 0.25 + 0.45}s`}
                                path={d}
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* 左侧：平时用的手机和电脑 */}
                <div className="absolute inset-y-0 left-1.5 flex w-[31%] flex-col justify-between py-3.5 sm:left-2 sm:w-[30%]">
                  {leftNodes.map((node) => {
                    const isActive = activeNode === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => handleSelectNode(node.id)}
                        className={`group flex items-center gap-1.5 rounded-xl border px-2 py-2 text-left transition-all sm:gap-2.5 sm:rounded-2xl sm:px-3 ${
                          isActive
                            ? 'border-indigo-400 bg-white shadow-[0_8px_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-200'
                            : 'border-stone-200/90 bg-white/85 hover:border-indigo-200 hover:bg-white'
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7 sm:rounded-xl ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-stone-100 text-stone-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                          }`}
                        >
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-semibold text-stone-800 sm:text-xs">
                            {node.label}
                          </div>
                          <div className="hidden truncate text-[10px] text-stone-500 sm:block">
                            {node.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 中央：居家圆润中枢小盒子 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.button
                    type="button"
                    onClick={handleToggleCenter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    title="点击切换全部连接或自动演示"
                    className="relative flex h-[68px] w-[68px] flex-col items-center justify-center rounded-2xl border border-indigo-200 bg-white shadow-[0_14px_35px_rgba(79,70,229,0.18)] sm:h-28 sm:w-28 sm:rounded-3xl"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/30 sm:h-10 sm:w-10 sm:rounded-2xl">
                      <Home className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    </div>
                    <span className="mt-1 text-[10px] font-bold text-stone-900 sm:mt-1.5 sm:text-xs">
                      AuraHub
                    </span>
                    <span className="hidden text-[10px] font-medium text-indigo-600 sm:block">
                      全屋翻译官
                    </span>
                  </motion.button>
                </div>

                {/* 右侧：家里各品牌的音箱和家电 */}
                <div className="absolute inset-y-0 right-1.5 flex w-[31%] flex-col justify-between py-3.5 sm:right-2 sm:w-[30%]">
                  {rightNodes.map((node) => {
                    const isActive = activeNode === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => handleSelectNode(node.id)}
                        className={`group flex items-center gap-1.5 rounded-xl border px-2 py-2 text-left transition-all sm:gap-2.5 sm:rounded-2xl sm:px-3 ${
                          isActive
                            ? 'border-sky-400 bg-white shadow-[0_8px_20px_rgba(2,132,199,0.14)] ring-1 ring-sky-200'
                            : 'border-stone-200/90 bg-white/85 hover:border-sky-200 hover:bg-white'
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7 sm:rounded-xl ${
                            isActive
                              ? 'bg-sky-600 text-white'
                              : 'bg-stone-100 text-stone-600 group-hover:bg-sky-50 group-hover:text-sky-600'
                          }`}
                        >
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-semibold text-stone-800 sm:text-xs">
                            {node.label}
                          </div>
                          <div className="hidden truncate text-[10px] text-stone-500 sm:block">
                            {node.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 底部通俗场景说明条 */}
              <div className="mt-3.5 flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeNode || 'all'}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium leading-relaxed text-stone-700"
                  >
                    {activeNodeObj
                      ? activeNodeObj.routeText
                      : '所有手机、电脑与跨品牌音箱家电已自动连成一个整体，随时等待你的指令。'}
                  </motion.span>
                </AnimatePresence>
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  已连接
                </span>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
