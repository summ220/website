import React from 'react';
import { motion } from 'framer-motion';
import { SceneState } from './sceneConfig';

interface LightingOverlayLayerProps {
  scene: SceneState;
}

/**
 * 日夜物理光影混合层：
 * 白天提供自然日光光束，夜晚和傍晚呈现出柔和真实的暖黄台灯光锥与门口勿扰红光
 */
export const LightingOverlayLayer: React.FC<LightingOverlayLayerProps> = ({
  scene,
}) => {
  const isDay = scene.isDaylight;

  const lampGradient =
    scene.lampTone === 'warm'
      ? 'radial-gradient(ellipse 52% 64% at 24% 46%, rgba(251, 191, 36, 0.5), rgba(245, 158, 11, 0.22) 45%, transparent 76%)'
      : scene.lampTone === 'neutral'
      ? isDay
        ? 'radial-gradient(ellipse 52% 66% at 24% 46%, rgba(255, 255, 255, 0.72), rgba(254, 243, 199, 0.32) 48%, transparent 78%)'
        : 'radial-gradient(ellipse 52% 66% at 24% 46%, rgba(248, 250, 252, 0.55), rgba(186, 230, 253, 0.2) 48%, transparent 78%)'
      : 'radial-gradient(ellipse 50% 62% at 24% 46%, rgba(254, 249, 195, 0.35), rgba(226, 232, 240, 0.14) 45%, transparent 75%)';

  const screenGlowColor =
    scene.monitorMode === 'meeting'
      ? 'radial-gradient(ellipse 40% 35% at 50% 42%, rgba(99, 102, 241, 0.22), transparent 72%)'
      : scene.monitorMode === 'music'
      ? 'radial-gradient(ellipse 40% 35% at 50% 42%, rgba(245, 158, 11, 0.26), transparent 72%)'
      : scene.monitorMode === 'standby'
      ? 'radial-gradient(ellipse 36% 30% at 50% 42%, rgba(251, 191, 36, 0.14), transparent 70%)'
      : 'none';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1. 白天清晨/上午自然日光氛围 */}
      <motion.div
        animate={{ opacity: isDay ? scene.ambientOpacity : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 65% at 32% 8%, rgba(255, 251, 235, 0.48), transparent 72%)',
        }}
      />

      {/* 2. 台灯柔和光锥层 */}
      {scene.layers?.lampLightLayerUrl ? (
        <motion.img
          src={scene.layers.lampLightLayerUrl}
          alt="台灯照明光效"
          animate={{ opacity: scene.lampBrightness }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <motion.div
          animate={{
            opacity: scene.lampBrightness,
            scale: 0.94 + scene.lampBrightness * 0.08,
          }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="absolute inset-0 blur-xl"
          style={{
            background: lampGradient,
            mixBlendMode: isDay ? 'soft-light' : 'screen',
          }}
        />
      )}

      {/* 3. 显示器屏幕微光投射 */}
      <motion.div
        animate={{ opacity: scene.monitorMode === 'off' ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 blur-2xl"
        style={{
          background: screenGlowColor,
          mixBlendMode: isDay ? 'normal' : 'screen',
        }}
      />

      {/* 4. 右侧房门外开会勿扰提示光晕 */}
      <motion.div
        animate={{ opacity: scene.doorAlertOn ? 0.9 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute inset-0 blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse 26% 55% at 93% 45%, rgba(244, 63, 94, 0.42), rgba(244, 63, 94, 0.14) 50%, transparent 78%)',
        }}
      />

      {/* 5. 深夜休眠柔和压暗层 */}
      <motion.div
        animate={{ opacity: scene.id === 'sleep' ? 0.45 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-transparent to-[#090A10]/70"
      />
    </div>
  );
};
