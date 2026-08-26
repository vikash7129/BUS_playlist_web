import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NOSTALGIC_MEMORIES } from '../data/playlistData';
import { Quote, Sparkles, ChevronLeft, ChevronRight, Wind, Coffee, Volume2, Ticket, Shield, Sunrise } from 'lucide-react';
import { busAudio } from '../utils/audioSynthesizer';

const iconMap: { [key: string]: React.ElementType } = {
  Wind,
  Coffee,
  Volume2,
  Ticket,
  Shield,
  Sunrise,
};

export const RotatingMemories: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_MEMORIES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = NOSTALGIC_MEMORIES[currentIndex];
  const IconComponent = iconMap[current.icon] || Sparkles;

  const handleNext = () => {
    busAudio.playCassetteClick('click');
    setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_MEMORIES.length);
  };

  const handlePrev = () => {
    busAudio.playCassetteClick('click');
    setCurrentIndex((prev) => (prev - 1 + NOSTALGIC_MEMORIES.length) % NOSTALGIC_MEMORIES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full relative my-6 rounded-3xl bg-gradient-to-r from-[#0e1626]/95 via-[#141e33]/90 to-[#0e1626]/95 backdrop-blur-xl border border-white/10 p-5 sm:p-7 shadow-2xl overflow-hidden"
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7b00]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ff9500] font-bold uppercase tracking-wider">
          <Quote className="w-4 h-4 text-[#ff7b00]" />
          <span>यादों का सफर • Highway Nostalgia ({currentIndex + 1}/{NOSTALGIC_MEMORIES.length})</span>
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-[#0a0f1a] text-neutral-300 hover:text-[#ff9500] hover:bg-[#141e33] border border-white/10 transition"
            title="Previous Memory"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-[#0a0f1a] text-neutral-300 hover:text-[#ff9500] hover:bg-[#141e33] border border-white/10 transition"
            title="Next Memory"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {/* Hindi Title & Tag */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff7b00]/20 text-[#ff9500] border border-[#ff7b00]/30 shadow-sm">
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-hindi tracking-wide">
              {current.hindiTitle}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0a0f1a] text-[#ff9500] text-xs font-mono border border-white/10">
              {current.timeContext}
            </span>
          </div>

          {/* Nostalgic Narrative */}
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-baskerville italic">
            "{current.story}"
          </p>

          <div className="text-xs text-neutral-400 font-body">
            — {current.englishTranslation}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-2">
        {NOSTALGIC_MEMORIES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-[#ff7b00] shadow-[0_0_8px_rgba(255,123,0,0.6)]' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
            }`}
            title={`Go to memory ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
