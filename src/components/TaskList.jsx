import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trash2, Calendar, GitCommit } from 'lucide-react';

const getSeedName = (cat) => {
  switch (cat) {
    case "study": return "Gieo mầm Trí tuệ";
    case "health": return "Gieo mầm Sinh lực";
    case "relationship": return "Gieo mầm Cảm thông";
    case "creative": return "Gieo mầm Sáng tạo";
    case "mind": return "Gieo mầm Tự chủ";
    case "waste": return "Tiêu khí năng lượng";
    default: return "Rèn luyện Tồn tại";
  }
};

const getNurturedValue = (cat, indexChanges) => {
  if (!indexChanges) return "";
  if (cat === "study") return `Trí tuệ +${indexChanges.triThuc || 8}`;
  if (cat === "health") return `Sức khỏe +${indexChanges.sucKhoe || 10}`;
  if (cat === "relationship") return `Cảm thông +${indexChanges.camXuc || 8}`;
  if (cat === "creative") return `Sáng tạo +${indexChanges.sangTao || 10}`;
  if (cat === "mind") return `Tự chủ +${indexChanges.kienTri || 5}`;
  if (cat === "waste") return `Kỷ luật ${indexChanges.kyLuat || -7}`;
  return `Kỷ luật +${indexChanges.kyLuat || 2}`;
};

const getInfluencedQuality = (cat, indexChanges) => {
  if (!indexChanges) return null;
  if (cat === "study") return `Kiên trì +${indexChanges.kienTri || 5}`;
  if (cat === "health") return `Tự chủ +${indexChanges.kyLuat || 6}`;
  if (cat === "relationship") return `Cảm thông +${indexChanges.moiQuanHe || 10}`;
  if (cat === "creative") return `Can đảm +${indexChanges.tuTin || 5}`;
  if (cat === "mind") return `Trí tuệ +${indexChanges.triThuc || 4}`;
  if (cat === "waste") return `Tự chủ ${indexChanges.kienTri || -4}`;
  return null;
};

export default function TaskList({ tasks, onDeleteTask }) {
  const [activeTaskId, setActiveTaskId] = useState(null);

  const toggleCausalChain = (id) => {
    setActiveTaskId(activeTaskId === id ? null : id);
  };

  return (
    <div className="w-full glass-dark rounded-3xl p-5 border border-white/10 shadow-lg mt-4 flex-1 flex flex-col min-h-0 text-white">
      <div className="flex justify-between items-center mb-3.5 border-b border-white/10 pb-2.5">
        <h3 className="text-base font-extrabold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Dấu vết thực tiễn ({tasks.length})
        </h3>
        {tasks.length > 0 && (
          <span className="text-[11px] bg-emerald-500/20 text-emerald-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Chi tiết nhân quả ▾
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-[120px]">
          <span className="text-3xl mb-2">🌱</span>
          <p className="text-[13px] font-bold text-slate-800">Chưa có dấu vết thực tiễn nào.</p>
          <p className="text-[11.5px] mt-0.5 text-slate-650">Hãy gieo hạt giống ở trên để bắt đầu tích lũy cuộc sống!</p>
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1 flex-1">
          <AnimatePresence>
            {tasks.map((task) => {
              const isActive = activeTaskId === task.id;
              const isNegative = task.analysis.thayDoiChiSo.kyLuat < 0;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isActive
                      ? "bg-white/40 border-emerald-500/30 shadow-md"
                      : "bg-white/10 hover:bg-white/20 border-white/5 shadow-sm"
                  }`}
                >
                  {/* Task Header info */}
                  <div
                    onClick={() => toggleCausalChain(task.id)}
                    className="p-3 flex justify-between items-center cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isNegative ? "bg-red-500" : "bg-emerald-600 animate-pulse"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className={`text-[13px] font-bold truncate ${isNegative ? "text-red-700" : "text-slate-800"}`}>
                          {task.text}
                        </p>
                        
                        {/* Nuôi dưỡng & Phẩm chất details */}
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10px] text-slate-500 items-center">
                          <span className="font-semibold text-slate-600">🌱 {getSeedName(task.analysis.category)}</span>
                          {getNurturedValue(task.analysis.category, task.analysis.thayDoiChiSo) && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span className="text-emerald-700 font-bold">{getNurturedValue(task.analysis.category, task.analysis.thayDoiChiSo)}</span>
                            </>
                          )}
                          {getInfluencedQuality(task.analysis.category, task.analysis.thayDoiChiSo) && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span className="text-amber-700 font-bold">{getInfluencedQuality(task.analysis.category, task.analysis.thayDoiChiSo)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                      title="Thu hồi nhân quả"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Causal Chain detail timeline */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-white/5 bg-black/5 text-slate-800"
                      >
                        <div className="p-3 space-y-3">
                          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                            <GitCommit className="w-3 h-3 text-emerald-800" />
                            Sơ đồ nhân quả (Causal Chain)
                          </div>

                          {/* Timeline Nodes */}
                          <div className="relative pl-4 border-l border-dashed border-emerald-800/30 ml-2.5 space-y-3">
                            {/* Node 1: Cause */}
                            <div className="relative">
                              <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-700 border border-emerald-100" />
                              <p className="text-[11px] font-bold text-emerald-850">1. Nguyên Nhân (Hành động)</p>
                              <p className="text-[13px] text-slate-700 mt-0.5">{task.text}</p>
                            </div>

                            {/* Node 2: Intermediate Effect */}
                            <div className="relative">
                              <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-sky-700 border border-sky-100" />
                              <p className="text-[11px] font-bold text-sky-850">2. Hệ Quả Ngắn Hạn</p>
                              <p className="text-[13px] text-slate-700 mt-0.5">{task.analysis.heQuaNganHan}</p>
                            </div>

                            {/* Node 3: Long Term effect */}
                            <div className="relative">
                              <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-700 border border-amber-100" />
                              <p className="text-[11px] font-bold text-amber-850">3. Hệ Quả Dài Hạn</p>
                              <p className="text-[13px] text-slate-700 mt-0.5">{task.analysis.heQuaDaiHan}</p>
                            </div>
                          </div>

                          {/* Philosophical Dialectical Lens */}
                          {task.analysis.giaiThich && (
                            <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 space-y-1.5">
                              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">💡 Góc nhìn Biện chứng:</p>
                              <p className="text-[13px] text-slate-700 italic leading-relaxed">
                                "{task.analysis.giaiThich}"
                              </p>
                              {task.analysis.khaiNiemTrieuHoc && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {task.analysis.khaiNiemTrieuHoc.map((concept, idx) => (
                                    <span key={idx} className="text-[9.5px] font-bold text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded">
                                      {concept}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Stat change chips */}
                          <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Chuyển biến năng lượng chỉ số:</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(task.analysis.thayDoiChiSo).map(([key, val]) => {
                                if (val === 0) return null;
                                const isPos = val > 0;
                                return (
                                  <span
                                    key={key}
                                    className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                                      isPos
                                        ? "bg-green-500/20 text-green-300"
                                        : "bg-red-500/20 text-red-300"
                                    }`}
                                  >
                                    {key.toUpperCase()} {isPos ? `+${val}` : val}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
