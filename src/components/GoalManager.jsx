import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, PlusCircle, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  { value: "study", label: "📚 Học tập & Trí thức" },
  { value: "health", label: "⚡ Sức khỏe & Thể chất" },
  { value: "relationship", label: "🤝 Mối quan hệ & Gia đình" },
  { value: "creative", label: "🎨 Sáng tạo & Nghệ thuật" },
  { value: "mind", label: "✍️ Tự phản tư & Tâm hồn" }
];

export default function GoalManager({ goals, onAddGoal, onDeleteGoal }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  const [currentReality, setCurrentReality] = useState("");
  const [newReality, setNewReality] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !currentReality.trim() || !newReality.trim()) return;

    onAddGoal({
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      currentReality: currentReality.trim(),
      newReality: newReality.trim()
    });

    // Reset form
    setTitle("");
    setCurrentReality("");
    setNewReality("");
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
                return (
                  <div key={goal.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 shadow-sm space-y-3 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                          🎯 {goal.title}
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

                    {/* Sơ đồ biện chứng rút gọn */}
                    <div className="bg-black/20 border border-white/5 rounded-xl p-2.5 text-[10px]">
                      <div className="flex justify-between items-center text-center gap-2">
                        {/* Node 1: Hiện thực cũ */}
                        <div className="flex-1 bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="font-extrabold text-slate-400 block text-[7px] uppercase mb-0.5">Hiện Thực Cũ</span>
                          <span className="text-[10px] font-semibold text-slate-200 block truncate">{goal.currentReality}</span>
                        </div>

                        {/* Mũi tên chuyển dịch */}
                        <span className="text-emerald-400 font-black text-sm shrink-0 animate-pulse">➔</span>

                        {/* Node 2: Hiện thực mới */}
                        <div className="flex-1 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/20">
                          <span className="font-extrabold text-emerald-400 block text-[7px] uppercase mb-0.5">Hiện Thực Mới</span>
                          <span className="text-[10px] font-bold text-emerald-300 block truncate">{goal.newReality}</span>
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
          <span className="font-bold text-emerald-300">Khả năng & Hiện thực:</span> Mục tiêu đóng vai trò định hướng sự phát triển. Hãy gieo các hành động thực tiễn để từng bước chuyển hóa hiện thực cũ thành hiện thực mới tốt đẹp.
        </p>
      </div>
    </div>
  );
}
