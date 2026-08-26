import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AtmosphereMode } from '../types';
import { busAudio } from '../utils/audioSynthesizer';
import { CloudRain, Sparkles, Wind, Eye } from 'lucide-react';

interface WindshieldCanvasProps {
  atmosphere: AtmosphereMode;
  isRaining: boolean;
  wiperActive: boolean;
  onWiperToggle: () => void;
  speedKmH: number;
}

interface Raindrop {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  trail: { x: number; y: number; r: number }[];
}

interface Milestone {
  text: string;
  sub: string;
  z: number;
  xSide: number;
}

interface OncomingVehicle {
  z: number;
  xOffset: number;
  color: string;
  isTruck: boolean;
}

export const WindshieldCanvas: React.FC<WindshieldCanvasProps> = ({
  atmosphere,
  isRaining,
  wiperActive,
  onWiperToggle,
  speedKmH,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wiperAngleRef = useRef<number>(0);
  const wiperDirectionRef = useRef<number>(1);
  const raindropsRef = useRef<Raindrop[]>([]);
  const roadOffsetRef = useRef<number>(0);
  const milestonesRef = useRef<Milestone[]>([
    { text: 'NH 44', sub: 'DELHI 160 KM', z: 1.0, xSide: 1 },
    { text: 'DHABA', sub: 'SHER-E-PUNJAB 2KM', z: 0.6, xSide: -1 },
    { text: 'TOLL', sub: 'FASTAG 500M', z: 0.2, xSide: 1 },
  ]);
  const oncomingRef = useRef<OncomingVehicle[]>([
    { z: 0.8, xOffset: -0.45, color: '#f59e0b', isTruck: true },
    { z: 0.3, xOffset: -0.38, color: '#ef4444', isTruck: false },
  ]);
  const [steamDrawings, setSteamDrawings] = useState<{ x: number; y: number; time: number }[]>([]);
  const isDrawingRef = useRef(false);

  // Initialize raindrops
  const initRaindrops = useCallback((width: number, height: number) => {
    const drops: Raindrop[] = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1.2,
        speed: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.5 + 0.4,
        trail: [],
      });
    }
    raindropsRef.current = drops;
  }, []);

  // Main rendering animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (raindropsRef.current.length === 0) {
          initRaindrops(canvas.width, canvas.height);
        }
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // 1. SKY & HORIZON BACKGROUND
      const horizonY = h * 0.48;
      const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
      if (atmosphere === 'midnight') {
        skyGradient.addColorStop(0, '#030712'); // deep obsidian night
        skyGradient.addColorStop(0.7, '#0b132b');
        skyGradient.addColorStop(1, '#1c2541'); // faint ambient highway glow
      } else if (atmosphere === 'golden') {
        skyGradient.addColorStop(0, '#451a03'); // warm amber twilight
        skyGradient.addColorStop(0.5, '#7c2d12');
        skyGradient.addColorStop(1, '#ea580c');
      } else {
        skyGradient.addColorStop(0, '#0f172a'); // foggy dawn cool mist
        skyGradient.addColorStop(0.6, '#1e293b');
        skyGradient.addColorStop(1, '#334155');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, w, horizonY);

      // Stars in Midnight mode
      if (atmosphere === 'midnight') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (let i = 0; i < 30; i++) {
          const sx = (Math.sin(i * 99 + 1) * 0.5 + 0.5) * w;
          const sy = (Math.cos(i * 33 + 2) * 0.5 + 0.5) * horizonY * 0.8;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.sin(Date.now() * 0.003 + i) * 0.6 + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Distant Hills / Tree Silhouettes
      ctx.fillStyle = atmosphere === 'golden' ? '#1c1917' : '#020617';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = 0; x <= w; x += 40) {
        const hillH = Math.sin(x * 0.008) * 28 + Math.cos(x * 0.015) * 14 + 18;
        ctx.lineTo(x, horizonY - hillH);
      }
      ctx.lineTo(w, horizonY);
      ctx.closePath();
      ctx.fill();

      // Roadside Dhaba Neon Glow / Distant lights on horizon
      const dhabaX = w * 0.22;
      const glowGrad = ctx.createRadialGradient(dhabaX, horizonY - 12, 5, dhabaX, horizonY - 12, 120);
      glowGrad.addColorStop(0, atmosphere === 'golden' ? 'rgba(251, 191, 36, 0.6)' : 'rgba(239, 68, 68, 0.55)');
      glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(dhabaX, horizonY - 12, 120, 0, Math.PI * 2);
      ctx.fill();

      // 2. HIGHWAY ROAD (3D Perspective)
      const roadTopW = 28;
      const roadBotW = w * 0.96;
      const roadTopX = w * 0.5;
      const roadBotX = w * 0.5;

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, '#0f172a');
      roadGrad.addColorStop(0.3, '#1e293b');
      roadGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = roadGrad;

      ctx.beginPath();
      ctx.moveTo(roadTopX - roadTopW / 2, horizonY);
      ctx.lineTo(roadTopX + roadTopW / 2, horizonY);
      ctx.lineTo(roadBotX + roadBotW / 2, h);
      ctx.lineTo(roadBotX - roadBotW / 2, h);
      ctx.closePath();
      ctx.fill();

      // Road Shoulder / Grass Verges
      ctx.fillStyle = '#052e16'; // dark green roadside grass
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(roadTopX - roadTopW / 2, horizonY);
      ctx.lineTo(roadBotX - roadBotW / 2, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w, horizonY);
      ctx.lineTo(roadTopX + roadTopW / 2, horizonY);
      ctx.lineTo(roadBotX + roadBotW / 2, h);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Highway Road Markings (Animated Dashed Lines)
      const speedFactor = speedKmH / 70;
      roadOffsetRef.current = (roadOffsetRef.current + 0.018 * speedFactor) % 1.0;
      const offset = roadOffsetRef.current;

      ctx.lineWidth = 3;
      for (let i = 0; i < 14; i++) {
        const t = ((i / 14 + offset) % 1.0);
        // non-linear perspective curve
        const z = t * t;
        const lineY = horizonY + (h - horizonY) * z;
        const lineH = Math.max(4, 38 * z);
        const lineW = Math.max(1.5, 9 * z);

        // Center dashed yellow line
        ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
        ctx.fillRect(roadBotX - lineW / 2, lineY, lineW, lineH);

        // White shoulder rumble strips
        const leftEdgeX = roadTopX - (roadTopW / 2) + ((roadBotX - roadBotW / 2) - (roadTopX - roadTopW / 2)) * z;
        const rightEdgeX = roadTopX + (roadTopW / 2) + ((roadBotX + roadBotW / 2) - (roadTopX + roadTopW / 2)) * z;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(leftEdgeX, lineY, lineW * 0.8, lineH);
        ctx.fillRect(rightEdgeX - lineW * 0.8, lineY, lineW * 0.8, lineH);
      }

      // 3. PASSING MILESTONES & ROAD SIGNS
      milestonesRef.current.forEach((m) => {
        m.z = m.z - 0.006 * speedFactor;
        if (m.z <= 0.05) m.z = 1.0;

        const z = 1.0 - m.z;
        const scale = z * z;
        const signY = horizonY + (h - horizonY) * scale;
        const sideOffset = (roadBotW * 0.55 * scale + 20) * m.xSide;
        const signX = w * 0.5 + sideOffset;
        const size = Math.max(12, 60 * scale);

        if (scale > 0.1) {
          // Yellow and White Indian Highway Milestone Pillar
          ctx.save();
          ctx.translate(signX, signY);
          
          // Top curved dome (yellow for NH)
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(0, -size * 0.6, size * 0.35, Math.PI, 0);
          ctx.fill();

          // Body (White with black text)
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-size * 0.35, -size * 0.6, size * 0.7, size * 0.8);

          if (scale > 0.4) {
            ctx.fillStyle = '#0f172a';
            ctx.font = `bold ${Math.max(8, Math.floor(size * 0.2))}px 'Rajdhani', sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(m.text, 0, -size * 0.35);
            ctx.font = `${Math.max(6, Math.floor(size * 0.14))}px 'Plus Jakarta Sans', sans-serif`;
            ctx.fillText(m.sub, 0, -size * 0.1);
          }
          ctx.restore();
        }
      });

      // 4. ONCOMING VEHICLES & HEADLIGHTS (Truck with high beams)
      oncomingRef.current.forEach((v) => {
        v.z = v.z - 0.009 * speedFactor;
        if (v.z <= 0.02) {
          v.z = 1.0;
          v.isTruck = Math.random() > 0.5;
        }

        const z = 1.0 - v.z;
        const scale = z * z;
        const vehY = horizonY + (h - horizonY) * scale * 0.85;
        const vehX = w * 0.5 + (roadBotW * v.xOffset * scale);
        const lightSpread = Math.max(20, 220 * scale);

        if (scale > 0.08) {
          // Headlight Glare
          const hlGrad = ctx.createRadialGradient(vehX, vehY, 2, vehX, vehY, lightSpread);
          hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          hlGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.6)');
          hlGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.15)');
          hlGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = hlGrad;
          ctx.beginPath();
          ctx.arc(vehX, vehY, lightSpread, 0, Math.PI * 2);
          ctx.fill();

          // Twin headlights
          const lampDist = Math.max(6, 42 * scale);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(vehX - lampDist / 2, vehY, Math.max(2, 6 * scale), 0, Math.PI * 2);
          ctx.arc(vehX + lampDist / 2, vehY, Math.max(2, 6 * scale), 0, Math.PI * 2);
          ctx.fill();

          // Red roof cabin lights for Indian trucks
          if (v.isTruck && scale > 0.2) {
            ctx.fillStyle = '#ef4444';
            for (let k = -2; k <= 2; k++) {
              ctx.beginPath();
              ctx.arc(vehX + k * (lampDist * 0.28), vehY - lampDist * 0.7, Math.max(1.5, 3 * scale), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      });

      // 5. RAINDROP PHYSICS & CONDENSATION
      if (isRaining) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        raindropsRef.current.forEach((drop) => {
          drop.y += drop.speed * (speedFactor * 0.5 + 0.5);
          // wind slant
          drop.x += (Math.random() - 0.5) * 0.3;

          if (drop.y > h) {
            drop.y = Math.random() * -20;
            drop.x = Math.random() * w;
          }

          // Draw teardrop/streak
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(186, 230, 253, ${drop.opacity})`;
          ctx.fill();

          // highlight reflection dot
          ctx.beginPath();
          ctx.arc(drop.x - drop.r * 0.3, drop.y - drop.r * 0.3, drop.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fill();
        });
      }

      // 6. WINDSHIELD WIPER ANIMATION & GLASS CLEARING ARC
      if (wiperActive) {
        wiperAngleRef.current += 0.055 * wiperDirectionRef.current;
        if (wiperAngleRef.current > Math.PI * 0.42) {
          wiperDirectionRef.current = -1;
          busAudio.playWiperSqueak();
        } else if (wiperAngleRef.current < -Math.PI * 0.42) {
          wiperDirectionRef.current = 1;
          busAudio.playWiperSqueak();
        }

        const angle = wiperAngleRef.current;
        const wiperPivotX1 = w * 0.32;
        const wiperPivotX2 = w * 0.68;
        const wiperPivotY = h * 0.98;
        const wiperLen = Math.min(w * 0.44, h * 0.8);

        // Draw dual windshield wipers
        [wiperPivotX1, wiperPivotX2].forEach((pivotX) => {
          const tipX = pivotX + Math.sin(angle) * wiperLen;
          const tipY = wiperPivotY - Math.cos(angle) * wiperLen;

          // Metal arm
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(pivotX, wiperPivotY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          // Chrome hinge
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(pivotX, wiperPivotY, 8, 0, Math.PI * 2);
          ctx.fill();

          // Black rubber blade perpendicular
          const bladeLen = wiperLen * 0.65;
          const bladeAngle = angle + Math.PI / 2;
          const b1X = tipX - Math.sin(bladeAngle) * (bladeLen * 0.5);
          const b1Y = tipY + Math.cos(bladeAngle) * (bladeLen * 0.5);
          const b2X = tipX + Math.sin(bladeAngle) * (bladeLen * 0.5);
          const b2Y = tipY - Math.cos(bladeAngle) * (bladeLen * 0.5);

          ctx.strokeStyle = '#020617';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(b1X, b1Y);
          ctx.lineTo(b2X, b2Y);
          ctx.stroke();

          // Water wipe shimmer arc
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pivotX, wiperPivotY, wiperLen * 0.95, -Math.PI / 2 - 0.7, -Math.PI / 2 + 0.7);
          ctx.stroke();
        });
      }

      // 7. STEAM FOG ON GLASS (Interactive drawings like smiley faces or names)
      if (steamDrawings.length > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < steamDrawings.length; i++) {
          const pt = steamDrawings[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // Windshield top sunshade tint strip (Classic Indian Bus green/blue gradient band)
      const tintGrad = ctx.createLinearGradient(0, 0, 0, h * 0.2);
      tintGrad.addColorStop(0, 'rgba(6, 78, 59, 0.5)'); // emerald sunshade tint
      tintGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = tintGrad;
      ctx.fillRect(0, 0, w, h * 0.2);

      // Top Glass Sticker: "SAFE HIGHWAY JOURNEY • GOD BLESS OUR VOYAGE"
      ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
      ctx.font = `bold 12px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('★ SAFE HIGHWAY JOURNEY • GOD BLESS OUR VOYAGE ★', w * 0.5, 22);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [atmosphere, isRaining, wiperActive, speedKmH, initRaindrops, steamDrawings]);

  // Touch / mouse interaction for drawing on foggy window
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSteamDrawings((prev) => [...prev, { x, y, time: Date.now() }]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSteamDrawings((prev) => [...prev, { x, y, time: Date.now() }]);
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="relative w-full h-[52vh] min-h-[380px] max-h-[580px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/15 bg-[#0a0f1a]">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-crosshair touch-none"
      />

      {/* Interactive Overlay HUD Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          id="wiper-toggle-btn"
          onClick={() => {
            busAudio.unlock();
            onWiperToggle();
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl transition-all flex items-center gap-1.5 border shadow-lg ${
            wiperActive
              ? 'bg-[#ff7b00]/25 text-[#ff9500] border-[#ff7b00]/60 shadow-[0_0_15px_rgba(255,123,0,0.3)] animate-pulse'
              : 'bg-[#0e1626]/80 text-neutral-300 border-white/15 hover:bg-[#141e33]'
          }`}
          title="Toggle Windshield Wiper"
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Wiper: {wiperActive ? 'ON' : 'OFF'}</span>
        </button>

        {steamDrawings.length > 0 && (
          <button
            id="clear-fog-btn"
            onClick={() => setSteamDrawings([])}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#0e1626]/80 text-neutral-400 border border-white/15 hover:text-white transition"
          >
            Clear Finger Art
          </button>
        )}
      </div>

      {/* Window Steam Hint */}
      <div className="absolute bottom-3 left-4 text-[11px] text-neutral-400/90 pointer-events-none flex items-center gap-1.5 drop-shadow font-mono">
        <Sparkles className="w-3.5 h-3.5 text-[#ff7b00]" />
        <span>Tip: Drag finger or mouse on glass to write in the window mist</span>
      </div>
    </div>
  );
};
