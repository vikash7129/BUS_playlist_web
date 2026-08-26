import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, Scissors, Stamp, Download, Check, Sparkles } from 'lucide-react';
import { busAudio } from '../utils/audioSynthesizer';
import { BusTicketData } from '../types';

export const BusTicketGenerator: React.FC = () => {
  const [passengerName, setPassengerName] = useState('Rahul Sharma');
  const [routeIndex, setRouteIndex] = useState(0);
  const [seatNumber, setSeatNumber] = useState('17B (Window Berth)');
  const [isPunched, setIsPunched] = useState(false);
  const [copied, setCopied] = useState(false);

  const routes = [
    { from: 'DELHI (ISBT Kashmiri Gate)', to: 'MANALI (Mall Road)', fare: '₹480.00', platform: 'Bay 12', time: '08:30 PM' },
    { from: 'MUMBAI (Borivali East)', to: 'GOA (Panjim Bus Stand)', fare: '₹650.00', platform: 'Bay 04', time: '07:00 PM' },
    { from: 'BANGALORE (Majestic)', to: 'OOTY (Charing Cross)', fare: '₹420.00', platform: 'Bay 09', time: '09:15 PM' },
    { from: 'JAIPUR (Sindhi Camp)', to: 'UDAIPUR (Udiapole)', fare: '₹390.00', platform: 'Bay 02', time: '10:00 PM' },
    { from: 'VARANASI (Cantt)', to: 'PATNA (Gandhi Maidan)', fare: '₹340.00', platform: 'Bay 07', time: '11:00 PM' },
  ];

  const currentRoute = routes[routeIndex];

  const handlePunchTicket = () => {
    busAudio.unlock();
    busAudio.playTicketPunch();
    setIsPunched(true);
    setTimeout(() => {
      // Conductor whistle
      busAudio.playConductorWhistle();
    }, 200);
  };

  const handleCopyTicket = () => {
    const text = `🎫 BUS WALE KI PLAYLIST - OFFICIAL PASSENGER TICKET\nPassenger: ${passengerName}\nRoute: ${currentRoute.from} ➔ ${currentRoute.to}\nSeat: ${seatNumber}\nDeparture: ${currentRoute.time}\nFare: ${currentRoute.fare}\nStatus: ${isPunched ? 'PUNCHED & BOARDED (चढ़ गए!)' : 'CONFIRMED'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-6 rounded-3xl bg-[#0e1626]/95 border border-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9500] font-bold uppercase tracking-wider">
            <Ticket className="w-4 h-4 text-[#ff7b00]" />
            <span>Souvenir Ticket Counter • Passenger Pass</span>
          </div>
          <h3 className="text-xl font-bold text-white font-serif tracking-tight mt-1">
            Generate Your Classic Midnight Highway Ticket
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="punch-ticket-btn"
            onClick={handlePunchTicket}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md ${
              isPunched
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-[#ff7b00] to-[#ff9500] hover:brightness-110 text-neutral-950 shadow-[0_0_15px_rgba(255,123,0,0.3)]'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>{isPunched ? '✓ Ticket Punched!' : 'Punch Ticket ✂️'}</span>
          </button>

          <button
            onClick={handleCopyTicket}
            className="px-3.5 py-2 rounded-xl bg-[#141e33] hover:bg-[#1e2c4a] text-neutral-200 text-xs font-mono border border-white/10 flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-[#ff9500]" />}
            <span>{copied ? 'Copied!' : 'Save Pass'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ticket Customizer Form */}
        <div className="space-y-4 bg-[#0a0f1a]/80 p-4 rounded-2xl border border-white/10">
          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-1">Passenger Name</label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141e33] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ff7b00] font-body transition"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-1">Highway Route</label>
            <select
              value={routeIndex}
              onChange={(e) => {
                setRouteIndex(Number(e.target.value));
                setIsPunched(false);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#141e33] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ff7b00] font-body transition"
            >
              {routes.map((r, i) => (
                <option key={i} value={i} className="bg-[#0e1626] text-white">
                  {r.from} ➔ {r.to}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-neutral-400 block mb-1">Seat Preference</label>
            <select
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141e33] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ff7b00] font-body transition"
            >
              <option value="17B (Window Berth - Upper)" className="bg-[#0e1626] text-white">17B (Window Berth - Upper)</option>
              <option value="04A (Front Cabin - Window)" className="bg-[#0e1626] text-white">04A (Front Cabin - Window)</option>
              <option value="12B (Driver Side Sleeper)" className="bg-[#0e1626] text-white">12B (Driver Side Sleeper)</option>
              <option value="28C (Last Row Bumpy Seat)" className="bg-[#0e1626] text-white">28C (Last Row Bumpy Seat)</option>
            </select>
          </div>
        </div>

        {/* The Retro Printed Indian Bus Ticket UI (Paper Vintage Style) */}
        <div className="lg:col-span-2 relative">
          <div className="relative w-full rounded-2xl bg-[#fff8e7] text-neutral-900 p-5 sm:p-6 shadow-2xl border-2 border-dashed border-amber-400/60 overflow-hidden font-mono select-none">
            {/* Paper Texture Details */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/50 to-transparent pointer-events-none"></div>

            {/* Ticket Punch Hole (when punched) */}
            {isPunched && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-6 w-8 h-8 rounded-full bg-[#0a0f1a] border-2 border-neutral-700 shadow-inner flex items-center justify-center text-[10px] text-[#ff9500] font-bold"
              >
                PUNCH
              </motion.div>
            )}

            {/* Header / Transport Logo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-neutral-400 pb-3 gap-2">
              <div>
                <div className="text-base sm:text-lg font-black text-neutral-950 tracking-tight uppercase font-mono">
                  NORTH HIGHWAY STATE TRANSPORT • PUSHPAK SLEEPER
                </div>
                <div className="text-[11px] text-neutral-700 font-mono">
                  EXPRESS NIGHT SERVICE • LUXURY 2x2 AIR SUSPENSION
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-red-700 font-mono">PNR: PSH-948201</div>
                <div className="text-[10px] text-neutral-600">Issued at: ISBT Counter #4</div>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 py-2 border-b-2 border-dashed border-neutral-400 text-xs">
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase">Passenger Name</span>
                <span className="font-bold text-sm text-neutral-900 font-body">{passengerName || 'Traveller'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase">Seat & Berth</span>
                <span className="font-bold text-sm text-neutral-900">{seatNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase">Departure Time</span>
                <span className="font-bold text-sm text-neutral-900">{currentRoute.time}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase">Fare Paid</span>
                <span className="font-bold text-base text-emerald-800">{currentRoute.fare}</span>
              </div>
            </div>

            {/* Route Board */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="text-[10px] text-neutral-600 uppercase">Boarding Point ➔ Destination</div>
                <div className="font-extrabold text-sm sm:text-base text-neutral-950 font-mono">
                  {currentRoute.from} ➔ {currentRoute.to}
                </div>
              </div>

              {/* Red Conductor Stamp */}
              <div className="border-2 border-red-700 text-red-700 px-3 py-1 rounded rotate-[-4deg] text-center font-bold text-xs uppercase tracking-widest bg-red-100/60 shadow-sm">
                {isPunched ? '✓ CHECKED & BOARDED' : 'PAID & CONFIRMED'}
              </div>
            </div>

            {/* Bottom Rules / Slogan */}
            <div className="mt-4 pt-2 border-t border-neutral-300 text-[9px] text-neutral-600 flex flex-wrap justify-between items-center">
              <span>* Keep hands inside the window • Enjoy the nostalgic 90s highway soundtrack</span>
              <span className="font-bold text-neutral-800 font-mono">HAPPY JOURNEY • BUS WALE KI PLAYLIST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
