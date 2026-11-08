# Diwali Glow 🪔✨
### A Cinematic Digital Diwali Gift Experience

*Diwali Glow* is an original, cinematic interactive digital Diwali greeting designed to feel like a beautifully produced short film rather than a conventional website. Inspired by the sentiment of lighting a sacred diya for loved ones, it combines realistic physics-driven canvas simulations, authentic Indian festive audio synthesis, and personalized video recording.

---

## 🌟 Key Features

1. **Cinematic 5-Scene Narrative**:
   - **Scene 1 (The Beginning)**: Deep midnight purple stillness, gentle flame ignition, delicate sacred flame reveal.
   - **Scene 2 (Lighting the Diya)**: Golden radial bloom expands, marigold (*genda phool*) petals shower down, peripheral decorative diyas illuminate.
   - **Scene 3 (Personal Greeting)**: Custom sender and receiver name reveal (`[SENDER] lit a diya for you ✨`) paired with festive blessings.
   - **Scene 4 (Grand Diwali Reveal)**: Grand fireworks show, luminous golden typography (*Happy Diwali*), and rotating sacred floor Rangoli.
   - **Scene 5 (Final Celebration & Action Dock)**: Warm heartfelt wishes card with seamless sharing tools.

2. **Realistic Diya & Fireplace Physics**:
   - Hand-crafted SVG diya body with Royal Brass, Classic Gold, and Terracotta clay finishes.
   - Multi-stage flickering flame with white-hot core, golden mantle, warm orange crest, and indigo blue base.
   - Rising ember sparkles, pulsing radial light aura, and floor reflections.

3. **Visual Effects & Crackers Engine (HTML5 Canvas)**:
   - **Anar (Flowerpot Fountain)**: Shoots towering 300px golden & silver spark fountains with realistic gravity and nozzle flame glow.
   - **Chakri (Ground Spinner)**: Whirling disk emitting high-velocity centrifugal spiral spark arms across the floor plane.
   - **Phooljhadi (Sparkler)**: Interactive handheld sparkler mode with branching starburst fractal sparks that follow user pointer/touch.
   - **Diwali Ladi (Firecrackers String)**: Rapid 14-shot staccato cracker flashes and rising smoke puffs on the ground.
   - **Sky Rockets & Chrysanthemum Fireworks**: Multicolored aerial bursts, weeping willow gold trails, and crackling micro-sparkles.
   - **Interactive Cracker Dock**: Dedicated "Burst Crackers 🎆" control to light Anar, Chakri, Phooljhadi, Ladi, or Rockets on demand.
   - 3D fluttering Marigold petals with tumbling aerodynamics and color gradients.
   - Sacred 12-petal rotating Lotus Rangoli mandala on a 3D perspective floor plane.

4. **Web Audio Synthesizer (Zero-dependency, 100% Offline)**:
   - Authentic Temple Brass Bell (*Ghanti*) with physical harmonic partials.
   - Warm diya flame ignition whoosh and sparkle swell.
   - Indian festive meditative Pa-Sa drone and Santoor-like chimes in Bhoopali pentatonic raga.
   - Responsive fireworks thump and crackle sounds.
   - Mute/Unmute control and autoplay compliance (starts on first user touch).

5. **Personalization & Social Sharing**:
   - Backward-compatible URL parser supporting both base64 payloads (e.g. `?w=S3Jpc2huYSAmIElzaHdhcg` matching `Krishna & Ishwar`) and modern JSON/query parameters.
   - Direct WhatsApp sharing with rich emoji invitation copy.
   - One-touch link copying with instant feedback.
   - Native Web Share API integration on iOS and Android devices.

6. **Real Canvas Video Export**:
   - Direct canvas recording using `canvas.captureStream()` and `MediaRecorder`.
   - Real `.webm` export (and hardware-accelerated `.mp4` where supported).
   - Real-time progress percentage bar and custom formatted file download (`Diwali_Greeting_From_[Sender].webm`).

---

## 🚀 Running the Project

```bash
# Navigate to the project directory
cd /Users/siddharthsingh/.gemini/antigravity/scratch/diwali-glow

# Install dependencies (already installed)
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### URL Examples:
- Default: `http://localhost:5173/`
- Reference base64 format: `http://localhost:5173/?w=S3Jpc2huYSAmIElzaHdhcg`
- Custom params: `http://localhost:5173/?from=Aarav&to=Simran&msg=May+your+year+be+radiant`
