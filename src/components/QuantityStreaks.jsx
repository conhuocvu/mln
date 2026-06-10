import React from 'react';
import { motion } from 'framer-motion';
import { Flame, HelpCircle } from 'lucide-react';

export default function QuantityStreaks({ stats }) {
  // Nhận các streaks từ stats
  const studyStreak = stats.studyStreak || 0;
  const healthStreak = stats.healthStreak || 0;
  const relationStreak = stats.relationStreak || 0;

  // Tính toán mốc đột phá kế tiếp
  // Mốc: 3 ngày -> 7 ngày -> 14 ngày -> 30 ngày
  const getNextMilestone = (streak) => {
    if (streak < 3) return { current: streak, target: 3, percent: (streak / 3) * 100 };
    if (streak < 7) return { current: streak, target: 7, percent: (streak / 7) * 100 };
    if (streak < 14) return { current: streak, target: 14, percent: (streak / 14) * 100 };
    return { current: streak, target: 30, percent: Math.min(100, (streak / 30) * 100) };
  };

  const streakData = [
    {
      key: "study",
      label: "Tích lũy Trí thức (Học tập)",
      icon: "📚",
      streak: studyStreak,
      color: "from-purple-400 to-indigo-500",
      milestone: getNextMilestone(studyStreak)
    },
    {
      key: "health",
      label: "Tích lũy Thể chất (Thể thao)",
      icon: "⚡",
      streak: healthStreak,
      color: "from-emerald-400 to-teal-500",
      milestone: getNextMilestone(healthStreak)
    },
    {
      key: "relation",
      label: "Tích lũy Nhân sinh (Mối quan hệ)",
      icon: "🤝",
      streak: relationStreak,
      color: "from-pink-400 to-rose-500",
      milestone: getNextMilestone(relationStreak)
    }
  ];

  return (
    <div className="w-full glass-dark rounded-3xl p-5 border border-white/10 shadow-lg text-white space-y-4">
      <h3 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-1.5 border-b border-white/10 pb-2.5">
        <Flame className="w-4.5 h-4.5 text-orange-400 animate-pulse" />
        Tích lũy Lượng → Biến đổi Chất (Streaks)
      </h3>

      <div className="space-y-3.5">
        {streakData.map((item) => (
          <div key={item.key} className="bg-white/5 rounded-2xl p-3 border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </span>
              <div className="flex items-center gap-1">
                <Flame className={`w-3.5 h-3.5 ${item.streak > 0 ? 'text-orange-400 animate-bounce' : 'text-slate-500'}`} />
                <span className="text-xs font-extrabold text-slate-100">{item.streak} ngày</span>
              </div>
            </div>

            {/* Progress to next breakthrough */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>Tiến độ đột phá: {item.milestone.current}/{item.milestone.target} ngày</span>
                <span>{Math.round(item.milestone.percent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950/30 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.milestone.percent}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 10 }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Triết học giải thích */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-[10px] text-slate-300 leading-relaxed flex gap-2">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <p>
          <span className="font-extrabold text-emerald-300">Quy luật Lượng - Chất: </span>
          Mỗi hành động hoàn thành là một lượng tích tụ. Khi đạt mốc ngày liên tiếp, chất biến đổi đột phá làm nở hoa hoặc mở khóa đảo nổi trên không!
        </p>
      </div>
    </div>
  );
}
