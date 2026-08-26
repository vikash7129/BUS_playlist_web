import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Radio,
  Disc3,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { SongTrack } from '../types';
import { PLAYLIST_TRACKS } from '../data/playlistData';
import { busAudio } from '../utils/audioSynthesizer';

interface CassettePlayerProps {
  currentTrack: SongTrack;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onTrackSelect: (track: SongTrack) => void;
  onNext: () => void;
  onPrev: () => void;
  onTapeHissToggle: () => void;
  tapeHissActive: boolean;
  busSpeakerEffect: boolean;
  onBusSpeakerToggle: () => void;
}

export const CassettePlayer: React.FC<CassettePlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayToggle,
  onTrackSelect,
  onNext,
  onPrev,
  onTapeHissToggle,
  tapeHissActive,
  busSpeakerEffect,
  onBusSpeakerToggle,
}) => {
  const [showTracklist, setShowTracklist] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(24);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('01:42');
  const [isExpanded, setIsExpanded] = useState(false);
  const [tapeSpinAngle, setTapeSpinAngle] = useState(0);

  // YouTube Player iframe ref
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);

  // Cassette reel rotation animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTapeSpinAngle((prev) => (prev + 8) % 360);
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.15;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update time display based on progress
  useEffect(() => {
    const totalSeconds = 240; // mock 4 mins
    const currentSecs = Math.floor((progress / 100) * totalSeconds);
    const mins = Math.floor(currentSecs / 60);
    const secs = currentSecs % 60;
    setCurrentTimeFormatted(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
  }, [progress]);

  const handlePlayClick = () => {
    busAudio.playCassetteClick('click');
    onPlayToggle();
  };

  const handleNextClick = () => {
    busAudio.playCassetteClick('click');
    onNext();
  };

  const handlePrevClick = () => {
    busAudio.playCassetteClick('click');
    onPrev();
  };

  return (
    <>
      {/* Hidden / Embedded YouTube Player for Actual Music Streaming */}
      <div className="fixed -bottom-96 -right-96 opacity-0 pointer-events-none" aria-hidden="true">
        <iframe
          id="bus-youtube-player"
          width="200"
          height="200"
          src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&origin=${window.location.origin}`}
          title="Bus Wale Ki Playlist Audio Source"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Main Glassmorphism Fixed Bottom Music Player Deck */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-5xl z-50">
        <div className="relative rounded-3xl bg-[#0e1626]/90 backdrop-blur-2xl border border-white/10 p-3.5 sm:p-4 shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Subtle Ambient LED Glow under the deck */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#ff7b00]/15 blur-2xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            {/* 1. RETRO CASSETTE TAPE VISUAL & METADATA */}
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              {/* Mini Cassette Tape with Spinning Spools */}
              <div
                onClick={() => setShowTracklist(!showTracklist)}
                className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl bg-[#070a12] border border-white/15 shadow-lg p-1.5 flex flex-col justify-between cursor-pointer group shrink-0 hover:border-[#ff7b00]/50 transition"
                title="Click to view full Bus Mixtape Playlist"
              >
                {/* Cassette Top Label */}
                <div className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff9500] rounded px-1.5 py-0.5 flex justify-between items-center text-[8px] font-bold text-neutral-950 font-mono shadow-sm">
                  <span>TDK 90</span>
                  <span>SIDE A</span>
                </div>

                {/* Cassette Center Window with 2 Spinning Reels */}
                <div className="relative w-full h-7 bg-[#0a0f1a] rounded border border-white/10 flex items-center justify-around px-2 overflow-hidden">
                  {/* Left Spool */}
                  <div
                    className="w-5 h-5 rounded-full border border-neutral-400 bg-neutral-800 flex items-center justify-center"
                    style={{ transform: `rotate(${tapeSpinAngle}deg)` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-neutral-950 flex items-center justify-center">
                      <div className="w-0.5 h-2 bg-neutral-400"></div>
                    </div>
                  </div>

                  {/* Tape Reel Bar */}
                  <div className="w-8 h-1.5 bg-[#ff7b00]/40 rounded-full"></div>

                  {/* Right Spool */}
                  <div
                    className="w-5 h-5 rounded-full border border-neutral-400 bg-neutral-800 flex items-center justify-center"
                    style={{ transform: `rotate(${tapeSpinAngle}deg)` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-neutral-950 flex items-center justify-center">
                      <div className="w-0.5 h-2 bg-neutral-400"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Tape Type Indicator */}
                <div className="text-[7px] text-neutral-400 text-center font-mono tracking-tighter">
                  HIGH POSITION • TYPE II
                </div>
              </div>

              {/* Track Title, Movie, Singer & Vibe */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-mono font-bold uppercase">
                    CASSETTE
                  </span>
                  <span className="text-[11px] text-[#ff9500] font-mono flex items-center gap-1">
                    <Disc3 className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
                    {currentTrack.year} CLASSIC
                  </span>
                </div>

                <div className="text-sm sm:text-base font-bold text-white truncate font-serif tracking-tight mt-0.5">
                  {currentTrack.title}
                </div>
                <div className="text-xs text-neutral-400 truncate font-body">
                  {currentTrack.singers} • <span className="text-[#ff9500] font-medium">{currentTrack.movie}</span>
                </div>
                <div className="text-[11px] text-[#ff9500]/80 italic truncate font-baskerville">
                  {currentTrack.dialogue}
                </div>
              </div>
            </div>

            {/* 2. PLAYBACK CONTROLS & PROGRESS BAR */}
            <div className="flex flex-col items-center gap-2 w-full md:w-5/12">
              <div className="flex items-center gap-4">
                {/* Prev Track */}
                <button
                  id="prev-track-btn"
                  onClick={handlePrevClick}
                  className="p-2 rounded-full text-neutral-300 hover:text-[#ff9500] hover:bg-white/5 transition"
                  title="Previous Song"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* Play / Pause Big Button */}
                <motion.button
                  id="main-play-pause-btn"
                  whileTap={{ scale: 0.92 }}
                  onClick={handlePlayClick}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl border ${
                    isPlaying
                      ? 'bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-neutral-950 border-[#ff7b00] shadow-[0_0_25px_rgba(255,123,0,0.6)]'
                      : 'bg-[#141e33] text-neutral-100 border-white/20 hover:bg-[#1e2c4a] hover:text-[#ff9500]'
                  }`}
                  title={isPlaying ? 'Pause Mixtape' : 'Play Bus Mixtape'}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </motion.button>

                {/* Next Track */}
                <button
                  id="next-track-btn"
                  onClick={handleNextClick}
                  className="p-2 rounded-full text-neutral-300 hover:text-[#ff9500] hover:bg-white/5 transition"
                  title="Next Song"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Toggle Playlist Drawer */}
                <button
                  id="playlist-drawer-btn"
                  onClick={() => setShowTracklist(!showTracklist)}
                  className={`p-2 rounded-full transition ${
                    showTracklist
                      ? 'bg-[#ff7b00]/20 text-[#ff9500] border border-[#ff7b00]/40'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                  }`}
                  title="View Mixtape Tracklist"
                >
                  <ListMusic className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="w-full flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">{currentTimeFormatted}</span>
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = (clickX / rect.width) * 100;
                    setProgress(Math.max(0, Math.min(100, newProgress)));
                  }}
                  className="flex-1 h-2 bg-[#0a0f1a] rounded-full overflow-hidden cursor-pointer relative border border-white/10"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#ff7b00] to-[#ff9500] rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(255,123,0,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 w-10">
                  {currentTrack.duration.includes('Full') ? '72:00' : currentTrack.duration}
                </span>
              </div>
            </div>

            {/* 3. VU EQUALIZER & AUDIO FX TOGGLES */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              {/* Pulsing 8-Bar VU Equalizer */}
              <div className="flex items-end gap-1 h-8 px-2 py-1 bg-[#0a0f1a] rounded-lg border border-white/10">
                {[12, 24, 18, 28, 16, 22, 30, 14].map((baseHeight, idx) => {
                  const animatedHeight = isPlaying
                    ? Math.max(4, Math.sin(Date.now() * 0.01 + idx) * 12 + baseHeight)
                    : 3;
                  const isPeak = animatedHeight > 20;
                  return (
                    <div
                      key={idx}
                      className={`w-1 rounded-sm transition-all duration-75 ${
                        isPeak ? 'bg-red-500' : animatedHeight > 14 ? 'bg-[#ff7b00]' : 'bg-emerald-500'
                      }`}
                      style={{ height: `${animatedHeight}px` }}
                    ></div>
                  );
                })}
              </div>

              {/* Tape Hiss Toggle */}
              <button
                id="tape-hiss-btn"
                onClick={() => {
                  busAudio.unlock();
                  onTapeHissToggle();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition ${
                  tapeHissActive
                    ? 'bg-[#ff7b00]/20 text-[#ff9500] border-[#ff7b00]/50 shadow-[0_0_10px_rgba(255,123,0,0.2)]'
                    : 'bg-[#141e33] text-neutral-400 border-white/10 hover:text-neutral-200'
                }`}
                title="Toggle authentic 90s cassette tape hiss sound effect"
              >
                Hiss: {tapeHissActive ? 'ON' : 'OFF'}
              </button>

              {/* External YouTube Link for full experience */}
              <a
                href={`https://youtu.be/${currentTrack.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition"
                title="Open Video on YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Drawer Modal */}
      <AnimatePresence>
        {showTracklist && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl bg-[#0e1626]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-[#ff9500] font-mono flex items-center gap-2">
                  <span>📻 Bus Driver's Original Cassette Tape Mixtape</span>
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Curated 90s & 2000s Bollywood Midnight Highway Mixtape
                </p>
              </div>
              <button
                onClick={() => setShowTracklist(false)}
                className="px-3 py-1 rounded-full bg-[#141e33] border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            {/* Tracks List */}
            <div className="mt-3 space-y-2">
              {PLAYLIST_TRACKS.map((track, idx) => {
                const isSelected = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      busAudio.playCassetteClick('click');
                      onTrackSelect(track);
                      setShowTracklist(false);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition border ${
                      isSelected
                        ? 'bg-[#ff7b00]/15 border-[#ff7b00]/50 text-white shadow-[0_0_15px_rgba(255,123,0,0.15)]'
                        : 'bg-[#0a0f1a]/60 border-white/10 hover:bg-[#141e33]/70 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#141e33] border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#ff9500]">
                        {isSelected && isPlaying ? <Disc3 className="w-4 h-4 animate-spin text-[#ff7b00]" /> : idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white font-serif">{track.title}</div>
                        <div className="text-xs text-neutral-400 font-body">
                          {track.singers} • <span className="text-[#ff9500]">{track.movie}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-neutral-400">{track.duration}</div>
                      <div className="text-[10px] text-[#ff9500]/80 font-mono">{track.vibe}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
