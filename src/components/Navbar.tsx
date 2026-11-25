import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Sparkles, Menu, X, Home } from 'lucide-react';

// 严格与页面自上而下的 DOM 模块顺序保持一致
const navLinks = [
  { id: 'pain-points', label: '解决什么问题', href: '#pain-points' },
  { id: 'sandbox', label: '一天怎么用', href: '#sandbox' },
  { id: 'features', label: '好用功能', href: '#features' },
  { id: 'deploy', label: '获取与预约', href: '#deploy' },
  { id: 'roadmap', label: '产品计划', href: '#roadmap' },
  { id: 'faq', label: '常见疑问', href: '#faq' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

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

    const targetTop =
      id === 'sandbox' ? el.offsetTop : Math.max(0, el.offsetTop - 76);
    const distance = Math.abs(window.scrollY - targetTop);

    window.scrollTo({
      top: targetTop,
      behavior: distance > 1800 ? 'auto' : 'smooth',
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3.5 sm:px-6">
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5 ${
          scrolled
            ? 'border-stone-200/90 bg-white/90 shadow-[0_10px_35px_rgba(28,25,23,0.08)] backdrop-blur-2xl'
            : 'border-stone-200/70 bg-white/75 shadow-[0_4px_20px_rgba(28,25,23,0.04)] backdrop-blur-xl'
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
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-105">
            <Home className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-stone-900">
              AuraHub
            </span>
            <span className="hidden rounded-full bg-amber-100/90 px-2 py-0.5 text-[11px] font-medium text-amber-800 sm:inline-block">
              开源版
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative rounded-xl px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'font-semibold text-indigo-700'
                    : 'font-medium text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActivePill"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-indigo-50 ring-1 ring-indigo-200/80"
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
            title="查看开源项目主页"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          >
            <Github className="h-3.5 w-3.5" />
            <span>开源主页</span>
          </a>
          <a
            href="#deploy"
            onClick={(e) => handleNavClick(e, 'deploy')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>立即使用</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 md:hidden"
          aria-label="打开导航菜单"
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
            className="absolute inset-x-4 top-[72px] z-40 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`rounded-xl px-3.5 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-indigo-50 font-semibold text-indigo-700'
                        : 'font-medium text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-stone-100 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-xs font-medium text-stone-700"
              >
                <Github className="h-3.5 w-3.5" />
                <span>开源项目主页</span>
              </a>
              <a
                href="#deploy"
                onClick={(e) => handleNavClick(e, 'deploy')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>立即使用 / 预约盒子</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
