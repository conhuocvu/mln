import React from 'react';
import { motion } from 'framer-motion';
import { getTreeTrunkPath, getBranchPoints, interpolate, getScaleFactor } from '../utils/gardenGenerator';

export default function Flower({ phatTrien, kyLuat, sucKhoe, triThuc, studyStreak = 0, evolutionStage }) {
  const scaleFactor = getScaleFactor(evolutionStage);
  const { endX, endY, height, sway } = getTreeTrunkPath(phatTrien, kyLuat, scaleFactor);
  const branches = getBranchPoints(endX, endY, height, sway, sucKhoe);

  // Số lượng hoa tỷ lệ với Trí Thức và bị giới hạn bởi giai đoạn để nở dần tinh tế
  let maxFlowers = 18;
  if (evolutionStage === 3) maxFlowers = 4; // Cây tơ tối đa 4 hoa
  if (evolutionStage === 4) maxFlowers = 2; // Thử thách lụi tàn tối đa 2 hoa
  if (evolutionStage === 5) maxFlowers = 10; // Tái sinh tối đa 10 hoa
  
  const flowerCount = Math.min(maxFlowers, Math.floor(interpolate(triThuc, 0, 18.9)));
  
  if (
    flowerCount === 0 || 
    branches.length === 0 || 
    evolutionStage === 1 || 
    evolutionStage === 2 || 
    evolutionStage === 4
  ) return null;

  // Lượng đổi chất đổi: Nếu chuỗi học tập học tiếng Nhật liên tục đạt >= 3 ngày, hoa nở thành Hoa Anh Đào màu hồng phấn quý phái
  const isSakuraBlossom = studyStreak >= 3;

  const flowers = [];
  for (let i = 0; i < flowerCount; i++) {
    const branchIdx = i % branches.length;
    const branch = branches[branchIdx];
    const ratio = 0.45 + ((i / flowerCount) * 0.5); 
    const fx = branch.startX + (branch.endX - branch.startX) * ratio + (i % 2 === 0 ? 6 : -6);
    const fy = branch.startY + (branch.endY - branch.startY) * ratio + (i % 3 === 0 ? -6 : 4);
    
    // Tùy biến màu hoa theo trạng thái chất lượng đột phá
    let flowerColor = "#FF80AB"; // Sakura pink mặc định
    let petalShape = "sakura";

    if (!isSakuraBlossom) {
      // Hoa thường nhiều màu sắc
      const colors = ["#E1BEE7", "#FFF9C4", "#F8BBD0", "#FFCDD2", "#FFE0B2"];
      flowerColor = colors[i % colors.length];
      petalShape = "circle";
    }

    flowers.push({
      x: fx,
      y: fy,
      color: flowerColor,
      centerColor: isSakuraBlossom ? "#FFF9C4" : "#FBC02D", // Nhụy hoa
      scale: (isSakuraBlossom ? 0.75 + (i % 3) * 0.15 : 0.6 + (i % 3) * 0.2) * scaleFactor,
      petalShape,
      key: `flower-${i}`
    });
  }

  return (
    <g className="flowers-layer">
      {flowers.map((fl, idx) => (
        <motion.g
          key={fl.key}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: fl.scale, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.6 + idx * 0.08
          }}
          className="origin-center"
          style={{ transformOrigin: `${fl.x}px ${fl.y}px` }}
        >
          {fl.petalShape === "sakura" ? (
            // Vẽ cánh hoa Anh Đào dạng giọt nước khía độc đáo
            <g>
              {/* Vẽ 5 cánh hoa đào chéo nhau */}
              <path d={`M ${fl.x} ${fl.y} C ${fl.x - 7} ${fl.y - 12}, ${fl.x + 7} ${fl.y - 12}, ${fl.x} ${fl.y}`} fill={fl.color} transform={`rotate(0, ${fl.x}, ${fl.y})`} />
              <path d={`M ${fl.x} ${fl.y} C ${fl.x - 7} ${fl.y - 12}, ${fl.x + 7} ${fl.y - 12}, ${fl.x} ${fl.y}`} fill={fl.color} transform={`rotate(72, ${fl.x}, ${fl.y})`} />
              <path d={`M ${fl.x} ${fl.y} C ${fl.x - 7} ${fl.y - 12}, ${fl.x + 7} ${fl.y - 12}, ${fl.x} ${fl.y}`} fill={fl.color} transform={`rotate(144, ${fl.x}, ${fl.y})`} />
              <path d={`M ${fl.x} ${fl.y} C ${fl.x - 7} ${fl.y - 12}, ${fl.x + 7} ${fl.y - 12}, ${fl.x} ${fl.y}`} fill={fl.color} transform={`rotate(216, ${fl.x}, ${fl.y})`} />
              <path d={`M ${fl.x} ${fl.y} C ${fl.x - 7} ${fl.y - 12}, ${fl.x + 7} ${fl.y - 12}, ${fl.x} ${fl.y}`} fill={fl.color} transform={`rotate(288, ${fl.x}, ${fl.y})`} />
            </g>
          ) : (
            // Vẽ hoa thường dạng hình tròn kết nối
            <g>
              <circle cx={fl.x - 4.5} cy={fl.y} r="4.5" fill={fl.color} />
              <circle cx={fl.x + 4.5} cy={fl.y} r="4.5" fill={fl.color} />
              <circle cx={fl.x} cy={fl.y - 4.5} r="4.5" fill={fl.color} />
              <circle cx={fl.x} cy={fl.y + 4.5} r="4.5" fill={fl.color} />
            </g>
          )}
          
          {/* Nhụy hoa ở tâm */}
          <circle cx={fl.x} cy={fl.y} r="2.5" fill={fl.centerColor} />
        </motion.g>
      ))}
    </g>
  );
}
