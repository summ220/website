import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop,
  Cpu,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Terminal,
  Sparkles,
  Download,
  PlugZap,
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

const COMPOSE_SNIPPET = `services:
  aurahub:
    image: ghcr.io/aurahub/core:latest
    container_name: aurahub
    network_mode: host # 用于局域网自动发现音箱与家电
    volumes:
      - ./data:/app/data
    restart: unless-stopped`;

export const DeploymentSection: React.FC = () => {
  const [showGeekInstall, setShowGeekInstall] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [downloadTipOpen, setDownloadTipOpen] = useState(false);
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
      setErrorMsg('请输入正确的邮箱地址（例如 name@example.com）');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <section
      id="deploy"
      className="relative z-10 scroll-mt-20 overflow-hidden border-t border-stone-200/80 bg-[#F4F1EA]/70 py-24 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-stone-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>两种使用方式任选</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            软件永久免费，也可以买小盒子插电即用
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            不会写代码、没有 NAS 也没关系。直接预约一个 ¥150 左右的小盒子，像手机充电头一样插上电连 Wi-Fi 就能开始用。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 左侧：软件免费版 + 可折叠极客 Docker 专区 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <SpotlightCard className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">
                        方式一：装在自家电脑上（免费）
                      </h3>
                      <span className="text-xs text-stone-500">
                        支持 Windows · Mac · 闲置小主机 / NAS
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    永久免费
                  </span>
                </div>

                {/* 3 步大众极简使用说明 */}
                <div className="mt-6 space-y-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-4">
                  <div className="text-xs font-semibold text-stone-700">
                    三步就能把家里设备连起来：
                  </div>
                  {[
                    { step: '1', text: '下载安装 AuraHub 桌面程序，打开软件' },
                    { step: '2', text: '自动搜出家里同一个 Wi-Fi 下的音箱、灯光与空调' },
                    { step: '3', text: '在电脑右上角或手机桌面直接遥控，设置自动规则' },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-center gap-3 rounded-xl bg-white p-2.5 text-xs text-stone-700 shadow-sm ring-1 ring-stone-100"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                        {item.step}
                      </span>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* 桌面软件下载入口 */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setDownloadTipOpen((prev) => !prev)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>获取 Windows / Mac 桌面端（内测预览）</span>
                  </button>

                  <AnimatePresence>
                    {downloadTipOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs leading-relaxed text-indigo-900">
                          桌面一键安装包正在内测打磨中（预计 2027 Q1 开放下载）。如果你想提前尝鲜，可在右侧留下邮箱接收推送，或者展开下方的 NAS / Docker 安装方式。
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 可折叠的极客 Docker 安装区，不打扰普通访客 */}
                <div className="mt-5 border-t border-stone-200/80 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGeekInstall((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                  >
                    <span className="flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5" />
                      我是开发者 / NAS 用户，查看 Docker 命令安装
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showGeekInstall ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showGeekInstall && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-900 px-3.5 py-2.5 text-stone-100">
                            <code className="font-mono text-xs">
                              <span className="text-indigo-400">$ </span>docker compose up -d
                            </code>
                            <button
                              type="button"
                              onClick={handleCopyCmd}
                              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 font-mono text-[11px] text-stone-200 transition hover:bg-white/20"
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

                          <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-900 text-stone-200">
                            <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2 font-mono text-[11px] text-stone-400">
                              <span>docker-compose.yml</span>
                              <button
                                type="button"
                                onClick={handleCopyYaml}
                                className="text-stone-300 hover:text-white"
                              >
                                {copiedYaml ? '已复制配置' : '复制配置'}
                              </button>
                            </div>
                            <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed">
                              <code>{COMPOSE_SNIPPET}</code>
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 右侧：大众主推“插电即用 ¥150 硬件小盒子” */}
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <PlugZap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">
                        方式二：AuraBox 小盒子（最省心）
                      </h3>
                      <span className="text-xs text-stone-500">
                        手机扫码连上 Wi-Fi，插电就能一直运行
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    约 ¥150 · 推荐
                  </span>
                </div>

                {/* 消费电子外观渲染示意卡片（替代原本的 PCB 电路图） */}
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-gradient-to-br from-[#FAF9F6] via-white to-[#F3F4F9] p-6">
                  {/* 极简柔和白银色 AuraBox 硬件立体小盒子示意图 */}
                  <div className="relative flex h-24 w-48 items-center justify-center rounded-3xl border border-stone-200 bg-gradient-to-b from-white to-stone-100 shadow-[0_18px_36px_rgba(28,25,23,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)]">
                    {/* 底部投影 */}
                    <div className="absolute -bottom-3 h-3 w-40 rounded-full bg-stone-900/10 blur-md" />
                    {/* 正面柔和呼吸灯带 */}
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold tracking-wide text-stone-800">
                        AuraBox
                      </span>
                      <motion.div
                        animate={{ opacity: [0.45, 1, 0.45] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-1.5 w-12 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-center text-xs font-medium text-stone-600">
                    只有掌心大小 · 静音无风扇 · 用普通手机 Type-C 充电线即可供电
                  </p>
                </div>

                {/* 普通人关心的三件事 */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <div className="rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-3 text-center">
                    <div className="text-[11px] text-stone-500">预估售价</div>
                    <div className="mt-1 text-sm font-bold text-stone-900">
                      约 ¥150
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-3 text-center">
                    <div className="text-[11px] text-stone-500">日常电费</div>
                    <div className="mt-1 text-sm font-bold text-stone-900">
                      一年不到 ¥10
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200/80 bg-[#FAF9F6] p-3 text-center">
                    <div className="text-[11px] text-stone-500">上手难度</div>
                    <div className="mt-1 text-sm font-bold text-emerald-700">
                      插电就会用
                    </div>
                  </div>
                </div>
              </div>

              {/* 邮箱预约通知表单 */}
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                {submitted ? (
                  <div className="flex items-center gap-3 py-1 text-sm text-emerald-800">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <div className="font-bold">已登记！首批上线时第一时间通知你</div>
                      <div className="mt-0.5 text-xs text-stone-600">
                        开售及桌面端内测信息将发送至 {email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-2.5">
                    <label
                      htmlFor="waitlist-email"
                      className="block text-xs font-semibold text-stone-800"
                    >
                      小盒子正在筹备量产，留个邮箱第一时间抢先体验：
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        id="waitlist-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="输入你的常用邮箱，例如 you@qq.com"
                        className="flex-1 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                      >
                        <Cpu className="h-3.5 w-3.5" />
                        <span>立即预约</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {errorMsg && (
                      <p className="text-xs font-medium text-rose-600">{errorMsg}</p>
                    )}
                  </form>
                )}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-stone-500">
          说明：对 HomePod、小米音箱、华为音箱等设备的兼容，均基于公开或社区开源标准协议实现，无需改装原有硬件。
        </p>
      </div>
    </section>
  );
};
