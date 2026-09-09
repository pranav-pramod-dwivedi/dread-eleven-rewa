/**
 * DREAD ELEVEN (DE) — AWWWARDS SITE OF THE YEAR INTERACTIVE ENGINE
 * 
 * 1. Kinetic Fluid Aura & Velocity Shockwave Mesh Canvas (60fps)
 * 2. Specular 3D Gyroscopic Tilt & Spotlight Glare
 * 3. Animated Number Rollups (countUp on viewport entry)
 * 4. Multi-Dimensional One Day & T20 Format & Season Filter
 * 5. ESPNcricinfo Interactive Tab Controller
 * 6. Squad Role Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  initKineticFluidCanvas();
  init3DSpecularTilt();
  initNumberCounters();
  initScorecardTabs();
  initMatchFilters();
  initSquadRoleFilter();
});

/* ==========================================================================
   1. KINETIC FLUID AURA & VELOCITY SHOCKWAVE MESH CANVAS
   ========================================================================== */
function initKineticFluidCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let ripples = [];
  let nodes = [];
  const nodeCount = window.innerWidth < 768 ? 25 : 55;

  let mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    lastX: -1000,
    lastY: -1000,
    speed: 0,
    radius: 190
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    const dx = e.clientX - mouse.lastX;
    const dy = e.clientY - mouse.lastY;
    mouse.speed = Math.sqrt(dx * dx + dy * dy);
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;

    // High velocity trigger shockwave ripple
    if (mouse.speed > 28 && ripples.length < 6) {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.min(mouse.speed * 4, 180),
        alpha: 0.35,
        speed: 4.5
      });
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
    mouse.speed = 0;
  });

  class KineticNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseRadius = Math.random() * 2 + 1;
      this.radius = this.baseRadius;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.02;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Cursor spring repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 4;
        this.y -= (dy / dist) * force * 4;
        this.radius = this.baseRadius * 1.5;
      } else {
        this.radius = this.baseRadius;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 255, 0, ${0.4 + Math.sin(this.phase) * 0.2})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#d4ff00';
      ctx.fill();
    }
  }

  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new KineticNode());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth cursor interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Ambient radial aura at cursor
    if (mouse.x > 0 && mouse.y > 0) {
      const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 320);
      aura.addColorStop(0, 'rgba(212, 255, 0, 0.06)');
      aura.addColorStop(0.5, 'rgba(212, 255, 0, 0.015)');
      aura.addColorStop(1, 'rgba(5, 5, 7, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);
    }

    // Render shockwave ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += rip.speed;
      rip.alpha -= 0.008;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        ripples.splice(r, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(212, 255, 0, ${rip.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#d4ff00';
      ctx.stroke();
    }

    // Connect node lattice lines
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(212, 255, 0, ${0.15 * (1 - dist / 120)})`;
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
   2. SPECULAR 3D GYROSCOPIC TILT & SPOTLIGHT GLARE
   ========================================================================== */
function init3DSpecularTilt() {
  const cards = document.querySelectorAll('.tilt-card, .match-card, .player-card, .monument-stage-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   3. ANIMATED NUMBER ROLLUPS (COUNTUP)
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
   4. ESPNcricinfo INTERACTIVE TAB CONTROLLER
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
   5. MULTI-DIMENSIONAL FORMAT & SEASON FILTER
   ========================================================================== */
function initMatchFilters() {
  const formatButtons = document.querySelectorAll('.format-filter-btn');
  const seasonButtons = document.querySelectorAll('.season-filter-btn');
  const matchCards = document.querySelectorAll('.match-card');
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
