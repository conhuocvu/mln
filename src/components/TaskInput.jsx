import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';

const SUGGESTIONS = [
  { text: "📖 Học tiếng Nhật 30 phút", tag: "Học tập" },
  { text: "🏃 Chạy bộ 3km", tag: "Thể chất" },
  { text: "📞 Gọi điện cho bố mẹ", tag: "Gia đình" },
  { text: "💻 Làm đồ án tốt nghiệp", tag: "Dự án" },
  { text: "✍️ Viết nhật ký phản tư", tag: "Tâm hồn" }
];

export default function TaskInput({ onAddTask, isAnalyzing }) {
  const [taskText, setTaskText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim() || isAnalyzing) return;
    onAddTask(taskText.trim());
    setTaskText("");
  };

  const handleSuggestClick = (text) => {
    if (isAnalyzing) return;
    onAddTask(text);
  };

  return (
    <div className="w-full glass-dark rounded-3xl p-5 border border-white/10 shadow-lg text-white space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-base font-extrabold flex items-center gap-1.5">
            <span className="text-emerald-600">🌱</span>
            Hạt giống hôm nay
          </h3>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            "Mỗi hành động là một hạt giống của tương lai."
          </p>
        </div>
        <button 
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-[11.5px] font-bold text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          {showSuggestions ? "Ẩn gợi ý ▴" : "Gợi ý ▾"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="flex items-center gap-3 bg-emerald-800/5 border border-emerald-800/15 rounded-2xl px-4 py-3 focus-within:bg-emerald-800/10 focus-within:border-emerald-800/30 focus-within:ring-1 focus-within:ring-emerald-800/20 transition-all shadow-inner">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Hôm nay bạn muốn gieo điều gì?"
            disabled={isAnalyzing}
            className="flex-1 bg-transparent focus:outline-none text-[13.5px] font-semibold text-slate-800 placeholder-slate-400"
          />
          
          <button
            type="submit"
            disabled={!taskText.trim() || isAnalyzing}
            className="w-10 h-10 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0 border border-emerald-700/20"
            title="Gieo hạt hành động"
          >
            {isAnalyzing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Plus className="w-5.5 h-5.5" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500 italic px-1">
          Ví dụ: Học tiếng Nhật 30 phút, Chạy bộ, Đọc sách...
        </p>
      </form>

      {/* Suggested shortcuts */}
      {showSuggestions && (
        <div className="space-y-2 pt-1">
          <span className="text-[11.5px] font-bold text-slate-600 uppercase tracking-wider block">
            Gợi ý hạt giống nhân quả:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isAnalyzing}
                onClick={() => handleSuggestClick(sug.text)}
                className="px-3 py-1.5 rounded-xl bg-emerald-850/5 hover:bg-emerald-850/10 border border-emerald-800/10 text-slate-800 text-[12px] md:text-[12.5px] text-left transition-all active:scale-95 cursor-pointer flex items-center font-medium"
              >
                <span>{sug.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
