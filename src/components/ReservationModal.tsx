import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles } from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphereContext';

const CITIES = ['上海 · 武康庭光影馆', '北京 · 798 建筑客厅', '深圳 · 海上世界', '成都 · 麓湖艺展中心'];
const MOMENTS = ['晨曦唤醒时刻', '私人影院沉浸', '全屋无感漫游'];

export const ReservationModal: React.FC = () => {
  const { isReserveOpen, setIsReserveOpen, reservePreset } = useAtmosphere();
  const [city, setCity] = useState(CITIES[0]);
  const [moment, setMoment] = useState(MOMENTS[2]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setIsReserveOpen(false);
    window.setTimeout(() => setSubmitted(false), 300);
  };

  useEffect(() => {
    if (!isReserveOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isReserveOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isReserveOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#121722]/70 p-4 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="frosted-surface relative w-full max-w-lg overflow-hidden rounded-[28px] border border-warmgrey-300/60 bg-[#FAF8F4] p-7 md:p-9 text-[#23201D]"
          >
            {/* 细腻晨雾暖光底纹，不透底且极具质感 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 80% 60% at 85% 0%, rgba(235, 206, 158, 0.28), transparent 70%)',
              }}
            />
            <div className="surface-grain pointer-events-none absolute inset-0" />

            <button
              type="button"
              aria-label="关闭窗口"
              onClick={handleClose}
              className="absolute right-5 top-5 z-20 rounded-full p-2 text-warmgrey-600 transition-colors hover:bg-warmgrey-200/60 hover:text-[#23201D]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-walnut-600 mb-1.5">
                      {reservePreset}
                    </p>
                    <h3
                      id="reservation-modal-title"
                      className="font-serif text-2xl md:text-3xl font-normal text-[#23201D]"
                    >
                      为你点亮一小时的私密客厅
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm font-light text-warmgrey-600">
                      每次仅接待一组客人，空间顾问将在柔和的灯光与咖啡香中等候。
                    </p>
                  </div>

                  {/* 城市选择 */}
                  <div>
                    <label className="block text-xs tracking-wider text-warmgrey-600 mb-2">
                      选择体验馆
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CITIES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCity(c)}
                          className={`rounded-xl px-3.5 py-2.5 text-left text-xs transition-all duration-300 border ${
                            city === c
                              ? 'bg-[#23201D] text-[#FAF8F4] border-[#23201D]'
                              : 'bg-white/80 text-[#23201D] border-warmgrey-300/60 hover:bg-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 体验时刻 */}
                  <div>
                    <label className="block text-xs tracking-wider text-warmgrey-600 mb-2">
                      最想沉浸感受的瞬间
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOMENTS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMoment(m)}
                          className={`rounded-full px-3.5 py-1.5 text-xs transition-all duration-300 border ${
                            moment === m
                              ? 'bg-champagne-400/25 border-champagne-500 text-walnut-900 font-medium'
                              : 'bg-white/75 border-warmgrey-300/60 text-warmgrey-600 hover:bg-white'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 极简联络信息 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="怎么称呼您"
                      className="w-full rounded-xl border border-warmgrey-300/60 bg-white px-4 py-2.5 text-sm text-[#23201D] placeholder:text-warmgrey-400 focus:border-walnut-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="手机号或邮箱"
                      className="w-full rounded-xl border border-warmgrey-300/60 bg-white px-4 py-2.5 text-sm text-[#23201D] placeholder:text-warmgrey-400 focus:border-walnut-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#23201D] py-3.5 text-sm tracking-widest text-[#FAF8F4] transition-colors duration-300 hover:bg-walnut-700"
                  >
                    确认预约 · 生成邀请函
                  </button>
                </form>
              ) : (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-champagne-400/25 text-walnut-700">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.26em] text-walnut-600 mb-2">
                    Lumina Invitation
                  </p>
                  <h3
                    id="reservation-modal-title"
                    className="font-serif text-3xl font-normal text-[#23201D] mb-3"
                  >
                    {name ? `${name}，静候您的到来` : '已为您保留专属时段'}
                  </h3>
                  <p className="text-sm font-light text-warmgrey-600 leading-relaxed mb-6">
                    我们将在 2 小时内通过 <span className="text-[#23201D] font-normal">{contact}</span>{' '}
                    与您确认到店时间，并在您抵达前为您提前点亮「{moment}」。
                  </p>
                  <div className="rounded-2xl border border-warmgrey-300/60 bg-white/85 p-4 text-left text-xs text-warmgrey-600 space-y-1.5 mb-6">
                    <div className="flex items-center gap-2 text-[#23201D] font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-champagne-500" />
                      <span>光栖空间邀约凭证</span>
                    </div>
                    <p>体验空间：{city}</p>
                    <p>预约偏好：{reservePreset} · {moment}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full bg-[#23201D] px-8 py-2.5 text-xs tracking-widest text-[#FAF8F4] hover:bg-walnut-700 transition-colors"
                  >
                    回到空间
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
