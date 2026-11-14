// Procedural Martian wind: filtered noise generated in the browser, no audio files.
export class WindAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.level = 0;
    this.master = 1;
  }

  // Must be called from a user gesture (click / key press) so the browser allows audio.
  start() {
    if (!this.ctx) this.#build();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.set(0.12, 1);
  }

  stop() {
    if (!this.ctx) return;
    this.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
  }

  toggleMute() {
    this.muted = !this.muted;
    this.set(this.level, this.master);
    return this.muted;
  }

  // level 0..1 = how hard the wind blows; master 0..1 = overall fade (used for the shutdown)
  set(level, master = 1) {
    this.level = level; this.master = master;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.muted ? 0 : master;
    this.out.gain.setTargetAtTime(vol * 0.9, now, 0.3);
    this.hissGain.gain.setTargetAtTime(0.05 + level * 0.5, now, 0.5);
    this.hiss.frequency.setTargetAtTime(350 + level * 900, now, 0.8);
    this.rumbleGain.gain.setTargetAtTime(0.1 + level * 0.9, now, 0.5);
    this.gust.gain.setTargetAtTime(0.02 + level * 0.3, now, 0.5);
  }

  #build() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.ctx = ctx;

    // 4 seconds of looping brown-ish noise
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.03 * white) / 1.03;
      data[i] = last * 3 + white * 0.15;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;

    this.out = ctx.createGain(); this.out.gain.value = 0;
    this.out.connect(ctx.destination);

    // airy hiss: band-pass that sweeps with the wind
    this.hiss = ctx.createBiquadFilter(); this.hiss.type = 'bandpass'; this.hiss.frequency.value = 400; this.hiss.Q.value = 0.7;
    this.hissGain = ctx.createGain(); this.hissGain.gain.value = 0.05;
    src.connect(this.hiss).connect(this.hissGain).connect(this.out);

    // low rumble
    const low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 140;
    this.rumbleGain = ctx.createGain(); this.rumbleGain.gain.value = 0.1;
    src.connect(low).connect(this.rumbleGain).connect(this.out);

    // slow gusts: two LFOs wobble the hiss volume
    this.gust = ctx.createGain(); this.gust.gain.value = 0.02;
    for (const f of [0.13, 0.31]) {
      const lfo = ctx.createOscillator(); lfo.frequency.value = f;
      lfo.connect(this.gust); lfo.start();
    }
    this.gust.connect(this.hissGain.gain);

    src.start();
    // If the context could not start yet (no user gesture), start it on the first one.
    const resume = () => { if (ctx.state === 'suspended') ctx.resume(); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
  }
}
