import React from 'react';
import { motion } from 'framer-motion';
import { SceneState } from './sceneConfig';

interface LightingOverlayLayerProps {
  scene: SceneState;
}

/**
 * 独立物理光影层：
 * 使用 mix-blend-mode: screen 与 blur 滤镜模拟真实光源打在桌面与墙面的质感
 */
export const LightingOverlayLayer: React.FC<LightingOverlayLayerProps> = ({
  scene,
}) => {
  const lampGradient =
    scene.lampTone === 'warm'
      ? 'radial-gradient(ellipse 52% 64% at 24% 46%, rgba(251, 191, 36, 0.44), rgba(245, 158, 11, 0.16) 45%, transparent 76%)'
      : scene.lampTone === 'neutral'
      ? 'radial-gradient(ellipse 52% 66% at 24% 46%, rgba(248, 250, 252, 0.48), rgba(186, 230, 253, 0.18) 48%, transparent 78%)'
      : 'radial-gradient(ellipse 50% 62% at 24% 46%, rgba(226, 232, 240, 0.34), rgba(148, 163, 184, 0.12) 45%, transparent 75%)';

  const screenGlowColor =
    scene.monitorMode === 'meeting'
      ? 'radial-gradient(ellipse 40% 35% at 50% 42%, rgba(129, 140, 248, 0.25), transparent 72%)'
      : scene.monitorMode === 'music'
      ? 'radial-gradient(ellipse 40% 35% at 50% 42%, rgba(245, 158, 11, 0.2), transparent 72%)'
      : scene.monitorMode === 'standby'
      ? 'radial-gradient(ellipse 36% 30% at 50% 42%, rgba(148, 163, 184, 0.14), transparent 70%)'
      : 'none';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
      {/* 1. 环境天光基调层 */}
      <motion.div
        animate={{ opacity: scene.ambientOpacity }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(148, 163, 184, 0.18), transparent 70%)',
        }}
      />

      {/* 2. 台灯广角光锥层（支持替换为 3D PNG 图层） */}
      {scene.layers?.lampLightLayerUrl ? (
        <motion.img
          src={scene.layers.lampLightLayerUrl}
          alt="Lamp Light Layer"
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
          style={{ background: lampGradient }}
        />
      )}

      {/* 3. 显示器屏幕反光投射层 */}
      <motion.div
        animate={{ opacity: scene.monitorMode === 'off' ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 blur-2xl"
        style={{ background: screenGlowColor }}
      />

      {/* 4. 门口红色勿扰氛围灯渗光（右侧门框） */}
      <motion.div
        animate={{ opacity: scene.doorAlertOn ? 0.85 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="absolute inset-0 blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse 24% 55% at 92% 45%, rgba(244, 63, 94, 0.42), rgba(244, 63, 94, 0.1) 50%, transparent 78%)',
        }}
      />

      {/* 5. 夜间休眠全屋暗角压暗层（使用 normal 混合在最外层营造静谧感） */}
      <motion.div
        animate={{ opacity: scene.id === 'sleep' ? 0.55 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/80"
        style={{ mixBlendMode: 'normal' }}
      />
    </div>
  );
};
