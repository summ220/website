import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Cpu,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const COMPOSE_SNIPPET = `services:
  aurahub:
    image: ghcr.io/aurahub/core:latest
    container_name: aurahub
    network_mode: host # 用于 mDNS / AirPlay / Matter 发现
    volumes:
      - ./data:/app/data
    restart: unless-stopped`;

export const DeploymentSection: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText('docker compose up -d').catch(() => {});
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyYaml = () => {
    navigator.clipboard?.writeText(COMPOSE_SNIPPET).catch(() => {});
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('请输入有效的邮箱地址');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <section id="deploy" className="relative z-10 scroll-mt-20 overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      {/* 中央晶圆同心圆电路装饰底纹 + 双极冷光场 */}
      <div className="tech-hatch pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-indigo-500/[0.12] blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-sky-400/[0.1] blur-[130px]" />
      <svg
        viewBox="0 0 600 600"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-20"
      >
        <circle cx="300" cy="300" r="140" fill="none" stroke="rgba(129,140,248,0.28)" strokeDasharray="4 8" />
        <circle cx="300" cy="300" r="220" fill="none" stroke="rgba(125,211,252,0.2)" strokeDasharray="10 10" />
        <circle cx="300" cy="300" r="290" fill="none" stroke="rgba(255,255,255,0.08)" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-indigo-300">
            <Server className="h-3.5 w-3.5" />
            <span>Dual Deployment</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            软件开源免费，硬件极简可选
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            如果你已有 Mac mini、NAS 或软路由，一条命令即可部署；未来也可选择 ¥150 级开源 ARM 盒子插电即用。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 左侧：软件开源版 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-indigo-300">
                      <Container className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        软件开源版
                      </h3>
                      <span className="font-mono text-xs text-zinc-400">
                        Mac mini / NAS / Linux Docker
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-300">
                    永久免费
                  </span>
                </div>

                {/* 一键复制命令条 */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.12] bg-[#07070A] px-3.5 py-2.5">
                  <code className="font-mono text-xs text-zinc-200 sm:text-sm">
                    <span className="text-indigo-400">$ </span>docker compose up -d
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCmd}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-300 transition hover:bg-white/[0.1]"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 终端风格 compose.yml 代码块 */}
                <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.09] bg-[#07070A]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3.5 py-2 font-mono text-[11px] text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-zinc-700" />
                        <span className="h-2 w-2 rounded-full bg-zinc-700" />
                        <span className="h-2 w-2 rounded-full bg-zinc-700" />
                      </span>
                      <span>docker-compose.yml</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyYaml}
                      className="text-zinc-400 transition hover:text-zinc-200"
                    >
                      {copiedYaml ? '已复制 YAML' : '复制配置'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
                    <code>{COMPOSE_SNIPPET}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] text-zinc-400">
                <span>• x86_64 &amp; ARM64 双架构镜像</span>
                <span>• 内存占用 &lt; 180MB</span>
                <span>• 开源社区驱动</span>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 右侧：轻量开源硬件盒子 (带 PCB 透视硬件示意图) */}
          <motion.div
            id="hardware-waitlist"
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SpotlightCard borderBeam className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-sky-300">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        轻量开源硬件盒子 (AuraBox)
                      </h3>
                      <span className="font-mono text-xs text-zinc-400">
                        ARM64 · USB-C 5V · 插电即用
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-xs text-indigo-300">
                    ¥150 级目标
                  </span>
                </div>

                {/* 工业设计感 SVG 开源硬件透视蓝图 */}
                <div className="mt-5 relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#07070A] p-4">
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                    <span>HARDWARE REV 1.2 // SCHEMATIC</span>
                    <span className="text-indigo-300">62 × 62 × 16 mm</span>
                  </div>
                  <svg
                    viewBox="0 0 420 120"
                    className="mt-2 h-24 w-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="pcbGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1B1D29" />
                        <stop offset="100%" stopColor="#0E1017" />
                      </linearGradient>
                    </defs>
                    {/* 外壳 CNC 边框 */}
                    <rect
                      x="65"
                      y="14"
                      width="290"
                      height="92"
                      rx="14"
                      fill="url(#pcbGrad)"
                      stroke="rgba(255,255,255,0.16)"
                      strokeWidth="1.2"
                    />
                    {/* PCB 电路走线装饰 + 通电流动脉冲光点 */}
                    <path
                      d="M 100 60 L 145 60 L 160 44 L 185 44"
                      fill="none"
                      stroke="rgba(129,140,248,0.42)"
                      strokeWidth="1.4"
                    />
                    <circle r="2.2" fill="#A5B4FC">
                      <animateMotion
                        dur="1.6s"
                        repeatCount="indefinite"
                        path="M 100 60 L 145 60 L 160 44 L 185 44"
                      />
                    </circle>
                    <path
                      d="M 235 44 L 265 44 L 280 60 L 320 60"
                      fill="none"
                      stroke="rgba(125,211,252,0.42)"
                      strokeWidth="1.4"
                    />
                    <circle r="2.2" fill="#7DD3FC">
                      <animateMotion
                        dur="1.6s"
                        begin="0.4s"
                        repeatCount="indefinite"
                        path="M 235 44 L 265 44 L 280 60 L 320 60"
                      />
                    </circle>
                    <path
                      d="M 100 74 L 150 74 L 165 82 L 255 82"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    {/* 左侧 USB-C 供电接口 */}
                    <rect
                      x="58"
                      y="48"
                      width="14"
                      height="24"
                      rx="3"
                      fill="#27272A"
                      stroke="rgba(255,255,255,0.22)"
                    />
                    <text x="20" y="63" fill="#71717A" fontSize="9" fontFamily="monospace">
                      USB-C 5V
                    </text>

                    {/* 中央 ARM64 核心芯片 */}
                    <rect
                      x="185"
                      y="32"
                      width="50"
                      height="50"
                      rx="6"
                      fill="#12131C"
                      stroke="rgba(129,140,248,0.5)"
                      strokeWidth="1.2"
                    />
                    <text x="195" y="55" fill="#E4E4E7" fontSize="8.5" fontFamily="monospace">
                      AURA-S1
                    </text>
                    <text x="197" y="67" fill="#818CF8" fontSize="7" fontFamily="monospace">
                      ARM64
                    </text>

                    {/* 右侧 Wi-Fi / Thread 蛇形天线 */}
                    <path
                      d="M 315 36 h 18 v 8 h -14 v 8 h 14 v 8 h -14"
                      fill="none"
                      stroke="rgba(125,211,252,0.5)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <text x="362" y="63" fill="#71717A" fontSize="9" fontFamily="monospace">
                      Wi-Fi / BLE
                    </text>

                    {/* 呼吸指示灯 */}
                    <circle cx="92" cy="30" r="3" fill="#818CF8" />
                  </svg>
                </div>

                {/* 硬件参数栅格 */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-white/[0.07] bg-[#08080B]/80 p-3">
                    <div className="font-mono text-[10px] text-zinc-500">架构</div>
                    <div className="mt-1 text-xs font-semibold text-zinc-100">
                      ARM64 4核
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-[#08080B]/80 p-3">
                    <div className="font-mono text-[10px] text-zinc-500">供电功耗</div>
                    <div className="mt-1 text-xs font-semibold text-zinc-100">
                      USB-C 5V / 2.5W
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-[#08080B]/80 p-3">
                    <div className="font-mono text-[10px] text-zinc-500">预装系统</div>
                    <div className="mt-1 text-xs font-semibold text-zinc-100">
                      Alpine Linux
                    </div>
                  </div>
                </div>
              </div>

              {/* 邮箱预约 Waitlist 表单 */}
              <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#08080B]/95 p-4">
                {submitted ? (
                  <div className="flex items-center gap-3 py-1 text-sm text-emerald-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="font-medium">已加入 AuraBox 开源硬件预约队列</div>
                      <div className="mt-0.5 font-mono text-xs text-zinc-400">
                        我们将通过 {email} 通知固件进度与首批众筹动态。
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                    <label
                      htmlFor="waitlist-email"
                      className="block font-mono text-[11px] text-zinc-400"
                    >
                      加入硬件内测与量产通知 Waitlist
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        id="waitlist-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="flex-1 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-indigo-400/50 focus:bg-white/[0.05]"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-white"
                      >
                        <span>立即预约</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {errorMsg && (
                      <p className="font-mono text-xs text-rose-400">{errorMsg}</p>
                    )}
                  </form>
                )}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        <p className="mt-6 text-center font-mono text-xs leading-relaxed text-zinc-500">
          注：对 HomePod、小米音箱、华为音箱及各品牌智能设备的兼容，均基于开源社区协议插件及 Matter / Home Assistant 标准桥接实现，无任何官方背书或闭源逆向依赖。
        </p>
      </div>
    </section>
  );
};
