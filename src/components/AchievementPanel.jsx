import React from 'react';
import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';
import { Award, Lock } from 'lucide-react';

export default function AchievementPanel({ stats, completedTasksCount }) {
  return (
    <div className="w-full glass rounded-3xl p-6 border border-white/20 shadow-lg mt-6">
      <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Award className="w-5 h-5 text-amber-500 animate-bounce" />
        Vinh Danh Cảnh Giới Nhân Sinh
      </h3>

      <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
        {achievements.map((ach) => {
          // Kiểm tra xem huy hiệu đã được mở khóa chưa
          const isUnlocked = ach.check(stats, completedTasksCount);
          
          return (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center relative overflow-hidden group select-none ${
                isUnlocked
                  ? "bg-white/95 border-garden-green-200 shadow-sm hover:shadow-md hover:border-garden-green-300"
                  : "bg-slate-100/40 border-slate-200/50 opacity-60"
              }`}
            >
              {/* Mặt nạ khóa nếu chưa mở */}
              {!isUnlocked && (
                <div className="absolute right-2 top-2 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Icon / Huy hiệu */}
              <span className={`text-3xl mb-1.5 transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-110 group-hover:rotate-6' : 'grayscale'}`}>
                {ach.icon}
              </span>

              {/* Tên danh hiệu */}
              <h4 className={`text-xs font-bold ${isUnlocked ? 'text-garden-green-900' : 'text-slate-500'}`}>
                {ach.title}
              </h4>

              {/* Yêu cầu */}
              <p className="text-[9px] text-slate-400 mt-1 font-medium leading-tight line-clamp-2">
                {isUnlocked ? ach.description : `Yêu cầu: ${ach.requirement}`}
              </p>

              {/* Glow effect for unlocked */}
              {isUnlocked && (
                <div className="absolute -inset-10 bg-gradient-to-r from-garden-green-200/0 via-garden-green-200/20 to-garden-green-200/0 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
