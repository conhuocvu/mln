import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, BookOpen, RotateCcw, HelpCircle, X, Layers, Target, CheckSquare, BarChart2, Award, EyeOff, Eye, Bell, Volume2, VolumeX } from 'lucide-react';

// Components
import Garden from './components/Garden';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import AIAnalysisCard from './components/AIAnalysisCard';
import StatsPanel from './components/StatsPanel';
import PhilosophyJournal from './components/PhilosophyJournal';
import AchievementPanel from './components/AchievementPanel';
import GoalManager from './components/GoalManager';
import QuantityStreaks from './components/QuantityStreaks';
import InstructionCard from './components/InstructionCard';
import TopGoalsWidget from './components/TopGoalsWidget';
import PhilosophyBanner from './components/PhilosophyBanner';

// Data & Utils
import { initialStats } from './data/initialStats';
import { analyzeTask, detectContradictions } from './utils/taskAnalyzer';
import { selectWhisper } from './utils/whisperGenerator';

export default function App() {
  // 1. STATES DỮ LIỆU
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('garden_stats_v2');
    return saved ? JSON.parse(saved) : { ...initialStats };
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('garden_tasks_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('garden_goals_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [journalHistory, setJournalHistory] = useState(() => {
    const saved = localStorage.getItem('garden_journals_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedTasksCount, setCompletedTasksCount] = useState(() => {
    const saved = localStorage.getItem('garden_tasks_count_v2');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [latestTask, setLatestTask] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('garden');

  // 2. STATES ĐIỀU KHIỂN & MODALS (Redesign mockup)
  const [showSidebars, setShowSidebars] = useState(true);
  const [showPhilosophicalDetailModal, setShowPhilosophicalDetailModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showStreaksModal, setShowStreaksModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // ONBOARDING: Kiểm tra đã có mục tiêu chưa
  const hasGoals = goals.length > 0;

  // WHISPER STATE — Cây thì thầm triết học
  const [whisperText, setWhisperText] = useState('');
  const [whisperVisible, setWhisperVisible] = useState(false);
  const whisperTimerRef = React.useRef(null);

  // Hàm kích hoạt thì thầm
  const triggerWhisper = (categoryOrText, currentStats, contradictionLevel) => {
    // Xóa timer cũ nếu có
    if (whisperTimerRef.current) {
      clearTimeout(whisperTimerRef.current);
    }

    let text = "";
    if (currentStats === undefined) {
      // Nhập trực tiếp phản tư của khu vườn (không cần trích dẫn triết gia)
      text = categoryOrText;
    } else {
      // Lấy danh ngôn triết nhân khi click vào cây
      const whisper = selectWhisper(categoryOrText, currentStats, contradictionLevel);
      text = whisper.text;
    }

    setWhisperText(text);
    setWhisperVisible(true);

    // Tự động ẩn sau 6 giây
    whisperTimerRef.current = setTimeout(() => {
      setWhisperVisible(false);
    }, 6000);
  };

  // Tính số ngày hành trình tự động từ task đầu tiên
  const journeyDays = (() => {
    if (tasks.length === 0) return 1;
    const oldestTimestamp = tasks[tasks.length - 1].timestamp;
    const diffTime = Math.abs(Date.now() - oldestTimestamp);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  })();
  // Phân chia Kỷ Nguyên Triết Học dựa trên số ngày rèn luyện
  const getPhilosophyEpoch = (days) => {
    if (days <= 3) {
      return {
        title: "Kỷ nguyên Nhận thức Sơ khởi",
        desc: "Thời kỳ tích lũy ban đầu để đánh thức thế giới quan rèn luyện tự thân."
      };
    } else if (days <= 7) {
      return {
        title: "Kỷ nguyên Tích lũy về Lượng",
        desc: "Thời kỳ rèn luyện chuyên tâm. Từng lượng nhỏ hành động đang dồn tích cho bước nhảy chất."
      };
    } else if (days <= 14) {
      return {
        title: "Kỷ nguyên Chuyển hóa về Chất",
        desc: "Thời kỳ chuyển giao sinh thái nhân cách mới. Thói quen rèn luyện tự lực vững vàng."
      };
    } else {
      return {
        title: "Kỷ nguyên Phát triển Tự giác",
        desc: "Thời kỳ tự ý thức cao độ, làm chủ vận mệnh và đồng điệu cùng thế giới quan rộng lớn."
      };
    }
  };
  const currentEpoch = getPhilosophyEpoch(journeyDays);


  const getTreeStageName = (stage) => {
    switch (stage) {
      case 1: return "Hạt giống Vô hình";
      case 2: return "Mầm non Thực tiễn";
      case 3: return "Cây tơ Tích lũy";
      case 4: return "Cây Thử thách (Mâu thuẫn)";
      case 5: return "Cây Tái sinh (Biện chứng)";
      case 6: return "Đại ngàn Cổ thụ Vĩ đại";
      default: return "Cây Nhân Sinh";
    }
  };

  // 3. PHÂN TÍCH MÂU THUẪN
  const contradictionAnalysis = detectContradictions(tasks, goals);

  // 4. CẬP NHẬT ĐIỂM BIỆN CHỨNG
  useEffect(() => {
    setStats((prev) => {
      const resolved = prev.resolvedContradictionsCount || 0;
      const breakthroughs = prev.qualityBreakthroughsCount || 0;
      const completedGoals = prev.completedGoalsCount || 0;
      
      const newBienChung = Math.min(100, 15 + (resolved * 15) + (breakthroughs * 15) + (completedGoals * 20));
      
      if (newBienChung !== prev.bienChung) {
        return { ...prev, bienChung: newBienChung };
      }
      return prev;
    });
  }, [stats.resolvedContradictionsCount, stats.qualityBreakthroughsCount, stats.completedGoalsCount]);

  // TIẾN HÓA TỰ ĐỘNG
  useEffect(() => {
    // Chỉ các hành động tích lũy năng lượng tích cực (kỷ luật không bị âm) mới giúp cây tiến hóa lớn lên
    const positiveTasksCount = tasks.filter(t => t.analysis.thayDoiChiSo.kyLuat >= 0).length;

    if (positiveTasksCount >= 1 && stats.evolutionStage === 1) {
      setStats(prev => ({ 
        ...prev, 
        evolutionStage: 2,
        qualityBreakthroughsCount: (prev.qualityBreakthroughsCount || 0) + 1
      }));
      triggerWhisper("🌱 Hạt giống đã nứt vỏ, mầm non tràn đầy nhựa sống đã vươn mình đón nắng mai!");
    } else if (positiveTasksCount >= 5 && stats.evolutionStage === 2) {
      setStats(prev => ({ 
        ...prev, 
        evolutionStage: 3,
        qualityBreakthroughsCount: (prev.qualityBreakthroughsCount || 0) + 1
      }));
      triggerWhisper("🌳 Mầm non đã tích lũy đủ lượng thực tiễn để chuyển hóa về chất, hóa thành một cây tơ đầy sức sống!");
    }
    
    if (contradictionAnalysis.level > 50 && stats.evolutionStage === 3) {
      setStats(prev => ({ ...prev, evolutionStage: 4 }));
      triggerWhisper("⚠️ Mâu thuẫn dâng cao! Cây nhân sinh đang lụi tàn vì lối sống mất cân bằng.");
    }
  }, [tasks, contradictionAnalysis.level, stats.evolutionStage]);

  // ĐỒNG BỘ LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('garden_stats_v2', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('garden_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('garden_goals_v2', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('garden_journals_v2', JSON.stringify(journalHistory));
  }, [journalHistory]);

  useEffect(() => {
    localStorage.setItem('garden_tasks_count_v2', completedTasksCount.toString());
  }, [completedTasksCount]);

  // NGHIỆP VỤ GIEO HẠT HÀNH ĐỘNG
  const handleAddTask = async (taskText) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTask(taskText);
      const isNeg = analysis.thayDoiChiSo.kyLuat < 0;
      const oldContradiction = detectContradictions(tasks, goals);

      setStats((prevStats) => {
        const newStats = { ...prevStats };
        
        Object.entries(analysis.thayDoiChiSo).forEach(([key, val]) => {
          if (newStats[key] !== undefined) {
            newStats[key] = Math.max(0, Math.min(100, newStats[key] + val));
          }
        });

        const sumChanges = Object.values(analysis.thayDoiChiSo).reduce((a, b) => a + b, 0);
        if (sumChanges !== 0) {
          newStats.phatTrien = Math.max(0, Math.min(100, newStats.phatTrien + Math.floor(sumChanges / 4)));
        }

        if (!isNeg) {
          if (analysis.category === "study") {
            newStats.studyStreak += 1;
            if (newStats.studyStreak === 3 || newStats.studyStreak === 7 || newStats.studyStreak === 14) {
              newStats.qualityBreakthroughsCount += 1;
            }
          }
          if (analysis.category === "health") {
            newStats.healthStreak += 1;
            if (newStats.healthStreak === 3 || newStats.healthStreak === 7) {
              newStats.qualityBreakthroughsCount += 1;
            }
          }
          if (analysis.category === "relationship") {
            newStats.relationStreak += 1;
          }
        } else {
          newStats.studyStreak = 0;
          newStats.healthStreak = 0;
          newStats.relationStreak = 0;
        }

        return newStats;
      });

      const newTask = {
        id: `task-${Date.now()}`,
        text: taskText,
        timestamp: Date.now(),
        analysis
      };

      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setLatestTask(newTask);
      setCompletedTasksCount(prev => prev + 1);

      // Giải quyết mâu thuẫn
      const newContradiction = detectContradictions(updatedTasks, goals);
      if (oldContradiction.level > 25 && newContradiction.level < oldContradiction.level) {
        setStats(prev => ({
          ...prev,
          resolvedContradictionsCount: (prev.resolvedContradictionsCount || 0) + 1,
          qualityBreakthroughsCount: (prev.qualityBreakthroughsCount || 0) + 1
        }));
      }


      // Hiển thị biến động thực tế trong vườn dưới dạng phản tư sinh động
      triggerWhisper(`🌱 Sự kiện nhân sinh: ${analysis.suKienVuon}`);

      // Tự động mở modal phản tư Socratic sau khi gieo hành động
      setTimeout(() => {
        setShowJournalModal(true);
      }, 2000);

    } catch (err) {
      console.error("Lỗi gieo hạt hành động:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setStats((prevStats) => {
      const newStats = { ...prevStats };
      
      Object.entries(taskToDelete.analysis.thayDoiChiSo).forEach(([key, val]) => {
        if (newStats[key] !== undefined) {
          newStats[key] = Math.max(0, Math.min(100, newStats[key] - val));
        }
      });

      const sumChanges = Object.values(taskToDelete.analysis.thayDoiChiSo).reduce((a, b) => a + b, 0);
      if (sumChanges !== 0) {
        newStats.phatTrien = Math.max(0, Math.min(100, newStats.phatTrien - Math.floor(sumChanges / 4)));
      }

      if (taskToDelete.analysis.category === "study") newStats.studyStreak = Math.max(0, newStats.studyStreak - 1);
      if (taskToDelete.analysis.category === "health") newStats.healthStreak = Math.max(0, newStats.healthStreak - 1);
      if (taskToDelete.analysis.category === "relationship") newStats.relationStreak = Math.max(0, newStats.relationStreak - 1);

      return newStats;
    });

    setTasks((prev) => prev.filter(t => t.id !== id));
    setCompletedTasksCount(prev => Math.max(0, prev - 1));
    if (latestTask && latestTask.id === id) {
      setLatestTask(null);
    }
  };

  const handleAddGoal = (newGoal) => {
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter(g => g.id !== id));
  };

  const handleSaveJournal = (journal) => {
    setJournalHistory((prev) => [journal, ...prev]);
  };

  const handleSpiralEvolution = () => {
    if (stats.evolutionStage === 4 && contradictionAnalysis.level <= 25) {
      setStats(prev => ({
        ...prev,
        evolutionStage: 5,
        qualityBreakthroughsCount: (prev.qualityBreakthroughsCount || 0) + 1
      }));
      alert("Đã hoàn thành phủ định biện chứng! Cây chính rũ bỏ lớp lá héo cũ và tái sinh kiêu hãnh với nhánh vàng rực rỡ.");
    } else if (stats.evolutionStage === 5 && stats.bienChung >= 80) {
      setStats(prev => ({
        ...prev,
        evolutionStage: 6,
        qualityBreakthroughsCount: (prev.qualityBreakthroughsCount || 0) + 2
      }));
      alert("Chúc mừng! Điểm Biện Chứng xuất sắc đã biến cây tái sinh thành một ĐẠI NGÀN CỔ THỤ VĨ ĐẠI - Bạn chính thức mở khóa danh hiệu: NGƯỜI KIẾN TẠO NHÂN SINH!");
    }
  };

  const handleResetGarden = () => {
    if (window.confirm("Bạn có chắc chắn muốn trồng lại khu vườn mới? Toàn bộ chỉ số, công việc và mục tiêu sẽ bị xóa.")) {
      setStats({ ...initialStats });
      setTasks([]);
      setGoals([]);
      setJournalHistory([]);
      setCompletedTasksCount(0);
      setLatestTask(null);
    }
  };

  const handleTreeClick = () => {
    // Chọn ngẫu nhiên một phạm trù triết học biện chứng để cây thì thầm
    const categories = ["nhanQua", "luongChat", "banChatHienTuong", "khaNangHienThuc", "mauThuan", "phuDinh"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    triggerWhisper(randomCategory, stats, contradictionAnalysis.level);
  };

  return (
    <div className="w-screen h-screen bg-phil-bg text-phil-text font-sans select-none relative overflow-hidden flex flex-col">

      {/* ===================== ONBOARDING: BẮT BUỘC THIẾT LẬP MỤC TIÊU ===================== */}
      <AnimatePresence>
        {!hasGoals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="max-w-lg w-full relative"
            >
              {/* Lời chào */}
              <div className="glass-dark rounded-3xl p-6 border border-white/10 shadow-2xl text-white mb-4">
                <div className="text-center space-y-3">
                  <span className="text-5xl block animate-pulse">🌱</span>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">
                    Chào mừng đến Vườn Ý Thức Biện Chứng
                  </h2>
                  <p className="text-xs text-emerald-300 font-medium italic leading-relaxed">
                    "Khả năng chỉ trở thành hiện thực khi có điều kiện phù hợp."
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Trước khi gieo hạt hành động, hãy xác định <span className="font-bold text-emerald-400">ít nhất 1 mục tiêu</span> để khu vườn biết bạn đang hướng tới điều gì.
                  </p>
                </div>
              </div>
              {/* Form thiết lập mục tiêu */}
              <GoalManager 
                goals={goals} 
                onAddGoal={handleAddGoal} 
                onDeleteGoal={handleDeleteGoal} 
                completedTasks={tasks} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* BACKGROUND LÀ KHU VƯỜN DƯỚI DẠNG FULL-SCREEN */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Garden 
          stats={stats} 
          contradictionLevel={contradictionAnalysis.level}
          whisperText={whisperText}
          whisperVisible={whisperVisible}
          onTreeClick={handleTreeClick}
          positiveTasksCount={tasks.filter(t => t.analysis.thayDoiChiSo.kyLuat >= 0).length}
        />
      </div>

      {/* TIÊU ĐIỂM MỤC TIÊU LÊN GIỮA Ở PHÍA TRÊN */}
      <TopGoalsWidget
        goals={goals}
        completedTasks={tasks}
        onClick={() => setShowGoalsModal(true)}
      />

      {/* HEADER DI ĐỘNG TỐI GIẢN */}
      <header className="md:hidden w-full px-4 pt-4 pb-2 flex items-center justify-between z-10 absolute top-0 left-0 right-0 select-none pointer-events-none">
        <div className="glass-dark rounded-full px-4 py-2 border border-white/10 pointer-events-auto flex items-center gap-1.5 shadow-lg">
          <span className="text-base animate-pulse">🌿</span>
          <h1 className="text-xs font-black text-white tracking-tight uppercase">
            VƯỜN Ý THỨC BIỆN CHỨNG AI
          </h1>
        </div>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white text-xs flex items-center justify-center shadow-lg transition-all active:scale-90"
          >
            ❓
          </button>
          <button
            onClick={handleResetGarden}
            className="w-8 h-8 rounded-full bg-red-950/60 backdrop-blur-md border border-red-500/20 text-red-200 text-xs flex items-center justify-center shadow-lg transition-all active:scale-90"
          >
            🔄
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT NƠI CÁC SIDEPANELS NỔI LÊN TRÊN SVG */}
      <main className="flex-1 w-full relative z-10 min-h-[500px]">
        
        {/* ===================== SIDEBAR TRÁI NỔI (CHỨA GIEO HẠT & THÔNG TIN CÂY) ===================== */}
        {showSidebars && (
          <div className="absolute left-6 top-6 bottom-24 w-[340px] z-20 pointer-events-none flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin select-none hidden md:flex">
            
            {/* 1. Header Thương hiệu & Slogan */}
            <div className="glass-dark rounded-3xl p-5 border border-white/10 shadow-lg text-white pointer-events-auto shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-pulse">🌿</span>
                <h1 className="text-base font-black tracking-tight text-white uppercase">
                  Vườn Ý Thức Biện Chứng AI
                </h1>
              </div>
              <p className="text-[10px] text-phil-primary font-bold italic mt-2.5 leading-relaxed">
                "Mỗi hành động là một hạt giống của tương lai."
              </p>
            </div>

            {/* 2. Gieo Hạt (TaskInput) — chỉ hiện khi đã có mục tiêu */}
            {hasGoals && (
              <div className="pointer-events-auto shrink-0">
                <TaskInput onAddTask={handleAddTask} isAnalyzing={isAnalyzing} />
              </div>
            )}

            {/* 3. Danh sách hành động đã gieo (TaskList) */}
            <div className="pointer-events-auto flex-1 min-h-0 flex flex-col">
              <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
            </div>

            {/* 4. Thông tin Cây của bạn */}
            <div className="glass-dark rounded-3xl p-4.5 border border-white/10 shadow-lg text-white pointer-events-auto shrink-0 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Cây của bạn:</span>
                <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5 mt-0.5">
                  {getTreeStageName(stats.evolutionStage)}
                </span>
                <span className="text-[10px] text-slate-300 block mt-0.5">
                  {stats.evolutionStage === 6 
                    ? "Đại ngàn cổ thụ vĩ đại phát triển tối đa!" 
                    : stats.evolutionStage === 4 
                      ? "Cây đang gặp mâu thuẫn bão giông thử thách." 
                      : "Cây đang sinh trưởng và phát triển tốt!"}
                </span>
              </div>
              <button
                onClick={() => setShowAchievementsModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] border border-white/10 transition-all cursor-pointer"
              >
                Huy hiệu
              </button>
            </div>

          </div>
        )}

        {/* ===================== SIDEBAR PHẢI NỔI (CHỨA AVATAR, GÓC NHÌN TRIẾT HỌC, CHỈ SỐ) ===================== */}
        {showSidebars && (
          <div className="absolute right-6 top-6 bottom-24 w-[340px] z-20 pointer-events-none flex flex-col gap-4 overflow-y-auto pl-1 scrollbar-thin select-none hidden md:flex">
            
            {/* 1. Profile người dùng & Ngày hành trình */}
            <div className="glass-dark rounded-2xl p-4 border border-white/10 shadow-lg pointer-events-auto shrink-0 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/10 border border-emerald-800/20 flex items-center justify-center text-base font-bold shadow-inner">
                    👤
                  </div>
                  <div>
                    <p className="text-[13px] font-bold leading-none">Người Chiêm Nghiệm</p>
                    <p className="text-[11px] text-emerald-800/80 mt-1 leading-none font-semibold">Tiến trình Lịch sử: Ngày {journeyDays}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {/* Bell notification */}
                  <button
                    onClick={() => {
                      if (contradictionAnalysis.hasContradiction) {
                        setShowPhilosophicalDetailModal(true);
                      } else {
                        alert("Không có xung đột mâu thuẫn biện chứng nào hiện tại. Lối sống của bạn đang rất cân bằng!");
                      }
                    }}
                    className="p-1.5 rounded-full bg-emerald-800/5 hover:bg-emerald-800/10 border border-emerald-800/15 text-emerald-800 transition-colors cursor-pointer relative"
                    title="Thông báo mâu thuẫn"
                  >
                    <Bell className="w-4 h-4" />
                    {contradictionAnalysis.hasContradiction && (
                      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    )}
                  </button>

                  {/* Volume toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-emerald-800/5 hover:bg-emerald-800/10 border border-emerald-800/15 text-emerald-800 transition-colors cursor-pointer"
                    title={isMuted ? "Bật nhạc" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-emerald-800/50" /> : <Volume2 className="w-4 h-4 text-emerald-800" />}
                  </button>
                </div>
              </div>

              {/* Kỷ nguyên Triết học */}
              <div className="px-3 py-2.5 rounded-xl bg-emerald-800/5 border border-emerald-800/10 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-800 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  {currentEpoch.title}
                </div>
                <p className="text-[12px] text-emerald-900/80 italic leading-relaxed font-serif">
                  "{currentEpoch.desc}"
                </p>
              </div>
            </div>

            {/* 2. AI Góc nhìn triết học */}
            <div className="pointer-events-auto shrink-0">
              <AIAnalysisCard 
                latestTask={latestTask} 
                stats={stats} 
                contradictionAnalysis={contradictionAnalysis} 
                onShowDetail={() => setShowPhilosophicalDetailModal(true)}
              />
            </div>

            {/* 3. Chỉ số cốt lõi */}
            <div className="pointer-events-auto flex-1 min-h-0 flex flex-col">
              <StatsPanel stats={stats} />
            </div>

          </div>
        )}

        {/* NÚT PHÁT TRIỂN XOẮN ỐC NỔI (Ở GIỮA SCREEN) */}
        {((stats.evolutionStage === 4 && contradictionAnalysis.level <= 25) || (stats.evolutionStage === 5 && stats.bienChung >= 80)) && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-[320px]">
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleSpiralEvolution}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 border border-white/20 active:scale-[0.98] transition-all animate-bounce cursor-pointer"
            >
              <Layers className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              {stats.evolutionStage === 4 
                ? "KÍCH HOẠT PHỦ ĐỊNH BIỆN CHỨNG (TÁI SINH)" 
                : "MỞ KHÓA ĐẠI NGÀN CỔ THỤ CẤP 6"}
            </motion.button>
          </div>
        )}

        {/* MOBILE VIEW LAYOUT */}
        <div className="absolute inset-x-4 top-16 bottom-4 z-20 md:hidden overflow-y-auto pointer-events-none space-y-4">
          {activeMobileTab === 'actions' && (
            <div className="pointer-events-auto space-y-4 pb-20">
              <GoalManager goals={goals} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} completedTasks={tasks} />
              {hasGoals && <TaskInput onAddTask={handleAddTask} isAnalyzing={isAnalyzing} />}
              {hasGoals && <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />}
            </div>
          )}

          {activeMobileTab === 'stats' && (
            <div className="pointer-events-auto space-y-4 pb-20">
              <StatsPanel stats={stats} />
              <QuantityStreaks stats={stats} />
              <AIAnalysisCard 
                latestTask={latestTask} 
                stats={stats} 
                contradictionAnalysis={contradictionAnalysis} 
                onShowDetail={() => setShowPhilosophicalDetailModal(true)}
              />
              <PhilosophyJournal
                completedTasks={tasks}
                stats={stats}
                journalHistory={journalHistory}
                onSaveJournal={handleSaveJournal}
                activeGoals={goals}
                contradictionAnalysis={contradictionAnalysis}
                latestTask={latestTask}
              />
              <AchievementPanel stats={stats} completedTasksCount={completedTasksCount} />
            </div>
          )}
        </div>

        {/* Lăng kính Triết nhân (Philosophy Banner) */}
        {showSidebars && (
          <div className="hidden md:block">
            <PhilosophyBanner />
          </div>
        )}

        {/* ===================== THANH ĐIỀU KHIỂN DOCK MAC-OS (DIALECTICAL DOCK) ===================== */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 hidden md:flex items-center gap-6 bg-slate-950/70 backdrop-blur-xl px-7 py-2.5 rounded-full border border-white/10 shadow-2xl">
          
          {/* Nhân Quả */}
          <button
            onClick={() => setShowPhilosophicalDetailModal(true)}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-semibold">Nhân Quả</span>
          </button>

          {/* Lượng → Chất */}
          <button
            onClick={() => setShowStreaksModal(true)}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-semibold">Lượng-Chất</span>
          </button>

          {/* Vườn Của Tôi (Center glowing button) */}
          <button
            onClick={() => setShowSidebars(!showSidebars)}
            className="flex flex-col items-center justify-center cursor-pointer"
            title={showSidebars ? "Ẩn các bảng để ngắm cảnh" : "Hiện bảng điều khiển"}
          >
            <div className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-emerald-300/30 active:scale-95 transition-all -mt-5">
              🌳
            </div>
            <span className="text-[9px] font-bold text-emerald-400 mt-1">Vườn Của Tôi</span>
          </button>

          {/* Mục Tiêu */}
          <button
            onClick={() => setShowGoalsModal(true)}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-semibold">Mục Tiêu</span>
          </button>

          {/* Nhật Ký */}
          <button
            onClick={() => setShowJournalModal(true)}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-semibold">Nhật Ký</span>
          </button>
        </div>

        {/* Nút Hướng Dẫn + Restart Nổi góc dưới phải */}
        <div className="absolute bottom-6 right-6 z-30 hidden md:flex items-center gap-2">
          <button
            onClick={handleResetGarden}
            className="flex items-center gap-1.5 bg-red-950/60 backdrop-blur-md border border-red-500/20 text-red-200 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-red-900/60 transition-all shadow-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Trồng lại
          </button>
          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-slate-900 transition-all shadow-lg cursor-pointer"
          >
            <span>❓</span> Hướng dẫn
          </button>
        </div>

        {/* TAB CHO DI ĐỘNG */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex md:hidden bg-slate-950/90 backdrop-blur-md p-1.5 border-t border-white/10 w-full gap-1 select-none pointer-events-auto">
          <button
            onClick={() => setActiveMobileTab('garden')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all ${
              activeMobileTab === 'garden' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <span className="text-base">🌳</span>
            Khu Vườn
          </button>
          <button
            onClick={() => setActiveMobileTab('actions')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all ${
              activeMobileTab === 'actions' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <span className="text-base">🌱</span>
            Hạt Giống
          </button>
          <button
            onClick={() => setActiveMobileTab('stats')}
            className={`flex-1 py-2 rounded-xl text-[10px] font-black flex flex-col items-center justify-center transition-all ${
              activeMobileTab === 'stats' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <span className="text-base">📊</span>
            Bản Thân & AI
          </button>
        </div>

      </main>

      {/* ===================== CÁC MODALS TRẢI NGHIỆM CHI TIẾT ===================== */}

      {/* 1. MODAL CẨM NANG HƯỚNG DẪN */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-md w-full relative z-50"
            >
              <button
                onClick={() => setShowInfoModal(false)}
                className="absolute right-4 top-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <InstructionCard />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MODAL PHÂN TÍCH BIỆN CHỨNG CHI TIẾT (Nhân quả & Mâu thuẫn) */}
      <AnimatePresence>
        {showPhilosophicalDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-dark rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative border border-white/10 max-h-[85vh] overflow-y-auto text-white scrollbar-thin"
            >
              <button
                onClick={() => setShowPhilosophicalDetailModal(false)}
                className="absolute right-4 top-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="text-xl">📊</span>
                  <h3 className="text-base font-bold text-white">Phân tích biện chứng chuyên sâu</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CỘT 1: CÂY NHÂN QUẢ */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-emerald-400 border-b border-white/5 pb-2 uppercase tracking-wider">
                      Sơ đồ Nhân Quả (Causal Flowchart)
                    </h4>
                    {latestTask && latestTask.analysis.causalGraph ? (
                      <div className="flex flex-col items-center space-y-3.5 py-4 bg-black/20 rounded-2xl p-4 border border-white/5">
                        {latestTask.analysis.causalGraph.nodes.map((node, index) => {
                          const isLast = index === latestTask.analysis.causalGraph.nodes.length - 1;
                          const isFirst = index === 0;

                          let nodeStyle = "bg-white/5 text-slate-200 border-white/10";
                          if (isFirst) nodeStyle = "bg-emerald-600 text-white border-emerald-700 shadow-md font-bold";
                          else if (isLast) nodeStyle = "bg-amber-500 text-white border-amber-600 shadow-md font-bold animate-causal";
                          else if (index === 1) nodeStyle = "bg-indigo-500/20 text-indigo-300 border-indigo-500/10";
                          else if (index === 2) nodeStyle = "bg-blue-500/20 text-blue-300 border-blue-500/10";

                          return (
                            <React.Fragment key={node.id}>
                              <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-full max-w-[260px] p-3 rounded-2xl border text-center text-[11px] leading-relaxed whitespace-pre-line ${nodeStyle}`}
                              >
                                {node.label}
                              </motion.div>
                              
                              {!isLast && (
                                <div className="flex flex-col items-center">
                                  <div className="w-0.5 h-3.5 bg-dashed border-l border-white/20" />
                                  <span className="text-[9px] text-slate-500 font-bold -mt-1">↓</span>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-black/10 rounded-2xl border border-white/5 text-slate-400 text-xs">
                        Chưa có hành động nào gần đây để lập bản đồ nhân quả.
                      </div>
                    )}
                  </div>

                  {/* CỘT 2: CẢNH BÁO MÂU THUẪN */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-teal-400 border-b border-white/5 pb-2 uppercase tracking-wider">
                      Mâu thuẫn biện chứng hiện tại
                    </h4>
                    {contradictionAnalysis.hasContradiction ? (
                      <div className="space-y-3">
                        <div className="bg-orange-500/15 border border-orange-500/20 rounded-2xl p-4 text-xs space-y-2">
                          <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                            <span className="font-bold text-orange-400">Phát hiện xung đột!</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
                              Cấp độ: {contradictionAnalysis.level}/100
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed font-medium text-[11px]">
                            {contradictionAnalysis.message}
                          </p>
                        </div>

                        {contradictionAnalysis.details.map((det, idx) => (
                          <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2.5">
                            <p className="text-[11px] text-red-300 leading-relaxed font-semibold">
                              ⚠️ Mâu thuẫn: {det.reason}
                            </p>
                            <p className="text-[11.5px] text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 leading-relaxed font-medium">
                              💡 Giải quyết: {det.advice}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-6 text-xs text-center space-y-2 text-slate-300">
                        <span className="text-3xl">✅</span>
                        <p className="font-bold text-emerald-400 text-[13px]">Trạng thái cân bằng</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Thực tiễn hành động của bạn đang đồng điệu với chí hướng. Không có mâu thuẫn biện chứng nào cản trở!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3 text-center">
                  *Ý nghĩa: Sự phát triển là một quá trình tự thân, vượt qua các mặt đối lập để vươn lên tầm cao sinh thái mới.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MODAL MỤC TIÊU */}
      <AnimatePresence>
        {showGoalsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-lg w-full relative z-50"
            >
              <button
                onClick={() => setShowGoalsModal(false)}
                className="absolute right-4 top-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <GoalManager 
                goals={goals} 
                onAddGoal={handleAddGoal} 
                onDeleteGoal={handleDeleteGoal} 
                completedTasks={tasks} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL NHẬT KÝ */}
      <AnimatePresence>
        {showJournalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-xl w-full relative z-50"
            >
              <button
                onClick={() => setShowJournalModal(false)}
                className="absolute right-4 top-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <PhilosophyJournal
                completedTasks={tasks}
                stats={stats}
                journalHistory={journalHistory}
                onSaveJournal={handleSaveJournal}
                activeGoals={goals}
                contradictionAnalysis={contradictionAnalysis}
                latestTask={latestTask}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MODAL LƯỢNG CHẤT (QuantityStreaks) */}
      <AnimatePresence>
        {showStreaksModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-md w-full relative z-50"
            >
              <button
                onClick={() => setShowStreaksModal(false)}
                className="absolute right-4 top-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <QuantityStreaks stats={stats} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MODAL HUY HIỆU */}
      <AnimatePresence>
        {showAchievementsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="max-w-md w-full relative z-50"
            >
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="absolute right-4 top-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <AchievementPanel stats={stats} completedTasksCount={completedTasksCount} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
