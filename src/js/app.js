/**
 * DREAD ELEVEN (DE) — OFFICIAL CRICKET FRANCHISE INTERACTIVE ENGINE
 * Captain: Akhil Mishra (#1) | Atal Bihari Vajpayee Memorial Tournament, Rewa
 * Strict Constraint: ABSOLUTELY ZERO BLUE. Pitch Void & Acid Volt (#d4ff00).
 * 
 * 1. Procedural 24fps Film Grain & Noise Foreground Canvas
 * 2. Film Grain Toggle HUD Pill
 * 3. Interactive Cursor Spotlight Tracker
 * 4. Next Derby Match Live Countdown Clock
 * 5. Multi-Tier Season & Format Filter Engine
 * 6. Squad Role Filter & Real-Time Search
 * 7. Mobile Navigation Drawer Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initProceduralFilmGrain();
  initGrainToggle();
  initCursorSpotlight();
  initLiveCountdown();
  initMatchFilters();
  initSquadRoleFilter();
  initMobileMenu();
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
      data[i + 3] = (Math.random() * 45 + 18) | 0; // High-density grain
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
  const playerCards = document.querySelectorAll('.jersey-player-card');
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
