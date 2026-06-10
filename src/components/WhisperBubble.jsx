import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhisperBubble — Bong bóng suy nghĩ triết học nổi gần tán cây
 * 
 * Render dưới dạng HTML overlay trên Garden (không dùng foreignObject trong SVG)
 * Vị trí tính theo % viewport để luôn nằm gần khu vực tán cây
 */
export default function WhisperBubble({ text, visible }) {
  // Random vị trí quanh khu vực tán cây (tính theo % viewport)
  // Cây nằm ở ~center-X, upper-40% Y trong viewport
  const position = useMemo(() => {
    const baseX = 45 + Math.random() * 15;   // 45% – 60% từ trái (quanh thân cây)
    const baseY = 15 + Math.random() * 20;   // 15% – 35% từ trên (quanh tán cây)
    return { x: baseX, y: baseY };
  }, [text]); // Recalculate mỗi khi text thay đổi → vị trí mới

  // Particles ngẫu nhiên
  const particles = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
    }));
  }, [text]);

  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          key={text}
          className="whisper-overlay"
          style={{
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hạt bụi phát sáng xung quanh */}
          {particles.map((p) => (
            <motion.div
              key={`particle-${p.id}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: '#FFF9C4',
                boxShadow: '0 0 6px 2px rgba(255, 249, 196, 0.5)',
                marginLeft: p.x,
                marginTop: p.y,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0.3, 0.7, 0],
                scale: [0, 1, 0.5, 1.1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Halo glow phía sau */}
          <motion.div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 180,
              height: 70,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(255,249,196,0.12) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Bubble chính */}
          <motion.div
            className="whisper-bubble"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -4, 0, -3, 0],
            }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{
              opacity: { duration: 0.6, ease: 'easeOut' },
              scale: { duration: 0.6, ease: 'easeOut' },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              },
            }}
          >
            <div className="whisper-bubble-inner">
              <span className="whisper-icon">✦</span>
              <p className="whisper-text">{text}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
