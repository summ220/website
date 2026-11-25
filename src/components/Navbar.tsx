import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Terminal, Menu, X } from 'lucide-react';

// 严格与页面自上而下的 DOM 模块顺序保持 100% 一致
const navLinks = [
  { id: 'sandbox', label: '在线体验', href: '#sandbox' },
  { id: 'features', label: '核心特性', href: '#features' },
  { id: 'deploy', label: '开源部署', href: '#deploy' },
  { id: 'roadmap', label: '硬件路线', href: '#roadmap' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      // 计算当前视口激活的区块
      const probeY = y + window.innerHeight * 0.32;
      let current = '';
      for (const item of navLinks) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (probeY >= top && probeY < bottom) {
            current = item.id;
            break;
          }
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    // #sandbox 为 sticky 舞台，定位到其顶部即可完美展示第 01 帧；其余区块预留顶部导航高度
    const targetTop =
      id === 'sandbox' ? el.offsetTop : Math.max(0, el.offsetTop - 72);
    const distance = Math.abs(window.scrollY - targetTop);

    // 跨越超过 1800px（如跨过 400vh Sticky 舞台）时直接精准落位，避免高速闪过多个 sticky 章节导致“乱跳”观感
    window.scrollTo({
      top: targetTop,
      behavior: distance > 1800 ? 'auto' : 'smooth',
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'border-white/[0.12] bg-[#0B0B10]/85 shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-2xl'
            : 'border-white/[0.08] bg-[#0B0B10]/55 backdrop-blur-xl'
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.14] bg-gradient-to-b from-white/[0.1] to-transparent">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)] transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-indigo-400/25" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              AuraHub
            </span>
            <span className="hidden rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[10px] text-indigo-300 sm:inline-block">
              v0.9-alpha
            </span>
          </div>
        </a>

        {/* Desktop Links（顺序与页面流完全对齐 + 实时高亮指示） */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'font-medium text-white'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActivePill"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-lg border border-indigo-400/30 bg-indigo-500/15 shadow-[0_0_16px_rgba(129,140,248,0.2)]"
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="#deploy"
            onClick={(e) => handleNavClick(e, 'deploy')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 shadow-[0_0_24px_rgba(255,255,255,0.16)] transition-all hover:bg-white"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>一键部署</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300 md:hidden"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 top-20 z-40 rounded-2xl border border-white/[0.12] bg-[#0B0B10]/95 p-4 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-indigo-500/15 font-medium text-indigo-200'
                        : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.08] pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 text-xs font-medium text-zinc-200"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub 仓库</span>
              </a>
              <a
                href="#deploy"
                onClick={(e) => handleNavClick(e, 'deploy')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 py-2 text-xs font-semibold text-zinc-950"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>一键部署</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
