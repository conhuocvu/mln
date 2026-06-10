import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getTreeTrunkPath, getBranchPoints, interpolate, getScaleFactor } from '../utils/gardenGenerator';

export default function Tree({ 
  phatTrien, 
  kyLuat, 
  sucKhoe, 
  leafColor, 
  contradictionLevel = 0, 
  resolvedContradictionsCount = 0,
  evolutionStage = 2,
  onClick,
  stats = {},
  positiveTasksCount = 0
}) {
  const [isHovered, setIsHovered] = useState(false);
  const scaleFactor = getScaleFactor(evolutionStage);

  // Lấy đường dẫn thân cây chính
  const { path: trunkPath, endX, endY, height, sway } = getTreeTrunkPath(phatTrien, kyLuat, scaleFactor);
  const branches = getBranchPoints(endX, endY, height, sway, sucKhoe);
  
  // Chiều rộng thân cây tăng tiến theo màn tiến hóa
  const isAncient = evolutionStage === 6;
  const isReborn = evolutionStage === 5;
  const isDormant = evolutionStage === 4;
  const isSeed = evolutionStage === 1;
  const isSprout = evolutionStage === 2;

  let trunkWidth = interpolate(phatTrien, 8, 25) * scaleFactor;
  if (isAncient) trunkWidth = trunkWidth * 1.5; // Cổ thụ siêu to
  const branchWidth = trunkWidth * 0.6;

  // Lượng mâu thuẫn cao -> Thân nứt nẻ, có cành gãy
  const isSevereContradiction = contradictionLevel > 75;
  const isMediumContradiction = contradictionLevel > 50;

  // Hàm tạo lá cây
  const getLeavesForBranch = (branch, index, isGolden = false) => {
    // Sức khỏe quy định số lá
    const leafCount = Math.min(10, Math.max(3, Math.floor(interpolate(sucKhoe, 3, 10.9))));
    const leaves = [];
    
    for (let i = 0; i < leafCount; i++) {
      const ratio = 0.2 + (i / (leafCount - 1)) * 0.8;
      const lx = branch.startX + (branch.endX - branch.startX) * ratio;
      const ly = branch.startY + (branch.endY - branch.startY) * ratio;
      const leafAngle = branch.angle + (i % 2 === 0 ? 40 : -40) + (i * 8);
      let leafSize = interpolate(sucKhoe, 6, 14) * scaleFactor;
      
      // Kiểm tra lá có bị héo úa không (do thiếu kỷ luật/sức khỏe hoặc mâu thuẫn cao)
      let isWilted = false;
      if (!isGolden && (kyLuat < 45 || contradictionLevel > 40 || sucKhoe < 45)) {
        // Tỉ lệ lá héo úa phụ thuộc vào mức độ thấp của kỷ luật, sức khỏe và mâu thuẫn
        const severity = Math.max(
          kyLuat < 45 ? (45 - kyLuat) / 45 : 0,
          sucKhoe < 45 ? (45 - sucKhoe) / 45 : 0,
          contradictionLevel > 40 ? (contradictionLevel - 40) / 60 : 0
        );
        const wiltThreshold = 0.3 + severity * 0.7; // Ít nhất 30% lá bị ảnh hưởng
        const seedValue = ((index * 17 + i * 23) % 100) / 100;
        if (seedValue < wiltThreshold) {
          isWilted = true;
          leafSize = leafSize * 0.7; // Thu nhỏ lá rũ
        }
      }
      
      leaves.push({
        x: lx,
        y: ly,
        angle: leafAngle,
        size: leafSize,
        isWilted,
        key: `${isGolden ? 'g' : 'l'}-leaf-${index}-${i}`
      });
    }
    return leaves;
  };

  // Tính toán Cành Vàng Kim (đại diện cho mâu thuẫn đã giải quyết)
  const goldenBranches = [];
  if (resolvedContradictionsCount > 0 || isReborn || isAncient) {
    const activeGoldBranches = Math.min(3, Math.max(1, resolvedContradictionsCount));
    for (let i = 0; i < activeGoldBranches; i++) {
      const ratio = 0.65 + i * 0.1;
      const startX = 400 + sway * ratio;
      const startY = 550 - height * ratio;
      
      const angle = (i % 2 === 0 ? -1 : 1) * 35;
      const length = height * 0.45;
      const rad = (angle * Math.PI) / 180;
      const endXGold = startX + length * Math.sin(rad);
      const endYGold = startY - length * Math.cos(rad);

      goldenBranches.push({
        startX,
        startY,
        endX: endXGold,
        endY: endYGold,
        length,
        angle,
        key: `gold-branch-${i}`
      });
    }
  }
  // Tính toán Cành Khô (Đại diện cho các mặt chưa phát triển)
  const isUnderdeveloped = kyLuat < 50 || sucKhoe < 50 || phatTrien < 45;
  const dryBranches = [];
  if (isUnderdeveloped && evolutionStage >= 3) {
    dryBranches.push({
      startX: 400 + sway * 0.45,
      startY: 550 - height * 0.45,
      endX: 400 + sway * 0.45 - 35,
      endY: 550 - height * 0.45 - 20,
      width: branchWidth * 0.5,
      key: "dry-branch-1"
    });
    if (contradictionLevel > 40) {
      dryBranches.push({
        startX: 400 + sway * 0.75,
        startY: 550 - height * 0.75,
        endX: 400 + sway * 0.75 + 40,
        endY: 550 - height * 0.75 - 15,
        width: branchWidth * 0.4,
        key: "dry-branch-2"
      });
    }
  }

  // RENDER THEO GIAI ĐOẠN TIẾN HÓA XOẮN ỐC (SPIRAL EVOLUTION)

  // 1. GIAI ĐOẠN HẠT GIỐNG (SEED)
  if (isSeed) {
    return (
      <g 
        className="tree-seed-stage cursor-pointer pointer-events-auto select-none"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Clickable backing */}
        <circle cx="400" cy="548" r="25" fill="rgba(0,0,0,0)" />
        {/* Hover Glow */}
        {isHovered && (
          <circle cx="400" cy="548" r="20" fill="rgba(255, 235, 59, 0.2)" className="animate-pulse" />
        )}
        {/* Đất cát nhỏ */}
        <ellipse cx="400" cy="550" rx="15" ry="6" fill="#795548" />
        {/* Hạt giống đang phát sáng */}
        <motion.circle
          cx="400"
          cy="548"
          r="4"
          fill="#FFF9C4"
          stroke="#FBC02D"
          strokeWidth="1.5"
          animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="400" y="535" textAnchor="middle" fill="#8D6E63" fontSize="9" fontWeight="bold">HẠT GIỐNG</text>
      </g>
    );
  }

  // 2. GIAI ĐOẠN MẦM NON (SPROUT)
  if (isSprout) {
    let stemPath = "M 400 550 Q 398 535 400 525";
    let stemWidth = 3.5;
    let leafScale = 1.0;
    let textY = 505;
    
    // Cấu hình dựa trên số lượng hành động tích cực để tạo sự tăng trưởng mượt mà
    if (positiveTasksCount <= 1) {
      stemPath = "M 400 550 Q 399 544 400 538";
      stemWidth = 2.5;
      leafScale = 0.5;
      textY = 525;
    } else if (positiveTasksCount === 2) {
      stemPath = "M 400 550 Q 398 539 400 528";
      stemWidth = 3.0;
      leafScale = 0.8;
      textY = 510;
    } else if (positiveTasksCount === 3) {
      stemPath = "M 400 550 Q 397 534 400 518";
      stemWidth = 3.8;
      leafScale = 1.0;
      textY = 495;
    } else { // positiveTasksCount === 4
      stemPath = "M 400 550 Q 396 525 400 500";
      stemWidth = 4.5;
      leafScale = 1.25;
      textY = 475;
    }

    const isUnhealthy = kyLuat < 45 || contradictionLevel > 40 || sucKhoe < 45;
    const leftLeafColor = isUnhealthy ? "#8D6E63" : "#4CAF50";
    const rightLeafColor = isUnhealthy ? "#7B5E57" : "#81C784";
    const sproutColor = isUnhealthy ? "#8D6E63" : "#81C784";

    // Lấy điểm cuối thân mầm
    const endSproutY = positiveTasksCount <= 1 ? 538 : positiveTasksCount === 2 ? 528 : positiveTasksCount === 3 ? 518 : 500;

    return (
      <g 
        className="tree-sprout-stage cursor-pointer pointer-events-auto select-none"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Clickable backing */}
        <circle cx="400" cy={endSproutY} r="35" fill="rgba(0,0,0,0)" />
        {/* Hover Glow */}
        {isHovered && (
          <circle cx="400" cy={endSproutY + 5} r="25" fill="rgba(129, 199, 132, 0.25)" className="animate-pulse" />
        )}
        <ellipse cx="400" cy="550" rx="20" ry="7" fill="#795548" />
        
        {/* Thân mầm */}
        <motion.path
          d={stemPath}
          fill="none"
          stroke={sproutColor}
          strokeWidth={stemWidth}
          strokeLinecap="round"
        />

        {/* Nhóm lá mầm thứ nhất (lá gốc) */}
        <g transform={`translate(400, ${endSproutY}) scale(${leafScale}) translate(-400, -${endSproutY})`}>
          {/* Lá trái */}
          <path d={`M 400 ${endSproutY} C 390 ${endSproutY - 5}, 392 ${endSproutY - 13}, 400 ${endSproutY}`} fill={leftLeafColor} />
          {/* Lá phải */}
          <path d={`M 400 ${endSproutY} C 410 ${endSproutY - 5}, 408 ${endSproutY - 13}, 400 ${endSproutY}`} fill={rightLeafColor} />
        </g>

        {/* Nhóm lá mầm thứ hai (khi đạt 3+ hành động, vươn thêm 2 lá phụ) */}
        {positiveTasksCount >= 3 && (
          <g transform={`translate(400, ${endSproutY + 8}) scale(${leafScale * 0.8}) translate(-400, -${endSproutY + 8})`}>
            {/* Lá trái phụ */}
            <path d={`M 400 ${endSproutY + 8} C 388 ${endSproutY + 5}, 390 ${endSproutY - 3}, 400 ${endSproutY + 8}`} fill={leftLeafColor} opacity="0.9" />
            {/* Lá phải phụ */}
            <path d={`M 400 ${endSproutY + 8} C 412 ${endSproutY + 5}, 410 ${endSproutY - 3}, 400 ${endSproutY + 8}`} fill={rightLeafColor} opacity="0.9" />
          </g>
        )}

        {/* Nhóm lá mầm thứ ba (khi đạt 4 hành động, vươn thêm 2 lá phụ ở dưới nữa) */}
        {positiveTasksCount >= 4 && (
          <g transform={`translate(400, ${endSproutY + 16}) scale(${leafScale * 0.6}) translate(-400, -${endSproutY + 16})`}>
            {/* Lá trái phụ thấp */}
            <path d={`M 400 ${endSproutY + 16} C 386 ${endSproutY + 14}, 388 ${endSproutY + 7}, 400 ${endSproutY + 16}`} fill={leftLeafColor} opacity="0.8" />
            {/* Lá phải phụ thấp */}
            <path d={`M 400 ${endSproutY + 16} C 414 ${endSproutY + 14}, 412 ${endSproutY + 7}, 400 ${endSproutY + 16}`} fill={rightLeafColor} opacity="0.8" />
          </g>
        )}

        <text x="400" y={textY} textAnchor="middle" fill="#2E7D32" fontSize="9" fontWeight="bold">
          {positiveTasksCount === 4 ? "MẦM CẬN TRƯỞNG THÀNH" : "MẦM NON"}
        </text>
      </g>
    );
  }

  // 3+ GIAI ĐOẠN CÂY PHÁT TRIỂN
  return (
    <g className="tree-container select-none">
      {/* HOVER GLOW BEHIND THE TREE */}
      {isHovered && (
        <circle
          cx={400}
          cy={550 - height / 2}
          r={height * 0.6}
          fill="url(#auroraGlow)"
          opacity="0.22"
          className="pointer-events-none transition-all duration-300 animate-pulse"
        />
      )}

      {/* KHU VỰC PHÁT SÁNG CỦA CÂY CỔ THỤ VÀ CÂY TÁI SINH */}
      {(isAncient || isReborn) && (
        <circle
          cx={endX}
          cy={endY + 50}
          r={height * 0.75}
          fill="url(#auroraGlow)"
          opacity="0.18"
          className="animate-pulse"
        />
      )}

      {/* THÂN CÂY CHÍNH */}
      <motion.path
        d={trunkPath}
        fill="none"
        stroke="#5D4037" 
        strokeWidth={trunkWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* VẾT NỨT NẺ THÂN CÂY (KHI MÂU THUẪN HOẶC GIAI ĐOẠN BÃO TÀN) */}
      {(isSevereContradiction || isDormant) && (
        <path
          d={`M 400 500 Q 395 450 405 400 T 397 350`}
          fill="none"
          stroke="#3E2723"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="5,3"
          className="animate-pulse"
        />
      )}

      {/* CÁC CÀNH CÂY THƯỜNG */}
      {!isDormant && branches.map((branch, idx) => (
        <g key={`branch-group-${idx}`}>
          <motion.path
            d={`M ${branch.startX} ${branch.startY} Q ${(branch.startX + branch.endX) / 2} ${(branch.startY + branch.endY) / 2 - 8}, ${branch.endX} ${branch.endY}`}
            fill="none"
            stroke="#6D4C41"
            strokeWidth={branchWidth * (1 - idx * 0.1)}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.3 + idx * 0.15 }}
          />

          {/* Lá của cành thường */}
          {getLeavesForBranch(branch, idx).map((leaf) => (
            <motion.path
              key={leaf.key}
              d={`M ${leaf.x} ${leaf.y} C ${leaf.x - leaf.size/2} ${leaf.y - leaf.size}, ${leaf.x + leaf.size/2} ${leaf.y - leaf.size}, ${leaf.x} ${leaf.y}`}
              fill={leaf.isWilted ? "#8D6E63" : leafColor}
              stroke={leaf.isWilted ? "#5D4037" : "#1B5E20"}
              strokeWidth="0.5"
              transform={`rotate(${leaf.angle}, ${leaf.x}, ${leaf.y})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 80,
                delay: 0.5 + idx * 0.15 + Math.random() * 0.2
              }}
              className="animate-leaf-shake origin-bottom"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
          ))}
        </g>
      ))}

      {/* CÀNH KHÔ (ĐẠI DIỆN CHO CÁC MẶT CHƯA PHÁT TRIỂN) */}
      {!isDormant && dryBranches.map((db) => (
        <g key={db.key} className="dry-branch-group">
          <motion.path
            d={`M ${db.startX} ${db.startY} Q ${(db.startX + db.endX) / 2} ${(db.startY + db.endY) / 2 - 4}, ${db.endX} ${db.endY}`}
            fill="none"
            stroke="#5C4033"
            strokeWidth={db.width}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
          {/* Small twig detail */}
          <path
            d={`M ${(db.startX + db.endX) / 2} ${(db.startY + db.endY) / 2 - 2} Q ${(db.startX + db.endX) / 2 - 10} ${(db.startY + db.endY) / 2 - 15}, ${(db.startX + db.endX) / 2 - 15} ${(db.startY + db.endY) / 2 - 12}`}
            fill="none"
            stroke="#5C4033"
            strokeWidth={db.width * 0.6}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* CÀNH GÃY RŨ XUỐNG ĐẤT (MÂU THUẪN MẠNH HOẶC CÂY LỤI TÀN) */}
      {(isMediumContradiction || isDormant) && (
        <g className="broken-branch-group">
          <line x1="390" y1="460" x2="350" y2="480" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
          <motion.path
            d="M 350 480 Q 330 520 340 555"
            fill="none"
            stroke="#4E342E"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="340" cy="558" r="4" fill="#8D6E63" opacity="0.8" />
          <circle cx="325" cy="530" r="3.5" fill="#8D6E63" opacity="0.8" />
        </g>
      )}

      {/* CÀNH VÀNG KIM ĐỘT PHÁ (MÂU THUẪN ĐÃ GIẢI QUYẾT / TÁI SINH / CỔ THỤ) */}
      {!isDormant && goldenBranches.map((gb, idx) => (
        <g key={gb.key} className="golden-branch-layer">
          <motion.path
            d={`M ${gb.startX} ${gb.startY} Q ${(gb.startX + gb.endX) / 2} ${(gb.startY + gb.endY) / 2 - 5}, ${gb.endX} ${gb.endY}`}
            fill="none"
            stroke="#FFF59D"
            strokeWidth={branchWidth * 1.5}
            opacity="0.25"
            strokeLinecap="round"
            className="animate-pulse"
          />
          
          <motion.path
            d={`M ${gb.startX} ${gb.startY} Q ${(gb.startX + gb.endX) / 2} ${(gb.startY + gb.endY) / 2 - 5}, ${gb.endX} ${gb.endY}`}
            fill="none"
            stroke="#FFD54F" 
            strokeWidth={branchWidth * 0.9}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {getLeavesForBranch(gb, idx, true).map((leaf) => (
            <motion.path
              key={leaf.key}
              d={`M ${leaf.x} ${leaf.y} C ${leaf.x - leaf.size/2} ${leaf.y - leaf.size}, ${leaf.x + leaf.size/2} ${leaf.y - leaf.size}, ${leaf.x} ${leaf.y}`}
              fill="#FFF59D"
              stroke="#FBC02D"
              strokeWidth="0.8"
              transform={`rotate(${leaf.angle}, ${leaf.x}, ${leaf.y})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
              className="animate-bounce origin-bottom"
              style={{ animationDuration: '3s', animationDelay: `${Math.random() * 2}s` }}
            />
          ))}
        </g>
      ))}

      {/* RỄ CÂY */}
      {phatTrien > 40 && (
        <g opacity="0.65">
          <path d="M 390 550 Q 380 565 365 570" fill="none" stroke="#4E342E" strokeWidth={trunkWidth/2} strokeLinecap="round" />
          <path d="M 410 550 Q 420 568 440 575" fill="none" stroke="#4E342E" strokeWidth={trunkWidth/2} strokeLinecap="round" />
        </g>
      )}
      {/* LÁ RỤNG TRÊN MẶT ĐẤT (FALLEN LEAVES) */}
      {evolutionStage >= 3 && (
        <g className="fallen-leaves-layer" opacity="0.75">
          {/* Một số lá xanh rụng nhẹ */}
          <path d="M 370 552 C 367 550, 365 553, 370 552" fill={leafColor} transform="rotate(15, 370, 552)" />
          <path d="M 385 554 C 382 552, 380 555, 385 554" fill={leafColor} transform="rotate(-10, 385, 554)" />
          <path d="M 425 553 C 422 551, 420 554, 425 553" fill={leafColor} transform="rotate(35, 425, 553)" />
          <path d="M 440 556 C 437 554, 435 557, 440 556" fill={leafColor} transform="rotate(-25, 440, 556)" />
          {/* Nếu có mâu thuẫn lớn hoặc chuỗi học tập học bị đứt quãng, rụng thêm lá khô úa màu nâu */}
          {(contradictionLevel > 40 || stats?.studyStreak === 0) && (
            <>
              <path d="M 355 555 C 352 553, 350 556, 355 555" fill="#8D6E63" transform="rotate(45, 355, 555)" />
              <path d="M 412 555 C 409 553, 407 556, 412 555" fill="#8D6E63" transform="rotate(-40, 412, 555)" />
            </>
          )}
        </g>
      )}
      {/* HÀO QUANG GRADIENT ĐẶC BIỆT */}
      <defs>
        <radialGradient id="auroraGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="1" />
          <stop offset="60%" stopColor="#81C784" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgba(129, 199, 132, 0)" />
        </radialGradient>
      </defs>

      {/* CLICKABLE BACKING ZONE FOR EASY TARGETING */}
      <circle
        cx="400"
        cy={550 - height / 2}
        r={height * 0.65}
        fill="rgba(0,0,0,0)"
        className="cursor-pointer pointer-events-auto"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </g>
  );
}
