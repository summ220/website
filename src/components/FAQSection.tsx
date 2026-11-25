import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: '家里以前买的老式空调或普通台灯，也能控制吗？',
    answer:
      '如果设备本身支持连 Wi-Fi（例如小米米家、华为智选、苹果 HomeKit 或 Matter 设备），AuraHub 都能直接发现并控制。如果是几年前没有联网功能的传统电器，只需要花几十元配一个常见的智能插座或万能红外遥控伴侣接入 Wi-Fi，同样能一起联动。',
  },
  {
    question: '我不懂代码也不懂电脑设置，买小盒子回去真的会用吗？',
    answer:
      '完全不用懂代码。预约的 AuraBox 小盒子在设计上追求“插电就会用”：用普通手机充电线接通电源后，手机打开向导页面连上家里 Wi-Fi，它就会自动搜索同一网络下的音箱、灯光和空调，整个过程像给蓝牙耳机或新手机配网一样简单。',
  },
  {
    question: '必须一直开着我平时用的电脑才能控制家里吗？',
    answer:
      '不需要。如果你使用的是插电小盒子（AuraBox），或者把免费软件装在家用 NAS / 闲置 Mac mini 上，平时主力笔记本电脑就算关机，手机控制和语音指令也照常工作；只有“开视频会议、打游戏时自动调灯”这类电脑联动功能，会在你开机用电脑时自动触发。',
  },
  {
    question: '软件永久免费，以后会收费或把我家里的录音传上网吗？',
    answer:
      'AuraHub 的核心软件遵循开源协议永久免费，没有月费或会员门槛，所有源码都公开接受社区检查。更重要的是，你的语音指令和设备操作全部只在自家路由器局域网内处理，不上传云端服务器，家里的日常对话只有你自己知道。',
  },
  {
    question: '如果哪天家里宽带断网了，还能用吗？',
    answer:
      '可以。只要家里路由器本身还有电在运行（哪怕拔掉了外网光纤线），屋内的局域网依然畅通。通过 AuraHub 的本地大脑，手机遥控、电脑状态联动以及基础语音控制照常流畅响应，不会一断网就全部失灵。',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative z-10 scroll-mt-20 border-t border-stone-200/80 bg-[#FAF9F6] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-stone-200">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>常见疑问解答</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            入手或体验前，大家最常问的几件事
          </h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            不绕弯子，把普通家庭最关心的设备兼容、操作难度和隐私问题一次讲明白。
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? 'border-indigo-200 bg-white shadow-[0_8px_24px_rgba(79,70,229,0.06)]'
                    : 'border-stone-200/85 bg-white/85 hover:border-stone-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="text-sm font-bold text-stone-900 sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-stone-100 px-5 py-4 text-sm leading-relaxed text-stone-600 sm:px-6">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
