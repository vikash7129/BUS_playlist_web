import React from 'react';
import { motion } from 'motion/react';
import { Volume2, BellRing, Compass, Gauge, Flame, Sparkles, Navigation } from 'lucide-react';
import { busAudio } from '../utils/audioSynthesizer';
import { HangingTalisman } from './HangingTalisman';

interface RouteBoardAndDashboardProps {
  speedKmH: number;
  onSpeedChange: (speed: number) => void;
  onHorn: () => void;
  onWhistle: () => void;
  hornActive: boolean;
}

export const RouteBoardAndDashboard: React.FC<RouteBoardAndDashboardProps> = ({
  speedKmH,
  onSpeedChange,
  onHorn,
  onWhistle,
  hornActive,
}) => {
  // Speedometer needle rotation angle (-120 deg for 0 km/h to +120 deg for 140 km/h)
  const needleRotation = -120 + (speedKmH / 140) * 240;

  return (
    <div className="w-full relative mt-4">
      {/* Top Illuminated LED Bus Destination Board */}
      <div className="relative w-full rounded-2xl bg-[#0e1626]/90 border border-[#ff7b00]/35 p-3.5 sm:p-4 shadow-[0_0_30px_rgba(255,123,0,0.15)] overflow-hidden backdrop-blur-xl">
        {/* Subtle LED Grid Matrix Pattern Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff7b00_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          {/* Service Name & Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-neutral-950 font-bold text-xs tracking-wider uppercase font-mono shadow-[0_0_12px_rgba(255,123,0,0.4)]">
              NH-44 NIGHT EXPRESS
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#ff9500] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE TRACKING</span>
            </div>
          </div>

          {/* Scrolling Destination Name in Hindi & English */}
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold tracking-wide text-[#ff9500] font-hindi drop-shadow-[0_0_12px_rgba(255,123,0,0.5)]">
              दिल्ली ➔ चंडीगढ़ ➔ कुल्लू ➔ मनाली
            </div>
            <div className="text-xs text-neutral-400 font-mono tracking-widest uppercase">
              DELHI ISBT ➔ CHANDIGARH ➔ MANALI (VIA NH 44)
            </div>
          </div>

          {/* Next Dhaba Stop Info */}
          <div className="hidden lg:flex items-center gap-2 text-right">
            <div>
              <div className="text-[11px] text-neutral-400 font-body">Next Dhaba Stop</div>
              <div className="text-xs font-semibold text-[#ff9500] font-mono">Murthal Pahalwan (14 KM)</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#141e33] border border-[#ff7b00]/30 flex items-center justify-center text-[#ff9500] shadow-sm">
              <Navigation className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Bus Cockpit / Wooden & Metal Dashboard */}
      <div className="relative mt-3 rounded-3xl bg-gradient-to-b from-[#141e33]/95 via-[#0e1626]/95 to-[#0a0f1a]/98 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        {/* Rearview Mirror + Talisman Assembly in Top Center */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          {/* Wide Convex Rearview Mirror */}
          <div className="w-36 sm:w-44 h-9 bg-[#070a12] rounded-xl border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Mirror Reflection of sleeping bus passengers */}
            <div className="w-full h-full bg-gradient-to-r from-[#070a12] via-neutral-800 to-[#070a12] flex items-center justify-between px-3 text-[9px] text-neutral-400 font-mono">
              <span>◄ SEATS 1-32</span>
              <span className="text-[#ff9500] font-bold">ALL ASLEEP</span>
              <span>33-40 ►</span>
            </div>
          </div>
          <HangingTalisman hornTriggered={hornActive} speedKmH={speedKmH} />
        </div>

        {/* Dashboard Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-8 sm:pt-4">
          {/* 1. SPEEDOMETER & ODOMETER GAUGE */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0a0f1a]/90 border border-white/10 shadow-inner">
            <div className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#ff7b00]" />
              <span>Vintage Speedometer</span>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Dial Background SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Outer Ring */}
                <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="6" />
                {/* Speed Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke={speedKmH > 80 ? '#ef4444' : '#ff7b00'}
                  strokeWidth="6"
                  strokeDasharray="210"
                  strokeDashoffset={210 - (speedKmH / 140) * 210}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>

              {/* Dial Face Numbers */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono text-white">{speedKmH}</span>
                <span className="text-[10px] text-neutral-400 font-mono">KM / H</span>
                {/* Mechanical Odometer */}
                <div className="mt-1 px-1.5 py-0.5 rounded bg-[#0a0f1a] border border-white/10 text-[9px] font-mono text-[#ff9500] font-bold tracking-widest">
                  482910 KM
                </div>
              </div>

              {/* Physical Needle */}
              <div
                className="absolute w-1 h-14 bg-[#ff7b00] rounded-full origin-bottom transform transition-transform duration-300 shadow-md"
                style={{
                  top: '18px',
                  left: 'calc(50% - 2px)',
                  transform: `rotate(${needleRotation}deg)`,
                  transformOrigin: '50% 100%',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white absolute -top-1 -left-0.5 shadow"></div>
              </div>
              <div className="w-4 h-4 rounded-full bg-[#0a0f1a] border-2 border-neutral-400 z-10"></div>
            </div>

            {/* Accelerator Cruise Slider */}
            <div className="w-full mt-2 flex items-center gap-2">
              <span className="text-[10px] text-neutral-400 font-mono">40</span>
              <input
                id="speed-slider"
                type="range"
                min="30"
                max="110"
                value={speedKmH}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff7b00]"
              />
              <span className="text-[10px] text-neutral-400 font-mono">110</span>
            </div>
          </div>

          {/* 2. THE SACRED DASHBOARD IDOL & DIYA */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0a0f1a]/90 border border-white/10 text-center relative overflow-hidden">
            {/* Small Marigold Garland SVG */}
            <div className="flex items-center gap-1 mb-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-[#ff7b00] border border-orange-600 shadow"></div>
              ))}
            </div>

            {/* Mini Dashboard Idol (Hanumanji / Ganesh ji silhouette with warm golden halo) */}
            <div className="relative my-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#ff7b00]/25 to-transparent flex items-center justify-center border border-[#ff7b00]/40 shadow-[0_0_20px_rgba(255,123,0,0.25)]">
                {/* Spiritual Icon */}
                <div className="text-3xl select-none filter drop-shadow">
                  🪔
                </div>
              </div>
              {/* Flickering LED Diya Flame */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#ff9500] animate-bounce" />
              </div>
            </div>

            <div className="text-xs font-bold text-[#ff9500] font-hindi mt-1">
              ॥ श्री गणेशाय नमः • जय बजरंग बली ॥
            </div>
            <div className="text-[10px] text-neutral-400 italic font-baskerville">
              "शुभ यात्रा • माँ का आशीर्वाद"
            </div>

            {/* Agarbatti Smoke particle text */}
            <div className="mt-2 text-[10px] text-[#ff9500]/80 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ff7b00]" />
              <span>Chandan Agarbatti Fragrance in the cabin</span>
            </div>
          </div>

          {/* 3. AIR HORN (भोंपू) & CONDUCTOR WHISTLE (सीटी) INTERACTION */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0a0f1a]/90 border border-white/10 gap-3">
            <div className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider">
              Interactive Highway Controls
            </div>

            {/* Giant Musical Air Horn Button */}
            <motion.button
              id="musical-air-horn-btn"
              whileTap={{ scale: 0.92 }}
              onClick={onHorn}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg border relative overflow-hidden ${
                hornActive
                  ? 'bg-[#ff9500] text-neutral-950 border-amber-300 shadow-[0_0_35px_rgba(255,149,0,0.85)] scale-105'
                  : 'bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-neutral-950 border-[#ff7b00] hover:brightness-110 shadow-[0_0_20px_rgba(255,123,0,0.3)]'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${hornActive ? 'animate-spin' : ''}`} />
              <div className="text-left leading-tight">
                <div className="text-sm font-black font-hindi">मल्टी-टोन एयर हॉर्न (Honk!)</div>
                <div className="text-[10px] font-mono opacity-85">Press [H] or Tap for "Poo-Poo-Peee-Poo"</div>
              </div>
            </motion.button>

            {/* Conductor Whistle Button */}
            <motion.button
              id="conductor-whistle-btn"
              whileTap={{ scale: 0.92 }}
              onClick={onWhistle}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141e33] hover:bg-[#1e2c4a] text-neutral-200 border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold font-mono transition"
            >
              <BellRing className="w-4 h-4 text-emerald-400" />
              <span>कंडक्टर की सीटी (Whistle [W])</span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Truck Art Slogan Ribbon */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-red-950/70 text-red-300 font-bold border border-red-800/50 font-hindi">
              HORN OK PLEASE
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#ff7b00]/20 text-[#ff9500] font-bold border border-[#ff7b00]/40 font-hindi">
              आवाज़ दे कहाँ है!
            </span>
          </div>

          <div className="text-[11px] text-neutral-400 font-hindi italic">
            "देखो मगर प्यार से • हँसो मत पगली प्यार हो जाएगा"
          </div>
        </div>
      </div>
    </div>
  );
};
