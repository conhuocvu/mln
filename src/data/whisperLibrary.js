// Thư viện câu thì thầm triết học — Cây Nhân Sinh
// 6 nhóm quy luật / cặp phạm trù biện chứng

export const WHISPER_CATEGORIES = {
  // 1. QUAN HỆ NHÂN QUẢ
  nhanQua: {
    key: 'nhanQua',
    label: 'Quan hệ Nhân Quả',
    whispers: [
      "Không có gì sinh ra từ hư vô, cũng không có gì tiêu biến vào hư vô. — Heraclitus",
      "Một tia lửa có thể châm ngòi cho cả cánh đồng cỏ. — V. I. Lenin",
      "Để hiểu được cái trước mắt, ta phải tìm kiếm cái nguồn gốc sinh ra nó. — G. W. F. Hegel",
      "Bản thân nhà giáo dục cũng cần phải được giáo dục. — Karl Marx",
      "Hành trình vạn dặm bắt đầu từ một bước chân. — Lão Tử",
    ],
  },

  // 2. LƯỢNG ĐỔI DẪN ĐẾN CHẤT ĐỔI
  luongChat: {
    key: 'luongChat',
    label: 'Lượng đổi dẫn đến Chất đổi',
    whispers: [
      "Sự tích lũy dần dần của thay đổi nhỏ đến giới hạn nhất định sẽ tạo ra bước nhảy vọt về chất. — Friedrich Engels",
      "Bất kỳ sự tích lũy nào về lượng đến một độ nhất định đều dẫn đến biến đổi về chất. — G. W. F. Hegel",
      "Trong lịch sử, sự phát triển về lượng luôn luôn đi trước sự chuyển biến về chất. — Karl Marx",
      "Tích tiểu thành đại, nước chảy đá mòn. — Lão Tử",
      "Học, học nữa, học mãi để nâng chất lượng nhận thức của ta lên tầm cao mới. — V. I. Lenin",
    ],
  },

  // 3. BẢN CHẤT VÀ HIỆN TƯỢNG
  banChatHienTuong: {
    key: 'banChatHienTuong',
    label: 'Bản chất và Hiện tượng',
    whispers: [
      "Nếu hiện tượng bên ngoài và bản chất sự vật trực tiếp trùng hợp, mọi khoa học sẽ trở nên thừa. — Karl Marx",
      "Bản chất được thể hiện ra qua hiện tượng, hiện tượng là sự biểu hiện của bản chất. — G. W. F. Hegel",
      "Con mắt chỉ nhìn thấy những gì mà trí tuệ đã sẵn sàng để hiểu. — Henri Bergson",
      "Người khôn ngoan nhìn thấu bản chất sâu xa đằng sau vẻ bề ngoài rực rỡ. — Lão Tử",
      "Hiện tượng thì phong phú và trôi nổi, còn bản chất thì ổn định và sâu lắng hơn. — V. I. Lenin",
    ],
  },

  // 4. KHẢ NĂNG VÀ HIỆN THỰC
  khaNangHienThuc: {
    key: 'khaNangHienThuc',
    label: 'Khả năng và Hiện thực',
    whispers: [
      "Các triết gia đã chỉ giải thích thế giới bằng nhiều cách; vấn đề là cải tạo thế giới. — Karl Marx",
      "Khả năng chỉ trở thành hiện thực khi có đầy đủ điều kiện khách quan và chủ quan. — V. I. Lenin",
      "Hạt giống chứa đựng khả năng trở thành cây đại thụ, nhưng chỉ thực tiễn mới biến nó thành hiện thực. — G. W. F. Hegel",
      "Hiện thực hôm nay vốn là khả năng của ngày hôm qua được nuôi dưỡng. — Friedrich Engels",
      "Vạn vật đều biến chuyển, không có gì đứng yên ở dạng khả năng thuần túy. — Heraclitus",
    ],
  },

  // 5. MÂU THUẪN
  mauThuan: {
    key: 'mauThuan',
    label: 'Mâu thuẫn',
    whispers: [
      "Sự phát triển là một cuộc đấu tranh giữa các mặt đối lập. — V. I. Lenin",
      "Mâu thuẫn là nguồn gốc của mọi sự vận động và sự sống. — G. W. F. Hegel",
      "Không ai tắm hai lần trên cùng một dòng sông, nước mới luôn trôi chảy và ta cũng đã khác. — Heraclitus",
      "Họa là chỗ dựa của phúc, phúc là nơi ẩn náu của họa. — Lão Tử",
      "Mọi hiện tượng đều chứa đựng sự thống nhất và đấu tranh của các mặt đối lập. — Friedrich Engels",
    ],
  },

  // 6. PHỦ ĐỊNH CỦA PHỦ ĐỊNH
  phuDinh: {
    key: 'phuDinh',
    label: 'Phủ định của Phủ định',
    whispers: [
      "Sự phát triển dường như lặp lại giai đoạn đã qua, nhưng ở trình độ cao hơn (đường xoắn ốc). — V. I. Lenin",
      "Hạt bị phủ định bởi cây, cây ra hoa kết quả sinh ra hạt mới - đó là phủ định của phủ định. — Friedrich Engels",
      "Mỗi bước tiến của lịch sử đều phủ định cái cũ nhưng bảo tồn giá trị cốt lõi của nó. — G. W. F. Hegel",
      "Lịch sử tiến lên không theo đường thẳng, mà theo một đường xoắn ốc đầy quanh co. — Karl Marx",
      "Muốn thành tựu cái gì, trước tiên phải để nó tự phủ định bản thân để vươn lên tầm cao mới. — Lão Tử",
    ],
  },
};

// Danh sách tất cả các key để truy cập nhanh
export const WHISPER_KEYS = Object.keys(WHISPER_CATEGORIES);
