import React from 'react';
import { motion } from 'framer-motion';

export default function Weather({ camXuc, apLuc, contradictionLevel = 0 }) {
  // 1. CHỈ SỐ CẢM XÚC -> MẶT TRỜI
  const sunScale = 0.5 + (camXuc / 100) * 0.8;
  const sunColor = camXuc > 60 ? "#FFB74D" : "#FFE082";

  // 2. MÂY ĐEN, MÂY XÁM (THEO MÂU THUẪN & ÁP LỰC)
  // Cấp độ mâu thuẫn:
  // - 0-25: Không mâu thuẫn hoặc mâu thuẫn nhẹ (Mây trắng, trời sáng)
  // - 26-50: Mâu thuẫn vừa (Mây xám nhẹ)
  // - 51-75: Mâu thuẫn mạnh (Mây đen bao phủ + Mưa)
  // - 76-100: Mâu thuẫn cực hạn (Bão bùng đen kịt + Gió giật)
  
  const isContradictionActive = contradictionLevel > 25;
  const isMediumContradiction = contradictionLevel > 50;
  const isSevereContradiction = contradictionLevel > 75;

  let cloudColor = "#ECEFF1"; // Mây trắng mặc định
  let cloudOpacity = 0.45;
  let cloudCount = 2;

  if (isSevereContradiction) {
    cloudColor = "#37474F"; // Đen kịt bão tố
    cloudOpacity = 0.9;
    cloudCount = 5;
  } else if (isMediumContradiction) {
    cloudColor = "#546E7A"; // Xám đậm
    cloudOpacity = 0.75;
    cloudCount = 4;
  } else if (isContradictionActive) {
    cloudColor = "#90A4AE"; // Xám nhẹ
    cloudOpacity = 0.6;
    cloudCount = 3;
  } else if (apLuc > 50) {
    cloudColor = "#B0BEC5"; 
    cloudOpacity = 0.5;
    cloudCount = 3;
  }

  // 3. MƯA RƠI THEO CẤP MÂU THUẪN
  // - Mức 51-75: Mưa vừa (20 hạt)
  // - Mức 76-100: Mưa xối xả (40 hạt chéo mạnh)
  const rainCount = isSevereContradiction ? 45 : isMediumContradiction ? 20 : 0;
  const rainDrops = Array.from({ length: rainCount });

  // 4. CẦU VỒNG (Chỉ xuất hiện khi tâm hồn yên bình và không có mâu thuẫn lớn)
  const showRainbow = camXuc >= 65 && contradictionLevel <= 25 && apLuc <= 40;

  return (
    <g className="weather-effects">
      {/* CẦU VỒNG HÒA BÌNH */}
      {showRainbow && (
        <motion.path
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.5, pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          d="M 100 500 A 300 300 0 0 1 700 500"
          fill="none"
          stroke="url(#rainbowGrad)"
          strokeWidth="28"
          strokeLinecap="round"
        />
      )}

      {/* MẶT TRỜI CẢM XÚC (Ẩn bớt nếu bão to) */}
      <motion.g
        animate={{ 
          scale: isSevereContradiction ? 0.3 : sunScale,
          opacity: isSevereContradiction ? 0.15 : isMediumContradiction ? 0.4 : 1
        }}
        transition={{ type: "spring", stiffness: 45 }}
      >
        <circle cx="700" cy="90" r="40" fill={sunColor} />
        <circle
          cx="700"
          cy="90"
          r="55"
          fill="none"
          stroke={sunColor}
          strokeWidth="1.5"
          opacity="0.4"
          className="animate-pulse"
        />
      </motion.g>

      {/* SẤM SÉT CHỚP GIẬT (Chỉ khi có mâu thuẫn cực hạn) */}
      {isSevereContradiction && (
        <motion.polygon
          points="400,20 420,150 380,160 430,300 450,160 410,150"
          fill="#FFF59D"
          opacity="0.8"
          animate={{
            opacity: [0, 0.8, 0, 0, 0.9, 0, 0, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* MÂY TRIẾT HỌC ĐA CẤP ĐỘ */}
      {cloudCount > 0 && Array.from({ length: cloudCount }).map((_, index) => {
        const cx = 130 + index * 120 + (index % 2 === 0 ? 15 : -15);
        const cy = 60 + (index % 3) * 20;
        const scale = 0.85 + (index % 3) * 0.15;
        
        return (
          <motion.g
            key={`cloud-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: cloudOpacity }}
            transition={{ duration: 1 }}
            className={index % 2 === 0 ? "animate-cloud-left" : "animate-cloud-right"}
          >
            <path
              d={`M ${cx} ${cy} 
                  a 25,25 0 0,1 25,-15 
                  a 35,35 0 0,1 55,5 
                  a 25,25 0 0,1 15,25 
                  a 20,20 0 0,1 -10,20 
                  l -85,0 
                  a 20,20 0 0,1 -10,-20
                  a 20,20 0 0,1 10,-15 z`}
              fill={cloudColor}
              transform={`scale(${scale}) translate(${-cx * (scale - 1) / scale}, ${-cy * (scale - 1) / scale})`}
            />
          </motion.g>
        );
      })}

      {/* MƯA GIÔNG BÃO THEO THANG MÂU THUẪN */}
      {rainCount > 0 && (
        <g className="rain-layer">
          {rainDrops.map((_, i) => {
            const startX = 20 + (i * 760) / rainCount + Math.random() * 20;
            const startY = 80 + Math.random() * 80;
            const duration = isSevereContradiction ? 0.45 : 0.7; // Rơi nhanh hơn khi giông bão
            const angleOffset = isSevereContradiction ? -40 : -20; // Rơi chéo dữ dội hơn khi có bão cực hạn

            return (
              <motion.line
                key={`rain-drop-${i}`}
                x1={startX}
                y1={startY}
                x2={startX + angleOffset * 0.4}
                y2={startY + 25}
                stroke={isSevereContradiction ? "#78909C" : "#90A4AE"}
                strokeWidth={isSevereContradiction ? "2" : "1.2"}
                strokeLinecap="round"
                opacity="0.75"
                animate={{
                  y: [0, 520],
                  x: [0, angleOffset * 8],
                  opacity: [0.75, 0.15]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 1.5
                }}
              />
            );
          })}
        </g>
      )}

      {/* GRADIENTS */}
      <defs>
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255, 99, 132, 0.7)" />
          <stop offset="20%" stopColor="rgba(255, 159, 64, 0.7)" />
          <stop offset="40%" stopColor="rgba(255, 205, 86, 0.7)" />
          <stop offset="60%" stopColor="rgba(75, 192, 192, 0.7)" />
          <stop offset="80%" stopColor="rgba(54, 162, 235, 0.7)" />
          <stop offset="100%" stopColor="rgba(153, 102, 255, 0.7)" />
        </linearGradient>
      </defs>
    </g>
  );
}
