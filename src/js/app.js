/**
 * DREAD ELEVEN (DE) — OFFICIAL DIGITAL STADIUM & BROADCAST PLATFORM
 * Captain: Akhil Mishra (#1) | Atal Bihari Vajpayee Memorial Trophy, Rewa (RDCA)
 * Strict Constraint: ABSOLUTELY ZERO BLUE. Pitch Void (#050505) & Acid Volt (#d7ff00).
 * 
 * Engines:
 * 1. Procedural 24fps Film Grain & Analog Noise Foreground Canvas
 * 2. Film Grain Toggle HUD Controller
 * 3. Interactive Cursor Spotlight Tracker & Acceleration
 * 4. Next Derby Match Live Countdown Clock
 * 5. Multi-Tier Season & Format Filter Engine
 * 6. Squad Role Filter & Real-Time Search
 * 7. Mobile Navigation Drawer Controller
 * 8. Command Palette (⌘K / Ctrl+K / Search Dock)
 * 9. Matchday Mode Broadcast Simulator (Live vs Archive)
 * 10. Ball-by-Ball Commentary & Over-Ball Interactive Timeline
 * 11. Season 2026 Horizontal Timeline Scroller & Match Drawers
 * 12. Scorecard Tab Controller (Scorecard / Commentary / Squads / Analytics)
 */

document.addEventListener('DOMContentLoaded', () => {
  initProceduralFilmGrain();
  initGrainToggle();
  initCursorSpotlight();
  initLiveCountdown();
  initMatchFilters();
  initSquadRoleFilter();
  initMobileMenu();
  initCommandPalette();
  initMatchdayMode();
  initBallTimeline();
  initSeasonTimeline();
  initScorecardTabs();
  initStadiumAudio();
});

/* ==========================================================================
   1. PROCEDURAL 24FPS FILM GRAIN & NOISE FOREGROUND CANVAS
   ========================================================================== */
function initProceduralFilmGrain() {
  const canvas = document.getElementById('film-grain-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const patternSize = 256;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = patternSize;
  patternCanvas.height = patternSize;
  const patternCtx = patternCanvas.getContext('2d');

  const noiseTiles = [];
  const totalTiles = 6;

  for (let t = 0; t < totalTiles; t++) {
    const imgData = patternCtx.createImageData(patternSize, patternSize);
    const data = imgData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = (Math.random() * 45 + 20) | 0; // High-density grain
    }

    noiseTiles.push(imgData);
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let frame = 0;
  let lastTime = performance.now();
  const fpsInterval = 1000 / 24; // 24fps cinematic shutter rate

  function render(now) {
    requestAnimationFrame(render);

    const elapsed = now - lastTime;
    if (elapsed < fpsInterval) return;
    lastTime = now - (elapsed % fpsInterval);

    frame = (frame + 1) % totalTiles;
    patternCtx.putImageData(noiseTiles[frame], 0, 0);

    ctx.clearRect(0, 0, width, height);
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
    }
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   2. FILM GRAIN TOGGLE HUD CONTROLLER
   ========================================================================== */
function initGrainToggle() {
  const toggleBtn = document.getElementById('grain-toggle-btn');
  const canvas = document.getElementById('film-grain-canvas');
  if (!toggleBtn || !canvas) return;

  let isEnabled = true;

  toggleBtn.addEventListener('click', () => {
    isEnabled = !isEnabled;
    if (isEnabled) {
      canvas.style.display = 'block';
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '<span>GRAIN: 35MM [ON]</span>';
    } else {
      canvas.style.display = 'none';
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '<span>GRAIN: OFF</span>';
    }
  });
}

/* ==========================================================================
   3. INTERACTIVE CURSOR SPOTLIGHT TRACKER
   ========================================================================== */
function initCursorSpotlight() {
  let ticking = false;

  window.addEventListener('pointermove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   4. NEXT DERBY MATCH LIVE COUNTDOWN CLOCK
   ========================================================================== */
function initLiveCountdown() {
  const daysEl = document.getElementById('hud-days');
  const hoursEl = document.getElementById('hud-hours');
  const minsEl = document.getElementById('hud-mins');
  const secsEl = document.getElementById('hud-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const targetDate = new Date('2026-09-06T09:30:00+05:30').getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. MULTI-TIER FORMAT & SEASON FILTER ENGINE
   ========================================================================== */
function initMatchFilters() {
  const formatButtons = document.querySelectorAll('.format-filter-pill');
  const seasonButtons = document.querySelectorAll('.season-filter-pill');
  const searchInput = document.getElementById('match-search-field');
  const matchCards = document.querySelectorAll('.match-card');
  const countEl = document.getElementById('visible-matches-count');

  if (!matchCards.length) return;

  let activeFormat = 'all';
  let activeSeason = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    matchCards.forEach((card) => {
      const fmt = (card.getAttribute('data-format') || '').toUpperCase();
      const season = card.getAttribute('data-season') || '';
      const text = card.textContent.toLowerCase();

      const formatMatches =
        activeFormat === 'all' ||
        (activeFormat === 'ODI' && (fmt.includes('ODI') || fmt.includes('ONE-DAY'))) ||
        (activeFormat === 'T20' && fmt.includes('T20'));

      const seasonMatches = activeSeason === 'all' || season === activeSeason;
      const searchMatches = !searchQuery || text.includes(searchQuery);

      if (formatMatches && seasonMatches && searchMatches) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) {
      countEl.textContent = visibleCount;
    }
  }

  formatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      formatButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFormat = btn.getAttribute('data-format') || 'all';
      applyFilters();
    });
  });

  seasonButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      seasonButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeSeason = btn.getAttribute('data-season') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

/* ==========================================================================
   6. SQUAD ROLE FILTER & REAL-TIME SEARCH
   ========================================================================== */
function initSquadRoleFilter() {
  const roleButtons = document.querySelectorAll('.role-filter-pill');
  const playerCards = document.querySelectorAll('.jersey-player-card, .fifa-player-card');
  if (!roleButtons.length || !playerCards.length) return;

  roleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const targetRole = btn.getAttribute('data-role');

      playerCards.forEach((card) => {
        const cardRole = (card.getAttribute('data-role') || '').toLowerCase();
        let show = false;

        if (targetRole === 'all') {
          show = true;
        } else if (targetRole === 'captain') {
          show = cardRole.includes('captain') || cardRole.includes('all-rounder');
        } else if (targetRole === 'bat') {
          show = cardRole.includes('batter') || cardRole.includes('bat');
        } else if (targetRole === 'bowl') {
          show = cardRole.includes('bowler') || cardRole.includes('bowl');
        } else if (targetRole === 'wicket') {
          show = cardRole.includes('wicket');
        }

        card.style.display = show ? 'flex' : 'none';
      });
    });
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION DRAWER CONTROLLER
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    drawer.style.display = isExpanded ? 'none' : 'flex';
  });
}

/* ==========================================================================
   8. COMMAND PALETTE (⌘K / Ctrl+K / Search Trigger)
   ========================================================================== */
function initCommandPalette() {
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');
  const openButtons = document.querySelectorAll('.cmd-palette-trigger');
  const closeButton = document.getElementById('cmd-palette-close');

  if (!palette || !input || !resultsContainer) return;

  function openPalette() {
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    input.value = '';
    input.focus();
    renderResults('');
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Keyboard shortcut: Cmd+K, Ctrl+K, or Slash
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
    } else if (e.key === 'Escape' && palette.classList.contains('open')) {
      closePalette();
    }
  });

  openButtons.forEach(btn => btn.addEventListener('click', openPalette));
  if (closeButton) closeButton.addEventListener('click', closePalette);

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  // Sample static search registry
  const searchRegistry = [
    { type: 'Quick Action', title: 'Home Arena & Digital Stadium', url: '/', icon: '⌂' },
    { type: 'Quick Action', title: 'Squad Command Center (43 Players)', url: '/players/', icon: '♟' },
    { type: 'Quick Action', title: '2026 Fixture Schedule & Tickets', url: '/fixtures/', icon: '📅' },
    { type: 'Quick Action', title: 'All-Time DE vs DES Derby Results', url: '/results/', icon: '🏆' },
    { type: 'Quick Action', title: 'League Points Table & Scenarios', url: '/points-table/', icon: '📊' },
    { type: 'Quick Action', title: 'Team Analytics & Record Books', url: '/stats/', icon: '📈' },
    { type: 'Player', title: 'Akhil Mishra (#1) — Captain & Top-Order Batter', url: '/players/akhil-mishra/', icon: '⚡' },
    { type: 'Player', title: 'Ritesh Shakya (#7) — Explosive Finisher', url: '/players/ritesh-shakya/', icon: '⚡' },
    { type: 'Player', title: 'Kuldeep Sen (#99) — Express Pace Bowler', url: '/players/kuldeep-sen/', icon: '⚡' },
    { type: 'Player', title: 'Venkatesh Iyer (#23) — Pace All-Rounder', url: '/players/venkatesh-iyer/', icon: '⚡' },
    { type: 'Player', title: 'Rajat Patidar (#9) — Top-Order Batter', url: '/players/rajat-patidar/', icon: '⚡' },
    { type: 'Player', title: 'Kumar Kartikeya (#31) — Slow Left-Arm Spinner', url: '/players/kumar-kartikeya/', icon: '⚡' },
    { type: 'Match', title: 'Championship Derby: DE vs DES (14 Feb 2026) — DE Won by 5 Wickets', url: '/matches/destroyers-vs-dread-eleven-2026-02-14/', icon: '🏏' },
    { type: 'Match', title: 'Historic Thriller: DE vs DES (05 Sep 2023) — DE Won by 84 Runs', url: '/matches/destroyers-vs-dread-eleven-2023-09-05/', icon: '🏏' },
    { type: 'Match', title: 'Inaugural Derby: DE vs DES (01 Aug 2021) — DE Won by 3 Wickets', url: '/matches/destroyers-vs-dread-eleven-2021-08-01/', icon: '🏏' },
    { type: 'News', title: 'Akhil Mishra Masterclass Clinches Rewa Derby', url: '/news/akhil-mishra-masterclass-chase-destroyers-2024/', icon: '📰' },
    { type: 'News', title: 'Tactical Blueprint: Death Overs Bowling Mastery', url: '/news/death-overs-bowling-masterclass-rewa-2025/', icon: '📰' }
  ];

  function renderResults(q) {
    const query = q.toLowerCase().trim();
    const filtered = query
      ? searchRegistry.filter(item => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query))
      : searchRegistry.slice(0, 8);

    if (!filtered.length) {
      resultsContainer.innerHTML = `
        <div class="cmd-no-results">
          <p>No matches found for "<strong>${q}</strong>". Try searching for <em>Akhil</em>, <em>Derby</em>, or <em>Squad</em>.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map((item, idx) => `
      <a href="${item.url}" class="cmd-result-item ${idx === 0 ? 'focused' : ''}">
        <span class="cmd-item-icon">${item.icon}</span>
        <div class="cmd-item-text">
          <span class="cmd-item-title">${item.title}</span>
          <span class="cmd-item-type">${item.type}</span>
        </div>
        <span class="cmd-item-enter">↵</span>
      </a>
    `).join('');
  }

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });
}

/* ==========================================================================
   9. MATCHDAY MODE BROADCAST SIMULATOR (Live vs Archive)
   ========================================================================== */
function initMatchdayMode() {
  const toggleBtn = document.getElementById('matchday-mode-toggle');
  const livePulseStrip = document.getElementById('live-pulse-container');
  const heroTag = document.getElementById('hero-broadcast-tag');

  if (!toggleBtn || !livePulseStrip) return;

  let isMatchday = localStorage.getItem('de-matchday-mode') === 'true';

  function applyMatchdayState() {
    if (isMatchday) {
      document.body.classList.add('matchday-active');
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '<span class="pulse-beacon red"></span><span>MATCHDAY: LIVE ON AIR</span>';

      livePulseStrip.innerHTML = `
        <div class="live-broadcast-banner">
          <div class="broadcast-live-badge">
            <span class="pulse-beacon red"></span>
            <strong>LIVE BROADCAST</strong>
          </div>
          <div class="broadcast-score-line">
            <div class="team-score-block batting">
              <span class="team-code">DREAD ELEVEN</span>
              <span class="score-main">174/4</span>
              <span class="overs-text">(18.2 OV)</span>
            </div>
            <div class="match-vs-divider">VS</div>
            <div class="team-score-block">
              <span class="team-code">DESTROYERS CC</span>
              <span class="score-main">171/8</span>
              <span class="overs-text">(20.0 OV)</span>
            </div>
          </div>
          <div class="broadcast-target-chip">
            <span>TARGET: 172 • DREAD ELEVEN WON BY 6 WICKETS</span>
          </div>
          <a href="/matches/destroyers-vs-dread-eleven-2026-02-14/" class="btn-athletic btn-sm btn-glow">
            <span>ENTER LIVE STADIUM →</span>
          </a>
        </div>
      `;
    } else {
      document.body.classList.remove('matchday-active');
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '<span class="pulse-beacon"></span><span>MATCHDAY: OFF-AIR</span>';

      livePulseStrip.innerHTML = `
        <div class="live-broadcast-banner upcoming">
          <div class="broadcast-live-badge">
            <span class="pulse-beacon"></span>
            <strong>NEXT DERBY CLASH</strong>
          </div>
          <div class="broadcast-score-line">
            <div class="team-score-block">
              <span class="team-code">DREAD ELEVEN</span>
            </div>
            <div class="match-vs-divider">VS</div>
            <div class="team-score-block">
              <span class="team-code">DESTROYERS CC</span>
            </div>
          </div>
          <div class="broadcast-target-chip">
            <span>06 SEP 2026 • 09:30 IST • APSU STADIUM, REWA</span>
          </div>
          <a href="/fixtures/" class="btn-athletic btn-sm btn-volt">
            <span>MATCH CENTRE & TICKETS →</span>
          </a>
        </div>
      `;
    }
  }

  applyMatchdayState();

  toggleBtn.addEventListener('click', () => {
    isMatchday = !isMatchday;
    localStorage.setItem('de-matchday-mode', isMatchday);
    applyMatchdayState();
  });
}

/* ==========================================================================
   10. BALL-BY-BALL COMMENTARY & OVER-BALL TIMELINE
   ========================================================================== */
function initBallTimeline() {
  const ballPills = document.querySelectorAll('.ball-timeline-pill');
  const commentaryItems = document.querySelectorAll('.commentary-item');

  if (!ballPills.length || !commentaryItems.length) return;

  ballPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      ballPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetBall = pill.getAttribute('data-ball');
      commentaryItems.forEach(item => {
        if (item.getAttribute('data-ball') === targetBall) {
          item.classList.add('highlighted');
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          item.classList.remove('highlighted');
        }
      });
    });
  });
}

/* ==========================================================================
   11. SEASON HORIZONTAL TIMELINE SCROLLER
   ========================================================================== */
function initSeasonTimeline() {
  const timelineTrack = document.getElementById('season-timeline-track');
  const prevBtn = document.getElementById('timeline-prev-btn');
  const nextBtn = document.getElementById('timeline-next-btn');

  if (!timelineTrack || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    timelineTrack.scrollBy({ left: -320, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    timelineTrack.scrollBy({ left: 320, behavior: 'smooth' });
  });
}

/* ==========================================================================
   12. SCORECARD TAB CONTROLLER (Scorecard / Commentary / Squads / Analytics)
   ========================================================================== */
function initScorecardTabs() {
  const tabButtons = document.querySelectorAll('.scorecard-tab-btn');
  const tabPanes = document.querySelectorAll('.scorecard-tab-pane');

  if (!tabButtons.length || !tabPanes.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const pane = document.getElementById(`tab-pane-${target}`);
      if (pane) {
        pane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   13. noth.in INSPIRED STADIUM AUDIO ENGINE (Web Audio API Synthesizer)
   ========================================================================== */
function initStadiumAudio() {
  const soundBtn = document.getElementById('stadium-sound-btn');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let noiseNode = null;
  let gainNode = null;

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Generate brown noise buffer for realistic stadium atmospheric roar
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 260;
      filter.Q.value = 2.5;

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 1.2);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      noiseNode.start();

      isPlaying = true;
      soundBtn.classList.add('active');
      const statusText = soundBtn.querySelector('.sound-status-text');
      if (statusText) statusText.textContent = 'STADIUM SOUND: ON';
    } else {
      if (gainNode && audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        setTimeout(() => {
          if (noiseNode) {
            try { noiseNode.stop(); } catch(e) {}
          }
        }, 400);
      }
      isPlaying = false;
      soundBtn.classList.remove('active');
      const statusText = soundBtn.querySelector('.sound-status-text');
      if (statusText) statusText.textContent = 'STADIUM SOUND: OFF';
    }
  });
}
