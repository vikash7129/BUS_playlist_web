import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  CloudRain,
  Wind,
  Radio,
  Disc3,
  Coffee,
  Ticket,
  Sparkles,
  Zap,
  Music4,
  Compass,
  Headphones,
  Info,
} from 'lucide-react';
import { SongTrack, AtmosphereMode, AmbientSettings } from './types';
import { PLAYLIST_TRACKS, MAIN_YOUTUBE_ID, TRUCK_ART_SLOGANS } from './data/playlistData';
import { busAudio } from './utils/audioSynthesizer';
import { WindshieldCanvas } from './components/WindshieldCanvas';
import { RouteBoardAndDashboard } from './components/RouteBoardAndDashboard';
import { CassettePlayer } from './components/CassettePlayer';
import { RotatingMemories } from './components/RotatingMemories';
import { BusTicketGenerator } from './components/BusTicketGenerator';
import { AmbientMixer } from './components/AmbientMixer';

export default function App() {
  // Playback & Track State
  const [currentTrack, setCurrentTrack] = useState<SongTrack>(PLAYLIST_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tapeHissActive, setTapeHissActive] = useState<boolean>(false);
  const [busSpeakerEffect, setBusSpeakerEffect] = useState<boolean>(false);

  // Environmental & Dashboard State
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>('midnight');
  const [isRaining, setIsRaining] = useState<boolean>(true);
  const [wiperActive, setWiperActive] = useState<boolean>(true);
  const [speedKmH, setSpeedKmH] = useState<number>(72);
  const [hornActive, setHornActive] = useState<boolean>(false);
  const [whistleActive, setWhistleActive] = useState<boolean>(false);
  const [truckSloganIndex, setTruckSloganIndex] = useState<number>(0);

  // Ambient sound synthesizer settings
  const [ambientSettings, setAmbientSettings] = useState<AmbientSettings>({
    engineVolume: 0.18,
    rainVolume: 0.25,
    cricketsVolume: 0.15,
    tapeHissVolume: 0.0,
    busSpeakerEffect: false,
    wiperActive: true,
  });

  // Cycle truck art slogans
  useEffect(() => {
    const timer = setInterval(() => {
      setTruckSloganIndex((prev) => (prev + 1) % TRUCK_ART_SLOGANS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleHorn = useCallback(() => {
    busAudio.unlock();
    setHornActive(true);
    busAudio.playMusicalAirHorn();
    setTimeout(() => setHornActive(false), 800);
  }, []);

  const handleWhistle = useCallback(() => {
    busAudio.unlock();
    setWhistleActive(true);
    busAudio.playConductorWhistle();
    setTimeout(() => setWhistleActive(false), 500);
  }, []);

  const handlePlayToggle = useCallback(() => {
    busAudio.unlock();
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNextTrack = useCallback(() => {
    const currentIndex = PLAYLIST_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % PLAYLIST_TRACKS.length;
    setCurrentTrack(PLAYLIST_TRACKS[nextIndex]);
    setIsPlaying(true);
  }, [currentTrack]);

  const handlePrevTrack = useCallback(() => {
    const currentIndex = PLAYLIST_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    setCurrentTrack(PLAYLIST_TRACKS[prevIndex]);
    setIsPlaying(true);
  }, [currentTrack]);

  // Global Keyboard Shortcuts (H for Horn, W for Whistle, Space for Play/Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleHorn();
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleWhistle();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handlePlayToggle();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTrack();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHorn, handleWhistle, handlePlayToggle, handleNextTrack, handlePrevTrack]);

  return (
    <div
      className={`min-h-screen bg-[#0a0f1a] text-neutral-100 pb-36 transition-colors duration-700 relative overflow-x-hidden ${
        hornActive ? 'bus-vibrate' : ''
      }`}
    >
      {/* Background Ambient Artistic Light Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-[#ff7b00]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Atmospheric Header & Nav */}
      <header className="border-b border-white/10 bg-[#0a0f1a]/85 backdrop-blur-xl sticky top-0 z-40 relative">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7b00]/20 border border-[#ff7b00]/40 flex items-center justify-center text-[#ff9500] shadow-[0_0_15px_rgba(255,123,0,0.25)] shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-hindi">
                  बस वाले की प्लेलिस्ट
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff7b00]/15 text-[#ff9500] text-[10px] font-mono border border-[#ff7b00]/30 uppercase tracking-wider">
                  90s Highway Mixtape
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate max-w-xs sm:max-w-md font-body">
                A midnight journey through 90s Bollywood cassettes & dhaba halts
              </p>
            </div>
          </div>

          {/* Slogan Banner & Quick Key Hints */}
          <div className="hidden md:flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#141e33]/90 border border-white/10 text-xs font-hindi text-[#ff9500] shadow-sm">
              {TRUCK_ART_SLOGANS[truckSloganIndex]}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-300 bg-[#141e33]/90 px-3 py-1.5 rounded-xl border border-white/10">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[#ff9500] font-bold border border-neutral-700">H</kbd>
              <span>Honk</span>
              <span className="text-neutral-500">•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[#ff9500] font-bold border border-neutral-700">W</kbd>
              <span>Whistle</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Experience Container */}
      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-7 relative z-10">
        {/* HERO TITLE SECTION */}
        <section className="text-center space-y-3 py-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff7b00]/15 border border-[#ff7b00]/35 text-[#ff9500] text-xs font-mono mb-1 shadow-[0_0_20px_rgba(255,123,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff7b00]" />
            <span className="tracking-wider">NH-44 NIGHT EXPRESS • DELHI ➔ MANALI • 01:30 AM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-hindi drop-shadow-md">
            बस वाले भइया का <span className="text-[#ff9500] text-glow-orange font-devanagari">टेप रिकॉर्डर</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-baskerville italic leading-relaxed">
            "Window seat par sar tikaaye, thandi pahadi hawa, baarish ki boondein, aur front speakers se goonjti Kumar Sanu aur Alka Yagnik ki timeless aawaz."
          </p>
        </section>

        {/* 1. CENTRAL OBJECT: CINEMATIC WINDSHIELD & ROAD */}
        <section aria-label="Interactive Windshield">
          <WindshieldCanvas
            atmosphere={atmosphere}
            isRaining={isRaining}
            wiperActive={wiperActive}
            onWiperToggle={() => setWiperActive(!wiperActive)}
            speedKmH={speedKmH}
          />
        </section>

        {/* 2. DASHBOARD COCKPIT CONTROLS & SPEEDOMETER */}
        <section aria-label="Bus Cockpit Dashboard">
          <RouteBoardAndDashboard
            speedKmH={speedKmH}
            onSpeedChange={(speed) => setSpeedKmH(speed)}
            onHorn={handleHorn}
            onWhistle={handleWhistle}
            hornActive={hornActive}
          />
        </section>

        {/* 3. ROTATING NOSTALGIC MEMORIES */}
        <section aria-label="Nostalgic Bus Memories">
          <RotatingMemories />
        </section>

        {/* 4. ATMOSPHERE & AMBIENT AUDIO MIXER */}
        <section aria-label="Soundscape and Atmosphere">
          <AmbientMixer
            atmosphere={atmosphere}
            onAtmosphereChange={(mode) => setAtmosphere(mode)}
            ambientSettings={ambientSettings}
            onSettingChange={(key, val) =>
              setAmbientSettings((prev) => ({ ...prev, [key]: val }))
            }
            isRaining={isRaining}
            onRainToggle={() => setIsRaining(!isRaining)}
          />
        </section>

        {/* 5. SOUVENIR BUS TICKET GENERATOR */}
        <section aria-label="Souvenir Bus Ticket">
          <BusTicketGenerator />
        </section>
      </main>

      {/* 6. FIXED GLASSMORPHISM CASSETTE PLAYER DECK */}
      <CassettePlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
        onTrackSelect={(track) => {
          setCurrentTrack(track);
          setIsPlaying(true);
        }}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onTapeHissToggle={() => {
          const newState = !tapeHissActive;
          setTapeHissActive(newState);
          busAudio.setAmbientLayer('tapeHiss', newState ? 0.4 : 0);
        }}
        tapeHissActive={tapeHissActive}
        busSpeakerEffect={busSpeakerEffect}
        onBusSpeakerToggle={() => setBusSpeakerEffect(!busSpeakerEffect)}
      />
    </div>
  );
}
