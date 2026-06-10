// Helper tính toán các thuộc tính động của khu vườn dựa trên chỉ số

// 1. Chuyển đổi trị số chỉ số (0-100) sang các khoảng giá trị thực tế của SVG
export function interpolate(val, minTarget, maxTarget, minSource = 0, maxSource = 100) {
  const boundedVal = Math.max(minSource, Math.min(maxSource, val));
  return minTarget + ((boundedVal - minSource) / (maxSource - minSource)) * (maxTarget - minTarget);
}

// Helper lấy tỷ lệ kích thước vật lý của cây dựa theo cấp tiến hóa để tăng trưởng tự nhiên
export function getScaleFactor(evolutionStage) {
  if (evolutionStage === 1) return 0; // Hạt giống (không có thân cây vẽ kiểu này)
  if (evolutionStage === 2) return 0; // Mầm non (vẽ mầm riêng)
  if (evolutionStage === 3) return 0.65; // Cây tơ (nhỏ nhắn, mảnh mai)
  if (evolutionStage === 4) return 0.75; // Thử thách lụi tàn (bị co lại nhẹ)
  if (evolutionStage === 5) return 1.0;  // Tái sinh (kích thước đầy đủ)
  if (evolutionStage === 6) return 1.4;  // Cổ thụ vĩ đại (phóng to cực đại)
  return 1.0;
}

// 2. Tính toán đường dẫn cho thân cây chính (Tree Trunk SVG Path)
// Chiều cao cây phụ thuộc vào phatTrien (từ 100 đến 350px)
// Kỷ luật cao (kyLuat >= 70): Thân mọc thẳng đứng (sway gần 0)
// Kỷ luật thấp (kyLuat < 40): Thân mọc cong vẹo, nghiêng lệch (sway từ -40 đến 40px)
export function getTreeTrunkPath(phatTrien, kyLuat, scaleFactor = 1.0) {
  const height = interpolate(phatTrien, 150, 320) * scaleFactor;
  
  // Độ nghiêng của thân cây tỷ lệ nghịch với Kỷ Luật
  // Kỷ luật càng cao, cây càng thẳng (độ lệch gần 0). Kỷ luật thấp, cây lệch nhiều
  const maxSway = interpolate(100 - kyLuat, 0, 70) * scaleFactor; 
  // Dùng hạt giống kỷ luật để tạo hướng nghiêng cố định
  const swayDirection = kyLuat % 2 === 0 ? 1 : -1;
  const sway = maxSway * swayDirection;

  const startX = 400;
  const startY = 550;
  
  const endX = startX + sway;
  const endY = startY - height;
  
  const cp1X = startX;
  const cp1Y = startY - height * 0.4;
  
  const cp2X = startX + sway * 0.5;
  const cp2Y = startY - height * 0.8;
  
  return {
    path: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
    endX,
    endY,
    height,
    sway
  };
}

// 3. Tạo các điểm định vị cho cành cây
export function getBranchPoints(trunkEndX, trunkEndY, height, sway, sucKhoe) {
  // Số cành phụ thuộc vào sức khỏe thể chất (tối đa 4 cành chính)
  const numBranches = Math.min(4, Math.max(2, Math.floor(interpolate(sucKhoe, 2, 4.9))));
  const branches = [];
  
  for (let i = 0; i < numBranches; i++) {
    const angle = (i % 2 === 0 ? -1 : 1) * interpolate(sucKhoe + i * 5, 25, 45); // góc mở cành
    const length = height * interpolate(sucKhoe, 0.3, 0.55); // chiều dài cành
    
    // Điểm xuất phát của cành trải dọc thân cây từ 50% chiều cao trở lên
    const ratio = 0.5 + (i / numBranches) * 0.45;
    const startX = 400 + sway * ratio;
    const startY = 550 - height * ratio;
    
    // Điểm kết thúc cành (dùng lượng giác cơ bản)
    const rad = (angle * Math.PI) / 180;
    const endX = startX + length * Math.sin(rad);
    const endY = startY - length * Math.cos(rad);
    
    branches.push({ startX, startY, endX, endY, length, angle });
  }
  
  return branches;
}

// 4. Định nghĩa bảng màu của khu vườn theo các mùa
export function getSeasonalColors(phatTrienTotal) {
  // Tổng chỉ số phát triển quyết định mùa hiện tại
  // phatTrienTotal từ 0 -> 400+: Xuân -> Hạ -> Thu -> Đông
  if (phatTrienTotal < 150) {
    return {
      season: "Xuân",
      bgGradient: "from-emerald-50 via-teal-50 to-amber-50",
      skyColor: "#E0F2F1",
      groundColor: "#A5D6A7",
      leafColor: "#81C784", // Xanh non lá mạ
      waterColor: "#80DEEA",
      description: "Tiết xuân ấm áp, vạn vật đâm chồi nảy lộc. Khu vườn mới bắt đầu tích lũy năng lượng."
    };
  } else if (phatTrienTotal < 350) {
    return {
      season: "Hạ",
      bgGradient: "from-sky-100 via-blue-50 to-emerald-50",
      skyColor: "#B3E5FC",
      groundColor: "#81C784",
      leafColor: "#2E7D32", // Xanh lục đậm, sum suê
      waterColor: "#4FC3F7",
      description: "Mùa hạ rực rỡ, ánh mặt trời chói chang, cây cối phát triển xum xuê đón nhận nguồn lực mạnh mẽ."
    };
  } else if (phatTrienTotal < 600) {
    return {
      season: "Thu",
      bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
      skyColor: "#FFE082",
      groundColor: "#C5E1A5",
      leafColor: "#FFB300", // Lá vàng, cam thu lãng mạn
      waterColor: "#81D4FA",
      description: "Tiết trời thu mát mẻ, lá chuyển sắc vàng đỏ. Quả ngọt tích lũy qua năm tháng bắt đầu chín."
    };
  } else {
    return {
      season: "Đông",
      bgGradient: "from-slate-100 via-zinc-100 to-sky-50",
      skyColor: "#ECEFF1",
      groundColor: "#EEEEEE",
      leafColor: "#B0BEC5", // Xanh bạc xám đông cô tịch
      waterColor: "#B0BEC5",
      description: "Mùa đông giá rét, cây trút lá dưỡng sức. Đây là thời kỳ phủ định biện chứng để chuẩn bị hồi sinh."
    };
  }
}
