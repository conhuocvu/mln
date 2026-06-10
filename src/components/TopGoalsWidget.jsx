import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';

export default function TopGoalsWidget({ goals, completedTasks, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sắp xếp mục tiêu: Đưa các mục tiêu chưa hoàn thành lên trước
  const sortedGoals = [...goals].sort((a, b) => {
    const aTasks = completedTasks.filter(t => t.analysis.category === a.category).length;
    const bTasks = completedTasks.filter(t => t.analysis.category === b.category).length;
    const aDone = aTasks >= a.requiredCount;
    const bDone = bTasks >= b.requiredCount;
    if (aDone && !bDone) return 1;
    if (!aDone && bDone) return -1;
    return 0;
  });

  useEffect(() => {
    if (sortedGoals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedGoals.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sortedGoals.length]);

  if (goals.length === 0) return null;

  const currentGoal = sortedGoals[currentIndex] || sortedGoals[0];
  if (!currentGoal) return null;

  const matchingTasksCount = completedTasks.filter(t => t.analysis.category === currentGoal.category).length;
  const progressPercent = Math.min(100, Math.round((matchingTasksCount / currentGoal.requiredCount) * 100));
  const isCompleted = progressPercent >= 100;

  const categoryEmojis = {
    study: "📚",
    health: "⚡",
    relationship: "🤝",
    creative: "🎨",
    mind: "✍️"
  };

  const emoji = categoryEmojis[currentGoal.category] || "🎯";

  return (
    <motion.div
      initial={{ y: -30, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      className="absolute top-[72px] md:top-6 left-1/2 z-30 flex flex-col items-center pointer-events-auto cursor-pointer select-none"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      title="Nhấp để xem bản đồ mục tiêu"
    >
      <div className="relative glass-dark px-4 py-2 rounded-full border border-white/15 shadow-xl flex items-center gap-3.5 max-w-[280px] md:max-w-md">
        {/* Glow effect on completion */}
        {isCompleted && (
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse border border-emerald-500/30 pointer-events-none" />
        )}
        
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-sm shrink-0">{emoji}</span>
          <div className="min-w-0 flex flex-col justify-center w-[120px] md:w-[180px]">
            <div className="flex justify-between items-center gap-1.5 w-full">
              <span className="text-[10px] md:text-xs font-bold text-slate-100 truncate">
                {currentGoal.title}
              </span>
              <span className={`text-[9px] font-extrabold shrink-0 ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                {matchingTasksCount}/{currentGoal.requiredCount}
              </span>
            </div>
            {/* Tiny progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Indicators/Dots if multiple goals */}
        {sortedGoals.length > 1 && (
          <div className="flex items-center gap-1 border-l border-white/10 pl-2 shrink-0">
            {sortedGoals.map((_, idx) => (
              <div
                key={idx}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-emerald-400 scale-125' : 'bg-slate-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
