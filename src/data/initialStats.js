export const initialStats = {
  phatTrien: 30,
  sucKhoe: 50,
  triThuc: 0,
  kyLuat: 40,
  camXuc: 50,
  moiQuanHe: 50,
  apLuc: 30,
  sangTao: 40,
  kienTri: 0,
  tuTin: 40,
  
  // Chỉ số nâng cao phục vụ hệ thống Biện Chứng và Tiến Hóa
  bienChung: 15,           // Chỉ số Biện Chứng (0 -> 100)
  evolutionStage: 1,       // 1: Hạt giống, 2: Mầm non, 3: Cây tơ, 4: Thử thách (Lụi tàn), 5: Tái sinh, 6: Cây cổ thụ vĩ đại
  
  // Chỉ số tích lũy lượng (Streaks)
  studyStreak: 0,
  healthStreak: 0,
  relationStreak: 0,
  
  // Thống kê để tính chỉ số Biện chứng
  resolvedContradictionsCount: 0,
  qualityBreakthroughsCount: 0,
  completedGoalsCount: 0
};

export const statLabels = {
  phatTrien: { label: "Phát Triển Tổng Thể", desc: "Thể hiện tầm vóc và sự trưởng thành của khu vườn (Chiều cao cây)" },
  sucKhoe: { label: "Sức Khỏe Thể Chất", desc: "Thể chất tốt giúp lá xanh tươi và tán lá xum xuê (Số lượng lá)" },
  triThuc: { label: "Trí Thức & Học Vấn", desc: "Học tập tích lũy tri thức làm đơm hoa kết trái trí tuệ (Số lượng hoa)" },
  kyLuat: { label: "Kỷ Luật & Thói Quen", desc: "Kỷ luật giúp thân cây vững chãi, mọc thẳng kiêu hãnh (Độ thẳng của thân)" },
  camXuc: { label: "Cảm Xúc & Tâm Hồn", desc: "Tâm hồn an yên đem lại nắng ấm và xua tan mây mù (Độ sáng mặt trời & Cầu vồng)" },
  moiQuanHe: { label: "Mối Quan Hệ Xã Hội", desc: "Tình bạn và tình thân thu hút ong bướm vây quanh (Số bướm bay lượn)" },
  apLuc: { label: "Áp Lực & Thử Thách", desc: "Gánh nặng cuộc sống tích tụ mây đen, giông bão (Mây đen & Mưa gió)" },
  sangTao: { label: "Sáng Tạo & Đổi Mới", desc: "Sự đổi mới làm đa dạng sắc màu của cỏ hoa và sinh vật lạ" },
  kienTri: { label: "Kiên Trì & Bền Bỉ", desc: "Sự bền bỉ kiên gan giúp hoa kết thành quả ngọt chín đỏ (Số lượng quả)" },
  tuTin: { label: "Tự Tin & Bản Lĩnh", desc: "Bản lĩnh thu hút chim quý muông thú về làm tổ (Số lượng chim)" },
  bienChung: { label: "Điểm Biện Chứng", desc: "Điểm phản ánh năng lực giải quyết mâu thuẫn, tích lũy lượng đổi chất và hoàn thành mục tiêu" }
};
