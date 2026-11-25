import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Speaker,
  WifiOff,
  Check,
  X,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';

const painComparisons = [
  {
    title: '再也不用满手机翻找 App',
    icon: <Smartphone className="h-5 w-5 text-indigo-600" />,
    before: '开灯要打开米家，调音箱要进苹果家庭，开关空调还得找半天遥控器。',
    after: '手机桌面或电脑右上角点一下，或者说一句话，不同品牌一起听你的。',
  },
  {
    title: '电脑和音箱不再“各过各的”',
    icon: <Speaker className="h-5 w-5 text-sky-600" />,
    before: 'Windows 电脑连不上 HomePod 放歌；开视频会议时音箱还在大声播报。',
    after: 'Windows / 安卓无线投音到 HomePod；电脑一开会，全屋音箱自动静音。',
  },
  {
    title: '不怕断网，对话不上传云端',
    icon: <WifiOff className="h-5 w-5 text-emerald-600" />,
    before: '很多智能设备一断宽带就彻底失灵，平时语音记录还要传到厂家服务器。',
    after: '思考和指令都在自家小盒子里完成，断了网照样秒响应，家里对话绝不出门。',
  },
];

const summaryStats = [
  {
    value: '秒级响应',
    label: '局域网直连，点完就亮',
    sub: '不用等云端服务器转一圈',
    icon: <Zap className="h-4 w-4 text-amber-600" />,
  },
  {
    value: '0 隐私上传',
    label: '断网也能正常说话控制',
    sub: '语音记录只留在家中本地',
    icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
  },
  {
    value: '4 大系统',
    label: '手机电脑全都能控制家里',
    sub: 'Windows · Mac · iPhone · 安卓',
    icon: <Layers className="h-4 w-4 text-indigo-600" />,
  },
  {
    value: '约 ¥150',
    label: '插电即用的可选小盒子',
    sub: '软件版还支持免费装在电脑上',
    icon: <Cpu className="h-4 w-4 text-sky-600" />,
  },
];

const brandsRow1 = [
  'Apple HomePod',
  '小米 / 米家全系',
  '华为 Sound 音箱',
  'Windows 10 / 11 电脑',
  'MacBook / Mac mini',
  'iPhone / iPad',
  '安卓手机 / 平板',
  'Matter 通用家电',
];

const brandsRow2 = [
  '智能吸顶灯 & 桌面台灯',
  '客厅挂机 & 中央空调',
  '自动窗帘电机',
  '全屋多音箱同步放歌',
  '无线开关 & 门窗感应',
  '腾讯会议 / Zoom 联动',
  '离家自动关灯省电',
  '开源免费无月费',
];

/**
 * 痛点对比区 + 大白话指标卡 + 支持设备品牌带
 */
export const TelemetryBand: React.FC = () => {
  return (
    <section
      id="pain-points"
      className="relative z-10 scroll-mt-20 border-y border-stone-200/80 bg-[#F4F1EA]/75 py-16 backdrop-blur-xl sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 标题：讲清用前 vs 用后 */}
        <div className="mb-10 max-w-2xl">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-stone-200">
            为什么需要 AuraHub
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            以前用智能家居有多割裂，现在就有多顺手
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            不用买昂贵的统一品牌全家桶，保留家里现有的灯、空调和音箱就行。
          </p>
        </div>

        {/* 3 组真实生活对比卡片 */}
        <div className="grid gap-5 md:grid-cols-3">
          {painComparisons.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="flex flex-col justify-between rounded-3xl border border-stone-200/85 bg-white p-6 shadow-[0_6px_24px_rgba(28,25,23,0.04)]"
            >
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-stone-100">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-stone-900">
                    {item.title}
                  </h3>
                </div>

                {/* 用前痛点 */}
                <div className="mt-4 rounded-2xl bg-stone-100/80 p-3.5 text-xs leading-relaxed text-stone-600">
                  <div className="mb-1 flex items-center gap-1.5 font-semibold text-stone-500">
                    <X className="h-3.5 w-3.5 text-rose-500" />
                    <span>以前的烦恼</span>
                  </div>
                  {item.before}
                </div>

                {/* 用后体验 */}
                <div className="mt-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-xs leading-relaxed text-stone-800">
                  <div className="mb-1 flex items-center gap-1.5 font-semibold text-emerald-700">
                    <Check className="h-3.5 w-3.5" />
                    <span>用了 AuraHub 后</span>
                  </div>
                  {item.after}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4 项通俗数字承诺 */}
        <div className="mt-8 grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-5">
          {summaryStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-2xl border border-stone-200/80 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                {stat.icon}
                <span>{stat.sub}</span>
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-stone-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 一看就懂的兼容设备跑马灯 */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-stone-200/80 bg-white/85 py-3.5 shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

          <div className="flex w-max animate-marquee-left gap-3">
            {[...brandsRow1, ...brandsRow1].map((brand, i) => (
              <span
                key={`b1-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-[#FAF9F6] px-3.5 py-1.5 text-xs font-medium text-stone-700"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {brand}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex w-max animate-marquee-right gap-3">
            {[...brandsRow2, ...brandsRow2].map((brand, i) => (
              <span
                key={`b2-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-stone-50 px-3.5 py-1.5 text-xs text-stone-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
