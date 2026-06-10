import React from 'react';
import { motion } from 'framer-motion';
import { getTreeTrunkPath, getBranchPoints, interpolate, getScaleFactor } from '../utils/gardenGenerator';

export default function Fruit({ phatTrien, kyLuat, sucKhoe, kienTri, evolutionStage }) {
  // Lấy cành để treo quả
  const scaleFactor = getScaleFactor(evolutionStage);
  const { endX, endY, height, sway } = getTreeTrunkPath(phatTrien, kyLuat, scaleFactor);
  const branches = getBranchPoints(endX, endY, height, sway, sucKhoe);

  // Số lượng quả chín phụ thuộc vào Kiên Trì và bị giới hạn bởi giai đoạn tiến hóa
  let maxFruits = 12;
  if (evolutionStage === 3) maxFruits = 3;  // Cây tơ tối đa 3 quả
  if (evolutionStage === 4) maxFruits = 0;  // Héo úa không có quả
  if (evolutionStage === 5) maxFruits = 7;  // Tái sinh tối đa 7 quả
  
  const fruitCount = Math.min(maxFruits, Math.floor(interpolate(kienTri, 0, 12.9)));

  if (
    fruitCount === 0 || 
    branches.length === 0 || 
    evolutionStage === 1 || 
    evolutionStage === 2 || 
    evolutionStage === 4
  ) return null;

  const fruits = [];
  for (let i = 0; i < fruitCount; i++) {
    // Treo xoay vòng trên các cành
    const branchIdx = i % branches.length;
    const branch = branches[branchIdx];
    
    // Treo quả ở vị trí xa dần trên cành
    const ratio = 0.4 + (i / fruitCount) * 0.5;
    const fx = branch.startX + (branch.endX - branch.startX) * ratio;
    const fy = branch.startY + (branch.endY - branch.startY) * ratio + 8; // lệch xuống dưới cành một chút
    
    // Chọn màu quả đỏ/cam ngon mắt
    const fruitColors = ["#EF5350", "#FF7043", "#F4511E", "#D84315"];
    const color = fruitColors[i % fruitColors.length];

    fruits.push({
      x: fx,
      y: fy,
      color,
      scale: (0.7 + (i % 2) * 0.2) * scaleFactor,
      key: `fruit-${i}`
    });
  }

  return (
    <g className="fruits-layer">
      {fruits.map((fr, idx) => (
        <motion.g
          key={fr.key}
          initial={{ scale: 0, y: -10, opacity: 0 }}
          animate={{ scale: fr.scale, y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay: 1.0 + idx * 0.12
          }}
          className="origin-top-center"
          style={{ transformOrigin: `${fr.x}px ${fr.y - 6}px` }}
        >
          {/* Cuống quả (Stem - màu xanh gỗ nhỏ nối cành) */}
          <line x1={fr.x} y1={fr.y - 8} x2={fr.x} y2={fr.y} stroke="#4E342E" strokeWidth="1.5" />
          
          {/* Quả tròn (Fruit Body) */}
          <circle cx={fr.x} cy={fr.y + 4} r="6.5" fill={fr.color} />
          
          {/* Vết sáng phản quang cho quả bóng đẹp (Specular Highlight) */}
          <circle cx={fr.x - 2.5} cy={fr.y + 1.5} r="1.8" fill="rgba(255, 255, 255, 0.65)" />
          
          {/* Lá nhỏ đầu cuống */}
          <path
            d={`M ${fr.x} ${fr.y - 3} Q ${fr.x + 4} ${fr.y - 6} ${fr.x + 6} ${fr.y - 4} Q ${fr.x + 3} ${fr.y - 2} ${fr.x} ${fr.y - 3}`}
            fill="#4CAF50"
          />
        </motion.g>
      ))}
    </g>
  );
}
