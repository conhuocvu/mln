import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Send, MessageSquare, AlertCircle, History, Sparkles, HelpCircle, X, Check } from 'lucide-react';
import { callGeminiChat, callGemini, SOCRATIC_SYSTEM_PROMPT, SOCRATIC_SYNTHESIS_PROMPT } from '../services/geminiService';

export default function PhilosophyJournal({ completedTasks, stats, journalHistory, onSaveJournal, activeGoals, contradictionAnalysis, latestTask }) {
  const [reflectionStep, setReflectionStep] = useState(null); // null, 'chatting', 'synthesizing', 'result'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [aiConversation, setAiConversation] = useState([]); // Lịch sử gửi cho Gemini
  const [inputVal, setInputVal] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [synthesisResult, setSynthesisResult] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0); // Đếm số lượt hỏi-đáp
  const lastTriggeredTaskId = useRef(null);

  const chatEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // Hàm gọi Gemini AI để lấy câu hỏi Socratic
  const askSocrates = async (task, conversation) => {
    const taskContext = task 
      ? `Người dùng vừa thực hiện hành động: "${task.text}" (phân loại: ${task.analysis?.category || 'other'}). Giải thích triết học: ${task.analysis?.giaiThich || ''}`
      : "Người dùng chưa thực hiện hành động nào hôm nay.";

    const systemWithContext = `${SOCRATIC_SYSTEM_PROMPT}

NGỮ CẢNH HIỆN TẠI:
${taskContext}

Thống kê: Kỷ luật ${stats?.kyLuat || 50}/100, Tri thức ${stats?.triThuc || 50}/100, Phát triển ${stats?.phatTrien || 50}/100.
${contradictionAnalysis?.hasContradiction ? `Mâu thuẫn hiện tại: ${contradictionAnalysis.message}` : 'Không có mâu thuẫn nổi bật.'}

Đây là lượt hỏi thứ ${conversation.length / 2 + 1}. Hãy đặt MỘT câu hỏi Socratic sâu sắc, ngắn gọn (2-3 câu), gợi mở suy nghĩ.`;

    try {
      const fullConversation = conversation.length === 0 
        ? [{ role: "user", text: `Hãy bắt đầu đối thoại Socratic. Tôi vừa thực hiện: "${task?.text || 'không có hành động'}"` }]
        : conversation;

      const response = await callGeminiChat(systemWithContext, fullConversation);
      return response;
    } catch (error) {
      console.error("Lỗi gọi Socrates AI:", error);
      // Fallback câu hỏi cơ bản
      return task 
        ? `Bạn vừa thực hiện "${task.text}". Điều gì thôi thúc bạn làm điều này hôm nay?`
        : "Hôm nay bạn cảm thấy thế nào về khu vườn nhân sinh của mình?";
    }
  };

  // Hàm khởi động phản tư cho một task cụ thể
  const startReflectionForTask = async (task) => {
    setSelectedEvent(task);
    setChatHistory([]);
    setAiConversation([]);
    setShowHistory(false);
    setCurrentJournal(null);
    setSynthesisResult(null);
    setTurnCount(0);
    setReflectionStep('chatting');

    // Gọi AI lấy câu hỏi đầu tiên
    setIsTyping(true);
    
    // Hiện lời chào trước
    setChatHistory([
      { type: 'ai', text: `💬 Chào người chiêm nghiệm, tôi là Socrates. ${task ? `Bạn vừa thực hiện: "${task.text}".` : 'Khu vườn hôm nay tĩnh lặng.'} Hãy cùng tôi nhìn sâu vào khoảnh khắc này.` }
    ]);

    try {
      const firstQuestion = await askSocrates(task, []);
      setChatHistory(prev => [...prev, { type: 'ai', text: firstQuestion }]);
      setAiConversation([
        { role: "user", text: `Hãy bắt đầu đối thoại Socratic. Tôi vừa thực hiện: "${task?.text || 'không có hành động'}"` },
        { role: "ai", text: firstQuestion }
      ]);
    } catch (err) {
      setChatHistory(prev => [...prev, { type: 'ai', text: "Điều gì đã khiến bạn thực hiện hành động này hôm nay?" }]);
    }
    setIsTyping(false);
  };

  // AUTO-TRIGGER: Tự động bật phản tư ngay khi gieo hành động mới
  useEffect(() => {
    if (latestTask && latestTask.id && latestTask.id !== lastTriggeredTaskId.current) {
      lastTriggeredTaskId.current = latestTask.id;
      const timer = setTimeout(() => {
        startReflectionForTask(latestTask);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [latestTask]);

  // Bắt đầu chu trình đối thoại Socratic (nút bấm thủ công)
  const handleStartReflection = () => {
    let event = null;
    if (completedTasks && completedTasks.length > 0) {
      event = completedTasks.find(t => t.analysis?.category === "waste") ||
              completedTasks.find(t => t.analysis?.category === "study") ||
              completedTasks.find(t => t.analysis?.category === "health") ||
              completedTasks[0];
    }
    startReflectionForTask(event);
  };

  // Xử lý gửi câu trả lời - gọi Gemini AI tiếp tục đối thoại
  const handleSendAnswer = async () => {
    if (!inputVal.trim()) return;

    const currentAnswer = inputVal.trim();
    setInputVal("");
    
    // Thêm câu trả lời của user vào chat
    setChatHistory(prev => [...prev, { type: 'user', text: currentAnswer }]);
    
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    // Cập nhật conversation cho AI
    const updatedConversation = [...aiConversation, { role: "user", text: currentAnswer }];
    setAiConversation(updatedConversation);

    // Sau 3 lượt hỏi-đáp → Chuyển sang đúc kết
    if (newTurn >= 3) {
      setReflectionStep('synthesizing');
      setIsTyping(true);
      
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: "✨ Cảm ơn bạn đã chia sẻ chân thành. Tôi sẽ đúc kết những gì chúng ta vừa khám phá..." 
      }]);

      try {
        // Gọi AI đúc kết
        const conversationSummary = updatedConversation.map(m => 
          `${m.role === 'ai' ? 'Socrates' : 'Người dùng'}: ${m.text}`
        ).join('\n\n');

        const synthesisPrompt = `Cuộc đối thoại Socratic vừa diễn ra:\n\n${conversationSummary}\n\nHành động gốc: "${selectedEvent?.text || 'không có'}"\nPhân loại: ${selectedEvent?.analysis?.category || 'other'}`;

        const synthesis = await callGemini(SOCRATIC_SYNTHESIS_PROMPT, synthesisPrompt);
        
        if (synthesis && synthesis.hienTuong) {
          setSynthesisResult(synthesis);
          setReflectionStep('result');
        } else {
          throw new Error("Kết quả đúc kết không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi đúc kết:", err);
        // Fallback synthesis
        setSynthesisResult({
          hienTuong: `Bạn đã thực hiện hành động "${selectedEvent?.text || 'phản tư'}" và chia sẻ suy nghĩ sâu sắc qua cuộc đối thoại.`,
          banChat: `Đằng sau hành động này là quá trình tự ý thức và phản tư liên tục. Mỗi câu trả lời bạn đưa ra đều phản ánh một lớp nhận thức đang dần sáng tỏ.`,
          mauThuan: `Mâu thuẫn giữa ý thức lý tưởng và thực tiễn hành động luôn hiện hữu. Chính sự đấu tranh giải quyết mâu thuẫn này là động lực phát triển.`,
          baiHoc: `Quy luật biện chứng: Nhận thức chỉ có giá trị khi được kiểm chứng qua thực tiễn. Hành động hôm nay là một bước trong tiến trình chuyển hóa bản thân liên tục.`,
          cauHoiMo: "Nếu duy trì hành động này liên tục trong 30 ngày, bạn nghĩ bản thân sẽ thay đổi như thế nào?"
        });
        setReflectionStep('result');
      }
      setIsTyping(false);
    } else {
      // Tiếp tục đối thoại - gọi AI hỏi câu tiếp
      setIsTyping(true);
      try {
        const nextQuestion = await askSocrates(selectedEvent, updatedConversation);
        setChatHistory(prev => [...prev, { type: 'ai', text: nextQuestion }]);
        setAiConversation(prev => [...prev, { role: "ai", text: nextQuestion }]);
      } catch (err) {
        const fallbackQuestions = [
          "Điều này cho thấy điều gì về giá trị mà bạn thực sự theo đuổi?",
          "Nếu nhìn lại sau một năm, bạn muốn thấy điều gì khác biệt?",
          "Có mâu thuẫn nào giữa những gì bạn muốn và những gì bạn đang làm?"
        ];
        const q = fallbackQuestions[newTurn - 1] || fallbackQuestions[0];
        setChatHistory(prev => [...prev, { type: 'ai', text: q }]);
        setAiConversation(prev => [...prev, { role: "ai", text: q }]);
      }
      setIsTyping(false);
    }
  };

  // Lưu đúc kết vào lịch sử nhật ký
  const handleSaveSynthesis = () => {
    if (!synthesisResult) return;

    const content = `Nhìn nhận dưới góc độ Triết học biện chứng: thứ nhất, ${synthesisResult.hienTuong} Thứ hai, ${synthesisResult.banChat} Thứ ba, ${synthesisResult.mauThuan} Lăng kính triết học rút ra: ${synthesisResult.baiHoc}`;

    const newJournal = {
      id: `journal-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timestamp: Date.now(),
      title: selectedEvent ? `Phản tư về: ${selectedEvent.text}` : "Chiêm nghiệm Sự Tĩnh Lặng",
      principle: selectedEvent ? (selectedEvent.analysis?.khaiNiemTrieuHoc?.[0] || "Phép biện chứng") : "Thực tiễn & Nhận thức",
      content,
      advice: `Câu hỏi phản tư mở: "${synthesisResult.cauHoiMo}"`
    };

    onSaveJournal(newJournal);
    setCurrentJournal(newJournal);
    setReflectionStep(null);
    setSynthesisResult(null);
  };

  const handleCancelReflection = () => {
    if (reflectionStep === 'chatting' && chatHistory.length > 2) {
      if (!window.confirm("Bạn có chắc muốn hủy bỏ phiên phản tư Socratic này?")) return;
    }
    setReflectionStep(null);
    setSynthesisResult(null);
    setChatHistory([]);
    setAiConversation([]);
    setTurnCount(0);
  };

  return (
    <div className="w-full glass-dark rounded-3xl p-5 border border-white/10 shadow-lg relative overflow-hidden flex flex-col text-white">
      <div className="flex justify-between items-center mb-3.5 border-b border-white/10 pb-2.5">
        <h3 className="text-sm font-bold text-white/90 flex items-center gap-1.5">
          <BookOpen className="w-4.5 h-4.5 text-emerald-400" />
          Đối Thoại Socratic AI
        </h3>
        
        {reflectionStep === null && journalHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[10px] font-bold text-slate-350 hover:text-white bg-emerald-800/10 hover:bg-emerald-800/20 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-emerald-800/20"
          >
            <History className="w-3 h-3" />
            {showHistory ? "Quay lại" : `Lịch sử (${journalHistory.length})`}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showHistory && reflectionStep === null ? (
          // 1. LỊCH SỬ NHẬT KÝ
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3 flex-1 flex flex-col"
          >
            <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Hành trình chiêm nghiệm đã qua:</p>
            <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1 flex-1 scrollbar-thin">
              {journalHistory.map((j) => (
                <div
                  key={j.id}
                  className="p-3.5 rounded-2xl bg-emerald-850/5 border border-emerald-800/10 shadow-sm space-y-2 hover:bg-emerald-800/10 transition-all text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold text-emerald-800/70">
                      📅 {j.date}
                    </span>
                    <span className="text-[8px] font-extrabold text-emerald-800 bg-emerald-800/10 px-2 py-0.5 rounded-full uppercase border border-emerald-800/20">
                      {j.principle}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-emerald-950">{j.title}</h4>
                  <p className="text-slate-700 leading-relaxed italic select-text font-serif">
                    "{j.content}"
                  </p>
                  <div className="text-[10px] text-emerald-900 bg-emerald-800/5 p-2.5 rounded-xl border border-emerald-800/15">
                    {j.advice}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : reflectionStep !== null ? (
          // 2. GIAO DIỆN CHAT ĐỐI THOẠI SOCRATIC AI
          <motion.div
            key="socratic-chat"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col min-h-[300px] max-h-[400px] overflow-hidden"
          >
            {/* Header chat & Progress bar */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider pb-1.5 border-b border-white/5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                Socrates AI đang đối thoại
              </span>
              {reflectionStep === 'chatting' ? (
                <span className="text-emerald-400">Lượt {turnCount + 1} / 3</span>
              ) : reflectionStep === 'synthesizing' ? (
                <span className="text-amber-400 animate-pulse">Đang đúc kết...</span>
              ) : (
                <span className="text-amber-400">Tổng kết</span>
              )}
            </div>
            
            {/* Progress bar */}
            {reflectionStep === 'chatting' && (
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-500"
                  style={{ width: `${((turnCount) / 3) * 100}%` }}
                />
              </div>
            )}

            {/* Khung chat chứa tin nhắn */}
            <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 scrollbar-thin flex flex-col">
              {chatHistory.map((chat, idx) => (
                <div
                  key={`chat-msg-${idx}`}
                  className={`flex flex-col max-w-[85%] text-xs ${
                    chat.type === 'ai' 
                      ? 'bg-emerald-950/40 text-stone-900 border border-emerald-900/30 rounded-2xl rounded-tl-none p-3 self-start font-serif' 
                      : 'bg-emerald-800/15 text-emerald-950 border border-emerald-850/20 rounded-2xl rounded-tr-none p-3 self-end font-medium'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line select-text">
                    {chat.text}
                  </p>
                </div>
              ))}

              {isTyping && (
                <div className="bg-emerald-950/20 text-emerald-800/60 border border-emerald-900/10 rounded-2xl rounded-tl-none p-3 self-start text-xs font-serif flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-700/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-700/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-700/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  Socrates AI đang suy tư...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input gửi phản tư */}
            {reflectionStep === 'chatting' ? (
              <div className="flex gap-2 border-t border-white/5 pt-2.5">
                <textarea
                  rows="2"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAnswer();
                    }
                  }}
                  placeholder="Nhập suy nghĩ chân thật của bạn..."
                  disabled={isTyping}
                  className="flex-1 bg-emerald-800/5 focus:bg-emerald-800/10 border border-emerald-800/20 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none transition-all placeholder:text-slate-400/70 resize-none font-medium leading-relaxed font-sans disabled:opacity-50"
                />
                <button
                  onClick={handleSendAnswer}
                  disabled={!inputVal.trim() || isTyping}
                  className="px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : reflectionStep === 'result' && synthesisResult ? (
              // 3. HIỂN THỊ KẾT QUẢ ĐÚC KẾT PHẢN TƯ AI
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-t border-white/10 pt-3.5 mt-1 space-y-4 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin select-none"
              >
                <div className="text-center pb-2 border-b border-emerald-800/10">
                  <span className="text-base">✨</span>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tight mt-0.5">Bản Tổng Hợp Chiêm Nghiệm Biện Chứng (AI)</h4>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Hiện tượng */}
                  <div className="bg-emerald-850/5 border border-emerald-800/10 rounded-xl p-3">
                    <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block mb-1">🔍 Hiện tượng:</span>
                    <p className="text-slate-850 leading-relaxed italic">"{synthesisResult.hienTuong}"</p>
                  </div>

                  {/* Bản chất */}
                  <div className="bg-emerald-850/5 border border-emerald-800/10 rounded-xl p-3">
                    <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block mb-1">💡 Bản chất:</span>
                    <p className="text-slate-850 leading-relaxed italic">"{synthesisResult.banChat}"</p>
                  </div>

                  {/* Mâu thuẫn */}
                  <div className="bg-emerald-850/5 border border-emerald-800/10 rounded-xl p-3">
                    <span className="text-[10px] font-extrabold text-red-900 uppercase tracking-wider block mb-1">⚖️ Mâu thuẫn:</span>
                    <p className="text-slate-850 leading-relaxed italic">"{synthesisResult.mauThuan}"</p>
                  </div>

                  {/* Bài học triết học */}
                  <div className="bg-emerald-800/10 border border-emerald-800/20 rounded-xl p-3">
                    <span className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      Bài học Triết học (AI):
                    </span>
                    <p className="text-slate-900 leading-relaxed font-serif">
                      {synthesisResult.baiHoc}
                    </p>
                  </div>

                  {/* Câu hỏi mở */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-950">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      Câu hỏi phản tư tiếp nối:
                    </span>
                    <p className="italic leading-relaxed font-serif font-semibold">
                      "{synthesisResult.cauHoiMo}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={handleCancelReflection}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-350 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleSaveSynthesis}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Khắc ghi Nhật ký
                  </button>
                </div>
              </motion.div>
            ) : null}

            {/* Nút Hủy bỏ nổi ở góc trên khi đang chat */}
            {reflectionStep === 'chatting' && (
              <button
                onClick={handleCancelReflection}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Hủy phản tư"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : currentJournal ? (
          // 3. HIỂN THỊ BẢN NHẬT KÝ MỚI NHẤT VỪA ĐÚC KẾT XONG
          <motion.div
            key="current-journal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-3 bg-emerald-850/5 border border-emerald-800/10 rounded-2xl p-4"
          >
            <div className="flex justify-between items-start border-b border-emerald-800/10 pb-2">
              <span className="text-[9px] font-bold text-emerald-800/70">
                📅 {currentJournal.date}
              </span>
              <span className="text-[8px] font-extrabold text-emerald-800 bg-emerald-800/10 px-2 py-0.5 rounded-full uppercase border border-emerald-800/20">
                {currentJournal.principle}
              </span>
            </div>

            <h4 className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              {currentJournal.title}
            </h4>

            <p className="text-xs text-slate-700 leading-relaxed italic select-text font-serif">
              "{currentJournal.content}"
            </p>

            <div className="bg-emerald-800/5 border border-emerald-800/10 rounded-xl p-2.5 text-[10px] text-slate-900 space-y-1">
              <p className="font-extrabold text-emerald-950">
                Suy nghĩ phản tư tiếp nối:
              </p>
              <p className="italic leading-relaxed font-serif font-semibold">{currentJournal.advice}</p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setCurrentJournal(null)}
                className="text-[9px] font-bold text-emerald-800 hover:text-emerald-600 transition-colors cursor-pointer uppercase tracking-wider"
              >
                ✍️ Khởi động phản tư mới
              </button>
            </div>
          </motion.div>
        ) : (
          // 4. MÀN HÌNH BẮT ĐẦU: NÚT KÍCH HOẠT PHẢN TƯ SOCRATIC
          <motion.div
            key="generate-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3.5 min-h-[140px]"
          >
            <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>💬</span>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Đối thoại Socratic AI & Phản tư hằng ngày</p>
              <p className="text-[10px] text-slate-400 max-w-[280px]">
                Trải qua một ngày hành động thực tiễn, hãy đối thoại cùng Socrates AI để khám phá quy luật biến đổi bản thân.
              </p>
            </div>

            <button
              onClick={handleStartReflection}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer border border-white/10"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Bắt đầu Phản tư với AI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
