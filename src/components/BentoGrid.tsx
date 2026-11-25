import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  ShieldCheck,
  Puzzle,
  Smartphone,
  Video,
  Gamepad2,
  Lock,
  WifiOff,
  Layers,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const desktopTriggers = [
  {
    id: 'cam',
    label: '摄像头开启',
    process: 'Zoom / Teams / FaceTime',
    actions: ['书房主灯 → 5000K 85%', 'HomePod → 自动静音', '门口灯带 → 勿扰红'],
    latency: '142 ms',
    icon: <Video className="h-3.5 w-3.5" />,
  },
  {
    id: 'game',
    label: '全屏游戏',
    process: 'Steam / Fullscreen DX12',
    actions: ['屏幕挂灯 → 4000K', '桌边氛围灯 → 极光靛蓝', '非紧急播报 → 挂起'],
    latency: '98 ms',
    icon: <Gamepad2 className="h-3.5 w-3.5" />,
  },
  {
    id: 'lock',
    label: '离开锁屏',
    process: 'macOS Lock / Win+L',
    actions: ['10分钟无人 → 关桌面灯', '桌面音箱 → 待机', '安防传感器 → 布防'],
    latency: '110 ms',
    icon: <Lock className="h-3.5 w-3.5" />,
  },
];

export const BentoGrid: React.FC = () => {
  const [activeHook, setActiveHook] = useState(0);
  const [lampLevel, setLampLevel] = useState(80);
  const [speakerIdx, setSpeakerIdx] = useState(0);

  const speakers = ['HomePod', '小米音箱 Pro', '华为 Sound X'];
  const currentHook = desktopTriggers[activeHook];

  return (
    <section id="features" className="relative z-10 overflow-hidden py-24 sm:py-32">
      {/* 工程蓝图参考线与双极光场 */}
      <div className="pointer-events-none absolute inset-0 bg-subtle-grid bg-grid-48 opacity-65 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_80%)]" />
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/[0.12] blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[360px] w-[360px] translate-x-1/2 rounded-full bg-sky-400/[0.09] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-indigo-300">
            <Layers className="h-3.5 w-3.5" />
            <span>Core Architecture</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            超越传统 App 的全屋神经中枢
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            传统智能家居只关心传感器，AuraHub 把你的主力生产力电脑与手机也纳入全屋状态机。以下组件均可直接点击体验。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* 卡片 1：可交互桌面状态触发器 (7列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-indigo-300">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[10px] text-indigo-300">
                    可点击切换钩子
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  电脑桌面状态深度联动
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  开会、启动全屏游戏、或离开锁屏——macOS 与 Windows 后台守护进程实时捕获系统状态，自动触发全屋设备协同。
                </p>
              </div>

              {/* 交互式桌面钩子面板 */}
              <div className="mt-6 rounded-xl border border-white/[0.09] bg-[#08080B]/95 p-4">
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                  <span>DESKTOP HOOK SIMULATOR</span>
                  <span className="text-emerald-400">LATENCY: {currentHook.latency}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {desktopTriggers.map((hook, idx) => {
                    const active = activeHook === idx;
                    return (
                      <button
                        key={hook.id}
                        type="button"
                        onClick={() => setActiveHook(idx)}
                        className={`rounded-lg border p-2.5 text-left transition-all ${
                          active
                            ? 'border-indigo-400/50 bg-indigo-500/15 shadow-[0_0_20px_rgba(129,140,248,0.16)]'
                            : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.18]'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-xs font-medium ${
                            active ? 'text-indigo-200' : 'text-zinc-300'
                          }`}
                        >
                          {hook.icon}
                          <span>{hook.label}</span>
                        </div>
                        <div className="mt-1 truncate font-mono text-[10px] text-zinc-500">
                          {hook.process}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 实时执行的动作链表 */}
                <div className="mt-3 flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
                  {currentHook.actions.map((act) => (
                    <span
                      key={act}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-200"
                    >
                      <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 卡片 2：本地优先 AI 雷达防泄漏面板 (5列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="md:col-span-5"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  本地优先 AI · 断网可用
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  语音指令与自动化规则引擎完全运行在局域网内。拔掉外网网线，全屋控制依然毫秒响应，隐私数据零出户。
                </p>
              </div>

              {/* 局域网声呐雷达扫描可视化 */}
              <div className="mt-6 rounded-xl border border-white/[0.09] bg-[#08080B]/95 p-4 font-mono">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <WifiOff className="h-3.5 w-3.5 text-rose-400" />
                    WAN 物理隔离模式
                  </span>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">
                    LAN ONLY
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  {/* 动态旋转声呐雷达 */}
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
                    <div className="absolute inset-3 rounded-full border border-emerald-500/30" />
                    <div className="absolute inset-6 rounded-full border border-emerald-500/40" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'conic-gradient(from 0deg, rgba(52,211,153,0.4), transparent 65deg)',
                      }}
                    />
                    {/* 局域网内部在线节点闪烁 */}
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.2, 0.85] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute left-5 top-5 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                    />
                    {/* 外网边缘被拦截数据包警示点 */}
                    <motion.span
                      animate={{ opacity: [0.2, 0.95, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}
                      className="absolute right-1.5 bottom-4 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.9)]"
                    />
                    <div className="relative z-10 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  </div>

                  <div className="flex-1 space-y-2 text-right">
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
                      <div className="text-base font-bold text-zinc-100">0 B</div>
                      <div className="text-[10px] text-zinc-500">外网云端上传</div>
                    </div>
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
                      <div className="text-base font-bold text-indigo-300">1.8 ms</div>
                      <div className="text-[10px] text-zinc-500">本地 NPU 响应</div>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 卡片 3：Matter + Home Assistant 开源插件生态 (5列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="md:col-span-5"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-sky-300">
                  <Puzzle className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  Matter + HA 开源插件生态
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  原生兼容 Matter 1.3，并通过社区插件无缝接入 Home Assistant、米家、HomeKit 与华为 HiLink 设备。
                </p>
              </div>

              <div className="mt-6 space-y-2.5 rounded-xl border border-white/[0.09] bg-[#08080B]/95 p-4 font-mono text-[11px]">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Matter 1.3', dot: 'bg-indigo-400' },
                    { name: 'AirPlay 2', dot: 'bg-sky-400' },
                    { name: 'MIoT', dot: 'bg-amber-400' },
                    { name: 'HiLink', dot: 'bg-rose-400' },
                    { name: 'MQTT', dot: 'bg-emerald-400' },
                    { name: 'HomeKit', dot: 'bg-zinc-300' },
                  ].map((proto) => (
                    <span
                      key={proto.name}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-zinc-200 transition hover:border-white/[0.2]"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${proto.dot}`} />
                      {proto.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[10px] text-zinc-500">
                  <span>Unified Device Graph</span>
                  <span className="text-sky-300">2,400+ 开源社区驱动</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 卡片 4：可互动极速跨端客户端预览 (7列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="md:col-span-7"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[10px] text-sky-300">
                    可交互迷你控制台
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  极速跨端客户端 · 菜单栏即点即控
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  告别臃肿的手机 App 列表翻找。macOS 菜单栏、Windows 托盘与 iOS/Android 小组件共享同一套毫秒级同步状态。
                </p>
              </div>

              {/* 可操作微型多端控制面板 */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {/* 桌面菜单栏悬浮窗：带可拖动滑块 */}
                <div className="rounded-xl border border-white/[0.09] bg-[#08080B]/95 p-3.5">
                  <div className="mb-2.5 flex items-center justify-between border-b border-white/[0.06] pb-1.5 font-mono text-[10px] text-zinc-400">
                    <span>macOS Menu Bar</span>
                    <span>⌘ + ⇧ + A</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="rounded-lg bg-white/[0.04] p-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-200">书房主灯亮度</span>
                        <span className="font-mono text-[11px] text-indigo-300">
                          {lampLevel}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={lampLevel}
                        onChange={(e) => setLampLevel(Number(e.target.value))}
                        aria-label="调整书房主灯亮度"
                        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-indigo-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpeakerIdx((prev) => (prev + 1) % speakers.length)}
                      className="flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 text-xs transition hover:border-sky-400/40"
                    >
                      <span className="text-zinc-400">切换音频输出</span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-sky-300">
                        <Volume2 className="h-3 w-3" /> {speakers[speakerIdx]}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 移动端小组件同步反馈卡片 */}
                <div className="flex flex-col justify-between rounded-xl border border-white/[0.09] bg-[#08080B]/95 p-3.5">
                  <div className="mb-2 flex items-center justify-between border-b border-white/[0.06] pb-1.5 font-mono text-[10px] text-zinc-400">
                    <span>iOS / Android Sync</span>
                    <span className="text-emerald-400">● 实时镜像</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 p-2.5 text-center">
                      <div className="text-[11px] font-medium text-zinc-100">当前亮度</div>
                      <div className="mt-0.5 font-mono text-xs text-indigo-300">
                        {lampLevel}%
                      </div>
                    </div>
                    <div className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-2.5 text-center">
                      <div className="text-[11px] font-medium text-zinc-100">活跃音箱</div>
                      <div className="mt-0.5 truncate font-mono text-[10px] text-sky-300">
                        {speakers[speakerIdx]}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 font-mono text-[10px] text-zinc-500">
                    WebSocket LAN Broadcast · &lt; 2ms
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
