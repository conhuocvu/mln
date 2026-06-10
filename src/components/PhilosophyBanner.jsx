import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';
import { WHISPER_CATEGORIES } from '../data/whisperLibrary';

// Lấy tất cả danh ngôn từ thư viện thì thầm để hiển thị
const allQuotes = Object.values(WHISPER_CATEGORIES).flatMap(cat => cat.whispers);

export default function PhilosophyBanner() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Tự động xoay vòng danh ngôn sau mỗi 15 giây
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextQuote();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = () => {
    setIsRotating(true);
    setQuoteIndex((prev) => (prev + 1) % allQuotes.length);
    setTimeout(() => setIsRotating(false), 600);
  };

  const currentQuoteRaw = allQuotes[quoteIndex] || "Hãy làm chủ vận mệnh của bạn. — Antigravity";
  const [quoteText, quoteAuthor] = currentQuoteRaw.split(' — ');

  return (
    <div className="absolute bottom-26 left-1/2 -translate-x-1/2 z-25 max-w-[500px] w-[90%] md:w-auto pointer-events-none select-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-dark rounded-2xl px-4.5 py-2.5 shadow-xl border border-emerald-800/15 flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-800/10 flex items-center justify-center text-emerald-800 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="relative overflow-hidden min-h-[48px] py-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="pr-2"
                >
                  <p className="text-[12px] md:text-[13px] font-serif italic text-emerald-950/90 leading-tight line-clamp-2">
                    "{quoteText}"
                  </p>
                  {quoteAuthor && (
                    <p className="text-[10px] font-sans font-bold text-emerald-850 uppercase tracking-widest mt-0.5 text-right">
                      — {quoteAuthor}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          onClick={handleNextQuote}
          className="p-1.5 rounded-lg hover:bg-emerald-800/10 text-emerald-800 transition-colors cursor-pointer shrink-0"
          title="Đọc triết lý khác"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>
    </div>
  );
}
