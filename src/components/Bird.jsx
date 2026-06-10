import React from 'react';
import { motion } from 'framer-motion';
import { getTreeTrunkPath, getBranchPoints, interpolate, getScaleFactor } from '../utils/gardenGenerator';

export default function Bird({ phatTrien, kyLuat, sucKhoe, tuTin, kienTri, stats }) {
  // Lấy vị trí cành cây để đậu
  const scaleFactor = getScaleFactor(stats?.evolutionStage || 2);
  const { endX, endY, height, sway } = getTreeTrunkPath(phatTrien, kyLuat, scaleFactor);
  const branches = getBranchPoints(endX, endY, height, sway, sucKhoe);

  // Số chim thường tỷ lệ với Tự Tin
  const birdCount = Math.min(3, Math.floor(interpolate(tuTin, 0, 3.9)));

  // Đột phá Chất đổi (lượng biến thành chất) -> Có chỉ số đạt >= 80 -> Có chim quý Phượng Hoàng xuất hiện!
  const hasQualitativeLeap = Object.values(stats).some(val => val >= 80);

  // Danh sách các tọa độ đậu (Perch) trên các cành chính
  const perchedBirds = [];
  for (let i = 0; i < birdCount; i++) {
    if (branches[i]) {
      // Đậu ở ngọn cành
      const bx = branches[i].endX;
      const by = branches[i].endY - 6;
      perchedBirds.push({
        x: bx,
        y: by,
        scale: 0.6 + (i * 0.1),
        color: i % 2 === 0 ? "#42A5F5" : "#FF7043", // Chim xanh lam hoặc chim lửa cam
        id: `bird-perch-${i}`
      });
    }
  }

  return (
    <g className="birds-layer">
      {/* 1. CHIM ĐẬU TRÊN CÀNH (PERCHED BIRDS) */}
      {perchedBirds.map((bird) => (
        <motion.g
          key={bird.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: bird.scale, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, delay: 1.5 }}
          style={{ x: bird.x, y: bird.y }}
        >
          {/* Vẽ chú chim nhỏ nhắn đậu nghiêng */}
          {/* Thân chim */}
          <ellipse cx="0" cy="0" rx="8" ry="5" fill={bird.color} />
          {/* Đầu chim */}
          <circle cx="6" cy="-4" r="4" fill={bird.color} />
          {/* Mỏ chim vàng nhọn */}
          <polygon points="10,-5 14,-3 9,-2" fill="#FFCA28" />
          {/* Mắt chim chấm đen nhỏ */}
          <circle cx="6" cy="-5" r="0.8" fill="#000" />
          {/* Đuôi chim */}
          <path d="M -8 1 L -14 6 L -10 3 Z" fill={bird.color} />
          {/* Cánh gập lại */}
          <ellipse cx="-1" cy="0" rx="4" ry="2.5" fill="rgba(0,0,0,0.15)" transform="rotate(-10)" />
          
          {/* Chân chim bám vào cành */}
          <line x1="1" y1="4" x2="1" y2="7" stroke="#4E342E" strokeWidth="1" />
          <line x1="-2" y1="4" x2="-2" y2="7" stroke="#4E342E" strokeWidth="1" />
        </motion.g>
      ))}

      {/* 2. CHIM BAY TRÊN BẦU TRỜI (FLYING BIRDS) */}
      {tuTin > 60 && (
        <motion.g
          animate={{
            x: [-100, 900],
            y: [120, 150, 100, 120]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Đập cánh liên tục */}
          <motion.path
            d="M 0 0 C 8 -12, 16 -12, 24 0 C 16 -3, 8 -3, 0 0 C -8 -3, -16 -3, -24 0 C -16 -12, -8 -12, 0 0"
            fill="#546E7A"
            animate={{
              d: [
                "M 0 0 C 8 -12, 16 -12, 24 0 C 16 -3, 8 -3, 0 0 C -8 -3, -16 -3, -24 0 C -16 -12, -8 -12, 0 0",
                "M 0 0 C 8 12, 16 12, 24 0 C 16 3, 8 3, 0 0 C -8 3, -16 3, -24 0 C -16 12, -8 12, 0 0",
                "M 0 0 C 8 -12, 16 -12, 24 0 C 16 -3, 8 -3, 0 0 C -8 -3, -16 -3, -24 0 C -16 -12, -8 -12, 0 0"
              ]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.g>
      )}

      {/* 3. CHIM PHƯỢNG HOÀNG VÀNG - BIỂU TƯỢNG ĐỘT PHÁ CHẤT ĐỔI (CHIM QUÝ) */}
      {hasQualitativeLeap && (
        <motion.g
          animate={{
            x: [-150, 950],
            y: [220, 160, 200, 150],
            rotate: [10, -5, 10, -5]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="phoenix-group"
        >
          {/* Vẽ chim quý Phượng Hoàng có đuôi dài phát sáng */}
          {/* Thân phượng hoàng */}
          <path d="M 0 0 C 15 -10, 35 -5, 45 15 C 30 15, 15 10, 0 0" fill="#FFD54F" />
          {/* Đầu vương miện */}
          <circle cx="48" cy="18" r="7" fill="#FFD54F" />
          <path d="M 49 24 L 54 28 L 51 23 L 56 25 Z" fill="#FF9100" /> {/* mỏ phượng hoàng */}
          <circle cx="47" cy="19" r="1.2" fill="#D84315" />
          {/* Vương miện lông đầu */}
          <path d="M 45 25 Q 42 32 38 34" fill="none" stroke="#FF9100" strokeWidth="1.5" />
          <circle cx="38" cy="34" r="2" fill="#D84315" />
          <path d="M 47 25 Q 45 33 42 37" fill="none" stroke="#FF9100" strokeWidth="1.5" />
          <circle cx="42" cy="37" r="2" fill="#D84315" />

          {/* Đuôi dài rực rỡ uốn lượn */}
          <motion.path
            d="M 0 0 Q -35 25 -80 30 Q -40 10 0 0"
            fill="url(#phoenixTailGrad)"
            animate={{
              d: [
                "M 0 0 Q -35 25 -80 30 Q -40 10 0 0",
                "M 0 0 Q -35 15 -80 10 Q -40 5 0 0",
                "M 0 0 Q -35 25 -80 30 Q -40 10 0 0"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Cánh phượng hoàng rực rỡ */}
          <motion.path
            d="M 20 8 C 30 -20, 25 -40, 10 -55 C 8 -30, 10 -10, 20 8"
            fill="#FFB300"
            animate={{
              rotate: [0, -30, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "20px 8px" }}
          />
        </motion.g>
      )}

      {/* GRADIENT DÀNH CHO ĐUÔI PHƯỢNG HOÀNG */}
      <defs>
        <linearGradient id="phoenixTailGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB300" />
          <stop offset="50%" stopColor="#FF3D00" />
          <stop offset="100%" stopColor="rgba(255, 61, 0, 0)" />
        </linearGradient>
      </defs>
    </g>
  );
}
