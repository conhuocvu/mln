// Bộ sinh câu thì thầm triết học theo ngữ cảnh hành động
import { WHISPER_CATEGORIES } from '../data/whisperLibrary';

// Mapping: task category → nhóm triết học ưu tiên
const CATEGORY_TO_PHILOSOPHY = {
  study:        'luongChat',         // Tích lũy kiến thức = Lượng → Chất
  health:       'banChatHienTuong',  // Rèn luyện cơ thể = Bản chất bên trong
  waste:        'mauThuan',          // Trì hoãn = Mâu thuẫn nội tại
  relationship: 'nhanQua',           // Kết nối = Nhân quả
  creative:     'khaNangHienThuc',   // Sáng tạo = Biến khả năng thành hiện thực
  mind:         'phuDinh',           // Phản tư = Phủ định cái cũ
  other:        'nhanQua',           // Mặc định = Nhân quả
};

// Lưu index câu cuối đã hiện cho mỗi nhóm để tránh trùng lặp
const lastUsedIndex = {};

/**
 * Chọn 1 câu thì thầm phù hợp với ngữ cảnh hành động
 * @param {string} category - Loại hành động (study, health, waste, ...)
 * @param {object} stats - Chỉ số hiện tại
 * @param {number} contradictionLevel - Mức mâu thuẫn (0-100)
 * @returns {{ text: string, philosophyKey: string, philosophyLabel: string }}
 */
export function selectWhisper(category, stats, contradictionLevel = 0) {
  // Xác định nhóm triết học phù hợp
  let philosophyKey = CATEGORY_TO_PHILOSOPHY[category] || 'nhanQua';

  // Override đặc biệt: mâu thuẫn cao → ưu tiên nhóm mâu thuẫn
  if (contradictionLevel > 50) {
    philosophyKey = 'mauThuan';
  }

  // Override đặc biệt: streak dài → ưu tiên nhóm Lượng → Chất
  if (stats.studyStreak >= 3 || stats.healthStreak >= 3) {
    if (category === 'study' || category === 'health') {
      philosophyKey = 'luongChat';
    }
  }

  // Lấy danh sách câu thì thầm của nhóm
  const group = WHISPER_CATEGORIES[philosophyKey];
  if (!group) {
    return {
      text: "Khu vườn đang lắng nghe...",
      philosophyKey: 'nhanQua',
      philosophyLabel: 'Quan hệ Nhân Quả',
    };
  }

  const whispers = group.whispers;

  // Chọn ngẫu nhiên, tránh trùng câu vừa hiện
  let index;
  const lastIndex = lastUsedIndex[philosophyKey];
  
  if (whispers.length <= 1) {
    index = 0;
  } else {
    do {
      index = Math.floor(Math.random() * whispers.length);
    } while (index === lastIndex);
  }

  lastUsedIndex[philosophyKey] = index;

  return {
    text: whispers[index],
    philosophyKey: group.key,
    philosophyLabel: group.label,
  };
}
