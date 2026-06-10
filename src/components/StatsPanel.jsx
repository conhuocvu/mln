import React from 'react';
import { motion } from 'framer-motion';

export default function StatsPanel({ stats }) {
  const existenceAspects = [
    { key: 'triThuc', label: '🧠 Trí tuệ', desc: 'Sự hiểu biết lý luận và thế giới quan sâu sắc.' },
    { key: 'kyLuat', label: '🎯 Kỷ luật', desc: 'Khả năng tuân thủ trật tự tất yếu, điều khiển hành vi.' },
    { key: 'sucKhoe', label: '🏃 Sức khỏe', desc: 'Nền tảng thực tại vật chất, sinh lực cơ thể.' },
    { key: 'sangTao', label: '🎨 Sáng tạo', desc: 'Năng lực đổi mới tư duy, kiến tạo biểu hiện độc đáo.' },
    { key: 'camXuc', label: '🤝 Cảm thông', desc: 'Tình cảm chia sẻ và kết nối biện chứng xã hội.' },
    { key: 'tuTin', label: '🦁 Can đảm', desc: 'Bản lĩnh dũng khí đối mặt giông bão cuộc đời.' },
    { key: 'kienTri', label: '🛡️ Tự chủ', desc: 'Kiên trì tự định vị bản thân vượt trên các xung lực hỗn loạn.' }
  ];

  return (
    <div className="w-full glass-dark rounded-3xl p-5 border border-white/10 shadow-lg relative text-white">
      <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-white/10">
        <h3 className="text-sm font-bold flex items-center gap-1.5">
          <span className="text-emerald-600">⚖️</span>
          Các mặt của tồn tại
        </h3>
      </div>

      {/* Grid các mặt tồn tại */}
      <div className="space-y-3.5">
        {existenceAspects.map((aspect) => {
          const percent = Math.round(stats[aspect.key] ?? 0);
          
          return (
            <div key={aspect.key} className="group relative flex items-center gap-3">
              {/* Nhãn chỉ số */}
              <span className="w-24 shrink-0 text-xs font-bold flex items-center gap-1">
                <span className="truncate text-slate-800">{aspect.label}</span>
              </span>

              {/* Thanh Tiến Trình (Progress Bar) */}
              <div className="flex-1 h-1.5 bg-slate-900/10 rounded-full overflow-hidden border border-slate-900/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ type: "spring", stiffness: 60, damping: 10 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700"
                />
              </div>

              {/* Số phần trăm */}
              <span className="w-12 text-right text-xs font-extrabold shrink-0 text-slate-700">
                {percent}/100
              </span>

              {/* Tooltip mô tả chi tiết */}
              <div className="hidden group-hover:block absolute left-24 right-0 bottom-6 z-30 p-2.5 bg-slate-800 text-white rounded-xl text-[10px] shadow-lg pointer-events-none opacity-95 transition-opacity border border-white/10">
                <p className="font-bold text-emerald-400">{aspect.label}</p>
                <p className="text-slate-200 mt-0.5">{aspect.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
