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
    phase: 'Phase 01',
    quarter: '2026 Q4 · 已开源',
    title: 'MVP 核心中枢与协议桥接',
    status: 'done',
    items: [
      'Docker 一键部署镜像 (x86_64 / ARM64)',
      '无蓝牙 Windows / Android 局域网音频转发引擎',
      'Matter 1.3 + Home Assistant + AirPlay 2 / MIoT 桥接',
    ],
  },
  {
    phase: 'Phase 02',
    quarter: '2027 Q1 · 进行中',
    title: '跨端桌面客户端与本地 AI 大脑',
    status: 'active',
    items: [
      'macOS 菜单栏 & Windows 系统托盘原生客户端',
      '摄像头 / 全屏游戏 / 锁屏状态毫秒级钩子',
      '本地量化小模型接入，支持一句话生成自动化规则',
    ],
  },
  {
    phase: 'Phase 03',
    quarter: '2027 Q2 · 规划中',
    title: '¥150 级开源硬件盒子量产',
    status: 'upcoming',
    items: [
      '开源 ARM64 PCB 原理图与 3D 打印外壳文件',
      'USB-C 5V 极低功耗固件，支持插电即用零配置配网',
      '首批社区内测与开源硬件众筹交付',
    ],
  },
];

export const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="relative z-10 overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      {/* 底部向上汇聚极光光幕 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px]"
        style={{
          background:
            'radial-gradient(ellipse 65% 70% at 50% 100%, rgba(129, 140, 248, 0.16), transparent 72%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 dot-matrix opacity-25 [mask-image:linear-gradient(to_top,black_10%,transparent_80%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-indigo-300">
            <Milestone className="h-3.5 w-3.5" />
            <span>Open Roadmap</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            清晰透明的开源演进路线
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            从软件容器 MVP 到全平台桌面客户端，再到百元级开源硬件盒子，每一步都欢迎社区 PR 与共建。
          </p>
        </div>

        <div className="relative">
          {/* 桌面端贯穿三阶段的微光轨道线 */}
          <div className="pointer-events-none absolute inset-x-10 top-8 hidden h-px bg-gradient-to-r from-emerald-400/40 via-indigo-400/50 to-white/[0.08] md:block" />

          <div className="grid gap-5 md:grid-cols-3">
          {phases.map((item, idx) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
            >
              <SpotlightCard className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-indigo-300">
                      {item.phase}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] ${
                        item.status === 'done'
                          ? 'border border-emerald-400/25 bg-emerald-500/10 text-emerald-300'
                          : item.status === 'active'
                          ? 'border border-indigo-400/30 bg-indigo-500/15 text-indigo-200'
                          : 'border border-white/[0.08] bg-white/[0.03] text-zinc-400'
                      }`}
                    >
                      {item.status === 'done' && <CheckCircle2 className="h-3 w-3" />}
                      {item.status === 'active' && <Sparkles className="h-3 w-3" />}
                      {item.status === 'upcoming' && <Clock className="h-3 w-3" />}
                      <span>{item.quarter}</span>
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-zinc-100">
                    {item.title}
                  </h3>

                  <ul className="mt-4 space-y-2.5">
                    {item.items.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-xs leading-relaxed text-zinc-400"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-3 font-mono text-[10px] text-zinc-500">
                  {item.status === 'done'
                    ? 'STATUS: RELEASED ON GITHUB'
                    : item.status === 'active'
                    ? 'STATUS: IN ACTIVE DEVELOPMENT'
                    : 'STATUS: HARDWARE PROTOTYPING'}
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
