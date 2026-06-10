import React from 'react';
import { motion } from 'framer-motion';
import { interpolate } from '../utils/gardenGenerator';

export default function Butterfly({ moiQuanHe }) {
  // Số lượng bướm tỷ lệ với chỉ số Mối Quan Hệ
  const butterflyCount = Math.min(8, Math.floor(interpolate(moiQuanHe, 0, 8.9)));

  if (butterflyCount === 0) return null;

  // Cấu hình các quỹ đạo ngẫu nhiên cho bướm xung quanh tán cây
  const butterflies = Array.from({ length: butterflyCount }).map((_, i) => {
    // Tọa độ trung tâm để bướm bay quanh
    const basePositions = [
      { x: 300, y: 320 },
      { x: 500, y: 350 },
      { x: 260, y: 420 },
      { x: 540, y: 380 },
      { x: 340, y: 240 },
      { x: 460, y: 260 },
      { x: 220, y: 300 },
      { x: 580, y: 280 }
    ];
    
    const base = basePositions[i % basePositions.length];
    
    // Biên độ dao động bay bay
    const rangeX = 40 + (i * 10);
    const rangeY = 30 + (i * 8);
    
    // Màu cánh bướm rực rỡ pastel
    const colors = ["#F06292", "#BA68C8", "#4FC3F7", "#FFD54F", "#AED581", "#FF8A65"];
    const wingColor = colors[i % colors.length];

    return {
      id: `butterfly-${i}`,
      baseX: base.x,
      baseY: base.y,
      rangeX,
      rangeY,
      wingColor,
      duration: 5 + (i * 1.5),
      delay: i * 0.4
    };
  });

  return (
    <g className="butterflies-layer">
      {butterflies.map((bf) => (
        <motion.g
          key={bf.id}
          // Di chuyển bướm ngẫu nhiên quanh vùng sinh sống của nó
          animate={{
            x: [0, bf.rangeX, -bf.rangeX / 2, bf.rangeX / 2, -bf.rangeX, 0],
            y: [0, -bf.rangeY, bf.rangeY / 2, -bf.rangeY / 2, bf.rangeY, 0],
            rotate: [0, 15, -10, 20, -15, 0]
          }}
          transition={{
            duration: bf.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: bf.delay
          }}
          style={{ x: bf.baseX, y: bf.baseY }}
        >
          {/* Cặp cánh bướm đập liên tục (dùng scaleX để mô phỏng đập cánh) */}
          <motion.g
            animate={{ scaleX: [1, 0.2, 1] }}
            transition={{
              duration: 0.4 + (Math.random() * 0.2),
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Cánh trái */}
            <path
              d="M 0 0 C -12 -12, -18 -8, -12 4 C -6 16, -2 8, 0 0"
              fill={bf.wingColor}
              stroke="#263238"
              strokeWidth="0.8"
            />
            {/* Cánh phải */}
            <path
              d="M 0 0 C 12 -12, 18 -8, 12 4 C 6 16, 2 8, 0 0"
              fill={bf.wingColor}
              stroke="#263238"
              strokeWidth="0.8"
            />
            {/* Thân bướm nhỏ màu đen ở giữa */}
            <line x1="0" y1="-5" x2="0" y2="8" stroke="#263238" strokeWidth="1.8" strokeLinecap="round" />
            {/* Râu bướm nhỏ */}
            <path d="M 0 -5 Q -3 -10 -5 -11" fill="none" stroke="#263238" strokeWidth="0.5" />
            <path d="M 0 -5 Q 3 -10 5 -11" fill="none" stroke="#263238" strokeWidth="0.5" />
          </motion.g>
        </motion.g>
      ))}
    </g>
  );
}
