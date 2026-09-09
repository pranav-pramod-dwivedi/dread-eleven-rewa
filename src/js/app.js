/**
 * DREAD ELEVEN (DE) — CYBER RADAR & TELEMETRY ENGINE
 * 60fps HTML5 Canvas Radar Pulse & Quantum Constellation
 */

(function () {
  'use strict';

  // 1. Radar Constellation Canvas
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const nodes = [];
    const NODE_COUNT = 45;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    let angle = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw nodes and connective cyber telemetry lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        ctx.fillStyle = `rgba(0, 240, 255, ${n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 130) * 0.15})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(render);
    }

    render();
  }

  // 2. Countdown Timer
  function initCountdown() {
    const targetDate = new Date("2025-09-10T14:00:00+05:30").getTime();
    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    const sEl = document.getElementById("cd-secs");
    if (!dEl || !hEl || !mEl || !sEl) return;

    function update() {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      dEl.textContent = days;
      hEl.textContent = String(hours).padStart(2, "0");
      mEl.textContent = String(mins).padStart(2, "0");
      sEl.textContent = String(secs).padStart(2, "0");
    }
    update();
    setInterval(update, 1000);
  }

  // 3. Squad Role Filter
  function initSquadFilter() {
    const container = document.getElementById("squad-filter-controls");
    const grid = document.getElementById("players-grid");
    if (!container || !grid) return;

    const buttons = container.querySelectorAll(".role-btn");
    const cards = grid.querySelectorAll(".cyber-player-card");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("btn-cyber-primary");
          b.classList.add("btn-cyber-outline");
        });
        btn.classList.remove("btn-cyber-outline");
        btn.classList.add("btn-cyber-primary");

        const filter = btn.getAttribute("data-filter");
        cards.forEach((card) => {
          const role = card.getAttribute("data-role") || "";
          if (filter === "all" || role.toLowerCase().includes(filter.toLowerCase())) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    initSquadFilter();
  });
})();
