import React from 'react';
import { Github, BookOpen, MessageSquare, Home } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-stone-200/80 bg-[#F4F1EA]/90 py-12 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Home className="h-3.5 w-3.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-stone-900">
              AuraHub
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-stone-600">
            让苹果、小米、华为的音箱与家电不再各自为战。软件永久开源免费，对话与隐私只留在你家里。
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-stone-600">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-indigo-700"
            >
              <Github className="h-4 w-4" />
              <span>开源主页</span>
            </a>
            <a
              href="#deploy"
              className="inline-flex items-center gap-1.5 transition hover:text-indigo-700"
            >
              <BookOpen className="h-4 w-4" />
              <span>使用指南</span>
            </a>
            <a
              href="#sandbox"
              className="inline-flex items-center gap-1.5 transition hover:text-indigo-700"
            >
              <MessageSquare className="h-4 w-4" />
              <span>实景体验</span>
            </a>
          </div>
          <div className="text-xs text-stone-500">
            遵循 MIT / Apache-2.0 开源协议 · AuraHub 社区共建项目
          </div>
        </div>
      </div>
    </footer>
  );
};
