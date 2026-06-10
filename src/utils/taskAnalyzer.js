// Hệ thống phân tích hành vi và triết học biện chứng chuyên sâu

const DB = [
  // 1. Học ngoại ngữ
  {
    keywords: ["tiếng anh", "tiếng nhật", "tiếng trung", "tiếng hàn", "ngoại ngữ", "english", "japanese", "vocabulary", "từ vựng", "toeic", "ielts"],
    category: "study",
    getNguyenNhan: (taskText) => `Giải mã và chuyển hóa hệ ngôn ngữ mới: "${taskText}"`,
    heQuaNganHan: "Tái cấu trúc tế bào não bộ, hình thành các liên kết thần kinh mới.",
    heQuaDaiHan: "Phá vỡ rào cản thế giới quan cũ, mở rộng khả năng tiếp cận tri thức nhân loại.",
    khaiNiemTrieuHoc: ["Nhận thức luận", "Sự thống nhất trong đa dạng", "Phủ định biện chứng"],
    giaiThich: "Ngôn ngữ không chỉ là công cụ, mà là hiện thực trực tiếp của tư duy. Việc học ngoại ngữ là quá trình tự phủ định hệ thống ký hiệu quen thuộc để thiết lập một thế giới quan đa chiều hơn.",
    suKienVuon: "Đóa hoa tri thức mang sắc lam nhạt khẽ hé nở, tỏa ra hương thơm thanh khiết.",
    thayDoiChiSo: { phatTrien: 4, sucKhoe: 0, triThuc: 9, kyLuat: 5, camXuc: 3, moiQuanHe: 0, apLuc: 1, sangTao: 5, kienTri: 6, tuTin: 5 }
  },
  // 2. Đọc sách
  {
    keywords: ["đọc sách", "doc sach", "đọc truyện", "đọc tiểu thuyết", "đọc tài liệu", "review sách", "sách triết", "đọc báo"],
    category: "study",
    getNguyenNhan: (taskText) => `Cuộc đối thoại tư tưởng xuyên thời gian với tác phẩm: "${taskText}"`,
    heQuaNganHan: "Ý thức tạm thời tách ly khỏi kích thích cảm tính vụn vặt để tập trung tư duy sâu.",
    heQuaDaiHan: "Xây dựng hệ thống tri thức lý luận bền vững, gạn lọc nhân sinh quan sâu sắc.",
    khaiNiemTrieuHoc: ["Nhận thức lý tính", "Mối liên hệ phổ biến", "Chuyển hóa Lượng - Chất"],
    giaiThich: "Đọc sách là tiến trình vượt ngưỡng từ nhận thức cảm tính (quan sát bề nổi) lên nhận thức lý tính (bản chất sâu xa). Sự tích lũy lặng lẽ qua từng trang sách chuẩn bị cho bước nhảy vọt của trí tuệ.",
    suKienVuon: "Đóa hoa Sakura tri thức chớm nở trên nhánh cây cao nhất, lấp lánh ánh sáng ban mai.",
    thayDoiChiSo: { phatTrien: 4, sucKhoe: 0, triThuc: 10, kyLuat: 4, camXuc: 5, moiQuanHe: 0, apLuc: -2, sangTao: 6, kienTri: 5, tuTin: 4 }
  },
  // 3. Viết code / lập trình
  {
    keywords: ["code", "lập trình", "lap trinh", "github", "bug", "fix bug", "dự án công nghệ", "coding", "software", "làm web"],
    category: "study",
    getNguyenNhan: (taskText) => `Hoạt động mô hình hóa thế giới quan bằng logic số: "${taskText}"`,
    heQuaNganHan: "Thiết lập trật tự logic chặt chẽ, rèn luyện tư duy thuật toán.",
    heQuaDaiHan: "Tạo ra các công cụ số có khả năng cải tạo thực tại hiệu quả, vật hóa ý tưởng sáng tạo.",
    khaiNiemTrieuHoc: ["Vật hóa ý niệm", "Quy luật đồng nhất", "Giải quyết mâu thuẫn"],
    giaiThich: "Viết mã nguồn là quá trình 'vật hóa' các cấu trúc tư duy trừu tượng thành sản phẩm thực tế. Mỗi lần sửa lỗi (fix bug) là một cuộc đấu tranh giải quyết mâu thuẫn logic để đạt đến sự đồng bộ hoàn thiện.",
    suKienVuon: "Một chồi lá xanh ngọc bảo sắc sảo vươn ra đón luồng gió mới.",
    thayDoiChiSo: { phatTrien: 4, sucKhoe: -1, triThuc: 8, kyLuat: 5, camXuc: 2, moiQuanHe: 0, apLuc: 3, sangTao: 8, kienTri: 7, tuTin: 6 }
  },
  // 4. Học tập nói chung
  {
    keywords: ["học", "hoc", "ôn thi", "làm bài", "nghiên cứu", "nghiên cứu khoa học", "seminar", "thuyết trình", "slide", "lớp", "trường"],
    category: "study",
    getNguyenNhan: (taskText) => `Tích lũy tri thức chuyên môn tự thân: "${taskText}"`,
    heQuaNganHan: "Hệ thống hóa thông tin, củng cố lý luận chuyên ngành.",
    heQuaDaiHan: "Nâng tầm năng lực thực tiễn, làm chủ các công cụ lao động trí óc.",
    khaiNiemTrieuHoc: ["Quy luật Lượng - Chất", "Nhận thức luận Mác-Lênin"],
    giaiThich: "Học tập là lao động trí óc có mục đích. Quá trình này đòi hỏi sự tích lũy nghiêm túc về 'lượng' thông tin và kỹ năng học hỏi để tạo nên bước nhảy chuyển hóa về 'chất' năng lực tư duy phản biện.",
    suKienVuon: "Nhánh tri thức mọc dài thêm vài phân, lá xanh mướt hướng về phía mặt trời.",
    thayDoiChiSo: { phatTrien: 3, sucKhoe: -1, triThuc: 8, kyLuat: 6, camXuc: 1, moiQuanHe: 1, apLuc: 4, sangTao: 3, kienTri: 6, tuTin: 5 }
  },
  // 5. Chạy bộ / Đi bộ
  {
    keywords: ["chạy bộ", "chay bo", "đi bộ", "di bo", "marathon", "cardio", "jogging", "walking", "chạy"],
    category: "health",
    getNguyenNhan: (taskText) => `Sự chuyển động cơ học tự chủ kích hoạt sinh lực thể xác: "${taskText}"`,
    heQuaNganHan: "Tăng cường tuần hoàn máu, giải phóng endorphin tạo cảm giác an nhiên.",
    heQuaDaiHan: "Tối ưu hóa thể trạng vật chất, tạo nền tảng vững chắc cho tinh thần hoạt động bền bỉ.",
    khaiNiemTrieuHoc: ["Vận động là phương thức tồn tại của vật chất", "Thống nhất tinh thần và thể chất"],
    giaiThich: "Thế giới vật chất tồn tại bằng vận động. Việc di chuyển cơ thể trong không gian là nỗ lực tự vận động chủ động, đẩy lùi lực trì trệ tích tụ của vật chất thụ động.",
    suKienVuon: "Nước hồ gợn sóng trong vắt phản chiếu nền trời tươi sáng.",
    thayDoiChiSo: { phatTrien: 3, sucKhoe: 10, triThuc: 0, kyLuat: 7, camXuc: 7, moiQuanHe: 0, apLuc: -6, sangTao: 3, kienTri: 7, tuTin: 7 }
  },
  // 6. Tập gym / Thể hình / Thể thao nặng
  {
    keywords: ["gym", "tập tạ", "push up", "hít đất", "tập cơ", "workout", "đá bóng", "đá cầu", "bơi", "cầu lông", "tennis", "bóng rổ", "võ thuật"],
    category: "health",
    getNguyenNhan: (taskText) => `Lao động thực tiễn trực tiếp rèn luyện vật chất cơ thể: "${taskText}"`,
    heQuaNganHan: "Phá vỡ cấu trúc cơ cũ để kích thích sự tái cấu trúc bền bỉ hơn.",
    heQuaDaiHan: "Rèn đúc ý chí vượt khó và một thể hình khỏe mạnh tựa đá tảng.",
    khaiNiemTrieuHoc: ["Phủ định biện chứng", "Đấu tranh của các mặt đối lập"],
    giaiThich: "Để cơ bắp lớn lên, nó phải chịu áp lực phá vỡ cấu trúc cũ (phủ định). Tập luyện là quá trình đấu tranh vượt qua sự đau mỏi thể xác để kiến tạo một cấu trúc sinh học mạnh mẽ hơn.",
    suKienVuon: "Cây nhân sinh rung động mạnh mẽ, rũ bỏ những cánh lá héo úa cũ kỹ.",
    thayDoiChiSo: { phatTrien: 4, sucKhoe: 10, triThuc: 0, kyLuat: 8, camXuc: 6, moiQuanHe: 2, apLuc: -4, sangTao: 1, kienTri: 8, tuTin: 8 }
  },
  // 7. Thiền / Yoga / Hơi thở
  {
    keywords: ["thiền", "thien", "meditation", "yoga", "hơi thở", "tĩnh tâm", "breath", "mindfulness", "hít thở"],
    category: "mind",
    getNguyenNhan: (taskText) => `Sự quay về quan sát và làm chủ tâm thức nội tại: "${taskText}"`,
    heQuaNganHan: "Tĩnh lặng hóa các xung đột suy nghĩ nhiễu loạn trong não bộ.",
    heQuaDaiHan: "Phát triển khả năng định tâm sâu sắc, làm chủ các phản ứng cảm xúc bản năng.",
    khaiNiemTrieuHoc: ["Ý thức tự giác", "Sự thống nhất của cảm xúc", "Phản tư biện chứng"],
    giaiThich: "Tĩnh lặng không phải là đứng yên thụ động, mà là sự vận động hướng nội ở trình độ cao. Ý thức tự soi chiếu chính nó (phản tư) để nhận diện bản chất chân thực sau các hiện tượng cảm xúc trôi nổi.",
    suKienVuon: "Sương mù mờ ảo quanh gốc cây tan biến, trả lại không gian tĩnh mịch an yên.",
    thayDoiChiSo: { phatTrien: 3, sucKhoe: 6, triThuc: 4, kyLuat: 6, camXuc: 9, moiQuanHe: 0, apLuc: -8, sangTao: 4, kienTri: 6, tuTin: 5 }
  },
  // 8. Viết nhật ký / Phản tư cá nhân
  {
    keywords: ["nhật ký", "nhat ky", "journal", "phản tư", "phan tu", "tự vấn", "suy ngẫm", "reflection", "tự học triết"],
    category: "mind",
    getNguyenNhan: (taskText) => `Tự ý thức soi xét dòng lịch sử cá nhân: "${taskText}"`,
    heQuaNganHan: "Cụ thể hóa cảm xúc trừu tượng thành ngôn từ rõ ràng trên trang viết.",
    heQuaDaiHan: "Ghi lại dấu vết trải nghiệm, tích lũy bài học nhân sinh biện chứng.",
    khaiNiemTrieuHoc: ["Phản tư biện chứng", "Phủ định của phủ định"],
    giaiThich: "Viết nhật ký là quá trình tự đối thoại. Cá nhân tự đặt mình vào vị thế 'khách thể' để nhận xét, phê bình hành vi của mình (chủ thể), thực hiện sự phủ định biện chứng cái tôi cũ để hướng đến cái tôi tiến bộ hơn.",
    suKienVuon: "Lá vàng nhạt khẽ rơi xuống hồ nước gợn sóng nhẹ nhàng.",
    thayDoiChiSo: { phatTrien: 3, sucKhoe: 1, triThuc: 5, kyLuat: 5, camXuc: 8, moiQuanHe: 0, apLuc: -5, sangTao: 5, kienTri: 5, tuTin: 6 }
  },
  // 9. Tiktok / Facebook / Mạng xã hội vô bổ
  {
    keywords: ["tiktok", "facebook", "lướt mạng", "luot facebook", "instagram", "youtube shorts", "reels", "mạng xã hội", "social media", "vô bổ", "vo bo", "lướt web", "tin tức nhảm"],
    category: "waste",
    getNguyenNhan: (taskText) => `Tiêu tán ý thức tự giác vào luồng kích thích dopamine hời hợt: "${taskText}"`,
    heQuaNganHan: "Thỏa mãn dopamine tức thời, nhưng làm phân rã khả năng tập trung sâu.",
    heQuaDaiHan: "Hình thành thói quen trốn tránh thực tại vật chất, bào mòn năng lực tự chủ.",
    khaiNiemTrieuHoc: ["Tha hóa ý thức", "Mâu thuẫn giữa Khoái cảm ngắn hạn và Tồn tại dài hạn"],
    giaiThich: "Lướt mạng xã hội quá đà là biểu hiện của sự tha hóa ý thức bởi các thuật toán thương mại. Bạn đang để các hiện tượng giải trí ảo định hình hành vi, phủ định năng lực tự quyết biện chứng của bản thân.",
    suKienVuon: "Một vài chiếc lá héo úa chuyển sang màu nâu khô rũ xuống.",
    thayDoiChiSo: { phatTrien: -3, sucKhoe: -2, triThuc: -3, kyLuat: -7, camXuc: 3, moiQuanHe: -2, apLuc: 4, sangTao: -3, kienTri: -5, tuTin: -4 }
  },
  // 10. Game / Giải trí quá đà
  {
    keywords: ["game", "chơi game", "choi game", "liên quân", "lien quan", "pubg", "lol", "tốc chiến", "play game", "gaming", "đột kích", "ps5"],
    category: "waste",
    getNguyenNhan: (taskText) => `Trốn tránh các mâu thuẫn thực tế để ẩn náu vào thế giới giả lập: "${taskText}"`,
    heQuaNganHan: "Đạt thành tựu ảo dễ dàng, giải tỏa căng thẳng tạm thời.",
    heQuaDaiHan: "Dồn nén các công việc thực tiễn, tạo áp lực lớn khi thực tại ập đến.",
    khaiNiemTrieuHoc: ["Thực tại giả lập", "Mâu thuẫn giữa Lý tưởng ảo và Thực tiễn thực tế"],
    giaiThich: "Trò chơi điện tử cung cấp một hệ thống nhân quả giả lập dễ dàng. Việc nghiện game phản ánh sự né tránh giải quyết các mâu thuẫn biện chứng trong cuộc sống thực - nơi đòi hỏi nỗ lực gian khổ hơn nhiều để đạt được bước nhảy chất.",
    suKienVuon: "Một nhánh khô rũ xuất hiện ở thân cây phía dưới.",
    thayDoiChiSo: { phatTrien: -3, sucKhoe: -3, triThuc: -2, kyLuat: -6, camXuc: 4, moiQuanHe: -1, apLuc: 5, sangTao: -2, kienTri: -4, tuTin: -3 }
  },
  // 11. Gia đình / Bố mẹ
  {
    keywords: ["gia đình", "gia dinh", "bố mẹ", "bo me", "gọi điện", "goi dien", "thăm", "giúp đỡ bố mẹ", "dọn dẹp nhà cửa", "quét nhà", "nấu ăn", "quét", "dọn dẹp", "rửa bát"],
    category: "relationship",
    getNguyenNhan: (taskText) => `Củng cố sợi dây liên kết biện chứng nguyên sơ nhất của đời sống: "${taskText}"`,
    heQuaNganHan: "Nuôi dưỡng cảm xúc ấm áp, làm dịu áp lực tinh thần.",
    heQuaDaiHan: "Xây dựng bệ đỡ gia đình vững chãi để nâng đỡ cá nhân trước bão giông xã hội.",
    khaiNiemTrieuHoc: ["Bản chất con người là tổng hòa các mối quan hệ xã hội", "Mối liên hệ phổ biến"],
    giaiThich: "Con người không tồn tại biệt lập. Gia đình là tế bào xã hội và là mối liên hệ biện chứng đầu tiên định hình ý thức cá nhân. Quan tâm gia đình chính là chăm sóc phần gốc rễ của bản thể xã hội.",
    suKienVuon: "Những cánh bướm vàng dịu dàng bay lượn quanh gốc cây nhân sinh.",
    thayDoiChiSo: { phatTrien: 2, sucKhoe: 1, triThuc: 0, kyLuat: 2, camXuc: 8, moiQuanHe: 10, apLuc: -5, sangTao: 2, kienTri: 4, tuTin: 5 }
  },
  // 12. Bạn bè / Người yêu / Kết nối xã hội
  {
    keywords: ["bạn bè", "ban be", "người yêu", "nguoi yeu", "tâm sự", "chia sẻ", "gặp gỡ", "đi chơi", "hẹn hò", "giúp đỡ", "nhắn tin", "tro chuyen", "trò chuyện"],
    category: "relationship",
    getNguyenNhan: (taskText) => `Hoạt động tương tác xã hội củng cố mối liên hệ liên cá nhân: "${taskText}"`,
    heQuaNganHan: "Hòa nhập ý thức cá nhân vào dòng chảy ý thức nhóm, giải tỏa sự cô đơn vị kỷ.",
    heQuaDaiHan: "Kiến tạo mạng lưới quan hệ xã hội phong phú, nâng cao trí tuệ cảm xúc.",
    khaiNiemTrieuHoc: ["Tồn tại xã hội quyết định ý thức", "Sự thống nhất và đấu tranh của các thế giới quan"],
    giaiThich: "Mỗi cuộc trò chuyện sâu sắc là sự cọ xát biện chứng giữa hai thế giới quan độc lập. Quá trình này giúp cá nhân hiểu sâu hơn về chính mình thông qua lăng kính phản chiếu của người khác.",
    suKienVuon: "Những chú chim sẻ nhỏ ríu rít sà xuống cành cây đùa giỡn.",
    thayDoiChiSo: { phatTrien: 2, sucKhoe: 0, triThuc: 1, kyLuat: 2, camXuc: 7, moiQuanHe: 9, apLuc: -4, sangTao: 3, kienTri: 3, tuTin: 5 }
  },
  // 13. Sáng tạo nghệ thuật / Vẽ / Thiết kế / Âm nhạc
  {
    keywords: ["vẽ", "ve", "vẽ tranh", "đàn", "guitar", "piano", "hát", "sing", "nghe nhạc", "làm nhạc", "sáng tác", "viết văn", "làm thơ", "thiết kế", "design", "vẽ vời"],
    category: "creative",
    getNguyenNhan: (taskText) => `Hoạt động tự biểu hiện của ý thức thẩm mỹ chủ quan: "${taskText}"`,
    heQuaNganHan: "Vật hóa cảm xúc nội tâm thành các cấu trúc thẩm mỹ khách quan.",
    heQuaDaiHan: "Phát triển tư duy trực giác nhạy bén, làm giàu đời sống tâm hồn.",
    khaiNiemTrieuHoc: ["Vật hóa tinh thần", "Nhận thức thẩm mỹ"],
    giaiThich: "Sáng tạo nghệ thuật là quá trình tinh thần chủ quan tự khách quan hóa chính mình vào thế giới vật chất (tranh vẽ, bản nhạc, bài thơ). Đây là nỗ lực tự do cao nhất để khẳng định bản ngã sáng tạo của con người.",
    suKienVuon: "Một dải cầu vồng mờ ảo lấp lánh xuất hiện ở phía sau tán cây cổ thụ.",
    thayDoiChiSo: { phatTrien: 3, sucKhoe: 0, triThuc: 3, kyLuat: 3, camXuc: 8, moiQuanHe: 2, apLuc: -5, sangTao: 10, kienTri: 4, tuTin: 6 }
  }
];

export function analyzeTaskMock(taskText) {
  const text = taskText.toLowerCase().trim();
  
  // Tìm kiếm trong cơ sở dữ liệu từ khóa
  const matched = DB.find(item => item.keywords.some(kw => text.includes(kw)));
  
  if (matched) {
    const nguyenNhan = matched.getNguyenNhan(taskText);
    return {
      nguyenNhan,
      heQuaNganHan: matched.heQuaNganHan,
      heQuaDaiHan: matched.heQuaDaiHan,
      khaiNiemTrieuHoc: matched.khaiNiemTrieuHoc,
      giaiThich: matched.giaiThich,
      thayDoiChiSo: matched.thayDoiChiSo,
      suKienVuon: matched.suKienVuon,
      category: matched.category,
      causalGraph: {
        nodes: [
          { id: "n1", label: `Nguyên nhân:\n${taskText}`, type: "cause" },
          { id: "n2", label: matched.heQuaNganHan, type: "step" },
          { id: "n3", label: matched.heQuaDaiHan, type: "step" },
          { id: "n4", label: `Chuyển biến:\n${matched.khaiNiemTrieuHoc[0]}`, type: "effect" }
        ],
        edges: [
          { from: "n1", to: "n2" },
          { from: "n2", to: "n3" },
          { from: "n3", to: "n4" }
        ]
      }
    };
  }

  // Fallback động nếu không khớp từ khóa cụ thể
  let category = "other";
  let labels = ["Mối liên hệ phổ biến", "Thực tiễn"];
  let giaiThich = `Hành động "${taskText}" là một biểu hiện sinh động của thực tiễn đời sống cá nhân, nằm trong lưới liên hệ biện chứng đa chiều của bản thể xã hội.`;
  let nguyenNhan = `Hành động thực tiễn chủ động: "${taskText}"`;
  let heQuaNganHan = "Ghi dấu ấn ý chí cá nhân lên thực tại khách quan hàng ngày.";
  let heQuaDaiHan = "Tích lũy phản hồi thực tiễn để định hình năng lực thích ứng của bản thân.";
  let suKienVuon = "Một chiếc lá nhỏ đung đưa trong làn gió mát lành.";
  
  let thayDoiChiSo = {
    phatTrien: 2,
    sucKhoe: 0,
    triThuc: 0,
    kyLuat: 2,
    camXuc: 1,
    moiQuanHe: 0,
    apLuc: 0,
    sangTao: 0,
    kienTri: 1,
    tuTin: 1
  };

  if (text.includes("học") || text.includes("đọc") || text.includes("sách") || text.includes("học tập") || text.includes("tìm hiểu")) {
    category = "study";
    labels = ["Quy luật Lượng - Chất", "Nhận thức luận"];
    giaiThich = `Hoạt động tự học "${taskText}" củng cố lý luận nhận thức. Quá trình tích lũy liên tục kiến thức là điều kiện tiên quyết cho sự bứt phá về chất lượng tư duy.`;
    nguyenNhan = `Gieo hạt giống tri thức: "${taskText}"`;
    heQuaNganHan = "Làm giàu vốn hiểu biết lý thuyết chuyên sâu.";
    heQuaDaiHan = "Chuyển hóa nhận thức cảm tính đơn thuần thành tri thức lý tính có tính hệ thống.";
    thayDoiChiSo = { phatTrien: 3, sucKhoe: 0, triThuc: 7, kyLuat: 4, camXuc: 1, moiQuanHe: 0, apLuc: 2, sangTao: 3, kienTri: 5, tuTin: 4 };
  } else if (text.includes("tập") || text.includes("gym") || text.includes("chạy") || text.includes("thể thao") || text.includes("sức khỏe") || text.includes("bơi")) {
    category = "health";
    labels = ["Thực tiễn", "Thống nhất tinh thần - thể xác"];
    giaiThich = `Rèn luyện thể chất thông qua "${taskText}" là hành vi cải tạo thực tại vật chất trực tiếp nhất. Một thể trạng khỏe mạnh chính là bệ nâng vật lý vững chắc cho ý thức tinh thần tồn tại bền vững.`;
    nguyenNhan = `Hành động rèn đúc sinh lực: "${taskText}"`;
    heQuaNganHan = "Đẩy lùi sự trì trệ cơ học của cơ thể, giải phóng năng lượng tích tụ.";
    heQuaDaiHan = "Nâng cao sức chống chịu khách quan trước áp lực môi trường sống.";
    thayDoiChiSo = { phatTrien: 3, sucKhoe: 8, triThuc: 0, kyLuat: 5, camXuc: 5, moiQuanHe: 1, apLuc: -4, sangTao: 1, kienTri: 6, tuTin: 6 };
  } else if (text.includes("game") || text.includes("facebook") || text.includes("tiktok") || text.includes("lướt") || text.includes("vô bổ")) {
    category = "waste";
    labels = ["Sự tha hóa ý thức", "Khoái cảm ngắn hạn và Tồn tại dài hạn"];
    giaiThich = `Việc tiêu phí thời gian vào "${taskText}" là sự thỏa hiệp trước các kích thích dễ dãi từ bên ngoài. Bạn đang phủ định năng lực tự chủ để rơi vào trạng thái thụ động trôi nổi trước dòng chảy của ngoại cảnh.`;
    nguyenNhan = `Sự sa đà vào các kích thích ảo hời hợt: "${taskText}"`;
    heQuaNganHan = "Gia tăng dopamine ngắn hạn, tạo cảm giác trốn thoát tạm thời.";
    heQuaDaiHan = "Làm rỗng năng lực tập trung thực tế, dồn tích áp lực giải quyết công việc.";
    thayDoiChiSo = { phatTrien: -2, sucKhoe: -1, triThuc: -2, kyLuat: -6, camXuc: 3, moiQuanHe: -1, apLuc: 3, sangTao: -2, kienTri: -4, tuTin: -3 };
  }

  return {
    nguyenNhan,
    heQuaNganHan,
    heQuaDaiHan,
    khaiNiemTrieuHoc: labels,
    giaiThich,
    thayDoiChiSo,
    suKienVuon,
    category,
    causalGraph: {
      nodes: [
        { id: "n1", label: `Nguyên nhân:\n${taskText}`, type: "cause" },
        { id: "n2", label: heQuaNganHan, type: "step" },
        { id: "n3", label: heQuaDaiHan, type: "step" },
        { id: "n4", label: `Chuyển biến:\n${labels[0]}`, type: "effect" }
      ],
      edges: [
        { from: "n1", to: "n2" },
        { from: "n2", to: "n3" },
        { from: "n3", to: "n4" }
      ]
    }
  };
}

// Bộ máy phát hiện mâu thuẫn biện chứng
export function detectContradictions(completedTasks, activeGoals) {
  if (activeGoals.length === 0) {
    return { hasContradiction: false, level: 0, message: "Khu vườn chưa ghi nhận mâu thuẫn nào.", details: [] };
  }

  const details = [];
  let contradictionScore = 0;

  activeGoals.forEach((goal) => {
    const relatedTasks = completedTasks.filter(t => t.analysis.category === goal.category);
    const harmfulTasks = completedTasks.filter(t => t.analysis.category === "waste");

    if (relatedTasks.length === 0 && harmfulTasks.length > 0) {
      contradictionScore += 35;
      details.push({
        goalId: goal.id,
        goalTitle: goal.title,
        category: goal.category,
        reason: `Mâu thuẫn biện chứng giữa Ý thức (Mục tiêu "${goal.title}") và Thực tiễn (Lãng phí thời gian vào giải trí hời hợt mà chưa có hành động nuôi dưỡng mục tiêu).`,
        advice: `Có lẽ khu vườn sẽ nhận được nhiều giá trị hơn nếu bạn giảm bớt thời gian tiêu khiển ảo để dành ít nhất 15 phút rèn luyện cho mục tiêu này.`
      });
    } else if (relatedTasks.length === 0) {
      contradictionScore += 15;
      details.push({
        goalId: goal.id,
        goalTitle: goal.title,
        category: goal.category,
        reason: `Mục tiêu "${goal.title}" mới dừng lại ở dạng khả năng trong ý thức. Chưa có hành động thực tiễn nào được gieo để biến nó thành hiện thực.`,
        advice: `Gieo hạt giống hành động cụ thể để bắt đầu quá trình chuyển hóa khả năng thành hiện thực khách quan.`
      });
    }
  });

  contradictionScore = Math.min(100, contradictionScore);

  let message = "Mâu thuẫn biện chứng ở mức thấp. Các mặt đối lập trong sinh thái lối sống đang dung hòa tốt.";
  if (contradictionScore > 75) {
    message = "MÂU THUẪN CỰC HẠN! Sự lệch pha nghiêm trọng giữa Lý tưởng (Mục tiêu) và Thực tiễn (Hành động) đang phá vỡ sự phát triển tự thân.";
  } else if (contradictionScore > 50) {
    message = "Mâu thuẫn mạnh! Tâm trí của bạn đang có xung đột gay gắt giữa Kỷ luật tự chủ và sức ỳ trì hoãn.";
  } else if (contradictionScore > 25) {
    message = "Mâu thuẫn vừa phải. Bầu trời âm u báo hiệu bạn cần cân bằng lại quỹ thời gian và năng lực thực tiễn.";
  } else if (contradictionScore > 0) {
    message = "Mâu thuẫn nhẹ. Hãy bổ sung thêm các hành động nhỏ để củng cố các mặt chưa hoàn thiện.";
  }

  return {
    hasContradiction: contradictionScore > 0,
    level: contradictionScore,
    message,
    details
  };
}

export async function analyzeTask(taskText) {
  try {
    const { callGrok, TASK_ANALYZER_PROMPT } = await import('../services/grokService.js');
    
    const result = await callGrok(TASK_ANALYZER_PROMPT, `Phân tích hành động sau: "${taskText}"`);
    
    // Validate cấu trúc kết quả từ AI
    if (result && result.category && result.thayDoiChiSo && result.nguyenNhan) {
      // Đảm bảo tất cả các trường chỉ số tồn tại
      const defaultChiSo = { phatTrien: 0, sucKhoe: 0, triThuc: 0, kyLuat: 0, camXuc: 0, moiQuanHe: 0, apLuc: 0, sangTao: 0, kienTri: 0, tuTin: 0 };
      result.thayDoiChiSo = { ...defaultChiSo, ...result.thayDoiChiSo };
      
      // Đảm bảo có causalGraph
      if (!result.causalGraph) {
        result.causalGraph = {
          nodes: [
            { id: "n1", label: `Nguyên nhân:\n${taskText}`, type: "cause" },
            { id: "n2", label: result.heQuaNganHan || "", type: "step" },
            { id: "n3", label: result.heQuaDaiHan || "", type: "step" },
            { id: "n4", label: `Chuyển biến:\n${(result.khaiNiemTrieuHoc || ["Biện chứng"])[0]}`, type: "effect" }
          ],
          edges: [
            { from: "n1", to: "n2" },
            { from: "n2", to: "n3" },
            { from: "n3", to: "n4" }
          ]
        };
      }
      
      // Đảm bảo khaiNiemTrieuHoc là mảng
      if (!Array.isArray(result.khaiNiemTrieuHoc)) {
        result.khaiNiemTrieuHoc = ["Phép biện chứng", "Thực tiễn"];
      }
      
      console.log("✅ Groq AI phân tích thành công:", result.category);
      return result;
    }
    
    throw new Error("Kết quả AI không hợp lệ");
  } catch (error) {
    console.warn("⚠️ Groq API lỗi, dùng phân tích cục bộ:", error.message);
    return analyzeTaskMock(taskText);
  }
}
