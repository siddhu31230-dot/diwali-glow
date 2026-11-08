/**
 * Diwali Glow Sound Engine (Web Audio API)
 * Synthesizes authentic Indian meditative ambience, temple bells, diya ignition,
 * and fireworks sounds with zero external network dependencies.
 */

class DiwaliAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private chimeTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.65, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Sound of lighting the Diya: warm ignition swell and sparkle
   */
  public playDiyaIgnition() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Warm resonant tone swell
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(180, now + 1.2);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.4, now + 0.25);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.6);

    // Filtered flame breath / whoosh
    const bufferSize = this.ctx.sampleRate * 1.2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);
    filter.Q.setValueAtTime(3.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.25, now + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 1.3);

    // Initial soft blessing chime
    this.playTempleBell(659.25, 0.4); // E5
  }

  /**
   * Authentic Temple Brass Bell / Ghanti sound with rich harmonics
   */
  public playTempleBell(freq = 587.33, delaySeconds = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime + delaySeconds;
    // Harmonic partial ratios for brass bell
    const partials = [
      { ratio: 1.0, gain: 0.5, decay: 2.8 },
      { ratio: 2.0, gain: 0.35, decay: 2.2 },
      { ratio: 2.76, gain: 0.25, decay: 1.8 },
      { ratio: 4.12, gain: 0.15, decay: 1.2 },
      { ratio: 5.43, gain: 0.08, decay: 0.8 },
    ];

    partials.forEach(({ ratio, gain, decay }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(gain * 0.4, now + 0.015);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  /**
   * Fireworks explosion thud and sparkling crackle
   */
  public playFireworkBurst(volume = 0.3) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Deep low thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.5);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.exponentialRampToValueAtTime(volume * 0.7, now + 0.03);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.8);

    // Crackle noise
    const duration = 0.9;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // intermittent crackles
      data[i] = Math.random() > 0.88 ? (Math.random() * 2 - 1) : 0;
    }

    const crackle = this.ctx.createBufferSource();
    crackle.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, now);

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(volume * 0.4, now + 0.05);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    crackle.connect(filter);
    filter.connect(crackleGain);
    crackleGain.connect(this.masterGain);

    crackle.start(now + 0.05);
    crackle.stop(now + duration + 0.1);
  }

  /**
   * Sound of Anar (Flowerpot Fountain): rich hissing whoosh with crackling golden sparks
   */
  public playAnarFountainSound(duration = 4.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Noise with random explosive density
      data[i] = (Math.random() * 2 - 1) * (0.8 + 0.2 * Math.sin(i * 0.02));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    // Resonant bandpass filter that sweeps as fountain shoots high
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.linearRampToValueAtTime(3200, now + 1.2);
    filter.frequency.linearRampToValueAtTime(2200, now + duration - 0.5);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gain.gain.setValueAtTime(0.35, now + duration - 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Deep combustion rumble
    const rumble = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    rumble.type = 'triangle';
    rumble.frequency.setValueAtTime(75, now);
    rumble.frequency.linearRampToValueAtTime(95, now + 1.5);
    rumble.frequency.linearRampToValueAtTime(60, now + duration);

    rumbleGain.gain.setValueAtTime(0.001, now);
    rumbleGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    rumble.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    rumble.start(now);
    rumble.stop(now + duration + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  /**
   * Sound of Chakri (Ground Spinner): whirling Doppler whirr + centrifugal spark spray
   */
  public playChakriSpinSound(duration = 3.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Whirling tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(540, now + 0.8);
    osc.frequency.linearRampToValueAtTime(420, now + duration - 0.8);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);

    // Rapid amplitude / frequency wobble for spinning sensation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(14, now); // 14 spins per sec
    lfoGain.gain.setValueAtTime(60, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
    oscGain.gain.setValueAtTime(0.2, now + duration - 0.5);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.1);

    // Spray noise
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  /**
   * Sound of Diwali Ladi (String of 12-16 rapid festive firecrackers)
   */
  public playLadiFirecrackers(count = 14) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    let delay = 0;
    for (let i = 0; i < count; i++) {
      const isFinal = i === count - 1;
      const popVol = isFinal ? 0.6 : 0.25 + Math.random() * 0.15;
      const popFreq = isFinal ? 85 : 240 + Math.random() * 180;

      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Sharp percussion pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isFinal ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(popFreq, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

        gain.gain.setValueAtTime(popVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.2);

        // Crackle click
        const clickBuf = this.ctx.createBuffer(1, 1024, this.ctx.sampleRate);
        const clickData = clickBuf.getChannelData(0);
        for (let c = 0; c < 1024; c++) clickData[c] = (Math.random() * 2 - 1) * 0.8;
        const click = this.ctx.createBufferSource();
        click.buffer = clickBuf;
        const clickGain = this.ctx.createGain();
        clickGain.gain.setValueAtTime(popVol * 0.6, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        click.connect(clickGain);
        clickGain.connect(this.masterGain);
        click.start(now);
      }, delay * 1000);

      // Fast syncopated rhythmic delay (65ms - 130ms)
      delay += isFinal ? 0.25 : 0.065 + Math.random() * 0.06;
    }
  }

  /**
   * Sound of Sparkler (Phooljhadi) sizzling
   */
  public playSparklerSizzle(duration = 2.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() > 0.82 ? (Math.random() * 2 - 1) : 0;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  /**
   * Starts Indian Festive Meditative Drone & Melodic Santoor/Flute chimes
   */
  public startFestiveAmbience() {
    this.initContext();
    if (this.isPlaying || !this.ctx || !this.ambientGain) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Indian Raga drone frequencies (Tuning around D: Sa-Pa)
    const droneFreqs = [73.42, 110.0, 146.83, 220.0, 293.66]; // D2, A2, D3, A3, D4

    this.ambientOscillators = droneFreqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle slow detune vibrato LFO
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.04, now);
      lfoGain.gain.setValueAtTime(1.2, now);
      lfo.connect(osc.frequency);
      lfo.start(now);

      const baseVol = 0.04 / (idx + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(baseVol, now + 3);

      osc.connect(gain);
      gain.connect(this.ambientGain!);
      osc.start(now);

      return osc;
    });

    // Schedule gentle melodic chimes in Indian festive pentatonic scale (Bhoopali: D, E, F#, A, B, D')
    const festiveScale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0];
    let noteIdx = 0;

    const playRandomChime = () => {
      if (!this.isPlaying || this.isMuted || !this.ctx) return;
      const freq = festiveScale[noteIdx % festiveScale.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % festiveScale.length;
      this.playTempleBell(freq, 0);

      // Random delay between 2.5s and 5.5s
      const nextDelay = 2500 + Math.random() * 3000;
      this.chimeTimer = window.setTimeout(playRandomChime, nextDelay);
    };

    this.chimeTimer = window.setTimeout(playRandomChime, 2000);
  }

  public stopFestiveAmbience() {
    this.isPlaying = false;
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.ambientOscillators = [];
  }
}

export const audioService = new DiwaliAudioEngine();
