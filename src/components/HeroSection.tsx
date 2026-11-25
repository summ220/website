import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Cpu,
  Laptop,
  Monitor,
  Smartphone,
  Speaker,
  Radio,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ScrambleText } from './ScrambleText';
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
    id: 'mac',
    label: 'macOS',
    sub: '状态钩子 · AirPlay',
    routeText: 'macOS Daemon (Camera/Focus) ──▶ AuraHub ──▶ 全屋照明 & 音箱',
    side: 'left',
    yPercent: 18,
    icon: <Laptop className="h-4 w-4" />,
  },
  {
    id: 'windows',
    label: 'Windows',
    sub: '无蓝牙局域网音频',
    routeText: 'Windows WASAPI 48kHz ──▶ AuraHub ──▶ HomePod / 小爱 (1.8ms)',
    side: 'left',
    yPercent: 39,
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: 'ios',
    label: 'iOS',
    sub: '捷径 · 地理围栏',
    routeText: 'iOS Geofence & Shortcuts ──▶ AuraHub ──▶ 回家自动唤醒场景',
    side: 'left',
    yPercent: 61,
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: 'android',
    label: 'Android',
    sub: '系统级音频转发',
    routeText: 'Android Audio Capture ──▶ AuraHub ──▶ AirPlay 2 / DLNA 音箱',
    side: 'left',
    yPercent: 82,
    icon: <Smartphone className="h-4 w-4" />,
  },
];

const rightNodes: NodeItem[] = [
  {
    id: 'homepod',
    label: 'HomePod',
    sub: 'AirPlay 2 桥接',
    routeText: '跨端无蓝牙音频 ──▶ AuraHub ──▶ HomePod AirPlay 2 组播',
    side: 'right',
    yPercent: 18,
    icon: <Speaker className="h-4 w-4" />,
  },
  {
    id: 'xiaomi',
    label: '小米音箱',
    sub: 'MIoT / DLNA',
    routeText: 'AI 语音语义指令 ──▶ AuraHub ──▶ 小米音箱 TTS & 媒体播放',
    side: 'right',
    yPercent: 39,
    icon: <Speaker className="h-4 w-4" />,
  },
  {
    id: 'huawei',
    label: '华为音箱',
    sub: 'HiLink / Cast+',
    routeText: '局域网广播流 ──▶ AuraHub ──▶ 华为 Sound HiLink 桥接',
    side: 'right',
    yPercent: 61,
    icon: <Speaker className="h-4 w-4" />,
  },
  {
    id: 'matter',
    label: 'Matter 设备',
    sub: '灯光 · 空调 · 窗帘',
    routeText: '桌面状态 & 本地 AI ──▶ AuraHub ──▶ Matter 1.3 灯光/空调',
    side: 'right',
    yPercent: 82,
    icon: <Radio className="h-4 w-4" />,
  },
];

const DOCKER_CMD = 'docker compose up -d aurahub';

export const HeroSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>('windows');

  const allNodes = [...leftNodes, ...rightNodes];
  const activeNodeObj = allNodes.find((n) => n.id === activeNode) || null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(DOCKER_CMD).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-10 overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* 顶部多层极光径向辉光 */}
      <div className="pointer-events-none absolute inset-0 aurora-radial" />
      {/* 3D 透视地板网格（向地平线延伸的科技空间感） */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[360px] overflow-hidden opacity-55 [mask-image:linear-gradient(to_top,black_15%,transparent_90%)]">
        <div className="perspective-grid h-full w-full" />
      </div>
      {/* 中心大光学透镜光环 */}
      <div className="pointer-events-none absolute right-[8%] top-[18%] h-[420px] w-[420px] rounded-full bg-indigo-500/[0.15] blur-[110px]" />
      <div className="pointer-events-none absolute inset-0 bg-subtle-grid bg-grid-48 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* 左侧核心文案与流光操作区 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-400/25 bg-indigo-500/[0.08] px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
              </span>
              <span className="font-mono text-xs text-indigo-200">
                <ScrambleText text="v0.9-alpha · LOCAL-FIRST AI HOME MESH" />
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              打破生态壁垒的
              <span className="mt-1 block bg-gradient-to-r from-white via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                开源 AI 全屋中枢
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              让 <span className="font-medium text-zinc-200">Mac / Windows / iOS / Android</span> 统一调度
              HomePod、小米与华为音箱及 Matter 设备。电脑桌面状态毫秒感知，本地 AI 大脑断网可用，隐私不出户。
            </p>

            {/* 双 CTA 按钮（主按钮带流光扫边） */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCopy}
                className="group relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/25 bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_35px_rgba(129,140,248,0.25)] transition-all hover:bg-white"
              >
                {/* 流光扫过效果 */}
                <span className="animate-shimmer pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <span className="relative z-10 flex items-center gap-2 font-mono text-xs sm:text-sm">
                  <span className="text-zinc-500">$</span>
                  {DOCKER_CMD}
                </span>
                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-md bg-zinc-950/10 text-zinc-800">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-105" />
                  )}
                </span>
              </button>

              <a
                href="#hardware-waitlist"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#111116]/80 px-5 py-3 text-sm font-medium text-zinc-200 backdrop-blur-md transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
              >
                <Cpu className="h-4 w-4 text-indigo-300 transition-transform group-hover:rotate-12" />
                <span>预约 ¥150 硬件盒子</span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-indigo-400" /> Mac mini / NAS 一键 Docker
              </span>
              <span>· 零云端上传</span>
              <span>· MIT / Apache-2.0</span>
            </div>
          </motion.div>

          {/* 右侧核心视觉：全息声学雷达 & 动态拓扑舱 (开启流光边框) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <SpotlightCard borderBeam className="bg-[#0B0B10]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.75)] sm:p-6">
              {/* 底部左右补齐角标 */}
              <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-1.5 w-1.5 border-b border-l border-white/20" />
              <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-1.5 w-1.5 border-b border-r border-white/20" />

              {/* 顶部微状态栏 */}
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                    AuraCore // Live Mesh HUD
                  </span>
                </div>
                <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-0.5 font-mono text-[10px] text-indigo-200">
                  点击节点实时测试链路
                </span>
              </div>

              {/* 交互拓扑画布 */}
              <div className="relative h-[350px] w-full select-none overflow-hidden rounded-xl border border-white/[0.05] bg-[#07070A]/80 px-2 sm:h-[390px]">
                {/* 中心雷达旋转刻度盘背景 */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {/* 外圈慢转刻度盘 */}
                  <motion.svg
                    width="280"
                    height="280"
                    viewBox="0 0 280 280"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="opacity-35"
                  >
                    <circle
                      cx="140"
                      cy="140"
                      r="128"
                      fill="none"
                      stroke="rgba(129,140,248,0.28)"
                      strokeWidth="1"
                      strokeDasharray="3 8"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="96"
                      fill="none"
                      stroke="rgba(125,211,252,0.22)"
                      strokeWidth="1"
                      strokeDasharray="16 10 2 10"
                    />
                  </motion.svg>
                  {/* 内圈反向旋转精密罗盘刻度 */}
                  <motion.svg
                    width="220"
                    height="220"
                    viewBox="0 0 220 220"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-45"
                  >
                    <circle
                      cx="110"
                      cy="110"
                      r="74"
                      fill="none"
                      stroke="rgba(165,180,252,0.35)"
                      strokeWidth="1.2"
                      strokeDasharray="2 12"
                    />
                  </motion.svg>
                  {/* 声波脉冲外扩环 */}
                  <motion.div
                    animate={{ scale: [0.7, 1.55], opacity: [0.45, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/30"
                  />
                </div>

                {/* SVG 动态双层光纤脉冲连线 */}
                <svg
                  viewBox="0 0 600 390"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="pulseGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(148,163,184,0.1)" />
                      <stop offset="50%" stopColor="rgba(129,140,248,0.95)" />
                      <stop offset="100%" stopColor="rgba(125,211,252,1)" />
                    </linearGradient>
                    <linearGradient id="pulseGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(125,211,252,1)" />
                      <stop offset="50%" stopColor="rgba(129,140,248,0.95)" />
                      <stop offset="100%" stopColor="rgba(148,163,184,0.1)" />
                    </linearGradient>
                  </defs>

                  {leftNodes.map((node, idx) => {
                    const startY = (node.yPercent / 100) * 390;
                    const d = `M 145 ${startY} C 225 ${startY}, 230 195, 290 195`;
                    const isHighlighted = activeNode === node.id || activeNode === null;
                    return (
                      <g key={node.id}>
                        <path
                          d={d}
                          fill="none"
                          stroke={isHighlighted ? 'rgba(129,140,248,0.32)' : 'rgba(255,255,255,0.06)'}
                          strokeWidth={isHighlighted ? 2 : 1}
                        />
                        {isHighlighted && (
                          <>
                            <motion.path
                              d={d}
                              fill="none"
                              stroke="url(#pulseGradLeft)"
                              strokeWidth="2.6"
                              strokeDasharray="22 115"
                              initial={{ strokeDashoffset: 137 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{
                                duration: 1.85,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: idx * 0.3,
                              }}
                            />
                            {/* 沿曲线高速飞行的能量数据包光球 */}
                            <circle r="3.2" fill="#A5B4FC">
                              <animateMotion
                                dur="1.85s"
                                repeatCount="indefinite"
                                begin={`${idx * 0.3}s`}
                                path={d}
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    );
                  })}

                  {rightNodes.map((node, idx) => {
                    const endY = (node.yPercent / 100) * 390;
                    const d = `M 310 195 C 370 195, 375 ${endY}, 455 ${endY}`;
                    const isHighlighted = activeNode === node.id || activeNode === null;
                    return (
                      <g key={node.id}>
                        <path
                          d={d}
                          fill="none"
                          stroke={isHighlighted ? 'rgba(125,211,252,0.32)' : 'rgba(255,255,255,0.06)'}
                          strokeWidth={isHighlighted ? 2 : 1}
                        />
                        {isHighlighted && (
                          <>
                            <motion.path
                              d={d}
                              fill="none"
                              stroke="url(#pulseGradRight)"
                              strokeWidth="2.6"
                              strokeDasharray="22 115"
                              initial={{ strokeDashoffset: 137 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{
                                duration: 1.85,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: idx * 0.3 + 0.45,
                              }}
                            />
                            {/* 沿曲线飞向目标音箱/设备的能量光球 */}
                            <circle r="3.2" fill="#7DD3FC">
                              <animateMotion
                                dur="1.85s"
                                repeatCount="indefinite"
                                begin={`${idx * 0.3 + 0.45}s`}
                                path={d}
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* 左侧：输入终端节点 */}
                <div className="absolute inset-y-0 left-2 flex w-[33%] flex-col justify-between py-3.5 sm:w-[29%]">
                  {leftNodes.map((node) => {
                    const isActive = activeNode === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveNode(isActive ? null : node.id)}
                        className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all sm:gap-2.5 sm:px-3 ${
                          isActive
                            ? 'border-indigo-400/60 bg-indigo-500/15 shadow-[0_0_24px_rgba(129,140,248,0.24)]'
                            : 'border-white/[0.08] bg-[#121218]/90 hover:border-white/[0.2]'
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                            isActive
                              ? 'border-indigo-400/50 bg-indigo-400/20 text-indigo-200'
                              : 'border-white/[0.08] bg-white/[0.03] text-zinc-400'
                          }`}
                        >
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-medium text-zinc-100">
                            {node.label}
                          </div>
                          <div className="hidden truncate font-mono text-[10px] text-zinc-500 sm:block">
                            {node.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 中心：金属玻璃核心芯片节点 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.button
                    type="button"
                    onClick={() => setActiveNode(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-indigo-400/50 bg-gradient-to-b from-[#1A1C2C] to-[#0D0E15] shadow-[0_0_60px_rgba(129,140,248,0.35)] sm:h-28 sm:w-28"
                  >
                    <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/80 to-transparent" />
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-400/40 shadow-[0_0_20px_rgba(129,140,248,0.4)]">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <span className="mt-1.5 text-xs font-semibold tracking-tight text-white">
                      AuraHub
                    </span>
                    <span className="font-mono text-[9px] text-sky-300/90">
                      NPU · CORE
                    </span>
                  </motion.button>
                </div>

                {/* 右侧：跨品牌音频与智能设备 */}
                <div className="absolute inset-y-0 right-2 flex w-[33%] flex-col justify-between py-3.5 sm:w-[29%]">
                  {rightNodes.map((node) => {
                    const isActive = activeNode === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveNode(isActive ? null : node.id)}
                        className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all sm:gap-2.5 sm:px-3 ${
                          isActive
                            ? 'border-sky-400/60 bg-sky-500/15 shadow-[0_0_24px_rgba(125,211,252,0.22)]'
                            : 'border-white/[0.08] bg-[#121218]/90 hover:border-white/[0.2]'
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                            isActive
                              ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
                              : 'border-white/[0.08] bg-white/[0.03] text-zinc-400'
                          }`}
                        >
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-medium text-zinc-100">
                            {node.label}
                          </div>
                          <div className="hidden truncate font-mono text-[10px] text-zinc-500 sm:block">
                            {node.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 底部实时路由流向状态条 */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 font-mono text-[11px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeNode || 'all'}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="truncate text-zinc-300"
                  >
                    {activeNodeObj
                      ? activeNodeObj.routeText
                      : '全屋全双工调度中 · 局域网延迟 1.8ms · 0 Byte 上传云端'}
                  </motion.span>
                </AnimatePresence>
                <span className="ml-3 shrink-0 flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MESH LIVE
                </span>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
