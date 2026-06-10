import React from 'react';
import { motion } from 'framer-motion';
import Weather from './Weather';
import Tree from './Tree';
import Flower from './Flower';
import Fruit from './Fruit';
import Butterfly from './Butterfly';
import Bird from './Bird';
import WhisperBubble from './WhisperBubble';
import { getSeasonalColors, interpolate } from '../utils/gardenGenerator';

export default function Garden({ stats, contradictionLevel = 0, whisperText = '', whisperVisible = false, onTreeClick, positiveTasksCount = 0 }) {
  // Tính tổng chỉ số phát triển tích lũy để xác định mùa
  const phatTrienTotal = stats.phatTrien + stats.sucKhoe + stats.triThuc + stats.kyLuat;
  const seasonColors = getSeasonalColors(phatTrienTotal);

  // Mở khóa đảo nổi lơ lửng đại diện cho Bước nhảy vọt về Chất
  // Khi Phát triển > 65 hoặc đạt cấp Cổ thụ (evolutionStage === 6)
  const isQualityUnlocked = stats.phatTrien > 65 || stats.evolutionStage === 6;

  // Sáng tạo cao -> Sinh hoa cỏ lạ lấp lánh quanh hồ nước
  const creativeSproutsCount = Math.min(10, Math.floor(interpolate(stats.sangTao, 0, 10.9)));
  
  // Hồ nước (Pond)
  const pondColor = stats.apLuc > 60 ? "#37474F" : stats.camXuc > 60 ? "#4DD0E1" : "#4FC3F7";
  const pondHeight = interpolate(stats.camXuc, 530, 560);

  // Vẽ các đụn đất đá ở nền đất
  const groundFill = seasonColors.groundColor;

  return (
    <div className="relative w-full h-full select-none bg-stone-100">
      
      {/* SVG CHI TIẾT KHU VƯỜN */}
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full transition-all duration-1000"
      >
        <defs>
          <linearGradient id="sunriseGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D5DFD8" /> {/* Soft sage/teal sky */}
            <stop offset="50%" stopColor="#F4E6CA" /> {/* Warm gold sunrise */}
            <stop offset="95%" stopColor="#F3F0E8" /> {/* Cream ground blend */}
          </linearGradient>
        </defs>

        {/* BACKGROUND SOLID RECT */}
        <rect width="800" height="600" fill="url(#sunriseGlow)" />

        {/* ==================== DIGITAL PHILOSOPHY GARDEN LAYERS ==================== */}

        {/* 1. Foggy Mountains (Núi mờ) */}
        <path
          d="M -20 480 L 120 380 Q 230 330 340 380 L 470 430 L 590 350 L 730 420 L 820 480 L 820 600 L -20 600 Z"
          fill="#9EB89A"
          opacity="0.18"
        />
        <path
          d="M -20 495 L 80 435 L 210 395 L 360 455 L 510 385 L 690 465 L 820 495 L 820 600 L -20 600 Z"
          fill="#5B7F68"
          opacity="0.15"
        />

        {/* 2. Distant Hills (Đồi xa) */}
        <path
          d="M -20 515 Q 160 460 330 495 T 690 485 Q 760 500 820 520 L 820 600 L -20 600 Z"
          fill="#9EB89A"
          opacity="0.28"
        />
        <path
          d="M -20 530 Q 260 485 510 520 T 820 540 L 820 600 L -20 600 Z"
          fill="#5B7F68"
          opacity="0.25"
        />

        {/* 3. Light Fog/Mist (Sương nhẹ) */}
        <motion.ellipse
          cx="200" cy="410" rx="140" ry="10"
          fill="#F3F0E8"
          opacity="0.35"
          animate={{ x: [-30, 30, -30], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="600" cy="430" rx="170" ry="12"
          fill="#F3F0E8"
          opacity="0.3"
          animate={{ x: [40, -40, 40], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 4. Gentle Wind (Gió nhẹ) */}
        <path d="M 80 200 Q 180 180 280 220 T 480 190" fill="none" stroke="#9EB89A" strokeWidth="1" strokeDasharray="5,15" opacity="0.35" />
        <path d="M 330 140 Q 430 160 530 130 T 730 150" fill="none" stroke="#9EB89A" strokeWidth="1" strokeDasharray="5,15" opacity="0.35" />

        {/* 5. Flying Birds (Chim bay) */}
        <motion.g
          animate={{
            x: [-100, 900],
            y: [120, 90],
          }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          opacity="0.4"
        >
          <path d="M 0 0 Q 6 -5 12 0 Q 18 -5 24 0" fill="none" stroke="#2F3A34" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M -35 15 Q -29 10 -23 15 Q -17 10 -11 15" fill="none" stroke="#2F3A34" strokeWidth="1" strokeLinecap="round" />
          <path d="M 25 20 Q 31 15 37 20 Q 43 15 49 20" fill="none" stroke="#2F3A34" strokeWidth="0.8" strokeLinecap="round" />
        </motion.g>

        {/* 6. Drifting Leaves (Lá rơi) */}
        <g className="drifting-leaves">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.path
              key={`drift-leaf-${i}`}
              d="M 0 0 C -2 -4, 2 -4, 0 0"
              fill="#9EB89A"
              opacity="0.55"
              animate={{
                x: [100 + i * 180, 60 + i * 180 + Math.random() * 40],
                y: [-20, 580],
                rotate: [0, 360],
              }}
              transition={{
                duration: 15 + i * 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 3,
              }}
            />
          ))}
        </g>

        {/* THỜI TIẾT (Theo mâu thuẫn biện chứng) */}
        <Weather 
          camXuc={stats.camXuc} 
          apLuc={stats.apLuc} 
          contradictionLevel={contradictionLevel} 
        />

        {/* NỀN ĐẤT PHÍA SAU */}
        <path
          d="M -50 560 Q 200 520 450 540 T 850 560 L 850 650 L -50 650 Z"
          fill={groundFill}
          opacity="0.8"
        />

        {/* HỒ NƯỚC (POND) BIỆN CHỨNG */}
        <motion.path
          d={`M -20 ${pondHeight} Q 150 ${pondHeight - 20} 300 ${pondHeight + 10} T 450 600 L -20 600 Z`}
          fill={pondColor}
          opacity="0.9"
          animate={{
            d: [
              `M -20 ${pondHeight} Q 150 ${pondHeight - 20} 300 ${pondHeight + 10} T 450 600 L -20 600 Z`,
              `M -20 ${pondHeight - 4} Q 165 ${pondHeight - 12} 290 ${pondHeight + 14} T 450 600 L -20 600 Z`,
              `M -20 ${pondHeight} Q 150 ${pondHeight - 20} 300 ${pondHeight + 10} T 450 600 L -20 600 Z`
            ]
          }}
          transition={{
            duration: contradictionLevel > 50 ? 2.5 : 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* CỎ HOA QUANH HỒ (Theo Sáng Tạo) */}
        {creativeSproutsCount > 0 && Array.from({ length: creativeSproutsCount }).map((_, i) => {
          const sx = 20 + i * 35;
          const sy = pondHeight + 15 + (i % 2 === 0 ? 5 : -5);
          
          return (
            <motion.g
              key={`sprout-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 0.75 + (i % 2) * 0.25 }}
              transition={{ delay: 1 }}
            >
              {/* Nấm sáng tạo phát sáng */}
              <path d={`M ${sx} ${sy} Q ${sx + 4} ${sy - 12} ${sx + 8} ${sy - 10}`} stroke="#BA68C8" strokeWidth="1.5" fill="none" />
              <circle cx={sx + 8} cy={sy - 10} r="3" fill="#E1BEE7" className="animate-pulse" />
              <circle cx={sx - 4} cy={sy + 8} r="2" fill="#FFF59D" />
            </motion.g>
          );
        })}

        {/* NỀN ĐẤT CHÍNH TRUNG TÂM */}
        <path
          d="M -50 575 Q 300 540 550 565 T 850 580 L 850 600 L -50 600 Z"
          fill={groundFill}
        />

        {/* Thảm cỏ quanh gốc cây */}
        <g fill="#66BB6A" opacity="0.8">
          <path d="M 360 555 Q 370 545 380 555" fill="none" stroke="#66BB6A" strokeWidth="2" />
          <path d="M 420 557 Q 430 548 440 557" fill="none" stroke="#66BB6A" strokeWidth="2" />
        </g>

        {/* ==================== BƯỚC NHẢY VỌT VỀ CHẤT: ĐẢO NỔI & THÁC NƯỚC ==================== */}
        {isQualityUnlocked && (
          <motion.g
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 60, delay: 0.8 }}
          >
            {/* Đảo nổi ngọc bích phía trái */}
            <path
              d="M 60 210 Q 140 190 200 215 T 240 240 Q 180 270 120 260 Z"
              fill="#A5D6A7"
              stroke="#81C784"
              strokeWidth="2"
            />
            {/* Chân đảo đất đá lơ lửng */}
            <path
              d="M 60 210 Q 130 250 120 260 Q 170 270 240 240 Z"
              fill="#8D6E63"
              opacity="0.8"
            />
            {/* Tháp tri thức nhỏ lấp lánh trên đảo nổi */}
            <polygon points="140,170 160,170 165,190 135,190" fill="#E0F2F1" stroke="#004D40" strokeWidth="1" />
            <polygon points="143,150 157,150 160,170 140,170" fill="#B2DFDB" stroke="#004D40" strokeWidth="1" />
            <polygon points="150,135 154,150 146,150" fill="#FFD54F" />

            {/* Thác nước chảy đổ vào hồ chính */}
            <motion.line
              x1="120"
              y1="255"
              x2="120"
              y2={pondHeight + 10}
              stroke="#E0F7FA"
              strokeWidth="3.5"
              strokeDasharray="4,4"
              animate={{ strokeDashoffset: [-20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Chữ mô tả chất mới */}
            <rect x="75" y="270" width="105" height="18" rx="6" fill="rgba(255,255,255,0.75)" />
            <text x="127" y="282" textAnchor="middle" fill="#1B5E20" fontSize="8" fontWeight="bold">CHẤT BIẾN: ĐẢO TRÍ TUỆ</text>
          </motion.g>
        )}

        {/* CÂY CHÍNH BIỆN CHỨNG */}
        <Tree
          phatTrien={stats.phatTrien}
          kyLuat={stats.kyLuat}
          sucKhoe={stats.sucKhoe}
          leafColor={seasonColors.leafColor}
          contradictionLevel={contradictionLevel}
          resolvedContradictionsCount={stats.resolvedContradictionsCount}
          evolutionStage={stats.evolutionStage}
          onClick={onTreeClick}
          stats={stats}
          positiveTasksCount={positiveTasksCount}
        />

        {/* HOA NỞ (Theo Trí Thức + Có Sakura khi học liên tiếp) */}
        <Flower
          phatTrien={stats.phatTrien}
          kyLuat={stats.kyLuat}
          sucKhoe={stats.sucKhoe}
          triThuc={stats.triThuc}
          studyStreak={stats.studyStreak}
          evolutionStage={stats.evolutionStage}
        />

        {/* QUẢ CHÍN (Theo Kiên Trì) */}
        <Fruit
          phatTrien={stats.phatTrien}
          kyLuat={stats.kyLuat}
          sucKhoe={stats.sucKhoe}
          kienTri={stats.kienTri}
          evolutionStage={stats.evolutionStage}
        />

        {/* BƯỚM LƯỢN (Theo Mối Quan Hệ) */}
        <Butterfly moiQuanHe={stats.moiQuanHe} />

        {/* CHIM QUÝ / BỒ CÂU (Theo Tự Tin & Đột Phá) */}
        <Bird
          phatTrien={stats.phatTrien}
          kyLuat={stats.kyLuat}
          sucKhoe={stats.sucKhoe}
          tuTin={stats.tuTin}
          kienTri={stats.kienTri}
          stats={stats}
        />
      </svg>

      {/* CÂY THÌ THẦM TRIẾT HỌC — Whisper Bubble nổi trên khu vườn */}
      <WhisperBubble
        text={whisperText}
        visible={whisperVisible}
      />
    </div>
  );
}
