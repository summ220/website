import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  durationMs?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_:-.#';

/**
 * 终端解码入场字符动效：
 * 首次进入视口时快速从随机工程字符解密定格为目标文本
 */
export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  durationMs = 650,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return;
    const totalFrames = Math.max(10, Math.round(durationMs / 32));
    let frame = 0;

    const timer = window.setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const lockedCount = Math.floor(progress * text.length);

      let next = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === '.' || ch === '·' || i < lockedCount) {
          next += ch;
        } else {
          next += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(next);

      if (frame >= totalFrames) {
        setDisplay(text);
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [inView, text, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};
