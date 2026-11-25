import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  ShieldAlert,
  Play,
  RotateCcw,
  Radio,
  Laptop,
  Smartphone,
  Speaker,
  CheckCircle2,
  Loader2,
  Terminal,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

type TabKey = 'meeting' | 'audio' | 'ai';

interface AiPromptPreset {
  id: string;
  text: string;
  intent: string;
  logs: { time: string; action: string; device: string }[];
}

const aiPresets: AiPromptPreset[] = [
  {
    id: 'nap',
    text: '“我有点困了，想眯半小时”',
    intent: 'scene.power_nap(duration=30m, wake_audio="soft_ambient")',
    logs: [
      { time: '00:00.12', action: '主卧纱帘与遮光帘缓缓闭合', device: 'Matter 窗帘电机' },
      { time: '00:00.28', action: '空调切换至 26°C 静音睡眠风', device: '客厅/卧室空调' },
      { time: '00:00.41', action: '全屋音箱设为免打扰，仅保留闹钟通道', device: 'HomePod + 小爱' },
      { time: '00:00.55', action: '已预约 30 分钟后轻音乐渐强唤醒', device: 'AuraHub Timer' },
    ],
  },
  {
    id: 'gaming',
    text: '“我要开始打游戏了”',
    intent: 'scene.gaming_focus(ambient="cool_indigo", audio="pc_passthrough")',
    logs: [
      { time: '00:00.09', action: '桌面主灯调暗至 20%，开启屏幕挂灯', device: '书房照明组' },
      { time: '00:00.22', action: 'Windows 游戏音频直通桌面声卡，关闭客厅播报', device: 'Audio Matrix' },
      { time: '00:00.38', action: '氛围灯带切换为低饱和冷靛蓝防眩光模式', device: 'RGBIC 灯带' },
    ],
  },
  {
    id: 'away',
    text: '“出门了，顺便让客厅扫个地”',
    intent: 'scene.away_mode(vacuum=true, power_save=true)',
    logs: [
      { time: '00:00.14', action: '关闭全屋非必要照明与待机插座', device: 'Matter 开关组' },
      { time: '00:00.31', action: '启动客厅扫拖机器人执行标准清扫', device: '米家扫地机' },
      { time: '00:00.46', action: '玄关门锁布防，异常震动推送至 iOS', device: 'AuraHub Security' },
    ],
  },
];

const audioSources = [
  { id: 'windows', label: 'Windows 11', sub: 'WASAPI 无损捕获', icon: <Laptop className="h-4 w-4" /> },
  { id: 'android', label: 'Android 15', sub: '系统级内录转发', icon: <Smartphone className="h-4 w-4" /> },
];

const audioTargets = [
  { id: 'homepod', label: 'HomePod', protocol: 'AirPlay 2 Bridge', latency: '14ms' },
  { id: 'xiaomi', label: '小米音箱 Pro', protocol: 'MIoT / DLNA', latency: '19ms' },
  { id: 'huawei', label: '华为 Sound X', protocol: 'HiLink / Cast+', latency: '17ms' },
];

export const InteractiveSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('meeting');

  // 场景 A：视频会议状态
  const [meetingStep, setMeetingStep] = useState<number>(4);
  const [meetingRunning, setMeetingRunning] = useState<boolean>(false);

  // 场景 B：无蓝牙跨端播报状态
  const [selectedSource, setSelectedSource] = useState<string>('windows');
  const [selectedTarget, setSelectedTarget] = useState<string>('homepod');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  // 场景 C：AI 一句话控全屋状态
  const [selectedPreset, setSelectedPreset] = useState<AiPromptPreset>(aiPresets[0]);
  const [typedText, setTypedText] = useState<string>(aiPresets[0].text);
  const [visibleLogs, setVisibleLogs] = useState<number>(aiPresets[0].logs.length);

  // 触发场景 A 动画序列
  const triggerMeetingFlow = () => {
    setMeetingRunning(true);
    setMeetingStep(0);
  };

  useEffect(() => {
    if (!meetingRunning) return;
    if (meetingStep >= 4) {
      setMeetingRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      setMeetingStep((prev) => prev + 1);
    }, 550);
    return () => clearTimeout(timer);
  }, [meetingRunning, meetingStep]);

  // 触发场景 C 逐字解析与日志点亮
  const runAiPreset = (preset: AiPromptPreset) => {
    setSelectedPreset(preset);
    setTypedText('');
    setVisibleLogs(0);
  };

  useEffect(() => {
    if (activeTab !== 'ai') return;
    if (typedText.length < selectedPreset.text.length) {
      const t = setTimeout(() => {
        setTypedText(selectedPreset.text.slice(0, typedText.length + 1));
      }, 32);
      return () => clearTimeout(t);
    }
    if (visibleLogs < selectedPreset.logs.length) {
      const t = setTimeout(() => {
        setVisibleLogs((prev) => prev + 1);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [activeTab, typedText, visibleLogs, selectedPreset]);

  const currentTargetObj =
    audioTargets.find((t) => t.id === selectedTarget) || audioTargets[0];
  const currentSourceObj =
    audioSources.find((s) => s.id === selectedSource) || audioSources[0];

  const meetingSteps = [
    { title: '检测到电脑摄像头开启', detail: 'macOS / Windows Hook · Zoom.us 进程激活' },
    { title: '书房灯切为 5000K 补光', detail: 'Matter Light · 亮度 85% / 显色 Ra97' },
    { title: 'HomePod 自动静音', detail: 'AirPlay 状态挂起 · 防止播报打断发言' },
    { title: '门口氛围灯变红', detail: 'RGB 灯带 · 门外“会议勿扰”状态生效' },
  ];

  return (
    <section id="sandbox" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 区块标题 */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-indigo-300">
              <Terminal className="h-3.5 w-3.5" />
              <span>Interactive Sandbox</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              在浏览器里，提前体验全屋调度
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            点击下方三个真实高频场景，实时查看 AuraHub 如何打通桌面状态、跨品牌音箱与本地 AI 大脑。
          </p>
        </div>

        {/* 控制台外框 */}
        <SpotlightCard className="p-4 sm:p-6">
          {/* 模拟窗口顶栏 + 场景切换 Tab */}
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="ml-2 font-mono text-xs text-zinc-500">
                aurahub-console — local://192.168.1.10:8123
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.08] bg-[#09090B]/90 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('meeting')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === 'meeting'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>场景 A：进入视频会议</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audio')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === 'audio'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>场景 B：无蓝牙跨端播报</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === 'ai'
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>场景 C：AI 一句话控全屋</span>
              </button>
            </div>
          </div>

          {/* 控制台内容区 */}
          <div className="pt-6">
            <AnimatePresence mode="wait">
              {/* 场景 A：进入视频会议 */}
              {activeTab === 'meeting' && (
                <motion.div
                  key="meeting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 lg:grid-cols-12"
                >
                  {/* 左侧：事件流触发 */}
                  <div className="flex flex-col justify-between lg:col-span-7">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-zinc-100">
                            桌面摄像头状态联动
                          </h3>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            无需手动按开关，系统级进程钩子在 150ms 内完成全屋协同
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={triggerMeetingFlow}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/25"
                        >
                          {meetingRunning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="h-3.5 w-3.5" />
                          )}
                          <span>{meetingRunning ? '执行中...' : '重新模拟入会'}</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {meetingSteps.map((step, index) => {
                          const done = meetingStep > index;
                          const active = meetingStep === index && meetingRunning;
                          return (
                            <div
                              key={step.title}
                              className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-300 ${
                                done
                                  ? 'border-indigo-400/30 bg-indigo-500/[0.07]'
                                  : active
                                  ? 'border-white/20 bg-white/[0.04]'
                                  : 'border-white/[0.06] bg-white/[0.015] opacity-45'
                              }`}
                            >
                              <div className="mt-0.5">
                                {done ? (
                                  <CheckCircle2 className="h-4 w-4 text-indigo-300" />
                                ) : active ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-zinc-300" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-zinc-700" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-zinc-100">
                                    {step.title}
                                  </span>
                                  <span className="font-mono text-[10px] text-zinc-500">
                                    STEP 0{index + 1}
                                  </span>
                                </div>
                                <p className="mt-0.5 font-mono text-xs text-zinc-400">
                                  {step.detail}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 右侧：实时房间设备状态面板 */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#09090B]/90 p-4 lg:col-span-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs text-zinc-400">
                        ROOM TELEMETRY · 书房
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          meetingStep >= 1
                            ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {meetingStep >= 1 ? 'ON AIR · 会议中' : 'IDLE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* 书房主灯 */}
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between text-zinc-400">
                          <Sun className="h-4 w-4 text-sky-200" />
                          <span className="font-mono text-[10px]">Matter</span>
                        </div>
                        <div className="mt-3 text-xs text-zinc-400">书房补光灯</div>
                        <div className="mt-0.5 font-mono text-sm font-semibold text-zinc-100">
                          {meetingStep >= 2 ? '5000K · 85%' : '3200K · 40%'}
                        </div>
                      </div>

                      {/* HomePod */}
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between text-zinc-400">
                          {meetingStep >= 3 ? (
                            <VolumeX className="h-4 w-4 text-amber-300" />
                          ) : (
                            <Volume2 className="h-4 w-4 text-zinc-300" />
                          )}
                          <span className="font-mono text-[10px]">AirPlay 2</span>
                        </div>
                        <div className="mt-3 text-xs text-zinc-400">HomePod mini</div>
                        <div className="mt-0.5 font-mono text-sm font-semibold text-zinc-100">
                          {meetingStep >= 3 ? 'Muted (静音)' : 'Standby'}
                        </div>
                      </div>

                      {/* 门口氛围灯 */}
                      <div className="col-span-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldAlert
                              className={`h-4 w-4 ${
                                meetingStep >= 4 ? 'text-rose-400' : 'text-zinc-500'
                              }`}
                            />
                            <span className="text-xs font-medium text-zinc-200">
                              门口勿扰氛围灯带
                            </span>
                          </div>
                          <span
                            className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                              meetingStep >= 4
                                ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]'
                                : 'bg-zinc-700'
                            }`}
                          />
                        </div>
                        <p className="mt-2 font-mono text-[11px] text-zinc-400">
                          {meetingStep >= 4
                            ? '状态：#F43F5E 呼吸常亮 — 提示家人请勿推门'
                            : '状态：待机微光'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 场景 B：无蓝牙跨端播报 */}
              {activeTab === 'audio' && (
                <motion.div
                  key="audio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 lg:grid-cols-12"
                >
                  {/* 左侧：源与目标选择器 */}
                  <div className="space-y-4 lg:col-span-5">
                    <div>
                      <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        1. 选择音频输入源（无蓝牙直连）
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {audioSources.map((src) => {
                          const active = selectedSource === src.id;
                          return (
                            <button
                              key={src.id}
                              type="button"
                              onClick={() => setSelectedSource(src.id)}
                              className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                                active
                                  ? 'border-indigo-400/50 bg-indigo-500/10'
                                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                              }`}
                            >
                              <div className="flex items-center gap-2 text-zinc-100">
                                {src.icon}
                                <span className="text-xs font-semibold">{src.label}</span>
                              </div>
                              <span className="mt-1 font-mono text-[10px] text-zinc-400">
                                {src.sub}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                        2. 选择目标音箱（跨品牌协议桥接）
                      </div>
                      <div className="space-y-2">
                        {audioTargets.map((tgt) => {
                          const active = selectedTarget === tgt.id;
                          return (
                            <button
                              key={tgt.id}
                              type="button"
                              onClick={() => setSelectedTarget(tgt.id)}
                              className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                                active
                                  ? 'border-sky-400/50 bg-sky-500/10'
                                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Speaker
                                  className={`h-4 w-4 ${
                                    active ? 'text-sky-300' : 'text-zinc-500'
                                  }`}
                                />
                                <div>
                                  <div className="text-xs font-semibold text-zinc-100">
                                    {tgt.label}
                                  </div>
                                  <div className="font-mono text-[10px] text-zinc-400">
                                    {tgt.protocol}
                                  </div>
                                </div>
                              </div>
                              <span className="font-mono text-[11px] text-zinc-400">
                                {tgt.latency}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 右侧：实时路由高亮与声波可视化 */}
                  <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#09090B]/90 p-5 lg:col-span-7">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-zinc-400">
                        AUDIO ROUTING MATRIX
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsStreaming((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs text-zinc-200 hover:bg-white/[0.08]"
                      >
                        <Play className="h-3 w-3" />
                        <span>{isStreaming ? '暂停推流' : '恢复推流'}</span>
                      </button>
                    </div>

                    {/* 路由路径图 */}
                    <div className="my-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <div className="w-full rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-2.5 text-center sm:w-auto">
                        <div className="text-xs font-semibold text-zinc-100">
                          {currentSourceObj.label}
                        </div>
                        <div className="font-mono text-[10px] text-indigo-300">
                          PCM 48kHz / 24bit
                        </div>
                      </div>

                      <div className="hidden h-px flex-1 bg-gradient-to-r from-indigo-400/60 to-sky-400/60 sm:block" />

                      <div className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-center">
                        <div className="font-mono text-[11px] font-medium text-zinc-200">
                          AuraHub Core
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400">
                          LAN Bridge
                        </div>
                      </div>

                      <div className="hidden h-px flex-1 bg-gradient-to-r from-sky-400/60 to-sky-300/80 sm:block" />

                      <div className="w-full rounded-xl border border-sky-400/30 bg-sky-500/10 px-3.5 py-2.5 text-center sm:w-auto">
                        <div className="text-xs font-semibold text-zinc-100">
                          {currentTargetObj.label}
                        </div>
                        <div className="font-mono text-[10px] text-sky-300">
                          {currentTargetObj.protocol}
                        </div>
                      </div>
                    </div>

                    {/* 声波微动效 */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-sky-300" />
                          实时无损局域网声波流
                        </span>
                        <span>延迟 {currentTargetObj.latency} · 0 丢包</span>
                      </div>
                      <div className="flex h-14 items-end justify-between gap-1 px-1">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-full rounded-full bg-gradient-to-t from-indigo-500/60 to-sky-300/90"
                            animate={
                              isStreaming
                                ? {
                                    height: [
                                      `${18 + ((i * 17) % 35)}%`,
                                      `${35 + ((i * 29) % 62)}%`,
                                      `${15 + ((i * 11) % 30)}%`,
                                    ],
                                  }
                                : { height: '12%' }
                            }
                            transition={{
                              duration: 0.7 + (i % 5) * 0.14,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 场景 C：AI 一句话控全屋 */}
              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 lg:grid-cols-12"
                >
                  {/* 左侧：预设语音气泡 */}
                  <div className="space-y-3 lg:col-span-5">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                      点击语音指令气泡，测试本地 AI 模糊意图理解
                    </div>
                    <div className="space-y-2.5">
                      {aiPresets.map((preset) => {
                        const active = selectedPreset.id === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => runAiPreset(preset)}
                            className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                              active
                                ? 'border-indigo-400/50 bg-indigo-500/10 shadow-[0_0_24px_rgba(129,140,248,0.14)]'
                                : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]'
                            }`}
                          >
                            <div className="text-sm font-medium text-zinc-100">
                              {preset.text}
                            </div>
                            <div className="mt-1.5 font-mono text-[10px] text-zinc-400">
                              → {preset.intent}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 右侧：逐字解析与执行日志 */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#09090B]/90 p-4 font-mono lg:col-span-7">
                    <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-xs text-zinc-400">
                      <span>LOCAL LLM · Qwen-2.5-3B-Int4 (Offline)</span>
                      <span className="text-emerald-400">● 断网可用</span>
                    </div>

                    <div className="mb-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                      <div className="text-zinc-500">USER_VOICE_INPUT:</div>
                      <div className="mt-1 text-sm text-indigo-200">
                        {typedText}
                        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-indigo-400 align-middle" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedPreset.logs.map((log, idx) => {
                        const shown = idx < visibleLogs;
                        return (
                          <motion.div
                            key={log.action}
                            initial={false}
                            animate={{ opacity: shown ? 1 : 0.18, x: shown ? 0 : -4 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-start justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2 text-xs"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-zinc-500">[{log.time}]</span>
                              <span className={shown ? 'text-zinc-100' : 'text-zinc-600'}>
                                {log.action}
                              </span>
                            </div>
                            <span className="shrink-0 rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-zinc-400">
                              {log.device}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
