import React, { createContext, useContext, useState, useMemo } from 'react';
import { interpolateLighting, InterpolatedLightingState } from '../data/luminaData';

interface AtmosphereContextValue {
  /** 光影昼夜实验室当前时间滑块进度 0-100 */
  labProgress: number;
  setLabProgress: (value: number) => void;
  /** 插值后的连续光影物理状态 */
  lighting: InterpolatedLightingState;
  /** 首屏归家开场亮灯是否已完成 */
  heroIlluminated: boolean;
  setHeroIlluminated: (v: boolean) => void;
  /** 预约体验弹窗状态 */
  isReserveOpen: boolean;
  setIsReserveOpen: (open: boolean) => void;
  reservePreset: string;
  setReservePreset: (preset: string) => void;
  openReservation: (preset?: string) => void;
}

const AtmosphereContext = createContext<AtmosphereContextValue | null>(null);

export const AtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 默认停在接近 20:00 微醺时刻前的 14:00~黄昏或从 07:00 晨曦起？默认停在 22% (柔和上午/午后) 或 0 (晨曦唤醒) 让用户在首页下来即看到明朗温暖的建筑色调，拖动到夜间可惊艳变成暮色蓝！
  const [labProgress, setLabProgress] = useState<number>(12);
  const [heroIlluminated, setHeroIlluminated] = useState<boolean>(false);
  const [isReserveOpen, setIsReserveOpen] = useState<boolean>(false);
  const [reservePreset, setReservePreset] = useState<string>('私人光影体验');

  const lighting = useMemo(() => interpolateLighting(labProgress), [labProgress]);

  const openReservation = (preset = '私人光影体验') => {
    setReservePreset(preset);
    setIsReserveOpen(true);
  };

  return (
    <AtmosphereContext.Provider
      value={{
        labProgress,
        setLabProgress,
        lighting,
        heroIlluminated,
        setHeroIlluminated,
        isReserveOpen,
        setIsReserveOpen,
        reservePreset,
        setReservePreset,
        openReservation,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
};

export function useAtmosphere() {
  const ctx = useContext(AtmosphereContext);
  if (!ctx) {
    throw new Error('useAtmosphere must be used inside AtmosphereProvider');
  }
  return ctx;
}
