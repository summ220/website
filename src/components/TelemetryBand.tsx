import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, Layers } from 'lucide-react';
import { ScrambleText } from './ScrambleText';

const metrics = [
  {
    value: '1.8 ms',
    label: '局域网跨端路由延迟',
    sub: 'WASAPI / AirPlay 2 直通',
    icon: <Activity className="h-3.5 w-3.5 text-sky-300" />,
  },
  {
    value: '0 Byte',
    label: '语音与状态上传云端',
    sub: '本地量化 LLM · 断网可用',
    icon: <Shield className="h-3.5 w-3.5 text-emerald-300" />,
  },
  {
    value: '4 OS',
    label: '桌面与移动统一感知',
    sub: 'macOS · Win · iOS · Android',
    icon: <Layers className="h-3.5 w-3.5 text-indigo-300" />,
  },
  {
    value: '¥150',
    label: '开源 ARM64 参考硬件',
    sub: 'USB-C 5V / 2.5W 静默运行',
    icon: <Cpu className="h-3.5 w-3.5 text-zinc-300" />,
  },
];

const protocolsRow1 = [
  'Matter 1.3',
  'AirPlay 2 Bridge',
  'Xiaomi MIoT',
  'Huawei HiLink',
  'Home Assistant',
  'Thread Border Router',
  'WASAPI Lossless',
  'Apple HomeKit',
];

const protocolsRow2 = [
  'Local LLM NPU',
  'DLNA / UPnP',
  'MQTT Broker',
  'Zigbee2MQTT',
  'mDNS Discovery',
  'WebRTC Audio',
  'Alpine Linux',
  'Docker Compose',
];

/**
 * 硬件级实时遥测带 + 双层协议总线跑马灯
 * 强化硬核科技感与核心指标记忆点
 */
export const TelemetryBand: React.FC = () => {
  return (
    <section className="relative z-10 border-y border-white/[0.08] bg-[#0A0A10]/85 backdrop-blur-2xl">
      {/* 碳纤维工程斜纹纹理底层 */}
      <div className="tech-hatch pointer-events-none absolute inset-0 opacity-75" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* 4 格精密指标仪表 */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {metrics.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E15]/85 p-4 transition-colors hover:border-indigo-400/35 hover:bg-[#12121B]"
            >
              {/* 卡片内背景微型科技波形线 */}
              <svg
                viewBox="0 0 120 40"
                className="pointer-events-none absolute bottom-1 right-1 h-12 w-24 opacity-20 transition-opacity group-hover:opacity-45"
              >
                <path
                  d={
                    idx % 2 === 0
                      ? 'M 0 32 Q 25 10, 45 26 T 90 14 T 120 22'
                      : 'M 0 26 L 24 26 L 36 10 L 48 34 L 62 18 L 120 18'
                  }
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="1.5"
                />
              </svg>
              {/* 边角准星装饰 */}
              <span className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-zinc-600 transition-colors group-hover:text-indigo-400">
                +
              </span>
              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>0{idx + 1}</span>
                </div>
                <div className="flex h-3 items-end gap-0.5 pr-3 opacity-60">
                  {[0, 1, 2].map((bar) => (
                    <motion.span
                      key={bar}
                      className="w-0.5 rounded-full bg-indigo-400"
                      animate={{ height: ['30%', '100%', '40%'] }}
                      transition={{
                        duration: 0.9 + bar * 0.2,
                        repeat: Infinity,
                        delay: idx * 0.15 + bar * 0.12,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2.5 bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text font-mono text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                <ScrambleText text={item.value} durationMs={720} />
              </div>
              <div className="mt-1 text-xs font-medium text-zinc-200">
                {item.label}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-zinc-500">
                {item.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 双层协议总线跑马灯 */}
        <div className="relative mt-8 overflow-hidden rounded-xl border border-white/[0.06] bg-[#070709]/90 py-3">
          {/* 左右渐变边缘遮罩 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070709] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070709] to-transparent" />

          <div className="flex w-max animate-marquee-left gap-3">
            {[...protocolsRow1, ...protocolsRow1].map((proto, i) => (
              <span
                key={`r1-${i}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1 font-mono text-[11px] text-zinc-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/80" />
                {proto}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex w-max animate-marquee-right gap-3">
            {[...protocolsRow2, ...protocolsRow2].map((proto, i) => (
              <span
                key={`r2-${i}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-1 font-mono text-[11px] text-zinc-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70" />
                {proto}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
