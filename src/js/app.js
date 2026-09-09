/**
 * DREAD ELEVEN (DE) — HIGH-PERFORMANCE INTERACTIVE ENGINE
 * Features:
 * 1. Interactive Cursor-Gravity Particle Constellation Canvas (60fps)
 * 2. 3D Tilt Physics on Cards
 * 3. Animated Number Rollups (CountUp on Viewport Entry)
 * 4. ESPNcricinfo Interactive Tab Controller (Scorecard / Match Info)
 * 5. Format & Season Filter for One Day & T20 Fixtures
 * 6. Squad Role Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  init3DCardTilt();
  initNumberCounters();
  initScorecardTabs();
  initMatchFilters();
  initSquadRoleFilter();
});

/* ==========================================================================
   1. INTERACTIVE CURSOR-GRAVITY PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;

  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(255, 255, 255,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. 3D TILT PHYSICS ON CARDS
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.tilt-card, .player-card, .hero-telemetry-panel');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS (COUNTUP ON ENTRY)
   ========================================================================== */
function initNumberCounters() {
  const counterElements = document.querySelectorAll('[data-count]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseFloat(target.getAttribute('data-count'));
        const isFloat = target.getAttribute('data-count').includes('.');
        const duration = 1200;
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = easeProgress * targetVal;

          target.textContent = isFloat ? currentVal.toFixed(2) : Math.floor(currentVal);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            target.textContent = isFloat ? targetVal.toFixed(2) : targetVal;
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. ESPNcricinfo INTERACTIVE TABS CONTROLLER (Scorecard / Match Info)
   ========================================================================== */
function initScorecardTabs() {
  const tabButtons = document.querySelectorAll('.espn-tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tabContents = document.querySelectorAll('.espn-tab-content');
      tabContents.forEach((content) => {
        if (content.id === targetId) {
          content.style.display = 'block';
          content.style.opacity = '0';
          setTimeout(() => {
            content.style.transition = 'opacity 0.2s ease';
            content.style.opacity = '1';
          }, 10);
        } else {
          content.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. FORMAT & SEASON FILTER FOR ONE DAY & T20 FIXTURES
   ========================================================================== */
function initMatchFilters() {
  const formatButtons = document.querySelectorAll('.format-filter-btn');
  const seasonButtons = document.querySelectorAll('.season-filter-btn');
  const matchCards = document.querySelectorAll('.match-fixture-card');
  if (!matchCards.length) return;

  let activeFormat = 'all';
  let activeSeason = 'all';

  function applyFilters() {
    let visibleCount = 0;
    matchCards.forEach((card) => {
      const format = (card.getAttribute('data-format') || '').toUpperCase();
      const season = card.getAttribute('data-season') || '';

      const matchFormat = activeFormat === 'all' || 
        (activeFormat === 'T20' && format.includes('T20')) || 
        (activeFormat === 'ODI' && (format.includes('ODI') || format.includes('ONE-DAY')));

      const matchSeason = activeSeason === 'all' || season === activeSeason;

      if (matchFormat && matchSeason) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    const countDisplay = document.getElementById('filter-matches-count');
    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }
  }

  formatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      formatButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFormat = btn.getAttribute('data-format');
      applyFilters();
    });
  });

  seasonButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      seasonButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeSeason = btn.getAttribute('data-season');
      applyFilters();
    });
  });
}

/* ==========================================================================
   6. SQUAD ROLE FILTER
   ========================================================================== */
function initSquadRoleFilter() {
  const filterBtns = document.querySelectorAll('#squad-filter-controls .role-btn');
  const cards = document.querySelectorAll('#players-grid .player-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const role = card.getAttribute('data-role') || '';
        if (filter === 'all' || role.toLowerCase().includes(filter.toLowerCase())) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}
