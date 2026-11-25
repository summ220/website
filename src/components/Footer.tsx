import React from 'react';
import { Github, BookOpen, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#070709]/95 py-12 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              AuraHub
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            打破苹果、小米、华为生态壁垒的开源 AI 全屋中枢。本地优先，隐私不出户。
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-zinc-100"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="#deploy"
              className="inline-flex items-center gap-1.5 transition hover:text-zinc-100"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>开源文档</span>
            </a>
            <a
              href="#sandbox"
              className="inline-flex items-center gap-1.5 transition hover:text-zinc-100"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>社区讨论</span>
            </a>
          </div>
          <div className="font-mono text-[11px] text-zinc-600">
            Released under MIT / Apache-2.0 Dual License · AuraHub Open Source Project
          </div>
        </div>
      </div>
    </footer>
  );
};
