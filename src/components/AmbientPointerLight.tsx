import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface AmbientPointerLightProps {
  /** 光斑直径 */
  size?: number;
  /** 光斑基础颜色 CSS */
  color?: string;
  /** 透明度 */
  opacity?: number;
  /** 是否限制在父容器相对坐标内（true）或全屏（false） */
  contained?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
}

export const AmbientPointerLight: React.FC<AmbientPointerLightProps> = ({
  size = 560,
  color = 'rgba(232, 198, 146, 0.22)',
  opacity = 1,
  contained = false,
  containerRef,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  // 高阻尼丝滑物理跟随
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 26, mass: 0.9 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 26, mass: 0.9 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMove = (e: MouseEvent) => {
      if (contained && containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - size / 2);
        mouseY.set(e.clientY - rect.top - size / 2);
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        setVisible(inside);
      } else {
        mouseX.set(e.clientX - size / 2);
        mouseY.set(e.clientY - size / 2);
        setVisible(true);
      }
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [contained, containerRef, mouseX, mouseY, size]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 68%)`,
      }}
      animate={{ opacity: visible ? opacity : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${
        contained ? 'absolute' : 'fixed'
      } left-0 top-0 pointer-events-none z-20 rounded-full mix-blend-screen will-change-transform`}
    />
  );
};
