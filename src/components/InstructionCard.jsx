import React from 'react';
import { Compass, BookOpen, Layers, Target, AlertTriangle } from 'lucide-react';

export default function InstructionCard() {
  return (
    <div className="w-full glass rounded-3xl p-5.5 border border-white/20 shadow-lg text-slate-700">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <Compass className="w-5.5 h-5.5 text-garden-green-600 animate-spin" style={{ animationDuration: '12s' }} />
        Hướng Dẫn Nuôi Dưỡng Nhân Sinh
      </h3>

      <div className="space-y-4 text-[14px] leading-relaxed">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-garden-green-100 text-garden-green-800 font-extrabold flex items-center justify-center shrink-0 text-sm">1</div>
          <div>
            <p className="font-bold text-slate-800 text-[15px] flex items-center gap-1.5">
              <Target className="w-4.5 h-4.5 text-red-500" />
              Thiết lập Mục tiêu (Chí hướng)
            </p>
            <p className="text-slate-500 mt-1">
              Tạo mục tiêu để định hình tương lai. Hệ thống sẽ phân tích <strong>Khả năng và Hiện thực</strong> của bạn (0% đến 100%).
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-garden-green-100 text-garden-green-800 font-extrabold flex items-center justify-center shrink-0 text-sm">2</div>
          <div>
            <p className="font-bold text-slate-800 text-[15px] flex items-center gap-1.5">
              🌱 Gieo hạt hành động (Thực tiễn)
            </p>
            <p className="text-slate-500 mt-1">
              Nhập hành động rèn luyện mỗi ngày (đọc sách, tập gym...). Hành động là <strong>Nguyên nhân</strong> trực tiếp thúc đẩy 10 chỉ số sinh mệnh của vườn.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-garden-green-100 text-garden-green-800 font-extrabold flex items-center justify-center shrink-0 text-sm">3</div>
          <div>
            <p className="font-bold text-slate-800 text-[15px] flex items-center gap-1.5">
              <Layers className="w-4.5 h-4.5 text-indigo-500" />
              Tích lũy Lượng → Chất biến
            </p>
            <p className="text-slate-500 mt-1">
              Rèn luyện liên tiếp để tăng chuỗi ngày (Streaks). Khi lượng tích đủ sẽ đột phá chất lượng: nở <strong>Hoa Anh Đào</strong> hoặc mở khóa <strong>Đảo thác nước</strong>.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-garden-green-100 text-garden-green-800 font-extrabold flex items-center justify-center shrink-0 text-sm">4</div>
          <div>
            <p className="font-bold text-slate-800 text-[15px] flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              Hóa giải Mâu thuẫn phát triển
            </p>
            <p className="text-slate-500 mt-1">
              Nếu hành động tiêu cực phủ định mục tiêu, bão tố sẽ nổi lên làm gãy cành cây. Hãy hành động tích cực để giải quyết mâu thuẫn và mọc <strong>Cành Vàng Kim</strong>.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-3">
          <div className="w-6.5 h-6.5 rounded-full bg-garden-green-100 text-garden-green-800 font-extrabold flex items-center justify-center shrink-0 text-sm">5</div>
          <div>
            <p className="font-bold text-slate-800 text-[15px] flex items-center gap-1.5">
              🔄 Tiến hóa xoắn ốc (Phủ định của phủ định)
            </p>
            <p className="text-slate-500 mt-1">
              Sau khi vượt qua thử thách lụi tàn, bấm nút tiến hóa xoắn ốc để cây <strong>Tái sinh</strong> kiêu hãnh ở trình độ sinh thái cao cấp hơn.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100 text-center italic text-garden-green-800 font-semibold text-[13px]">
        💡 Mẹo: Click biểu tượng con mắt (Eye 👁️) ở Dock bên dưới để ẩn hết bảng và ngắm cây!
      </div>
    </div>
  );
}
