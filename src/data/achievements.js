export const achievements = [
  {
    id: "giao_hat",
    title: "Người Gieo Hạt Nhân Quả",
    description: "Hoàn thành 3 công việc bất kỳ để gieo hạt giống nguyên nhân đầu tiên.",
    icon: "🌱",
    requirement: "Hoàn thành 3 công việc",
    check: (stats, completedTasksCount) => completedTasksCount >= 3
  },
  {
    id: "vun_trong",
    title: "Người Vun Trồng Bền Bỉ",
    description: "Hoàn thành 12 công việc. Sự tích lũy đang làm biến đổi khu vườn từng ngày.",
    icon: "🏡",
    requirement: "Hoàn thành 12 công việc",
    check: (stats, completedTasksCount) => completedTasksCount >= 12
  },
  {
    id: "kien_tao",
    title: "Người Kiến Tạo Đại Ngàn",
    description: "Hoàn thành 30 công việc. Một khu vườn sinh thái rộng lớn phản chiếu lối sống vững chãi.",
    icon: "🌳",
    requirement: "Hoàn thành 30 công việc",
    check: (stats, completedTasksCount) => completedTasksCount >= 30
  },
  {
    id: "luong_doi_chat_doi",
    title: "Bước Nhảy Vọt Về Chất",
    description: "Có ít nhất một chỉ số đạt từ 80 trở lên. Quá trình tích lũy lượng đã tạo nên biến đổi nhảy vọt.",
    icon: "⚡",
    requirement: "Có chỉ số đạt >= 80",
    check: (stats) => Object.values(stats).some(val => val >= 80)
  },
  {
    id: "thuc_tien",
    title: "Nhà Biện Chứng Thực Tiễn",
    description: "Hoàn thành 5 công việc thực hành (Làm đồ án, Tập gym, Chạy bộ, Viết nhật ký). Tri thức chỉ có giá trị khi đi vào thực tiễn.",
    icon: "🛠️",
    requirement: "Đưa tri thức vào hành động thực tế",
    check: (stats) => stats.phatTrien >= 50 && stats.kyLuat >= 50
  },
  {
    id: "doi_lap_thong_nhat",
    title: "Sự Thống Nhất Các Mặt Đối Lập",
    description: "Cân bằng hoàn hảo giữa Kỷ luật (>= 60) và Cảm xúc (>= 60). Hai mặt đối lập bổ sung cho nhau.",
    icon: "☯️",
    requirement: "Kỷ luật >= 60 và Cảm xúc >= 60",
    check: (stats) => stats.kyLuat >= 60 && stats.camXuc >= 60
  },
  {
    id: "vuot_qua_thu_thach",
    title: "Phủ Định Của Phủ Định",
    description: "Vượt qua áp lực cao (Áp Lực đạt >= 60 nhưng Kiên Trì đạt >= 60). Sự phủ định cái cũ để vươn lên tầm cao mới.",
    icon: "🏔️",
    requirement: "Đối mặt áp lực lớn bằng sự kiên trì bền bỉ",
    check: (stats) => stats.apLuc >= 60 && stats.kienTri >= 60
  },
  {
    id: "uy_tin_muon_thu",
    title: "Hài Hòa Phổ Biến",
    description: "Thu hút đầy đủ chim quý và bướm lượn (Mối Quan Hệ >= 70 và Tự Tin >= 70). Thể hiện mối liên hệ phổ biến và hài hòa xã hội.",
    icon: "🦜",
    requirement: "Mối Quan Hệ >= 70 và Tự Tin >= 70",
    check: (stats) => stats.moiQuanHe >= 70 && stats.tuTin >= 70
  }
];
