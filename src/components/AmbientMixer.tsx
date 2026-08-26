import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Volume2, CloudRain, Wind, Disc3, Sun, Moon, CloudFog, Coffee, Sparkles } from 'lucide-react';
import { AtmosphereMode, AmbientSettings } from '../types';
import { busAudio } from '../utils/audioSynthesizer';

interface AmbientMixerProps {
  atmosphere: AtmosphereMode;
  onAtmosphereChange: (mode: AtmosphereMode) => void;
  ambientSettings: AmbientSettings;
  onSettingChange: (key: keyof AmbientSettings, value: number | boolean) => void;
  isRaining: boolean;
  onRainToggle: () => void;
}

export const AmbientMixer: React.FC<AmbientMixerProps> = ({
  atmosphere,
  onAtmosphereChange,
  ambientSettings,
  onSettingChange,
  isRaining,
  onRainToggle,
}) => {
  const [showChaiModal, setShowChaiModal] = useState(false);

  const handleSliderChange = (type: 'engine' | 'rain' | 'crickets' | 'tapeHiss', value: number) => {
    busAudio.unlock();
    const keyMap = {
      engine: 'engineVolume',
      rain: 'rainVolume',
      crickets: 'cricketsVolume',
      tapeHiss: 'tapeHissVolume',
    } as const;
    onSettingChange(keyMap[type], value);
    busAudio.setAmbientLayer(type, value);
  };

  const handleChaiBreak = () => {
    busAudio.unlock();
    busAudio.playMusicalAirHorn();
    setShowChaiModal(true);
  };

  return (
    <div className="w-full my-6 rounded-3xl bg-[#0e1626]/95 border border-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff9500] font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[#ff7b00]" />
            <span>Highway Atmosphere & Audio Mixer</span>
          </div>
          <h3 className="text-xl font-bold text-white font-hindi mt-1">
            हाईवे का माहौल और आवाज़ें कस्टमाइज़ करें
          </h3>
        </div>

        {/* Chai Break Button */}
        <motion.button
          id="dhaba-chai-halt-btn"
          whileTap={{ scale: 0.94 }}
          onClick={handleChaiBreak}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7b00] to-[#ff9500] hover:brightness-110 text-neutral-950 font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(255,123,0,0.3)] transition"
        >
          <Coffee className="w-4 h-4 fill-current" />
          <span>2:30 AM Dhaba Chai Break ☕</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. ATMOSPHERE PRESET SELECTOR */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
            Select Journey Atmosphere (समय और मौसम)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Midnight */}
            <button
              onClick={() => {
                busAudio.unlock();
                onAtmosphereChange('midnight');
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition ${
                atmosphere === 'midnight'
                  ? 'bg-[#ff7b00]/20 border-[#ff7b00] text-white shadow-[0_0_20px_rgba(255,123,0,0.25)]'
                  : 'bg-[#0a0f1a]/80 border-white/10 text-neutral-400 hover:bg-[#141e33]'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <div className="text-center">
                <div className="text-xs font-bold font-hindi">आधी रात (01:30 AM)</div>
                <div className="text-[10px] opacity-75 font-mono">Midnight Highway</div>
              </div>
            </button>

            {/* Golden Hour */}
            <button
              onClick={() => {
                busAudio.unlock();
                onAtmosphereChange('golden');
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition ${
                atmosphere === 'golden'
                  ? 'bg-[#ff7b00]/20 border-[#ff7b00] text-white shadow-[0_0_20px_rgba(255,123,0,0.25)]'
                  : 'bg-[#0a0f1a]/80 border-white/10 text-neutral-400 hover:bg-[#141e33]'
              }`}
            >
              <Sun className="w-5 h-5 text-[#ff7b00]" />
              <div className="text-center">
                <div className="text-xs font-bold font-hindi">ढलती शाम (06:45 PM)</div>
                <div className="text-[10px] opacity-75 font-mono">Golden Ghats</div>
              </div>
            </button>

            {/* Foggy Dawn */}
            <button
              onClick={() => {
                busAudio.unlock();
                onAtmosphereChange('foggy');
              }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition ${
                atmosphere === 'foggy'
                  ? 'bg-[#ff7b00]/20 border-[#ff7b00] text-white shadow-[0_0_20px_rgba(255,123,0,0.25)]'
                  : 'bg-[#0a0f1a]/80 border-white/10 text-neutral-400 hover:bg-[#141e33]'
              }`}
            >
              <CloudFog className="w-5 h-5 text-sky-400" />
              <div className="text-center">
                <div className="text-xs font-bold font-hindi">सुबह का कोहरा (04:30 AM)</div>
                <div className="text-[10px] opacity-75 font-mono">Foggy Dawn Mist</div>
              </div>
            </button>
          </div>

          {/* Rain Toggle Switch */}
          <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-[#0a0f1a]/80 border border-white/10">
            <div className="flex items-center gap-2.5">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-neutral-200">Windshield Drizzle & Rain</div>
                <div className="text-[10px] text-neutral-400 font-mono">Real-time water drop physics on glass</div>
              </div>
            </div>
            <button
              id="rain-physics-btn"
              onClick={() => {
                busAudio.unlock();
                onRainToggle();
                handleSliderChange('rain', isRaining ? 0 : 0.6);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition ${
                isRaining
                  ? 'bg-sky-500 text-neutral-950 shadow-[0_0_12px_rgba(14,165,233,0.4)]'
                  : 'bg-[#141e33] border border-white/10 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {isRaining ? 'RAINING 🌧️' : 'DRY ROAD'}
            </button>
          </div>
        </div>

        {/* 2. AMBIENT SOUND LAYERS MIXER */}
        <div className="space-y-4 bg-[#0a0f1a]/80 p-4 rounded-2xl border border-white/10">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
            Ambient Audio Synthesizer Layers (पृष्ठभूमि ध्वनि)
          </label>

          {/* Layer 1: Bus Engine Rumble */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#ff7b00]" />
                Bus Engine Low Drone (डीजल इंजन की गड़गड़ाहट)
              </span>
              <span className="text-[#ff9500] font-bold">{Math.round(ambientSettings.engineVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientSettings.engineVolume}
              onChange={(e) => handleSliderChange('engine', Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff7b00]"
            />
          </div>

          {/* Layer 2: Rain & Tire Splash */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                Rain on Roof & Wet Tires (बारिश और टायरों की छन-छन)
              </span>
              <span className="text-sky-400 font-bold">{Math.round(ambientSettings.rainVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientSettings.rainVolume}
              onChange={(e) => handleSliderChange('rain', Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Layer 3: Night Crickets & Highway Breeze */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                Night Crickets & Wind (सन्नाटे में झींगुर की आवाज़)
              </span>
              <span className="text-emerald-400 font-bold">{Math.round(ambientSettings.cricketsVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientSettings.cricketsVolume}
              onChange={(e) => handleSliderChange('crickets', Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Layer 4: Tape Head Magnetic Hiss */}
          <div>
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5 text-[#ff7b00]" />
                Cassette Tape Head Hiss (कैसेट का विंटेज शोर)
              </span>
              <span className="text-[#ff9500] font-bold">{Math.round(ambientSettings.tapeHissVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientSettings.tapeHissVolume}
              onChange={(e) => handleSliderChange('tapeHiss', Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff7b00]"
            />
          </div>
        </div>
      </div>

      {/* 2:30 AM Dhaba Chai Break Modal */}
      {showChaiModal && (
        <div className="fixed inset-0 bg-[#070a12]/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full rounded-3xl bg-[#0e1626] border border-[#ff7b00]/40 p-6 text-center shadow-[0_0_50px_rgba(255,123,0,0.2)] relative"
          >
            {/* Dhaba Neon Sign */}
            <div className="px-4 py-1.5 rounded-full bg-[#ff7b00]/20 text-[#ff9500] font-bold border border-[#ff7b00]/40 text-xs inline-flex items-center gap-1.5 font-hindi mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#ff7b00]" />
              <span>शेर-ए-पंजाब वैष्णो ढाबा (24x7 खुला)</span>
            </div>

            {/* Steaming Chai Cup Illustration */}
            <div className="my-4 flex flex-col items-center justify-center">
              <div className="text-6xl animate-bounce">☕</div>
              <div className="text-xs text-[#ff9500] font-mono mt-2 animate-pulse">
                ~ Steaming Hot Adrak Wali Kulhad Chai ~
              </div>
            </div>

            <h4 className="text-xl font-bold text-white font-hindi">
              "छोटू! दो कड़क अदरक वाली चाय और मक्खन पराठा!"
            </h4>
            <p className="text-xs text-neutral-300 mt-2 font-baskerville italic leading-relaxed">
              The night bus has stopped for a 20-minute tea halt. Cool mountain fog rolls in as tired passengers sip piping hot ginger tea from earthen kulhads under yellow halogen lamps.
            </p>

            <button
              onClick={() => setShowChaiModal(false)}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(255,123,0,0.3)] transition"
            >
              Resume Highway Journey (वापस बस में बैठें) 🚎
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
