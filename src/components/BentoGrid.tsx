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
  Sparkles,
  Volume2,
  CheckCircle2,
  CloudOff,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const desktopTriggers = [
  {
    id: 'cam',
    label: '打开视频会议',
    process: '微信通话 / 腾讯会议 / Zoom',
    actions: ['书房台灯 → 自动提亮补光', '客厅音箱 → 立刻静音', '门口灯带 → 亮起勿扰提醒'],
    tip: '不用手忙脚乱找遥控器',
    icon: <Video className="h-4 w-4" />,
  },
  {
    id: 'game',
    label: '晚上打游戏时',
    process: '电脑进入全屏游戏',
    actions: ['头顶主灯 → 调暗防屏幕反光', '氛围灯 → 柔和微光', '非紧急播报 → 暂不打扰'],
    tip: '一秒进入沉浸娱乐氛围',
    icon: <Gamepad2 className="h-4 w-4" />,
  },
  {
    id: 'lock',
    label: '起身离开电脑',
    process: '电脑锁屏或人离开座位',
    actions: ['10 分钟无人 → 自动关灯', '桌面音箱 → 进入待机', '省电又省心'],
    tip: '再也不怕忘记关书房灯',
    icon: <Lock className="h-4 w-4" />,
  },
];

export const BentoGrid: React.FC = () => {
  const [activeHook, setActiveHook] = useState(0);
  const [lampLevel, setLampLevel] = useState(80);
  const [speakerIdx, setSpeakerIdx] = useState(0);

  const speakers = ['苹果 HomePod', '小米音箱 Pro', '华为 Sound X'];
  const currentHook = desktopTriggers[activeHook];

  return (
    <section id="features" className="relative z-10 overflow-hidden py-24 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200/80">
            <Sparkles className="h-3.5 w-3.5" />
            <span>顺手又聪明的实用功能</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            不止能远程点开关，它更懂你的生活节奏
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            传统智能家居只认定时和感应器，AuraHub 把你每天用得最多的电脑和手机也算进来。下面的功能都能直接点开试玩。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* 卡片 1：电脑一有动作，房间自动配合 (7列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    点一下切换场景试试
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  电脑一有动作，房间自动配合
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                  不管你用的是 Mac 还是 Windows 电脑，开会、打游戏或离开锁屏时，房间灯光和音箱都会默契联动。
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-4">
                <div className="mb-3 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium">选择一个常见桌面场景：</span>
                  <span className="font-semibold text-emerald-700">{currentHook.tip}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {desktopTriggers.map((hook, idx) => {
                    const active = activeHook === idx;
                    return (
                      <button
                        key={hook.id}
                        type="button"
                        onClick={() => setActiveHook(idx)}
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          active
                            ? 'border-indigo-400 bg-white shadow-md ring-1 ring-indigo-200'
                            : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold ${
                            active ? 'text-indigo-700' : 'text-stone-800'
                          }`}
                        >
                          {hook.icon}
                          <span>{hook.label}</span>
                        </div>
                        <div className="mt-1 truncate text-[11px] text-stone-500">
                          {hook.process}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 自动执行结果列表 */}
                <div className="mt-3.5 flex flex-wrap gap-2 border-t border-stone-200/80 pt-3.5">
                  {currentHook.actions.map((act) => (
                    <span
                      key={act}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200/70"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 卡片 2：断网照样能用，对话不上传云端 (5列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="md:col-span-5"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  断网也能用，对话从不传上网
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                  语音识别与智能判断就在家里本地运行。就算外网宽带突然断了，家里控制依然流畅响应，家庭隐私永远不上传云端。
                </p>
              </div>

              <div className="mt-6 space-y-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-4">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <WifiOff className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">本地独立运行</div>
                      <div className="text-[11px] text-stone-500">拔掉外网网线也能控制家电</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    已就绪
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <CloudOff className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">隐私数据 0 上传</div>
                      <div className="text-[11px] text-stone-500">语音与居家习惯只留在家中</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                    更放心
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 卡片 3：不用换掉老家电 (5列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="md:col-span-5"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Puzzle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  不用换掉旧家电，各品牌都能连
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                  不管是几年前买的小米台灯，还是苹果 HomePod、华为音箱，只要连在同一个家里 Wi-Fi 下，AuraHub 都能自动找到它们。
                </p>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: '苹果 HomePod / 家庭', dot: 'bg-indigo-500' },
                    { name: '小米 / 米家', dot: 'bg-amber-500' },
                    { name: '华为音箱 / 智选', dot: 'bg-rose-500' },
                    { name: '空调 / 窗帘 / 灯具', dot: 'bg-emerald-500' },
                    { name: 'Windows / Mac 电脑', dot: 'bg-sky-500' },
                    { name: 'Matter 通用设备', dot: 'bg-violet-500' },
                  ].map((brand) => (
                    <span
                      key={brand.name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200/70"
                    >
                      <span className={`h-2 w-2 rounded-full ${brand.dot}`} />
                      {brand.name}
                    </span>
                  ))}
                </div>
                <div className="border-t border-stone-200/80 pt-2.5 text-[11px] font-medium text-stone-500">
                  开源社区持续适配中，已支持超过 2,400 种常见智能家居型号
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 卡片 4：可互动极速跨端小面板 (7列) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="md:col-span-7"
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                    拉动滑块体验同步
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  电脑右上角、手机桌面，抬手就能调
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                  不用解锁手机再一层层打开 App。电脑菜单栏、手机桌面小组件共享同一个面板，改一个地方，全家人设备马上同步。
                </p>
              </div>

              <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {/* 电脑端控制小卡片 */}
                <div className="rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-stone-200/80 pb-2 text-xs font-semibold text-stone-700">
                    <span>电脑桌面悬浮小窗</span>
                    <span className="text-[11px] font-normal text-stone-400">即点即调</span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-stone-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-stone-800">书房主灯亮度</span>
                        <span className="font-bold text-indigo-600">
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
                        className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-indigo-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpeakerIdx((prev) => (prev + 1) % speakers.length)}
                      className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-medium shadow-sm transition hover:border-indigo-300"
                    >
                      <span className="text-stone-600">点击换音箱放歌</span>
                      <span className="flex items-center gap-1 font-semibold text-indigo-700">
                        <Volume2 className="h-3.5 w-3.5" /> {speakers[speakerIdx]}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 手机小组件同步反馈卡片 */}
                <div className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-4">
                  <div className="mb-2 flex items-center justify-between border-b border-stone-200/80 pb-2 text-xs font-semibold text-stone-700">
                    <span>手机桌面小组件</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      实时同步
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-indigo-100">
                      <div className="text-[11px] text-stone-500">当前灯光</div>
                      <div className="mt-1 text-lg font-bold text-indigo-600">
                        {lampLevel}%
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-sky-100">
                      <div className="text-[11px] text-stone-500">正在使用音箱</div>
                      <div className="mt-1.5 truncate text-xs font-bold text-sky-700">
                        {speakers[speakerIdx]}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-stone-500">
                    在左边拖动滑块或换音箱，这里立刻同步变化
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
