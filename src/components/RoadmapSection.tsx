import React from 'react';
import { motion } from 'framer-motion';
import { Milestone, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

interface RoadmapPhase {
  phase: string;
  quarter: string;
  title: string;
  status: 'done' | 'active' | 'upcoming';
  items: string[];
}

const phases: RoadmapPhase[] = [
  {
    phase: '第一步',
    quarter: '2026 Q4 · 已完成',
    title: '让不同牌子的设备先能互通',
    status: 'done',
    items: [
      '解决 Windows 电脑 / 安卓直接给 HomePod 放歌的问题',
      '打通苹果、小米、华为音箱和主流智能灯具与空调',
      '开放第一版核心源码，欢迎极客与爱好者提前部署',
    ],
  },
  {
    phase: '第二步',
    quarter: '2027 Q1 · 正在打磨',
    title: '普通人点几下鼠标就能安装使用',
    status: 'active',
    items: [
      '推出 Windows 和 Mac 图形化客户端，不再需要敲命令',
      '开视频会议、全屏游戏、锁屏自动触发全屋联动',
      '说大白话就能自动配好“回家”、“晚安”等全屋场景',
    ],
  },
  {
    phase: '第三步',
    quarter: '2027 Q2 · 即将推出',
    title: '¥150 插电即用 AuraBox 小盒子',
    status: 'upcoming',
    items: [
      '掌心大小白色静音小盒子，外观设计与外壳文件同步开源',
      '插上手机充电线就能通电，手机扫一扫自动连上家里设备',
      '开启首批面向大众用户的社区体验预订与发货',
    ],
  },
];

export const RoadmapSection: React.FC = () => {
  return (
    <section
      id="roadmap"
      className="relative z-10 overflow-hidden border-t border-stone-200/80 py-24 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200/80">
            <Milestone className="h-3.5 w-3.5" />
            <span>产品演进计划</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            一步步变得越来越简单好用
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            从打通协议开始，正在把交互打磨成“连长辈都能看懂、插电就能用”的居家好帮手。
          </p>
        </div>

        <div className="relative">
          {/* 连接三阶段的柔和引导线 */}
          <div className="pointer-events-none absolute inset-x-10 top-10 hidden h-0.5 bg-gradient-to-r from-emerald-300 via-indigo-300 to-stone-200 md:block" />

          <div className="grid gap-5 md:grid-cols-3">
            {phases.map((item, idx) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700">
                        {item.phase}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          item.status === 'done'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : item.status === 'active'
                            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                            : 'bg-stone-100 text-stone-600 ring-1 ring-stone-200'
                        }`}
                      >
                        {item.status === 'done' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : item.status === 'active' ? (
                          <Sparkles className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {item.quarter}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-stone-900">
                      {item.title}
                    </h3>

                    <ul className="mt-4 space-y-2.5">
                      {item.items.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-stone-600"
                        >
                          <span
                            className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                              item.status === 'done'
                                ? 'bg-emerald-500'
                                : item.status === 'active'
                                ? 'bg-indigo-500'
                                : 'bg-stone-400'
                            }`}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
