// Web Audio API Synthesizer for Authentic Indian Highway Bus Experience

class BusAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGainNodes: { [key: string]: GainNode } = {};
  private ambientSources: { [key: string]: AudioNode } = {};
  private isAudioUnlocked = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isAudioUnlocked = true;
  }

  public unlock() {
    this.initContext();
  }

  // Master method to play any Highway Bus Horn style
  public playHorn(style: 'musical' | 'heavy' | 'fanfare' | 'staccato' = 'musical') {
    switch (style) {
      case 'heavy':
        this.playHeavyHighwayBlast();
        break;
      case 'fanfare':
        this.playMelodyFanfareHorn();
        break;
      case 'staccato':
        this.playStaccatoHorn();
        break;
      case 'musical':
      default:
        this.playMusicalAirHorn();
        break;
    }
  }

  // 1. Iconic Indian 4-Stage Multi-Tone Musical Air Horn ("Poo-Poo-Peee-Poo!")
  public playMusicalAirHorn() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [
      { f1: 349.23, f2: 440.0, f3: 523.25, dur: 0.16, delay: 0 },
      { f1: 392.00, f2: 493.88, f3: 587.33, dur: 0.16, delay: 0.17 },
      { f1: 440.00, f2: 554.37, f3: 659.25, dur: 0.22, delay: 0.34 },
      { f1: 523.25, f2: 659.25, f3: 783.99, dur: 0.6, delay: 0.57 }
    ];

    notes.forEach(note => {
      const startTime = now + note.delay;
      const stopTime = startTime + note.dur;

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.48, startTime + 0.03);
      noteGain.gain.setValueAtTime(0.48, stopTime - 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, startTime);
      filter.Q.setValueAtTime(4.0, startTime);

      const freqs = [note.f1, note.f2, note.f3];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? 'sawtooth' : (idx === 1 ? 'square' : 'sawtooth');
        osc.frequency.setValueAtTime(freq + (idx === 1 ? 1.5 : -1.5), startTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 14;
        lfoGain.gain.value = 5;
        lfo.connect(osc.frequency);
        lfo.start(startTime);
        lfo.stop(stopTime);

        osc.connect(noteGain);
        osc.start(startTime);
        osc.stop(stopTime);
      });

      // Pneumatic air rush hiss
      const bufferSize = Math.floor(ctx.sampleRate * note.dur);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1900;
      noiseFilter.Q.value = 2.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(filter);
      noise.start(startTime);
      noise.stop(stopTime);

      noteGain.connect(filter);
      filter.connect(ctx.destination);
    });
  }

  // 2. Heavy Dual-Trumpet Pneumatic Highway Truck Blast ("HOOOONNKK!")
  public playHeavyHighwayBlast() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.75;
    const stopTime = now + duration;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.55, now + 0.04);
    gain.gain.setValueAtTime(0.52, stopTime - 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3.5, now);

    // Deep dissonant chord typical of heavy freight & interstate sleeper coaches (E3 + G#3 + B3 + D4)
    const baseFreqs = [164.81, 207.65, 246.94, 293.66];
    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq, now);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 10;
      lfoGain.gain.value = 3.5;
      lfo.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(stopTime);

      osc.connect(gain);
      osc.start(now);
      osc.stop(stopTime);
    });

    // Heavy air exhaust rush
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1200;
    noiseFilter.Q.value = 1.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(filter);
    noise.start(now);
    noise.stop(stopTime);

    gain.connect(filter);
    filter.connect(ctx.destination);
  }

  // 3. Fast Overtaking Fanfare Melody ("Poo-Pi-Poo-Peee-Pooo!")
  public playMelodyFanfareHorn() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const sequence = [
      { f: [440, 554], dur: 0.12, delay: 0 },
      { f: [494, 622], dur: 0.12, delay: 0.13 },
      { f: [554, 698], dur: 0.12, delay: 0.26 },
      { f: [440, 554], dur: 0.14, delay: 0.39 },
      { f: [659, 830], dur: 0.45, delay: 0.54 }
    ];

    sequence.forEach(step => {
      const startTime = now + step.delay;
      const stopTime = startTime + step.dur;

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.45, startTime + 0.02);
      noteGain.gain.setValueAtTime(0.42, stopTime - 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, startTime);
      filter.Q.setValueAtTime(3.0, startTime);

      step.f.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.connect(noteGain);
        osc.start(startTime);
        osc.stop(stopTime);
      });

      noteGain.connect(filter);
      filter.connect(ctx.destination);
    });
  }

  // 4. Double Rapid Staccato Blast ("Paap-Paap!")
  public playStaccatoHorn() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bursts = [
      { delay: 0, dur: 0.13 },
      { delay: 0.17, dur: 0.22 }
    ];

    bursts.forEach(burst => {
      const startTime = now + burst.delay;
      const stopTime = startTime + burst.dur;

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.5, startTime + 0.02);
      noteGain.gain.setValueAtTime(0.48, stopTime - 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, startTime);
      filter.Q.setValueAtTime(3.0, startTime);

      [392, 493.88, 587.33].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.connect(noteGain);
        osc.start(startTime);
        osc.stop(stopTime);
      });

      noteGain.connect(filter);
      filter.connect(ctx.destination);
    });
  }

  // Conductor Whistle ("Phweee-phweeeet!")
  public playConductorWhistle() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const playBeep = (time: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2600, time);
      osc.frequency.exponentialRampToValueAtTime(2900, time + duration);

      // Trill (the little pea inside the whistle rattling)
      lfo.type = 'sawtooth';
      lfo.frequency.value = 45;
      lfoGain.gain.value = 180;
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      lfo.start(time);
      lfo.stop(time + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    playBeep(now, 0.18);
    playBeep(now + 0.22, 0.28);
  }

  // Mechanical Cassette Deck Button Clunk (Play, Eject, Stop)
  public playCassetteClick(type: 'click' | 'eject' | 'insert' = 'click') {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (type === 'eject') {
      // Spring pop + plastic clack
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

      // Secondary metallic latch
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(800, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain2.gain.setValueAtTime(0.2, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.14);
    } else {
      // Heavy mechanical latch click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  // Wiper Squeak Sound
  public playWiperSqueak() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.linearRampToValueAtTime(950, now + 0.15);
    osc.frequency.linearRampToValueAtTime(600, now + 0.35);

    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 5.0;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Ticket Punch Click
  public playTicketPunch() {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Continuous Ambient Generator (Engine, Rain, Crickets, Tape Hiss)
  public setAmbientLayer(type: 'engine' | 'rain' | 'crickets' | 'tapeHiss', volume: number) {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;

    if (!this.ambientGainNodes[type]) {
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      this.ambientGainNodes[type] = gain;

      // Create generator based on type
      if (type === 'engine') {
        // Low frequency engine hum + subtle harmonic vibration
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 46; // low idle rumble (approx 650 RPM)
        osc2.type = 'sine';
        osc2.frequency.value = 92;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 160;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);

        osc1.start();
        osc2.start();
        this.ambientSources[type] = osc1;
      } else if (type === 'rain') {
        // Pink noise generator through gentle lowpass
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;

        noise.connect(filter);
        filter.connect(gain);
        noise.start();
        this.ambientSources[type] = noise;
      } else if (type === 'crickets') {
        // High frequency modulated night cricket chirps
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 4800;
        lfo.frequency.value = 18;
        lfoGain.gain.value = 240;
        lfo.connect(osc.frequency);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4800;
        filter.Q.value = 6.0;

        lfo.start();
        osc.connect(filter);
        filter.connect(gain);
        osc.start();
        this.ambientSources[type] = osc;
      } else if (type === 'tapeHiss') {
        // Soft high-frequency magnetic tape hiss
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.04;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3500;
        filter.Q.value = 1.0;

        noise.connect(filter);
        filter.connect(gain);
        noise.start();
        this.ambientSources[type] = noise;
      }
    }

    const gainNode = this.ambientGainNodes[type];
    if (gainNode) {
      const targetGain = Math.max(0, Math.min(1, volume));
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetGain * 0.35, ctx.currentTime + 0.1);
    }
  }

  public getUnlocked(): boolean {
    return this.isAudioUnlocked;
  }
}

export const busAudio = new BusAudioEngine();
