import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { busAudio } from '../utils/audioSynthesizer';

interface HangingTalismanProps {
  hornTriggered: boolean;
  speedKmH: number;
}

export const HangingTalisman: React.FC<HangingTalismanProps> = ({ hornTriggered, speedKmH }) => {
  const [rotation, setRotation] = useState(0);
  const [blessingMessage, setBlessingMessage] = useState<string | null>(null);
  const lastMouseX = useRef(0);

  // Horn shockwave reaction
  useEffect(() => {
    if (hornTriggered) {
      setRotation(22);
      setTimeout(() => setRotation(-18), 120);
      setTimeout(() => setRotation(12), 240);
      setTimeout(() => setRotation(-6), 360);
      setTimeout(() => setRotation(0), 500);
    }
  }, [hornTriggered]);

  // Road vibration & mouse tracking physics
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - lastMouseX.current;
      lastMouseX.current = e.clientX;
      if (Math.abs(deltaX) > 4) {
        setRotation(Math.max(-25, Math.min(25, deltaX * 0.4)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTalismanClick = () => {
    busAudio.unlock();
    setRotation(35);
    setTimeout(() => setRotation(-28), 150);
    setTimeout(() => setRotation(15), 300);
    setTimeout(() => setRotation(0), 600);

    const blessings = [
      '🧿 EVIL EYE WARDED OFF: 100% Highway Protection Activated!',
      "🌸 MOTHER'S BLESSING: Safe Journey & Smooth Highway Roads",
      '🚎 DRIVER NOTICE: Please keep hands inside the window!',
      '🌶️ LEMON-CHILI TALISMAN: Neutralized every pothole on the road!',
      '✨ 90s CASSETTE MAGIC: No matter how long the highway, sleep won’t come!'
    ];
    const picked = blessings[Math.floor(Math.random() * blessings.length)];
    setBlessingMessage(picked);
    setTimeout(() => setBlessingMessage(null), 3500);
  };

  return (
    <div className="relative flex flex-col items-center pointer-events-auto select-none">
      {/* Mirror Mount Hanger Pin */}
      <div className="w-8 h-2 bg-neutral-800 rounded-full border border-neutral-700 shadow-md"></div>
      {/* Black Thread */}
      <div className="w-0.5 h-6 bg-neutral-900"></div>

      {/* Swinging Assembly */}
      <motion.div
        animate={{
          rotate: rotation,
          y: Math.sin(Date.now() * 0.003) * (speedKmH > 40 ? 3 : 1),
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
        onClick={handleTalismanClick}
        className="cursor-pointer group relative flex flex-col items-center origin-top transition-transform hover:scale-105"
        title="Click the Lemon-Chili Highway Talisman for Protection!"
      >
        {/* Top Evil Eye Bead */}
        <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-300 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-black"></div>
          </div>
        </div>

        <div className="w-0.5 h-3 bg-neutral-900"></div>

        {/* 7 Green Chilies + Lemon Bundle (SVG Indian Talisman) */}
        <svg width="64" height="110" viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
          {/* Central Bright Yellow Juicy Lemon */}
          <circle cx="32" cy="24" r="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <ellipse cx="32" cy="11" rx="2.5" ry="1.5" fill="#65A30D" />
          {/* Lemon highlight */}
          <ellipse cx="28" cy="20" rx="3.5" ry="6" fill="#FEF08A" opacity="0.6" transform="rotate(-20 28 20)" />

          {/* Green Hanging Mirchis (7 chilies) */}
          {/* Chili 1 (Left curve) */}
          <path d="M26 36 C24 45, 16 60, 14 75 C13 82, 17 84, 18 78 C20 68, 28 50, 30 36 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
          {/* Chili 2 */}
          <path d="M29 37 C28 48, 22 66, 20 84 C19 90, 23 91, 24 85 C26 72, 31 52, 32 37 Z" fill="#22C55E" stroke="#14532D" strokeWidth="1" />
          {/* Chili 3 (Center Long) */}
          <path d="M32 38 C32 52, 31 72, 32 94 C32 99, 35 98, 35 93 C35 76, 35 54, 34 38 Z" fill="#15803D" stroke="#14532D" strokeWidth="1" />
          {/* Chili 4 */}
          <path d="M35 37 C36 48, 42 66, 44 84 C45 90, 41 91, 40 85 C38 72, 33 52, 32 37 Z" fill="#22C55E" stroke="#14532D" strokeWidth="1" />
          {/* Chili 5 (Right curve) */}
          <path d="M38 36 C40 45, 48 60, 50 75 C51 82, 47 84, 46 78 C44 68, 36 50, 34 36 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
          
          {/* Black Coal / Nazar Doll bead at bottom */}
          <circle cx="32" cy="100" r="5.5" fill="#171717" stroke="#404040" strokeWidth="1.5" />
          <circle cx="30" cy="98" r="1.5" fill="#E5E5E5" />
        </svg>

        {/* Small Truck Art Badge below */}
        <div className="mt-1 px-2 py-0.5 rounded bg-[#ff7b00] text-neutral-950 font-bold text-[9px] tracking-tight font-mono shadow-md border border-amber-300">
          PROTECTION TALISMAN 🧿
        </div>
      </motion.div>

      {/* Floating blessing popup */}
      {blessingMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-12 whitespace-nowrap bg-neutral-900/95 text-amber-300 text-xs px-3 py-1.5 rounded-full border border-amber-500/50 shadow-2xl z-40 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>{blessingMessage}</span>
        </motion.div>
      )}
    </div>
  );
};
