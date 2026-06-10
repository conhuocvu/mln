import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TopGoalsWidget({ goals, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (goals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % goals.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [goals.length]);

  if (goals.length === 0) return null;

  const currentGoal = goals[currentIndex] || goals[0];
  if (!currentGoal) return null;

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
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm shrink-0">{emoji}</span>
          <span className="text-[11px] md:text-xs font-bold text-slate-100 truncate max-w-[150px] md:max-w-[250px]">
            Mục tiêu: {currentGoal.title}
          </span>
        </div>

        {/* Indicators/Dots if multiple goals */}
        {goals.length > 1 && (
          <div className="flex items-center gap-1 border-l border-white/10 pl-2 shrink-0">
            {goals.map((_, idx) => (
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
