/* ============================================================
   METAPORTO — main.js
   Metaphor: ReFantazio UI Interactions, Web Audio API SFX & 3D Shatter
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const menuItems        = document.querySelectorAll('.menu-item');
  const pages            = document.querySelectorAll('.page');
  const menuScreen       = document.getElementById('menuScreen');
  const contentScreen    = document.getElementById('contentScreen');
  const backBtn          = document.getElementById('backBtn');
  const wipeBlack        = document.getElementById('wipeBlack');
  const wipeColor        = document.getElementById('wipeColor');
  const wipeBrushSlash   = document.getElementById('wipeBrushSlash');
  const collageLayer     = document.getElementById('collageLayer');
  const commandBadge     = document.getElementById('commandBadge');
  const cmdDigitValSvg   = document.getElementById('cmdDigitValSvg');
  const cmdDigitZeroSvg  = document.getElementById('cmdDigitZeroSvg');
  const shatterContainer = document.getElementById('shatterContainer');
  const hudBR            = document.getElementById('hudBR');
  const bgMedia          = document.querySelector('.bg-media');
  const bgmAudio         = document.getElementById('bgmAudio');
  const bgmToggle        = document.getElementById('bgmToggle');
  const bgmText          = document.getElementById('bgmText');
  const sysBgmItem       = document.getElementById('sysBgmItem');
  const sysBgmState      = document.getElementById('sysBgmState');

  // ==================== DYNAMIC PAGE BACKGROUNDS ====================
  // Maps specific background artwork per menu
  const pageBackgrounds = {
    home: 'assets/twk2i43ldc9e1.gif',
    skill: 'assets/38752648-bd78-49a8-b9ea-c31f585c702f.png',
    item: 'assets/bc0323a7-d167-4af9-bded-0374ed78f99e.png',
    equipment: 'assets/e91f5449-4afe-4b57-b81c-99fabd80865d.png',
    party: 'assets/ChatGPT Image Sep 14, 2026, 10_25_55 AM.png',
    follower: 'assets/f7cef99c-c822-41e4-ba8b-b53242a2bc18.png',
    quest: 'assets/614f9d7a-b1a0-4703-b9f7-4984b840e5ed.png',
    journal: 'assets/8459fa4f-105b-4515-8beb-0a3ab52dc832.png',
    system: 'assets/system-bg.png',
    // Siap diisi untuk menu lain saat user memberikan gambarnya:
    // calendar: '...'
  };

  // Preload background images agar transisi instan tanpa jeda
  Object.values(pageBackgrounds).forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Sub-Menu Interactive Elements
  const memberCards      = document.querySelectorAll('.member-card');
  const skillEntriesList = document.getElementById('skillEntriesList');
  const invItems         = document.querySelectorAll('.inv-item');
  const itemDetailTitle  = document.getElementById('itemDetailTitle');
  const itemDetailDesc   = document.getElementById('itemDetailDesc');
  const itemDetailTech   = document.getElementById('itemDetailTech');

  let isTransitioning = false;
  let currentPage = null;
  let isBgmPlaying = false;
  let isBgmUserPaused = false;
  const TARGET_BGM_VOLUME = 0.32;
  let bgmFadeInterval = null;

  // ==================== METAPHOR BACKGROUND MUSIC (BGM) ENGINE ====================
  function updateBgmUI(playing) {
    if (bgmToggle) {
      if (playing) {
        bgmToggle.classList.add('playing');
        bgmToggle.classList.remove('muted');
        if (bgmText) bgmText.textContent = 'BGM: ON';
      } else {
        bgmToggle.classList.remove('playing');
        bgmToggle.classList.add('muted');
        if (bgmText) bgmText.textContent = 'BGM: OFF';
      }
    }
    if (sysBgmState) {
      sysBgmState.textContent = playing ? 'PLAYING' : 'PAUSED';
      sysBgmState.style.color = playing ? '#00e676' : 'rgba(255,255,255,0.4)';
    }
  }

  function fadeAudio(targetVol, durationMs, onComplete) {
    if (!bgmAudio) return;
    clearInterval(bgmFadeInterval);
    const startVol = bgmAudio.volume;
    const diff = targetVol - startVol;
    const steps = 25;
    const stepTime = durationMs / steps;
    let currentStep = 0;

    bgmFadeInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      bgmAudio.volume = Math.max(0, Math.min(1, startVol + diff * progress));
      if (currentStep >= steps) {
        clearInterval(bgmFadeInterval);
        bgmAudio.volume = targetVol;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  function startBgm() {
    if (!bgmAudio || isBgmUserPaused) return;
    bgmAudio.volume = 0;
    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isBgmPlaying = true;
          fadeAudio(TARGET_BGM_VOLUME, 1200);
          updateBgmUI(true);
        })
        .catch(() => {});
    }
  }

  function toggleBgm() {
    if (!bgmAudio) return;
    if (isBgmPlaying) {
      isBgmUserPaused = true;
      fadeAudio(0, 400, () => {
        bgmAudio.pause();
        isBgmPlaying = false;
        updateBgmUI(false);
      });
    } else {
      isBgmUserPaused = false;
      bgmAudio.play().then(() => {
        isBgmPlaying = true;
        fadeAudio(TARGET_BGM_VOLUME, 800);
        updateBgmUI(true);
      }).catch(() => {});
    }
  }

  if (bgmToggle) {
    bgmToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSFX();
      toggleBgm();
    });
    bgmToggle.addEventListener('mouseenter', () => {
      playHoverSFX();
    });
  }

  if (sysBgmItem) {
    sysBgmItem.addEventListener('click', () => {
      playClickSFX();
      toggleBgm();
    });
    sysBgmItem.addEventListener('mouseenter', () => {
      playHoverSFX();
    });
  }

  // Page Visibility API: smart pause when switching tabs
  document.addEventListener('visibilitychange', () => {
    if (!bgmAudio || isBgmUserPaused) return;
    if (document.hidden) {
      if (isBgmPlaying) {
        fadeAudio(0, 300, () => {
          bgmAudio.pause();
        });
      }
    } else {
      if (isBgmPlaying) {
        bgmAudio.play().then(() => {
          fadeAudio(TARGET_BGM_VOLUME, 600);
        }).catch(() => {});
      }
    }
  });

  // ==================== JRPG STYLIZED UI SFX (WEB AUDIO API) ====================
  // Design: crisp, tactile, dry, minimal, fast, polished
  // NO frequency sweeps (causes "pew"), NO heavy bass, NO sci-fi whoosh
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!isBgmPlaying && !isBgmUserPaused) {
      startBgm();
    }
  }

  // Utility: create a short burst of filtered white noise
  function createNoiseBurst(duration, filterFreq, filterQ, volume, startTime) {
    const len = Math.floor(audioCtx.sampleRate * duration);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = audioCtx.createBufferSource();
    src.buffer = buf;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = filterQ;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    src.start(startTime);
    return src;
  }

  // 1. HOVER / CURSOR MOVE: Very short, sharp, dry UI click
  //    Fast attack, tiny tonal character, extremely short decay
  function playHoverSFX() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Tiny noise click (3ms) - the "tactile snap"
      createNoiseBurst(0.003, 3000, 1, 0.09, now);

      // Fixed-pitch micro ping (no sweep!) - the "tonal character"
      const ping = audioCtx.createOscillator();
      const pingGain = audioCtx.createGain();
      ping.type = 'sine';
      ping.frequency.value = 900; // Fixed! No ramp = no pew
      pingGain.gain.setValueAtTime(0.04, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      ping.connect(pingGain);
      pingGain.connect(audioCtx.destination);
      ping.start(now);
      ping.stop(now + 0.008);
    } catch (e) {}
  }

  // 2. CONFIRM / SELECT: Slightly stronger click + subtle tonal resonance
  function playClickSFX() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Stronger noise click (5ms)
      createNoiseBurst(0.005, 2500, 1.5, 0.14, now);

      // Confirmation ping with subtle resonance tail
      const ping = audioCtx.createOscillator();
      const pingGain = audioCtx.createGain();
      ping.type = 'sine';
      ping.frequency.value = 750; // Fixed pitch
      pingGain.gain.setValueAtTime(0.07, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      ping.connect(pingGain);
      pingGain.connect(audioCtx.destination);
      ping.start(now);
      ping.stop(now + 0.035);

      // Very subtle harmonic overtone for "satisfying" feel
      const harm = audioCtx.createOscillator();
      const harmGain = audioCtx.createGain();
      harm.type = 'sine';
      harm.frequency.value = 1500; // Octave above, fixed
      harmGain.gain.setValueAtTime(0.02, now + 0.002);
      harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      harm.connect(harmGain);
      harmGain.connect(audioCtx.destination);
      harm.start(now + 0.002);
      harm.stop(now + 0.025);
    } catch (e) {}
  }

  // 3. ENTER SUBMENU: Confirm click + elegant short transition sweep
  function playEnterSFX() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Confirm click first
      createNoiseBurst(0.005, 2500, 1.5, 0.12, now);

      const ping = audioCtx.createOscillator();
      const pingGain = audioCtx.createGain();
      ping.type = 'sine';
      ping.frequency.value = 750;
      pingGain.gain.setValueAtTime(0.06, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      ping.connect(pingGain);
      pingGain.connect(audioCtx.destination);
      ping.start(now);
      ping.stop(now + 0.03);

      // Elegant sweep: filtered noise with rising filter (not osc pitch sweep!)
      const sweepLen = Math.floor(audioCtx.sampleRate * 0.08);
      const sweepBuf = audioCtx.createBuffer(1, sweepLen, audioCtx.sampleRate);
      const sweepData = sweepBuf.getChannelData(0);
      for (let i = 0; i < sweepLen; i++) {
        sweepData[i] = Math.random() * 2 - 1;
      }

      const sweepSrc = audioCtx.createBufferSource();
      sweepSrc.buffer = sweepBuf;

      const sweepFilter = audioCtx.createBiquadFilter();
      sweepFilter.type = 'bandpass';
      sweepFilter.Q.value = 2;
      sweepFilter.frequency.setValueAtTime(800, now + 0.01);
      sweepFilter.frequency.linearRampToValueAtTime(5000, now + 0.07);

      const sweepGain = audioCtx.createGain();
      sweepGain.gain.setValueAtTime(0.06, now + 0.01);
      sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      sweepSrc.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(audioCtx.destination);
      sweepSrc.start(now + 0.01);
    } catch (e) {}
  }

  // 4. BACK / RETURN: Softer retracting sweep
  function playBackSFX() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Soft click
      createNoiseBurst(0.004, 2800, 1, 0.08, now);

      // Reverse sweep: filter goes high→low (retracting feel)
      const sweepLen = Math.floor(audioCtx.sampleRate * 0.06);
      const sweepBuf = audioCtx.createBuffer(1, sweepLen, audioCtx.sampleRate);
      const sweepData = sweepBuf.getChannelData(0);
      for (let i = 0; i < sweepLen; i++) {
        sweepData[i] = Math.random() * 2 - 1;
      }

      const sweepSrc = audioCtx.createBufferSource();
      sweepSrc.buffer = sweepBuf;

      const sweepFilter = audioCtx.createBiquadFilter();
      sweepFilter.type = 'bandpass';
      sweepFilter.Q.value = 2;
      sweepFilter.frequency.setValueAtTime(4000, now);
      sweepFilter.frequency.linearRampToValueAtTime(600, now + 0.05);

      const sweepGain = audioCtx.createGain();
      sweepGain.gain.setValueAtTime(0.06, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      sweepSrc.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(audioCtx.destination);
      sweepSrc.start(now);
    } catch (e) {}
  }

  ['click', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, initAudio, { once: true });
  });

  // ==================== SVG CALLIGRAPHIC BRUSH STROKE INJECTION ====================
  // Real organic Bézier curve brush strokes — NOT clip-path polygon shapes

  function injectMenuBrushSVGs() {
    const splashes = document.querySelectorAll('.m-brush-splash');
    splashes.forEach(splash => {
      const menuItem = splash.closest('.menu-item');
      const color = menuItem ? menuItem.dataset.color : '#ab47bc';
      splash.innerHTML = `
        <svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <!-- Core thick calligraphic body with organic tapered edges -->
          <path d="M 18,60 C 30,42 55,32 95,35 C 155,38 210,28 290,32 C 380,36 460,44 540,52 Q 555,55 558,60 C 555,68 540,76 460,80 C 370,84 280,86 190,84 C 120,82 60,78 30,72 C 22,70 18,66 18,60 Z" fill="${color}" opacity="0.95"/>

          <!-- Upper dry-bristle fiber spikes (ragged top edge) -->
          <path d="M 50,44 C 70,32 110,24 170,26 Q 250,28 340,24 C 400,22 460,28 520,36 Q 540,40 548,44 C 530,46 490,38 420,34 C 340,30 260,30 180,34 C 130,36 80,42 50,44 Z" fill="${color}" opacity="0.8"/>
          <path d="M 85,30 C 120,18 180,15 250,18 Q 340,20 420,24 C 460,26 500,30 530,36 C 510,34 460,28 390,24 Q 300,20 220,20 C 160,20 110,24 85,30 Z" fill="${color}" opacity="0.6"/>
          <path d="M 130,18 C 170,10 220,8 290,10 Q 370,12 440,18 C 470,20 500,24 525,30 C 500,26 450,20 390,16 Q 310,12 240,12 C 190,12 150,14 130,18 Z" fill="${color}" opacity="0.42"/>
          <!-- Thin wispy single-bristle fibers at very top -->
          <path d="M 180,10 Q 230,4 300,5 C 360,6 420,10 470,18" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.35"/>
          <path d="M 220,6 Q 280,2 350,3 C 400,4 450,10 490,16" fill="none" stroke="${color}" stroke-width="1" opacity="0.25"/>

          <!-- Lower dry-brush fibrous tears (ragged bottom edge) -->
          <path d="M 28,72 C 60,82 120,90 200,92 Q 300,95 400,90 C 450,88 510,80 548,70 C 530,80 470,90 400,96 Q 300,102 190,98 C 120,96 65,88 28,72 Z" fill="${color}" opacity="0.8"/>
          <path d="M 70,88 C 110,100 170,106 250,108 Q 340,110 430,104 C 470,100 510,94 540,84 C 510,96 450,106 380,110 Q 290,114 200,112 C 140,110 90,100 70,88 Z" fill="${color}" opacity="0.55"/>
          <path d="M 120,102 C 160,114 220,118 290,118 Q 370,118 440,112 C 470,108 500,102 520,94 C 500,106 450,114 390,118 Q 310,122 230,120 C 180,118 140,112 120,102 Z" fill="${color}" opacity="0.35"/>
          <!-- Thin wispy single-bristle fibers at very bottom -->
          <path d="M 160,112 Q 240,120 330,118 C 390,116 440,110 480,100" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.3"/>

          <!-- Dry-brush void skips (unpainted internal streaks) -->
          <path d="M 170,50 Q 240,48 320,52 Q 260,55 170,50 Z" fill="#000" opacity="0.22"/>
          <path d="M 140,68 Q 230,70 330,68 Q 240,72 140,68 Z" fill="#000" opacity="0.28"/>
          <path d="M 270,58 Q 360,59 440,63 Q 370,66 270,58 Z" fill="#000" opacity="0.2"/>
          <path d="M 350,48 Q 410,47 460,50 Q 420,53 350,48 Z" fill="#000" opacity="0.18"/>

          <!-- Flying ink splatter droplets (beyond stroke body) -->
          <circle cx="570" cy="44" r="2.8" fill="${color}" opacity="0.9"/>
          <circle cx="558" cy="28" r="1.8" fill="${color}" opacity="0.75"/>
          <circle cx="544" cy="16" r="3.2" fill="${color}" opacity="0.7"/>
          <circle cx="528" cy="8" r="1.5" fill="${color}" opacity="0.55"/>
          <circle cx="578" cy="64" r="2.2" fill="${color}" opacity="0.85"/>
          <circle cx="564" cy="82" r="2.8" fill="${color}" opacity="0.75"/>
          <circle cx="548" cy="98" r="1.8" fill="${color}" opacity="0.65"/>
          <circle cx="524" cy="108" r="2.4" fill="${color}" opacity="0.55"/>
          <circle cx="8" cy="54" r="2.0" fill="${color}" opacity="0.7"/>
          <circle cx="20" cy="38" r="1.4" fill="${color}" opacity="0.55"/>
          <circle cx="12" cy="74" r="1.8" fill="${color}" opacity="0.6"/>
        </svg>`;
    });
  }

  function injectWipeSVGs() {
    // Black wipe — massive brush blade with organic Bézier leading edge
    const wipeBlackEl = document.getElementById('wipeBlack');
    if (wipeBlackEl) {
      wipeBlackEl.innerHTML = `
        <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="
            M 0,0 L 0,1200 L 1050,1200
            C 1060,1150 1080,1100 1070,1050
            C 1058,990 1085,940 1075,880
            C 1065,820 1090,770 1080,710
            C 1070,650 1095,600 1085,540
            C 1075,480 1100,430 1088,370
            C 1078,310 1098,260 1090,200
            C 1082,140 1095,80 1090,40
            C 1085,10 1075,0 1060,0
            Z" fill="#050505"/>
          <!-- Bristle fibers on leading edge -->
          <path d="M 1060,0 C 1080,50 1100,120 1092,200 C 1084,280 1105,350 1098,430" fill="none" stroke="#050505" stroke-width="8" opacity="0.7"/>
          <path d="M 1075,400 C 1095,480 1085,560 1095,640 C 1105,720 1082,800 1090,880" fill="none" stroke="#050505" stroke-width="6" opacity="0.6"/>
          <path d="M 1088,850 C 1098,920 1075,980 1085,1050 C 1095,1120 1070,1160 1060,1200" fill="none" stroke="#050505" stroke-width="7" opacity="0.65"/>
          <!-- Splatter dots along edge -->
          <circle cx="1105" cy="180" r="4" fill="#050505" opacity="0.8"/>
          <circle cx="1112" cy="350" r="3" fill="#050505" opacity="0.7"/>
          <circle cx="1108" cy="520" r="5" fill="#050505" opacity="0.75"/>
          <circle cx="1115" cy="700" r="3.5" fill="#050505" opacity="0.7"/>
          <circle cx="1100" cy="900" r="4.5" fill="#050505" opacity="0.65"/>
          <circle cx="1110" cy="1050" r="3" fill="#050505" opacity="0.6"/>
        </svg>`;
    }

    // Color wipe — slightly different organic edge profile
    const wipeColorEl = document.getElementById('wipeColor');
    if (wipeColorEl) {
      wipeColorEl.innerHTML = `
        <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="
            M 0,0 L 0,1200 L 1040,1200
            C 1055,1140 1070,1080 1060,1020
            C 1048,950 1075,890 1065,830
            C 1055,770 1080,710 1068,650
            C 1058,590 1082,530 1072,470
            C 1062,410 1085,350 1075,290
            C 1065,230 1080,170 1072,110
            C 1064,60 1058,20 1050,0
            Z" fill="var(--transition-color, #d32f2f)"/>
          <!-- Bristle fiber streaks -->
          <path d="M 1050,0 C 1070,80 1090,160 1080,250 C 1072,340 1090,420 1082,510" fill="none" stroke="var(--transition-color, #d32f2f)" stroke-width="7" opacity="0.65"/>
          <path d="M 1080,500 C 1095,590 1075,680 1088,770 C 1098,860 1070,940 1060,1020" fill="none" stroke="var(--transition-color, #d32f2f)" stroke-width="5" opacity="0.55"/>
          <!-- Splatter dots -->
          <circle cx="1098" cy="150" r="4" fill="var(--transition-color, #d32f2f)" opacity="0.8"/>
          <circle cx="1105" cy="400" r="3.5" fill="var(--transition-color, #d32f2f)" opacity="0.7"/>
          <circle cx="1095" cy="650" r="5" fill="var(--transition-color, #d32f2f)" opacity="0.75"/>
          <circle cx="1102" cy="850" r="3" fill="var(--transition-color, #d32f2f)" opacity="0.65"/>
          <circle cx="1090" cy="1100" r="4" fill="var(--transition-color, #d32f2f)" opacity="0.6"/>
        </svg>`;
    }

    // White brush slash accent — thin dramatic slash
    const wipeBrushEl = document.getElementById('wipeBrushSlash');
    if (wipeBrushEl) {
      wipeBrushEl.innerHTML = `
        <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="
            M 0,0 L 0,1200 L 1020,1200
            C 1040,1120 1060,1040 1048,960
            C 1036,880 1058,800 1048,720
            C 1038,640 1060,560 1050,480
            C 1040,400 1058,320 1048,240
            C 1038,160 1052,80 1045,20
            C 1040,0 1030,0 1020,0
            Z" fill="#ffffff" opacity="0.85"/>
          <path d="M 1020,0 C 1045,100 1065,220 1055,340 C 1045,460 1065,580 1055,700 C 1045,820 1060,940 1040,1060 C 1028,1140 1025,1180 1020,1200" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.5"/>
          <circle cx="1070" cy="200" r="3" fill="#ffffff" opacity="0.6"/>
          <circle cx="1075" cy="500" r="4" fill="#ffffff" opacity="0.55"/>
          <circle cx="1068" cy="800" r="3.5" fill="#ffffff" opacity="0.5"/>
          <circle cx="1060" cy="1050" r="3" fill="#ffffff" opacity="0.45"/>
        </svg>`;
    }
  }

  function injectSubMenuBrushSVGs() {
    // Generic brush stroke SVG for sub-menu items
    function brushSVG(color) {
      return `<svg viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:100%;display:block;overflow:visible;">
        <path d="M 10,50 C 20,34 45,26 80,28 C 140,32 200,24 280,28 C 360,32 420,38 470,46 Q 485,48 488,52 C 486,58 470,66 410,70 C 340,74 260,76 180,74 C 115,72 55,68 25,62 C 16,60 10,56 10,50 Z" fill="${color}" opacity="0.92"/>
        <path d="M 35,36 C 60,24 100,18 160,20 Q 250,22 340,20 C 390,18 430,24 468,34 C 450,36 400,30 340,28 C 260,26 180,28 110,32 C 70,34 45,38 35,36 Z" fill="${color}" opacity="0.7"/>
        <path d="M 70,22 C 110,12 160,10 230,12 Q 320,14 400,18 C 430,20 456,24 472,30 C 450,28 410,22 350,18 Q 270,14 200,16 C 140,18 95,22 70,22 Z" fill="${color}" opacity="0.45"/>
        <path d="M 22,60 C 50,72 110,80 180,82 Q 280,86 370,80 C 420,76 460,68 480,58 C 465,70 420,82 360,86 Q 270,92 170,88 C 105,86 55,78 22,60 Z" fill="${color}" opacity="0.7"/>
        <path d="M 60,78 C 100,90 160,96 230,96 Q 310,96 380,90 C 420,86 450,80 470,70 C 450,82 400,92 340,96 Q 260,100 180,98 C 120,96 80,88 60,78 Z" fill="${color}" opacity="0.45"/>
        <path d="M 150,44 Q 220,42 300,46 Q 240,48 150,44 Z" fill="#000" opacity="0.2"/>
        <path d="M 120,58 Q 210,60 300,58 Q 220,62 120,58 Z" fill="#000" opacity="0.25"/>
        <circle cx="496" cy="38" r="2.2" fill="${color}" opacity="0.8"/>
        <circle cx="488" cy="24" r="1.5" fill="${color}" opacity="0.65"/>
        <circle cx="500" cy="56" r="1.8" fill="${color}" opacity="0.7"/>
        <circle cx="484" cy="72" r="2.0" fill="${color}" opacity="0.6"/>
        <circle cx="4" cy="44" r="1.6" fill="${color}" opacity="0.6"/>
        <circle cx="8" cy="62" r="1.2" fill="${color}" opacity="0.5"/>
      </svg>`;
    }

    // Skill member cards — just inject SVG, let CSS handle show/hide
    document.querySelectorAll('.m-brush-stroke').forEach(el => {
      el.innerHTML = brushSVG('#ab47bc');
    });

    // Item rows
    document.querySelectorAll('.m-item-brush-bg').forEach(el => {
      el.innerHTML = brushSVG('#2e7d32');
    });

    // Equipment cards
    document.querySelectorAll('.eq-brush-bg').forEach(el => {
      el.innerHTML = brushSVG('#d32f2f');
    });

    // Follower entries
    document.querySelectorAll('.f-brush-bg').forEach(el => {
      el.innerHTML = brushSVG('#ef6c00');
    });

    // Calendar entries
    document.querySelectorAll('.cal-brush-bg').forEach(el => {
      el.innerHTML = brushSVG('#7cb342');
    });
  }

  // Inject on load
  injectMenuBrushSVGs();
  injectWipeSVGs();
  injectSubMenuBrushSVGs();

  // ==================== 3D EXPLOSIVE LETTER SHATTER ====================
  function triggerLetterShatter(menuItemEl) {
    shatterContainer.innerHTML = '';
    const wordEl = menuItemEl.querySelector('.m-word');
    if (!wordEl) return;

    const rect = wordEl.getBoundingClientRect();
    const text = wordEl.textContent.trim();
    const computedStyle = window.getComputedStyle(wordEl);
    const fontSize = computedStyle.fontSize;

    const letterWidth = rect.width / text.length;

    for (let i = 0; i < text.length; i++) {
      const letter = document.createElement('span');
      letter.className = 'shatter-letter';
      letter.textContent = text[i];
      letter.style.fontSize = fontSize;
      letter.style.left = (rect.left + i * letterWidth) + 'px';
      letter.style.top = rect.top + 'px';

      const tx = (Math.random() - 0.5) * 600;
      const ty = (Math.random() - 0.5) * 500 - 100;
      const tz = Math.random() * 400 + 100;
      const rx = (Math.random() - 0.5) * 720;
      const ry = (Math.random() - 0.5) * 720;
      const sc = Math.random() * 1.5 + 0.5;

      letter.style.setProperty('--tx', `${tx}px`);
      letter.style.setProperty('--ty', `${ty}px`);
      letter.style.setProperty('--tz', `${tz}px`);
      letter.style.setProperty('--rx', `${rx}deg`);
      letter.style.setProperty('--ry', `${ry}deg`);
      letter.style.setProperty('--sc', sc);

      shatterContainer.appendChild(letter);
    }

    setTimeout(() => {
      shatterContainer.innerHTML = '';
    }, 650);
  }

  // ==================== PAGE NAVIGATION ====================
  function navigateTo(pageId, pageColor) {
    if (isTransitioning || currentPage === pageId) return;
    isTransitioning = true;

    if (pageColor) {
      document.documentElement.style.setProperty('--transition-color', pageColor);
    }

    wipeBlack.className = 'wipe-black in';
    wipeColor.className = 'wipe-color in';
    if (wipeBrushSlash) wipeBrushSlash.className = 'wipe-brush-slash in';

    setTimeout(() => {
      menuScreen.classList.add('hidden');
      if (hudBR) hudBR.style.display = 'none';
      if (commandBadge) commandBadge.style.display = 'none';

      // Switch background media for specific menu if configured
      const targetBg = pageBackgrounds[pageId] || pageBackgrounds.home;
      if (bgMedia && !decodeURIComponent(bgMedia.src).endsWith(targetBg)) {
        bgMedia.src = targetBg;
      }

      pages.forEach(p => p.classList.remove('active'));
      const page = document.getElementById('page-' + pageId);
      if (page) {
        page.classList.add('active');
        page.style.setProperty('--theme', pageColor || '#d32f2f');
      }

      contentScreen.classList.add('active');
      contentScreen.scrollTop = 0;
      currentPage = pageId;

      wipeBlack.className = 'wipe-black out';
      wipeColor.className = 'wipe-color out';
      if (wipeBrushSlash) wipeBrushSlash.className = 'wipe-brush-slash out';

      setTimeout(() => {
        contentScreen.classList.add('fade-in');

        wipeBlack.className = 'wipe-black';
        wipeColor.className = 'wipe-color';
        if (wipeBrushSlash) wipeBrushSlash.className = 'wipe-brush-slash';
        isTransitioning = false;
      }, 240);
    }, 280);
  }

  function navigateHome() {
    if (isTransitioning || currentPage === null) return;
    isTransitioning = true;

    playBackSFX();

    wipeBlack.className = 'wipe-black in';
    wipeColor.className = 'wipe-color in';
    if (wipeBrushSlash) wipeBrushSlash.className = 'wipe-brush-slash in';

    setTimeout(() => {
      contentScreen.classList.remove('active', 'fade-in');
      pages.forEach(p => p.classList.remove('active'));

      // Restore default Home background media
      if (bgMedia && !decodeURIComponent(bgMedia.src).endsWith(pageBackgrounds.home)) {
        bgMedia.src = pageBackgrounds.home;
      }

      menuScreen.classList.remove('hidden');
      if (hudBR) hudBR.style.display = '';
      if (commandBadge) commandBadge.style.display = '';
      currentPage = null;

      wipeBlack.className = 'wipe-black out';
      wipeColor.className = 'wipe-color out';
      if (wipeBrushSlash) wipeBrushSlash.className = 'wipe-brush-slash out';

      setTimeout(() => {
        wipeBlack.className = 'wipe-black';
        wipeColor.className = 'wipe-color';
        if (wipeBrushSlash) wipeBrushSlash.className = 'wipe-brush-slash';
        isTransitioning = false;
      }, 240);
    }, 280);
  }

  // ==================== SKILL PAGE PARTY CARD SWITCHER ====================
  const skillSets = {
    backend: [
      { icon: '◈', elemClass: 'phys', name: 'PHP 8 & Laravel 11/12', mp: '98 PTS' },
      { icon: '◇', elemClass: 'wind', name: 'RESTful API Architecture', mp: '96 PTS' },
      { icon: '◎', elemClass: 'magic', name: 'Node.js & Express.js Backend', mp: '90 PTS' },
      { icon: '○', elemClass: 'fire', name: 'Python Scripting & Automation', mp: '88 PTS' }
    ],
    frontend: [
      { icon: '◈', elemClass: 'phys', name: 'HTML5 / CSS3 / JavaScript', mp: '94 PTS' },
      { icon: '○', elemClass: 'fire', name: 'TailwindCSS & Responsive UI/UX', mp: '96 PTS' },
      { icon: '◇', elemClass: 'wind', name: 'React.js & Next.js Interface', mp: '88 PTS' },
      { icon: '△', elemClass: 'ice', name: 'Vue.js & Laravel Blade Components', mp: '90 PTS' }
    ],
    tools: [
      { icon: '◈', elemClass: 'tool', name: 'MySQL Relational Database', mp: '96 PTS' },
      { icon: '◎', elemClass: 'magic', name: 'Antigravity IDE Workflow', mp: '98 PTS' },
      { icon: '◇', elemClass: 'wind', name: 'Git & GitHub Version Control', mp: '95 PTS' },
      { icon: '△', elemClass: 'phys', name: 'Postman API Testing & Debugging', mp: '94 PTS' }
    ]
  };

  memberCards.forEach(card => {
    card.addEventListener('click', () => {
      playHoverSFX();
      memberCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const setKey = card.dataset.skillSet;
      const skills = skillSets[setKey] || skillSets.backend;

      skillEntriesList.innerHTML = skills.map(s => `
        <div class="g-skill-row">
          <span class="g-elem-icon ${s.elemClass || 'phys'}">${s.icon}</span>
          <span class="g-skill-name">${s.name}</span>
          <span class="g-skill-mp">${s.mp}</span>
        </div>
      `).join('');
    });
  });

  // ==================== ITEM PAGE INVENTORY SWITCHER ====================
  const itemRows = document.querySelectorAll('.m-item-row');
  itemRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      playHoverSFX();
    });
    row.addEventListener('click', () => {
      playClickSFX();
      itemRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  // ==================== EQUIPMENT PAGE LOADOUT SWITCHER ====================
  const eqMemberCards = document.querySelectorAll('.eq-member-card');
  const eqTitle = document.getElementById('eqTitle');
  const eqDesc = document.getElementById('eqDesc');
  const eqSlots = document.getElementById('eqSlots');

  const eqData = [
    {
      title: 'Backend Architecture (PHP & Laravel)',
      desc: 'Fokus utama pada perancangan logika bisnis backend terstruktur menggunakan PHP 8 dan framework Laravel (versi 11/12), pembuatan endpoint RESTful API terstandarisasi, routing middleware, autentikasi data aman, dan integrasi arsitektur MVC.',
      slots: [
        { label: 'CORE RUNTIME & FRAMEWORK', name: 'PHP 8.3 & Laravel 11/12', val: 'Primary' },
        { label: 'API ARCHITECTURE', name: 'RESTful JSON Resource API', val: 'Structured' },
        { label: 'DATABASE ORM', name: 'Eloquent ORM & Migrations', val: 'Optimized' },
        { label: 'SECURITY & MIDDLEWARE', name: 'Sanctum Auth & Validation', val: 'Secured' }
      ]
    },
    {
      title: 'Database Management & Modeling (MySQL)',
      desc: 'Perancangan struktur skema basis data relasional MySQL yang terorganisir: normalisasi tabel, foreign key relations, efisiensi indexing, query builder optimization, serta migrasi skema dan factory seeding.',
      slots: [
        { label: 'RELATIONAL ENGINE', name: 'MySQL Database Server', val: 'Relational' },
        { label: 'SCHEMA DESIGN', name: 'Database Normalization & FKs', val: 'Structured' },
        { label: 'QUERY PERFORMANCE', name: 'Indexed Queries & Joins', val: 'Fast' },
        { label: 'MIGRATION TRACKING', name: 'Laravel Migrations & Seeds', val: 'Versioned' }
      ]
    },
    {
      title: 'Development Environment & Testing Tools',
      desc: 'Alur kerja modern berbasis Antigravity IDE, version control terdistribusi Git & GitHub untuk tracking kode dan kolaborasi tim, serta pengujian menyeluruh endpoint HTTP API menggunakan Postman.',
      slots: [
        { label: 'PRIMARY IDE', name: 'Antigravity IDE & Terminal CLI', val: 'Primary' },
        { label: 'VERSION CONTROL', name: 'Git & GitHub Repositories', val: 'Versioned' },
        { label: 'API DEBUG & TESTING', name: 'Postman API Testing Suite', val: 'Verified' },
        { label: 'PACKAGE MANAGERS', name: 'Composer & NPM Ecosystem', val: 'Automated' }
      ]
    },
    {
      title: 'Frontend & UI Integration (TailwindCSS)',
      desc: 'Implementasi antarmuka web modern, responsif, dan dinamis menggunakan HTML5 semantik, TailwindCSS utility classes, JavaScript DOM interaction, serta integrasi Blade templating components.',
      slots: [
        { label: 'CSS FRAMEWORK', name: 'TailwindCSS Utility System', val: 'Responsive' },
        { label: 'CORE WEB TECH', name: 'HTML5 Semantic & Vanilla CSS3', val: 'Modern' },
        { label: 'CLIENT SCRIPTING', name: 'JavaScript ES6+ & Web APIs', val: 'Dynamic' },
        { label: 'TEMPLATE INTEGRATION', name: 'Laravel Blade Components', val: 'Modular' }
      ]
    }
  ];

  eqMemberCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      playHoverSFX();
    });
    card.addEventListener('click', () => {
      playClickSFX();
      eqMemberCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const index = parseInt(card.dataset.eq, 10) || 0;
      const d = eqData[index] || eqData[0];

      if (eqTitle) eqTitle.textContent = d.title;
      if (eqDesc) eqDesc.textContent = d.desc;
      if (eqSlots) {
        eqSlots.innerHTML = d.slots.map(s => `
          <div class="eq-slot-item">
            <span class="eq-s-label">${s.label}</span>
            <strong class="eq-s-name">${s.name}</strong>
            <span class="eq-s-val">${s.val}</span>
          </div>
        `).join('');
      }
    });
  });

  // ==================== FOLLOWER INTERACTION ====================
  const followerEntries = document.querySelectorAll('.f-entry:not(.locked)');
  followerEntries.forEach(entry => {
    entry.addEventListener('mouseenter', () => {
      followerEntries.forEach(e => e.classList.remove('active'));
      entry.classList.add('active');
      playHoverSFX();
    });
    entry.addEventListener('click', () => {
      playClickSFX();
    });
  });

  // ==================== CALENDAR MILESTONES SWITCHER ====================
  const calEntries = document.querySelectorAll('.cal-entry');
  const calDYear = document.getElementById('calDYear');
  const calDTag = document.getElementById('calDTag');
  const calDTitle = document.getElementById('calDTitle');
  const calDInst = document.getElementById('calDInst');
  const calDDesc = document.getElementById('calDDesc');
  const calDComp = document.getElementById('calDComp');

  const calMilestonesData = [
    {
      year: '2024',
      tag: 'FORMAL EDUCATION',
      title: 'REKAYASA PERANGKAT LUNAK',
      inst: 'SMK Telkom 1 Medan • Periode 2024 — 2026',
      desc: 'Menempuh pendidikan vokasi kejuruan Rekayasa Perangkat Lunak (RPL) di SMK Telkom 1 Medan dengan fokus pembelajaran mendalam pada Logika Algoritma, Pemrograman Backend, Basis Data MySQL, Pemrograman Berorientasi Objek (OOP), dan Pengembangan Web Modern.',
      comp: ['Rekayasa Perangkat Lunak', 'PHP & Laravel', 'MySQL Database', 'REST API', 'Git & GitHub']
    },
    {
      year: '2024',
      tag: 'INTERNSHIP EXPERIENCE',
      title: 'IT INTERN (BACKEND ENGINEER)',
      inst: 'Politeknik Wilmar Bisnis Indonesia (WBI) • IT Department',
      desc: 'Melaksanakan Praktik Kerja Lapangan (PKL) sebagai Backend Engineer di Politeknik Wilmar Bisnis Indonesia. Bertanggung jawab merancang arsitektur API, integrasi basis data MySQL, dan membangun website donasi buku perpustakaan WilmarBooks.',
      comp: ['Backend Architecture', 'Laravel Framework', 'MySQL Integration', 'RESTful API', 'Production Deployment']
    },
    {
      year: '2025',
      tag: 'TECHNICAL MASTERY',
      title: 'BACKEND & API MASTERY',
      inst: 'Advanced Full-Scale Backend Development Track',
      desc: 'Pengembangan berkelanjutan dalam merancang arsitektur server terdistribusi, pembuatan REST API dengan performa tinggi, sistem autentikasi aman, dan pemodelan database relational kompleks.',
      comp: ['Laravel 11/12', 'Database Normalization', 'API Security', 'Clean Code MVC', 'TailwindCSS']
    },
    {
      year: '2026',
      tag: 'FUTURE HORIZON',
      title: 'GRADUATION & CAREER HORIZON',
      inst: 'Future Career in Professional Backend & Software Engineering',
      desc: 'Target kelulusan dari SMK Telkom 1 Medan dengan portofolio backend kuat dan kesiapan penuh untuk berkontribusi dalam industri teknologi skala profesional dan enterprise.',
      comp: ['Professional Software Engineering', 'Enterprise Backend', 'System Scalability', 'Collaboration']
    }
  ];

  calEntries.forEach(entry => {
    entry.addEventListener('mouseenter', () => {
      playHoverSFX();
    });
    entry.addEventListener('click', () => {
      playClickSFX();
      calEntries.forEach(e => e.classList.remove('active'));
      entry.classList.add('active');

      const index = parseInt(entry.dataset.cal, 10) || 0;
      const m = calMilestonesData[index] || calMilestonesData[0];

      if (calDYear) calDYear.textContent = m.year;
      if (calDTag) calDTag.textContent = m.tag;
      if (calDTitle) calDTitle.textContent = m.title;
      if (calDInst) calDInst.textContent = m.inst;
      if (calDDesc) calDDesc.textContent = m.desc;
      if (calDComp) {
        calDComp.innerHTML = m.comp.map(c => `<span>${c}</span>`).join('');
      }
    });
  });

  // ==================== FLOATING INK PARTICLES ENGINE ====================
  const inkCanvas = document.getElementById('inkCanvas');
  if (inkCanvas) {
    const ctx = inkCanvas.getContext('2d');
    let width = (inkCanvas.width = window.innerWidth);
    let height = (inkCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = inkCanvas.width = window.innerWidth;
      height = inkCanvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;
    const colors = [
      'rgba(211, 47, 47, 0.45)',
      'rgba(251, 192, 45, 0.35)',
      'rgba(171, 71, 188, 0.35)',
      'rgba(255, 255, 255, 0.25)',
      'rgba(2, 136, 209, 0.35)'
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4 - 0.2,
        vy: -Math.random() * 0.6 - 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function renderInkParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx + Math.sin(p.angle) * 0.3;
        p.y += p.vy;
        p.angle += p.angularSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      requestAnimationFrame(renderInkParticles);
    }
    renderInkParticles();
  }

  // ==================== MAIN MENU EVENTS & COMMAND BADGE ====================
  menuItems.forEach(item => {
    function handleHover() {
      playHoverSFX();

      const num = item.dataset.num;
      if (num) {
        const d0 = num.charAt(0) || '0';
        const d1 = num.charAt(1) || '1';

        if (cmdDigitZeroSvg) cmdDigitZeroSvg.textContent = d0;
        if (cmdDigitValSvg) {
          cmdDigitValSvg.textContent = d1;
          cmdDigitValSvg.style.opacity = '0.4';
          setTimeout(() => { cmdDigitValSvg.style.opacity = '1'; }, 90);
        }

        if (commandBadge) {
          commandBadge.classList.remove('bump');
          void commandBadge.offsetWidth; // Force reflow
          commandBadge.classList.add('bump');
        }
      }
    }

    item.addEventListener('mouseenter', handleHover);
    item.addEventListener('focus', handleHover);

    item.addEventListener('click', () => {
      playEnterSFX();
      triggerLetterShatter(item);

      const pageId = item.dataset.page;
      const pageColor = item.dataset.color;
      navigateTo(pageId, pageColor);
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Global Keyboard RPG Navigation
  let focusedMenuIndex = 0;
  document.addEventListener('keydown', e => {
    // If inside a sub-menu and Escape or Backspace pressed, return to main menu
    if (currentPage !== null) {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        navigateHome();
        return;
      }

      // Keyboard navigation inside sub-menus (ArrowUp / ArrowDown)
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'w') {
        const activePageEl = document.getElementById('page-' + currentPage);
        if (!activePageEl) return;

        const subItems = activePageEl.querySelectorAll('.m-item-row, .member-card, .eq-member-card, .cal-entry, .f-entry');
        if (subItems.length > 0) {
          e.preventDefault();
          let currentSubIndex = Array.from(subItems).findIndex(el => el.classList.contains('active'));
          if (currentSubIndex === -1) currentSubIndex = 0;

          if (e.key === 'ArrowDown' || e.key === 's') {
            currentSubIndex = (currentSubIndex + 1) % subItems.length;
          } else {
            currentSubIndex = (currentSubIndex - 1 + subItems.length) % subItems.length;
          }

          subItems[currentSubIndex].click();
          subItems[currentSubIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      return;
    }

    // Main Menu Keyboard Navigation
    if (e.key === 'ArrowDown' || e.key === 's') {
      e.preventDefault();
      focusedMenuIndex = (focusedMenuIndex + 1) % menuItems.length;
      menuItems[focusedMenuIndex].focus();
      menuItems[focusedMenuIndex].dispatchEvent(new Event('mouseenter'));
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
      e.preventDefault();
      focusedMenuIndex = (focusedMenuIndex - 1 + menuItems.length) % menuItems.length;
      menuItems[focusedMenuIndex].focus();
      menuItems[focusedMenuIndex].dispatchEvent(new Event('mouseenter'));
    } else if (e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key, 10) - 1;
      if (menuItems[idx]) {
        e.preventDefault();
        focusedMenuIndex = idx;
        menuItems[idx].focus();
        menuItems[idx].click();
      }
    }
  });

  // Back Button
  backBtn.addEventListener('click', navigateHome);
  backBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateHome();
    }
  });

  // ==================== PROCEDURAL EDITORIAL DISTRESSED COLLAGE ENGINE ====================
  // Generates unpredictable, subtle semi-transparent paper/ink/print overlays
  // that flash into view at irregular intervals and locations without glow/particles.
  function initEditorialCollage() {
    if (!collageLayer) return;

    const shapeClasses = [
      'c-paper-tear',
      'c-paint-wash',
      'c-stencil-text',
      'c-chalk-hatch',
      'c-geometric-shard',
      'c-halftone-bar',
      'c-frame-crop'
    ];

    const stencilWords = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09',
      'COMMAND', 'REFANTAZIO', 'ARCHETYPE', 'EXP', 'MAG', 'STR',
      'LV.99', '技・スキル', '命', '斬', '魔', 'IV', 'VIII'
    ];

    function spawnCollageShape() {
      // Keep max 4 shapes on screen simultaneously
      if (collageLayer.childElementCount >= 4) return;

      const el = document.createElement('div');
      const shapeType = shapeClasses[Math.floor(Math.random() * shapeClasses.length)];
      el.className = `collage-shape ${shapeType}`;

      if (shapeType === 'c-stencil-text') {
        el.textContent = stencilWords[Math.floor(Math.random() * stencilWords.length)];
      }

      // Random sizes: large diffuse or sharp angular
      const isLarge = Math.random() > 0.55;
      const width = isLarge ? Math.floor(Math.random() * 320 + 180) : Math.floor(Math.random() * 160 + 60);
      const height = isLarge ? Math.floor(Math.random() * 220 + 100) : Math.floor(Math.random() * 90 + 30);

      // Random viewport position
      const left = Math.floor(Math.random() * 88);
      const top = Math.floor(Math.random() * 85);

      // Random rotation and high-impact semi-transparent opacity (0.14 - 0.32)
      const rot = Math.floor(Math.random() * 80 - 40);
      const opacity = (Math.random() * 0.18 + 0.14).toFixed(3);

      if (shapeType !== 'c-stencil-text') {
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      }
      el.style.left = `${left}vw`;
      el.style.top = `${top}vh`;
      el.style.setProperty('--cr', `${rot}deg`);
      el.style.setProperty('--c-op', opacity);
      el.style.setProperty('--cx', `${Math.floor(Math.random() * 30 - 15)}px`);
      el.style.setProperty('--cy', `${Math.floor(Math.random() * 30 - 15)}px`);

      collageLayer.appendChild(el);

      // Remove immediately after flash animation completes (380ms)
      setTimeout(() => {
        if (el.parentNode === collageLayer) {
          collageLayer.removeChild(el);
        }
      }, 400);
    }

    // Irregular flashing loop
    function scheduleNextCollage() {
      const nextDelay = Math.floor(Math.random() * 350 + 180); // 180ms - 530ms
      setTimeout(() => {
        spawnCollageShape();
        if (Math.random() > 0.45) {
          // Occasionally spawn a rapid pair of shapes
          setTimeout(spawnCollageShape, 70);
        }
        scheduleNextCollage();
      }, nextDelay);
    }

    scheduleNextCollage();
  }

  initEditorialCollage();

});

