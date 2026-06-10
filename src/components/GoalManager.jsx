import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, PlusCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { value: "study", label: "📚 Học tập & Trí thức" },
  { value: "health", label: "⚡ Sức khỏe & Thể chất" },
  { value: "relationship", label: "🤝 Mối quan hệ & Gia đình" },
  { value: "creative", label: "🎨 Sáng tạo & Nghệ thuật" },
  { value: "mind", label: "✍️ Tự phản tư & Tâm hồn" }
];

export default function GoalManager({ goals, onAddGoal, onDeleteGoal, completedTasks }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  const [currentReality, setCurrentReality] = useState("");
  const [newReality, setNewReality] = useState("");
  const [targetCount, setTargetCount] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !currentReality.trim() || !newReality.trim()) return;

    const requiredCount = targetCount;
    const conditionNeeded = category === "study" 
      ? `Tích lũy ${requiredCount} ngày tự học` 
      : category === "health" 
        ? `Tập thể dục/vận động ${requiredCount} lần` 
        : category === "mind"
          ? `Tích lũy ${requiredCount} ngày phản tư`
          : category === "relationship"
            ? `Tích lũy ${requiredCount} ngày kết nối chia sẻ`
            : `Hoàn thành ${requiredCount} hành động sáng tạo/khác`;

    onAddGoal({
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      currentReality: currentReality.trim(),
      newReality: newReality.trim(),
      conditionNeeded,
      requiredCount,
      completedCount: 0
    });

    // Reset form
    setTitle("");
    setCurrentReality("");
    setNewReality("");
    setTargetCount(10);
    setShowAddForm(false);
  };

  return (
    <div className="w-full glass-dark rounded-3xl p-5 border border-white/10 shadow-lg text-white">
      <div className="flex justify-between items-center mb-3.5 border-b border-white/10 pb-2.5">
        <h3 className="text-sm font-bold text-white/90 flex items-center gap-1.5">
          <Target className="w-4.5 h-4.5 text-emerald-400" />
          Bản Đồ Khả Năng & Hiện Thực
        </h3>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          {showAddForm ? "Đóng" : "Thiết lập"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showAddForm ? (
          // FORM THIẾT LẬP MỤC TIÊU MỚI
          <motion.form
            key="add-goal-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 mb-3"
          >
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tên mục tiêu:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đạt JLPT N3, giảm cân 3kg..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Lĩnh vực:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Số lượng tích lũy:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={targetCount}
                  onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hiện thực hiện tại:</label>
                <input
                  type="text"
                  required
                  value={currentReality}
                  onChange={(e) => setCurrentReality(e.target.value)}
                  placeholder="Ví dụ: Đang ở N5 / Lười tập"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hiện thực mới muốn đạt:</label>
                <input
                  type="text"
                  required
                  value={newReality}
                  onChange={(e) => setNewReality(e.target.value)}
                  placeholder="Ví dụ: Đọc hiểu N3 / Cơ thể thon gọn"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Thiết lập Hiện thực mới
            </button>
          </motion.form>
        ) : (
          // DANH SÁCH MỤC TIÊU HIỆN CÓ
          <motion.div key="goals-list" className="space-y-3">
            {goals.length === 0 ? (
              <div className="text-center p-6 min-h-[120px] flex flex-col items-center justify-center">
                <span className="text-3xl mb-1.5 block">🎯</span>
                <p className="text-xs text-slate-300 font-semibold">Chưa có mục tiêu định hình Hiện thực.</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Nhấp "Thiết lập" bên trên để tạo mục tiêu biện chứng.</p>
              </div>
            ) : (
              goals.map((goal) => {
                const matchingTasksCount = completedTasks.filter(t => t.analysis.category === goal.category).length;
                const progressPercent = Math.min(100, Math.round((matchingTasksCount / goal.requiredCount) * 100));
                const isCompleted = progressPercent >= 100;

                return (
                  <div key={goal.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 shadow-sm space-y-3 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : "🎯"}
                          {goal.title}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded mt-1.5 inline-block uppercase">
                          Lĩnh vực: {CATEGORIES.find(c => c.value === goal.category)?.label.split(" ")[1] || goal.category}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="text-[9px] font-bold text-red-300 hover:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>

                    {/* Sơ đồ biện chứng */}
                    <div className="bg-black/20 border border-white/5 rounded-xl p-2.5 space-y-2.5 text-[10px]">
                      <div className="grid grid-cols-4 gap-1.5 items-center text-center">
                        {/* Node 1: Hiện thực cũ */}
                        <div className="bg-white/5 p-1 rounded-lg border border-white/5">
                          <span className="font-extrabold text-slate-400 block text-[7px] uppercase">1. Hiện Thực</span>
                          <span className="text-[9px] font-semibold text-slate-200 truncate block mt-0.5">{goal.currentReality}</span>
                        </div>

                        {/* Node 2: Điều kiện */}
                        <div className="bg-indigo-500/10 p-1 rounded-lg border border-indigo-500/10">
                          <span className="font-extrabold text-indigo-400 block text-[7px] uppercase">2. Điều Kiện</span>
                          <span className="text-[8px] font-semibold text-slate-300 line-clamp-2 mt-0.5">{goal.conditionNeeded}</span>
                        </div>

                        {/* Node 3: Khả năng */}
                        <div className="bg-amber-500/10 p-1 rounded-lg border border-amber-500/10">
                          <span className="font-extrabold text-amber-400 block text-[7px] uppercase">3. Khả Năng</span>
                          <span className="text-[10px] font-extrabold text-amber-300 block mt-0.5">{progressPercent}%</span>
                        </div>

                        {/* Node 4: Hiện thực mới */}
                        <div className={`p-1 rounded-lg border ${isCompleted ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                          <span className="font-extrabold text-[7px] block uppercase">4. Mới</span>
                          <span className="text-[9px] font-semibold truncate block mt-0.5">{goal.newReality}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400">
                          <span>Hành động: {matchingTasksCount}/{goal.requiredCount} lần</span>
                          <span>{progressPercent}% khả năng</span>
                        </div>
                        <div className="w-full h-1 bg-slate-950/40 rounded-full overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 border border-white/5 rounded-2xl p-2.5 mt-3 text-[9px] text-slate-300 leading-relaxed flex gap-2">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <p>
          <span className="font-bold text-emerald-300">Khả năng & Hiện thực:</span> Mỗi hành động tích lũy chính là các điều kiện cần để chuyển hóa khả năng thành một hiện thực mới tốt đẹp.
        </p>
      </div>
    </div>
  );
}
