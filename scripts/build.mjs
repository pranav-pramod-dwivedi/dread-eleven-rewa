/**
 * PRODUCTION STATIC SITE GENERATOR (SSG) FOR DREAD ELEVEN (DE)
 * Generates 100% pre-rendered, SEO-optimized, accessible HTML pages.
 * Captain: Akhil Mishra (1,342 runs, 14 wickets in derby clashes)
 * Arch-rivals: Destroyers Cricket Club (DES), led by Pranav Dwivedi
 * Atal Bihari Vajpayee Memorial Tournament • Rewa Division (RDCA)
 * Design Direction: Awwwards-winning Athletic Brutalist / $4k Studio Quality
 * Strict Rule: ZERO BLUE. Pitch Void, Acid Volt (#d4ff00), & Trophy Gold.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.SITE_URL || 'https://dreadeleven.in';

// Load Datasets
const tournament = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/tournament.json'), 'utf8'));
const teams = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/teams.json'), 'utf8'));
const squad = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/squad.json'), 'utf8'));
const matches = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/matches.json'), 'utf8'));
const news = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/news.json'), 'utf8'));
const pointsTable = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/pointsTable.json'), 'utf8'));
const stats = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/stats.json'), 'utf8'));

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatDate(str) {
  if (!str) return '';
  const parts = str.split('-');
  if (parts.length !== 3) return str;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = parts[2];
  const month = months[parseInt(parts[1], 10) - 1] || parts[1];
  const year = parts[0];
  return `${day} ${month} ${year}`;
}

function esc(text) {
  if (!text && text !== 0) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ------------------------------------------------------------
// GLOBAL HTML TEMPLATE BLOCKS
// ------------------------------------------------------------
function renderHead({ title, description, canonicalUrl, ogType = 'website', jsonLd = null }) {
  const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${fullCanonical}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:url" content="${fullCanonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:site_name" content="Dread Eleven Cricket Club (DE)">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${fullCanonical}">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">

  <!-- Typography Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/src/css/styles.css">
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
  <!-- Awwwards-Grade Procedural Film Grain & Noise Foreground FX -->
  <canvas id="film-grain-canvas" aria-hidden="true"></canvas>
  <div class="interactive-spotlight-layer" aria-hidden="true"></div>

  <div class="content-wrapper">
  `;
}

function renderHeader(activeNav = '') {
  const links = [
    { label: 'Squad', href: '/players', key: 'squad' },
    { label: 'Matches', href: '/results', key: 'results' },
    { label: 'Fixtures', href: '/fixtures', key: 'fixtures' },
    { label: 'Standings', href: '/points-table', key: 'table' },
    { label: 'Stats', href: '/stats', key: 'stats' },
    { label: 'Media', href: '/news', key: 'news' },
    { label: 'Club', href: '/about', key: 'about' }
  ];

  return `
  <!-- Franchise Header Navigation (Clean Floating Digital Stadium Nav) -->
  <header class="site-header">
    <div class="container nav-container">
      <a href="/" class="brand-crest" aria-label="Dread Eleven Cricket Club Home">
        <div class="brand-crest-symbol">DE</div>
        <div class="brand-title-wrap">
          <span class="brand-main-title">DREAD ELEVEN <span style="color:var(--c-volt);">CC</span></span>
          <span class="brand-sub-title">Atal Bihari Vajpayee Cup • Rewa</span>
        </div>
      </a>

      <nav class="primary-nav" aria-label="Main Navigation">
        ${links.map((l) => `
          <a href="${l.href}" class="nav-link ${activeNav === l.key ? 'active' : ''}" ${activeNav === l.key ? 'aria-current="page"' : ''}>
            ${esc(l.label)}
          </a>
        `).join('')}
      </nav>

      <div class="header-cta-group">
        <a href="/#live-pulse" class="nav-live-pill" aria-label="Jump to Live Match Centre">
          <span class="pulse-beacon red"></span>
          <span>LIVE</span>
        </a>
        <button type="button" class="cmd-palette-trigger header-search-btn" aria-label="Open Command Palette (Cmd+K)">
          <span class="search-icon">⌕</span>
          <span class="search-label">SEARCH</span>
          <kbd class="cmd-kbd">⌘K</kbd>
        </button>
        <button type="button" class="mobile-nav-toggle" id="mobile-menu-btn" aria-label="Open Navigation Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <div class="mobile-menu-drawer" id="mobile-menu-drawer">
      <a href="/" class="mobile-nav-item ${activeNav === 'home' ? 'active' : ''}">Home</a>
      ${links.map((l) => `
        <a href="${l.href}" class="mobile-nav-item ${activeNav === l.key ? 'active' : ''}">
          ${esc(l.label)}
        </a>
      `).join('')}
      <a href="/contact" class="mobile-nav-item ${activeNav === 'contact' ? 'active' : ''}">Contact &amp; Trials</a>
    </div>
  </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="brand-main-title" style="font-size: 2.25rem; margin-bottom:0.75rem;">
              DREAD ELEVEN <span style="color:var(--c-volt);">CRICKET CLUB</span>
            </div>
            <p style="font-size:0.9rem; color:var(--c-gray-400); max-width:48ch; line-height:1.7; margin-bottom:1.5rem;">
              Official franchise digital stadium for Dread Eleven (DE), captained by Akhil Mishra.
              Sanctioned by the Rewa Division Cricket Association (RDCA) in Madhya Pradesh, competing in the iconic Atal Bihari Vajpayee Memorial Tournament.
            </p>
            <div class="hero-badge-strip">
              <span class="badge-brutalist badge-volt">RDCA SANCTIONED</span>
              <span class="badge-brutalist badge-gold">2022 MEMORIAL TROPHY CHAMPIONS</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Match Hub</h4>
            <ul class="footer-links">
              <li><a href="/fixtures">2026 Memorial Cup Fixtures</a></li>
              <li><a href="/results">Completed Results Archive (2021–2026)</a></li>
              <li><a href="/points-table">Multi-Season Points Table</a></li>
              <li><a href="/stats">Franchise &amp; Derby Records</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Franchise</h4>
            <ul class="footer-links">
              <li><a href="/players">Official Roster (43 Players)</a></li>
              <li><a href="/players/akhil-mishra">Capt. Akhil Mishra (#1)</a></li>
              <li><a href="/about">Club Legacy &amp; Fortress</a></li>
              <li><a href="/news">Press Dispatches &amp; Media</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Host Grounds</h4>
            <ul class="footer-links">
              <li><a href="/about#martand">Martand Ground No. 3 (5,000)</a></li>
              <li><a href="/about#apsu">APSU Stadium, Rewa (10,000)</a></li>
              <li><a href="/contact">Trials &amp; Academy Enquiries</a></li>
              <li><a href="/contact#management">Club Management</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; 2021–2026 Dread Eleven Cricket Club (DE) • Rewa Division Cricket Association (RDCA)</div>
          <div>Bespoke Cyber-Athletic Architecture • Forged in Rewa, Madhya Pradesh</div>
        </div>

        <!-- noth.in Inspired Monumental Full-Width SVG Wordmark -->
        <div class="giant-footer-svg-wrap" aria-hidden="true">
          <svg class="giant-footer-svg" viewBox="0 0 1400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="'Bebas Neue', sans-serif" font-size="200" font-weight="900" fill="currentColor" letter-spacing="-0.02em">DREAD ELEVEN</text>
          </svg>
        </div>
      </div>
    </footer>

    <!-- Mobile Floating Bottom Dock (App Experience) -->
    <nav class="mobile-bottom-dock" aria-label="Mobile Bottom Navigation">
      <a href="/" class="dock-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>Home</span>
      </a>
      <a href="/#live-pulse" class="dock-item">
        <span class="pulse-beacon red" style="width:8px;height:8px;"></span>
        <span>Live</span>
      </a>
      <a href="/players" class="dock-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Squad</span>
      </a>
      <a href="/results" class="dock-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Matches</span>
      </a>
      <button type="button" class="dock-item cmd-palette-trigger" style="background:transparent; border:none; cursor:pointer;" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Search</span>
      </button>
    </nav>

    <!-- Command Palette (⌘K) Modal -->
    <div id="cmd-palette" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="cmd-palette-modal">
        <div class="cmd-palette-header">
          <span class="cmd-palette-icon">⌕</span>
          <input type="text" id="cmd-palette-input" placeholder="Search players, matches, statistics, news..." autocomplete="off" spellcheck="false">
          <kbd class="cmd-palette-esc">ESC</kbd>
        </div>
        <div id="cmd-palette-results"></div>
      </div>
    </div>
  </div> <!-- /content-wrapper -->

  <script src="/src/js/app.js" defer></script>
</body>
</html>
  `;
}

// ------------------------------------------------------------
// 1. HOME PAGE GENERATOR (/)
// ------------------------------------------------------------
function generateHomePage() {
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const nextMatch = upcomingMatches[0] || {
    matchDate: '2026-09-06',
    time: '09:30 IST',
    venue: { name: 'APSU Stadium, Rewa' },
    stage: '2026 Memorial Cup Super Clash'
  };
  const featuredNews = news.slice(0, 3);
  const featuredSquad = squad.slice(0, 8);
  const season2026Matches = matches.filter(m => m.seasonYear === 2026);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: 'Dread Eleven Cricket Club',
    alternateName: 'Dread Eleven (DE)',
    sport: 'Cricket',
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'Rewa Division Cricket Association (RDCA)'
    },
    location: {
      '@type': 'Place',
      name: 'Martand School Ground No. 3',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rewa',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'India'
      }
    },
    coach: {
      '@type': 'Person',
      name: 'Akhil Mishra',
      jobTitle: 'Captain & Top-Order Batter'
    }
  };

  const html = `
${renderHead({
  title: 'Dread Eleven Cricket Club (DE) — Digital Stadium & Broadcast Arena | Rewa',
  description: 'Official digital stadium for Dread Eleven Cricket Club (DE), captained by Akhil Mishra. Complete 2021–2026 match scorecards against Destroyers, 43-man squad roster, tournament standings, and stats.',
  canonicalUrl: '/',
  jsonLd
})}
${renderHeader('home')}

<!-- Full-Screen Digital Stadium Hero -->
<section class="digital-stadium-hero" id="stadium-hero">
  <div class="stadium-floodlight-left" aria-hidden="true"></div>
  <div class="stadium-floodlight-right" aria-hidden="true"></div>

  <div class="stadium-crest-halo">
    <div class="brand-monogram-shield">DE</div>
  </div>

  <h1 class="stadium-giant-headline">DREAD ELEVEN</h1>
  <div class="hunt-begins-tagline">THE HUNT BEGINS • PRO CRICKET FRANCHISE</div>

  <!-- Match Cockpit Card -->
  <div class="stadium-next-match-cockpit">
    <div class="cockpit-team">
      <span class="team-code" style="color:var(--c-volt);">DREAD ELEVEN</span>
      <span class="team-sub">CAPT. AKHIL MISHRA</span>
    </div>
    <div class="cockpit-vs">VS</div>
    <div class="cockpit-team">
      <span class="team-code">DESTROYERS</span>
      <span class="team-sub">ATAL BIHARI VAJPAYEE TROPHY</span>
    </div>
    <div class="cockpit-meta">
      <span class="cockpit-meta-date">${formatDate(nextMatch.matchDate)} • ${nextMatch.time || '09:30 IST'}</span>
      <span class="cockpit-meta-venue">${esc(nextMatch.venue.name)}</span>
    </div>
  </div>

  <a href="#live-pulse" class="scroll-stadium-cue">
    <span>&darr; SCROLL TO ENTER THE DIGITAL STADIUM</span>
  </a>
</section>

<!-- The Live Pulse Match Centre -->
<section class="live-pulse-section" id="live-pulse">
  <div class="container">
    <div id="live-pulse-container">
      <div class="live-broadcast-banner upcoming">
        <div class="broadcast-live-badge">
          <span class="pulse-beacon"></span>
          <strong>NEXT DERBY CLASH</strong>
        </div>
        <div class="broadcast-score-line">
          <div class="team-score-block">
            <span class="team-code" style="color:var(--c-volt);">DREAD ELEVEN</span>
          </div>
          <div class="match-vs-divider" style="font-family:var(--f-display); font-size:1.2rem; color:var(--c-volt);">VS</div>
          <div class="team-score-block">
            <span class="team-code">DESTROYERS CC</span>
          </div>
        </div>
        <div class="broadcast-target-chip">
          <span>${formatDate(nextMatch.matchDate)} • 09:30 IST • APSU STADIUM, REWA</span>
        </div>
        <a href="/fixtures" class="btn-athletic btn-sm btn-volt">
          <span>MATCH CENTRE &amp; TICKETS &rarr;</span>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Season 2026 Horizontal Timeline Scroller -->
<section class="season-timeline-section">
  <div class="container">
    <div class="season-timeline-header">
      <div>
        <p class="section-pretitle">The Championship Journey</p>
        <h2 class="section-bigtitle">Season 2026 Timeline</h2>
        <p style="color:var(--c-gray-400); font-size:0.95rem; margin-top:0.35rem;">
          Track every marquee clash, decisive over, and tournament milestone in the 2026 campaign.
        </p>
      </div>
      <div class="timeline-nav-controls">
        <button type="button" class="timeline-scroll-btn" id="timeline-prev-btn" aria-label="Scroll Timeline Left">&larr;</button>
        <button type="button" class="timeline-scroll-btn" id="timeline-next-btn" aria-label="Scroll Timeline Right">&rarr;</button>
      </div>
    </div>

    <div class="season-timeline-track" id="season-timeline-track">
      ${season2026Matches.map((m, idx) => {
        const isWin = m.winner === 'DE';
        const isCompleted = m.status === 'completed';
        const inn1 = m.innings[0] || { runs: '---', wickets: '-' };
        const inn2 = m.innings[1] || { runs: '---', wickets: '-' };
        
        let statusClass = 'next';
        let statusText = 'UPCOMING';
        if (isCompleted) {
          statusClass = isWin ? 'win' : 'loss';
          statusText = isWin ? 'WIN' : 'DEFEAT';
        } else if (idx === 3) {
          statusText = 'NEXT MATCH';
        }

        return `
          <a href="/matches/${m.slug}" class="timeline-match-node">
            <div class="timeline-node-status">
              <span class="timeline-status-pill ${statusClass}">${statusText}</span>
              <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-gray-400);">${formatDate(m.matchDate)}</span>
            </div>
            <div class="timeline-node-scores">
              <div class="timeline-scores-line">
                ${isCompleted ? `${inn1.runs}/${inn1.wickets} &rarr; ${inn2.runs}/${inn2.wickets}` : 'DE vs DES'}
              </div>
              <div class="timeline-node-detail">
                ${isCompleted ? esc(m.resultText) : `${esc(m.venue.name)} • ${m.time || '09:30 IST'}`}
              </div>
            </div>
            <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); font-weight:800; display:flex; justify-content:space-between; align-items:center;">
              <span>MATCH #${m.matchNumber || (idx + 1)}</span>
              <span>Full Details &rarr;</span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  </div>
</section>

<!-- Rivalry Barometer Strip -->
<section class="rivalry-barometer-strip">
  <div class="container">
    <div class="barometer-header">
      <div class="barometer-title-group">
        <h2>DE vs DES Derby Rivalry Barometer</h2>
        <p>Official head-to-head records across all 35 Atal Bihari Vajpayee Memorial Tournament matches (2021–2026)</p>
      </div>
      <div>
        <span class="badge-brutalist badge-gold">17 WINS DE — 15 WINS DES</span>
      </div>
    </div>

    <div class="barometer-stats-row">
      <div class="barometer-stat-box">
        <div class="barometer-stat-val volt tabular">17</div>
        <div class="barometer-stat-lbl">Dread Eleven Wins</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val tabular">15</div>
        <div class="barometer-stat-lbl">Destroyers Wins</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val gold tabular">3</div>
        <div class="barometer-stat-lbl">2026 Fixtures Left</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val tabular">35</div>
        <div class="barometer-stat-lbl">Total Clashes</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val tabular" style="color:var(--c-emerald);">53.1%</div>
        <div class="barometer-stat-lbl">DE Win Ratio</div>
      </div>
    </div>
  </div>
</section>

<!-- Squad Command Center (FIFA / Cricket 24 Style Cards) -->
<section class="squad-section" style="background:var(--c-surface); padding:4.5rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Squad Command Center</p>
        <h2 class="section-bigtitle">Featured Dread Eleven Warriors</h2>
        <p style="color:var(--c-gray-400); font-size:0.95rem; margin-top:0.35rem;">
          Hover for tactical telemetry, form indicators, and Cricket 24 attribute ratings. Click for complete dossiers.
        </p>
      </div>
      <a href="/players" class="btn-athletic btn-outline">
        <span>Complete 43-Man Roster &rarr;</span>
      </a>
    </div>

    <div class="players-cards-grid">
      ${featuredSquad.map((p) => {
        const ovr = p.fifaRatings ? p.fifaRatings.overall : 88;
        const formDots = p.formDots || 4;
        const formRating = p.formRating || 'HOT';
        return `
          <a href="/players/${p.slug}" class="fifa-player-card">
            <div class="fifa-card-header">
              <div class="fifa-ovr-badge">
                ${ovr} <small>OVR</small>
              </div>
              <div class="player-form-badge ${formRating.toLowerCase()}">
                ${formRating}
              </div>
            </div>

            <div class="fifa-card-body">
              <h3 class="fifa-card-name">#${p.jerseyNumber} ${esc(p.name)}</h3>
              <div class="fifa-card-role">${esc(p.role)}</div>
            </div>

            <div class="fifa-attributes-grid">
              <div class="fifa-attr-item">
                <span class="fifa-attr-label">BAT PWR</span>
                <span class="fifa-attr-val tabular">${p.fifaRatings ? p.fifaRatings.battingPower : 88}</span>
              </div>
              <div class="fifa-attr-item">
                <span class="fifa-attr-label">TIMING</span>
                <span class="fifa-attr-val tabular">${p.fifaRatings ? p.fifaRatings.timing : 85}</span>
              </div>
              <div class="fifa-attr-item">
                <span class="fifa-attr-label">STAMINA</span>
                <span class="fifa-attr-val tabular">${p.fifaRatings ? p.fifaRatings.stamina : 90}</span>
              </div>
              <div class="fifa-attr-item">
                <span class="fifa-attr-label">CLUTCH</span>
                <span class="fifa-attr-val tabular" style="color:var(--c-volt);">${p.fifaRatings ? p.fifaRatings.clutch : 92}</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="fifa-form-dots">
                ${'●'.repeat(formDots)}${'○'.repeat(5 - formDots)}
              </div>
              <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); font-weight:800; text-transform:uppercase;">
                View Profile &rarr;
              </span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  </div>
</section>

<!-- noth.in Inspired Kinetic Manifesto Section -->
<section class="kinetic-manifesto-section">
  <div class="kinetic-manifesto-container">
    <span class="bracket-tag">( The Digital Stadium Ethos )</span>
    
    <div class="kinetic-lines-group">
      <div class="kinetic-line">WE ARE DREAD ELEVEN</div>
      <div class="kinetic-line focus">WE ARE DREAD ELEVEN</div>
      <div class="kinetic-line">WE ARE DREAD ELEVEN</div>
    </div>

    <div class="manifesto-editorial-grid">
      <div class="manifesto-lead-statement">
        Not merely a cricket team. An unyielding sporting citadel forged under the floodlights of Rewa.
      </div>
      <div class="manifesto-body-prose">
        <p>
          In a sporting landscape crowded with generic templates and complacent rivalries, Dread Eleven exists to redefine poise, precision, and tactical supremacy.
        </p>
        <p>
          Under captain Akhil Mishra, every delivery contested against Destroyers is an event. 35 clashes, 17 victories, and an unbreakable legacy in the Atal Bihari Vajpayee Memorial Trophy.
        </p>
        <div style="margin-top:1.5rem;">
          <a href="/about" class="btn-athletic btn-sm btn-volt">
            <span>Explore Franchise Origins &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Latest News -->
<section style="padding: 4.5rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Tournament Press &amp; Media Room</p>
        <h2 class="section-bigtitle">Latest News &amp; Features</h2>
      </div>
      <a href="/news" class="btn-athletic btn-outline">
        <span>All News Articles &rarr;</span>
      </a>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2rem;">
      ${featuredNews.map((n) => `
        <article style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; display:flex; flex-direction:column; border-radius:var(--radius-sm);">
          <div style="font-family:var(--f-mono); font-size:0.6875rem; color:var(--c-volt); text-transform:uppercase; font-weight:800; margin-bottom:0.75rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}
          </div>
          <h3 style="font-family:var(--f-athletic); font-size:1.85rem; color:var(--c-white); text-transform:uppercase; line-height:1.05; margin-bottom:0.85rem;">
            <a href="/news/${n.slug}" style="color:inherit; text-decoration:none;">${esc(n.title)}</a>
          </h3>
          <p style="font-size:0.9rem; color:var(--c-gray-400); line-height:1.6; margin-bottom:1.75rem;">
            ${esc(n.summary)}
          </p>
          <a href="/news/${n.slug}" style="margin-top:auto; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); font-weight:800; text-transform:uppercase; text-decoration:none;">
            Read Full Dispatch &rarr;
          </a>
        </article>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(rootDir, 'index.html'), html);
  console.log('Generated index.html (Digital Stadium Home)');
}

// ------------------------------------------------------------
// 2. SQUAD DIRECTORY (/players) & INDIVIDUAL PLAYERS (/players/[slug])
// ------------------------------------------------------------
function generateSquadPages() {
  const playersDir = path.join(rootDir, 'players');
  ensureDir(playersDir);

  const squadJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: squad.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Person',
        name: p.name,
        jobTitle: p.role,
        url: `${BASE_URL}/players/${p.slug}`
      }
    }))
  };

  const squadHtml = `
${renderHead({
  title: 'Dread Eleven Roster 2021–2026 | Player Roster (43 Players) | RDCA',
  description: 'Complete player directory for Dread Eleven Cricket Club (DE) in Rewa. Captain Akhil Mishra, batsmen, all-rounders, bowlers, and wicketkeepers with tournament statistics.',
  canonicalUrl: '/players',
  jsonLd: squadJsonLd
})}
${renderHeader('squad')}

<section class="squad-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Franchise Arsenal</p>
        <h1 class="section-bigtitle">Dread Eleven Player Roster (${squad.length})</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Sanctioned 43-man tournament squad for Dread Eleven Cricket Club in the Atal Bihari Vajpayee Memorial Tournament, Rewa.
        </p>
      </div>
    </div>

    <!-- Role Filter Toolbar -->
    <div class="filters-toolbar">
      <div class="filter-row">
        <span class="filter-label">Filter Role:</span>
        <button type="button" class="filter-pill-btn role-filter-pill active" data-role="all">All Squad (${squad.length})</button>
        <button type="button" class="filter-pill-btn role-filter-pill" data-role="captain">Captains &amp; All-Rounders</button>
        <button type="button" class="filter-pill-btn role-filter-pill" data-role="bat">Batters</button>
        <button type="button" class="filter-pill-btn role-filter-pill" data-role="bowl">Bowlers</button>
        <button type="button" class="filter-pill-btn role-filter-pill" data-role="wicket">Wicketkeepers</button>
      </div>
    </div>

    <!-- Players Cards Grid -->
    <div class="players-cards-grid" id="players-grid">
      ${squad.map((p) => `
        <a href="/players/${p.slug}" class="jersey-player-card" data-role="${esc(p.role)}">
          <div class="jersey-big-number">${p.jerseyNumber}</div>
          <div class="jersey-player-role">${esc(p.role)}</div>
          <h2 class="jersey-player-name">#${p.jerseyNumber} ${esc(p.name)}</h2>
          <div class="jersey-player-subtitle">${esc(p.battingStyle)} • ${p.matches} Matches</div>
          <div class="jersey-stats-strip">
            <div><div class="jersey-stat-val tabular" style="color:var(--c-volt);">${esc(p.batting.runs)}</div><div class="jersey-stat-lbl">Runs</div></div>
            <div><div class="jersey-stat-val tabular">${esc(p.batting.average)}</div><div class="jersey-stat-lbl">Avg</div></div>
            <div><div class="jersey-stat-val tabular" style="color:var(--c-emerald);">${esc(p.bowling.wickets)}</div><div class="jersey-stat-lbl">Wkts</div></div>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(playersDir, 'index.html'), squadHtml);

  // Individual player pages
  squad.forEach((p) => {
    const playerDir = path.join(playersDir, p.slug);
    ensureDir(playerDir);

    const playerJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p.name,
      jobTitle: p.role,
      description: p.bio,
      memberOf: {
        '@type': 'SportsTeam',
        name: 'Dread Eleven Cricket Club'
      }
    };

    // Filter match logs for this player
    const playerLogs = [];
    matches.forEach((m) => {
      m.innings.forEach((inn) => {
        const batEntry = (inn.batting || []).find((b) => b.playerId === p.id);
        const bowlEntry = (inn.bowling || []).find((bo) => bo.playerId === p.id);
        if (batEntry || bowlEntry) {
          playerLogs.push({
            match: m,
            batting: batEntry,
            bowling: bowlEntry
          });
        }
      });
    });

    const playerHtml = `
${renderHead({
  title: `#${p.jerseyNumber} ${p.name} — Career Stats & Profile | Dread Eleven`,
  description: `Official player profile and career tournament statistics for ${p.name} (#${p.jerseyNumber}) of Dread Eleven. ${p.batting.runs} runs, ${p.bowling.wickets} wickets in Rewa division.`,
  canonicalUrl: `/players/${p.slug}`,
  jsonLd: playerJsonLd
})}
${renderHeader('squad')}

<section style="padding: 4rem 0;">
  <div class="container">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <a href="/players" style="color:inherit; text-decoration:none;">Roster</a> / <span style="color:var(--c-volt);">${esc(p.name)}</span>
    </nav>

    <!-- Player Masthead Card -->
    <div class="jersey-player-card" style="padding: 3rem 2.5rem; margin-bottom: 3rem; background: var(--c-surface);">
      <div class="jersey-big-number" style="font-size: 14rem; right: 2rem; top: -1rem;">${p.jerseyNumber}</div>
      <div class="hero-badge-strip">
        <span class="badge-brutalist badge-volt">JERSEY #${p.jerseyNumber}</span>
        <span class="badge-brutalist badge-gold">${esc(p.role)}</span>
      </div>

      <h1 class="section-bigtitle" style="font-size: clamp(3rem, 7vw, 5rem); margin-bottom:0.5rem;">
        #${p.jerseyNumber} ${esc(p.name)}
      </h1>
      <p style="font-family:var(--f-mono); font-size:0.875rem; color:var(--c-gray-400); margin-bottom:1.5rem;">
        ${esc(p.battingStyle)} • ${esc(p.bowlingStyle)} • Dread Eleven Cricket Club (DE)
      </p>

      <p style="font-size:1.05rem; color:var(--c-gray-300); max-width:72ch; line-height:1.7; margin-bottom:2.5rem;">
        ${esc(p.bio)}
      </p>

      <!-- Key Telemetry Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem;">
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Matches</div>
          <div class="jersey-stat-val tabular">${p.matches}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Runs</div>
          <div class="jersey-stat-val tabular" style="color:var(--c-volt);">${esc(p.batting.runs)}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Highest Score</div>
          <div class="jersey-stat-val tabular">${esc(p.batting.highestScore)}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Batting Avg</div>
          <div class="jersey-stat-val tabular">${esc(p.batting.average)}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Strike Rate</div>
          <div class="jersey-stat-val tabular">${esc(p.batting.strikeRate)}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">50s / 100s</div>
          <div class="jersey-stat-val tabular">${esc(p.batting.fifties)} / ${esc(p.batting.hundreds)}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Wickets</div>
          <div class="jersey-stat-val tabular" style="color:var(--c-emerald);">${esc(p.bowling.wickets)}</div>
        </div>
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem 1rem; text-align:center; border-radius:var(--radius-sm);">
          <div class="jersey-stat-lbl">Best Bowling</div>
          <div class="jersey-stat-val tabular">${esc(p.bowling.bestBowling)}</div>
        </div>
      </div>
    </div>

    <!-- Match Appearances Table -->
    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
      <h2 style="font-family:var(--f-athletic); font-size:2rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1.5rem;">
        Match-by-Match Derby Telemetry vs Destroyers
      </h2>

      <div class="scorecard-table-wrap">
        <table class="cricket-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Format</th>
              <th>Match Hub</th>
              <th style="text-align:right;">Batting</th>
              <th>Dismissal</th>
              <th style="text-align:right;">Bowling</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${playerLogs.length ? playerLogs.map((item) => `
              <tr>
                <td style="font-weight:700; color:var(--c-white);">${formatDate(item.match.matchDate)}</td>
                <td><span class="match-format-tag">${esc(item.match.format)}</span></td>
                <td><a href="/matches/${item.match.slug}" style="color:var(--c-volt); font-weight:700; text-decoration:none;">Scorecard &rarr;</a></td>
                <td class="tabular font-bold" style="text-align:right; color:var(--c-white);">${item.batting ? `${item.batting.runs} (${item.batting.balls}b)` : '—'}</td>
                <td style="font-size:0.8125rem; color:var(--c-gray-400);">${item.batting ? esc(item.batting.dismissal) : 'Did Not Bat'}</td>
                <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald);">${item.bowling ? `${item.bowling.wickets}/${item.bowling.runs} (${item.bowling.overs} ov)` : '—'}</td>
                <td>
                  <span class="badge-brutalist ${item.match.winner === 'DE' ? 'badge-volt' : 'badge-gold'}" style="font-size:0.6875rem;">
                    ${item.match.winner === 'DE' ? 'DE Win' : (item.match.winner === 'DES' ? 'DES Win' : 'Upcoming')}
                  </span>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="7" style="text-align:center; color:var(--c-gray-400); padding:2rem;">No individual match appearances recorded.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
    `;

    fs.writeFileSync(path.join(playerDir, 'index.html'), playerHtml);
  });

  console.log(`Generated /players directory and ${squad.length} individual player pages.`);
}

// ------------------------------------------------------------
// 3. FIXTURES (/fixtures) & RESULTS (/results) & MATCH PAGES (/matches/[slug])
// ------------------------------------------------------------
function generateMatchPages() {
  const matchesDir = path.join(rootDir, 'matches');
  const fixturesDir = path.join(rootDir, 'fixtures');
  const resultsDir = path.join(rootDir, 'results');

  ensureDir(matchesDir);
  ensureDir(fixturesDir);
  ensureDir(resultsDir);

  function renderMatchListSection(isResultsPage) {
    const listMatches = isResultsPage ? matches.filter((m) => m.status === 'completed') : matches.filter((m) => m.status === 'upcoming');

    return `
<section class="matches-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">${isResultsPage ? 'HISTORICAL DERBY ARCHIVE (2021–2026)' : 'TOURNAMENT SCHEDULE (2026)'}</p>
        <h1 class="section-bigtitle">${isResultsPage ? `Match Results Archive (${listMatches.length} Matches)` : `Upcoming Derby Fixtures (${listMatches.length} Matches)`}</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Sanctioned Atal Bihari Vajpayee Memorial Tournament encounters between Dread Eleven and Destroyers in Rewa.
        </p>
      </div>
      <div>
        <span class="tabular font-bold" style="font-family:var(--f-mono); font-size:1.1rem; color:var(--c-volt);">
          SHOWING <span id="visible-matches-count">${listMatches.length}</span> MATCHES
        </span>
      </div>
    </div>

    <!-- Multi-tier Filter Toolbar -->
    <div class="filters-toolbar">
      <div class="filter-row">
        <span class="filter-label">Format:</span>
        <button type="button" class="filter-pill-btn format-filter-pill active" data-format="all">All (${listMatches.length})</button>
        <button type="button" class="filter-pill-btn format-filter-pill" data-format="ODI">ODI (50-Over)</button>
        <button type="button" class="filter-pill-btn format-filter-pill" data-format="T20">T20 Blast</button>

        <span class="filter-label" style="margin-left:1.5rem;">Season:</span>
        <button type="button" class="filter-pill-btn season-filter-pill active" data-season="all">All Seasons</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2026">2026</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2025">2025</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2024">2024</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2023">2023</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2022">2022</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2021">2021</button>
      </div>

      <div class="filter-row">
        <div class="search-input-wrap">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="match-search-field" class="search-input-field" placeholder="Search by player, venue, or stage...">
        </div>
      </div>
    </div>

    <div class="matches-grid">
      ${listMatches.map((m) => {
        const isCompleted = m.status === 'completed';
        const isDeWinner = m.winner === 'DE';
        const inn1 = m.innings[0] || { runs: 0, wickets: 0, overs: 0, teamName: 'Dread Eleven' };
        const inn2 = m.innings[1] || { runs: 0, wickets: 0, overs: 0, teamName: 'Destroyers' };

        const deInn = inn1.teamName.includes('Dread') ? inn1 : inn2;
        const desInn = inn1.teamName.includes('Dread') ? inn2 : inn1;

        return `
        <a href="/matches/${m.slug}" class="match-card" data-format="${esc(m.format)}" data-season="${esc(m.seasonYear)}">
          <div class="match-card-meta">
            <span class="match-format-tag">${esc(m.format)} • Season ${esc(m.seasonYear)}</span>
            <span class="match-stage-text">${esc(m.stage)}</span>
          </div>

          <div style="font-size:0.8125rem; color:var(--c-gray-400); margin-bottom:1rem;">
            ${formatDate(m.matchDate)} • ${esc(m.venue.name)}
          </div>

          <div class="match-teams-block">
            <div class="team-scoreline ${isDeWinner ? 'winner' : ''}">
              <div class="team-info">
                <div class="team-crest-badge crest-de">DE</div>
                <span class="team-name-text">Dread Eleven</span>
              </div>
              <div class="team-score-text tabular">
                ${isCompleted ? `${deInn.runs}/${deInn.wickets}` : '—'}
                <span class="team-overs-text">${isCompleted ? `(${deInn.overs} ov)` : ''}</span>
              </div>
            </div>

            <div class="team-scoreline ${isCompleted && !isDeWinner ? 'winner' : ''}">
              <div class="team-info">
                <div class="team-crest-badge crest-des">DES</div>
                <span class="team-name-text">Destroyers</span>
              </div>
              <div class="team-score-text tabular">
                ${isCompleted ? `${desInn.runs}/${desInn.wickets}` : '—'}
                <span class="team-overs-text">${isCompleted ? `(${desInn.overs} ov)` : ''}</span>
              </div>
            </div>
          </div>

          <div class="match-result-banner">
            ${esc(m.resultText)}
          </div>

          <div class="match-potm-strip">
            <div>
              ${m.playerOfTheMatch ? `
                <span class="potm-badge">POTM: ${esc(m.playerOfTheMatch.name)}</span>
                <span style="font-size:0.75rem; color:var(--c-gray-400); margin-left:0.35rem;">(${esc(m.playerOfTheMatch.reason)})</span>
              ` : `
                <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Upcoming Climax Encounter</span>
              `}
            </div>
            <div class="match-card-link-cta">Scorecard &rarr;</div>
          </div>
        </a>
        `;
      }).join('')}
    </div>
  </div>
</section>
    `;
  }

  // Generate /fixtures/index.html
  const fixturesHtml = `
${renderHead({
  title: 'Dread Eleven Upcoming Derby Fixtures (2026 Season) | Rewa Tournament',
  description: 'Schedule of upcoming Atal Bihari Vajpayee Memorial Tournament fixtures for Dread Eleven against Destroyers at APSU Stadium, Rewa.',
  canonicalUrl: '/fixtures'
})}
${renderHeader('fixtures')}
${renderMatchListSection(false)}
${renderFooter()}
  `;
  fs.writeFileSync(path.join(fixturesDir, 'index.html'), fixturesHtml);

  // Generate /results/index.html
  const resultsHtml = `
${renderHead({
  title: 'Match Results Archive (2021–2026) | Dread Eleven vs Destroyers',
  description: 'Official results archive of all completed matches between Dread Eleven and Destroyers in the Atal Bihari Vajpayee Memorial Tournament, Rewa.',
  canonicalUrl: '/results'
})}
${renderHeader('results')}
${renderMatchListSection(true)}
${renderFooter()}
  `;
  fs.writeFileSync(path.join(resultsDir, 'index.html'), resultsHtml);

  // Generate individual match pages (/matches/[slug]) for ALL 35 matches
  matches.forEach((m) => {
    const matchPageDir = path.join(matchesDir, m.slug);
    ensureDir(matchPageDir);

    const isCompleted = m.status === 'completed';
    const isDeWinner = m.winner === 'DE';
    const inn1 = m.innings[0] || { runs: 0, wickets: 0, overs: 0, batting: [], bowling: [], teamName: 'Dread Eleven' };
    const inn2 = m.innings[1] || { runs: 0, wickets: 0, overs: 0, batting: [], bowling: [], teamName: 'Destroyers' };

    const deInn = inn1.teamName.includes('Dread') ? inn1 : inn2;
    const desInn = inn1.teamName.includes('Dread') ? inn2 : inn1;

    const matchJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: `Dread Eleven vs Destroyers (${m.seasonYear})`,
      startDate: `${m.matchDate}T${m.time ? m.time.split(' ')[0] : '09:30'}:00+05:30`,
      location: {
        '@type': 'Place',
        name: m.venue.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: m.venue.city,
          addressRegion: 'Madhya Pradesh',
          addressCountry: 'India'
        }
      },
      competitor: [
        { '@type': 'SportsTeam', name: 'Dread Eleven' },
        { '@type': 'SportsTeam', name: 'Destroyers Cricket Club' }
      ]
    };

    function renderInningsTable(inn, battingTeam, bowlingTeam) {
      if (!inn || !inn.batting || !inn.batting.length) {
        return '<p style="color:var(--c-gray-400); padding:1rem;">Innings details scheduled for match day.</p>';
      }

      const batRows = inn.batting.map((b) => `
        <tr>
          <td style="font-weight:800; color:var(--c-white); font-family:var(--f-athletic); font-size:1.25rem;">${esc(b.playerName)}</td>
          <td style="color:var(--c-gray-400); font-size:0.8125rem;">${esc(b.dismissal)}</td>
          <td class="tabular font-bold" style="text-align:right; color:var(--c-white); font-size:1.1rem;">${esc(b.runs)}</td>
          <td class="tabular" style="text-align:right;">${esc(b.balls)}</td>
          <td class="tabular" style="text-align:right;">${esc(b.fours)}</td>
          <td class="tabular" style="text-align:right;">${esc(b.sixes)}</td>
          <td class="tabular" style="text-align:right; color:var(--c-volt); font-weight:700;">${esc(b.strikeRate)}</td>
        </tr>
      `).join('');

      const bowlRows = (inn.bowling || []).map((bo) => `
        <tr>
          <td style="font-weight:800; color:var(--c-white); font-family:var(--f-athletic); font-size:1.25rem;">${esc(bo.playerName)}</td>
          <td class="tabular" style="text-align:right;">${esc(bo.overs)}</td>
          <td class="tabular" style="text-align:right;">${esc(bo.maidens)}</td>
          <td class="tabular" style="text-align:right;">${esc(bo.runs)}</td>
          <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald); font-size:1.1rem;">${esc(bo.wickets)}</td>
          <td class="tabular" style="text-align:right; color:var(--c-volt); font-weight:700;">${esc(bo.economy)}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom:2.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid var(--b-medium); padding-bottom:0.75rem; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase;">Batting Side: ${esc(battingTeam)}</div>
              <h3 style="font-family:var(--f-athletic); font-size:2rem; color:var(--c-white); text-transform:uppercase;">
                ${esc(inn.teamName)} Innings
              </h3>
            </div>
            <div class="tabular" style="font-family:var(--f-athletic); font-size:2.25rem; font-weight:900; color:var(--c-white);">
              ${inn.runs}/${inn.wickets} <span style="font-size:1rem; color:var(--c-gray-400); font-family:var(--f-mono); font-weight:500;">(${inn.overs} ov • RR ${inn.runRate})</span>
            </div>
          </div>

          <div class="scorecard-table-wrap">
            <table class="cricket-table">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Dismissal</th>
                  <th style="text-align:right;">R</th>
                  <th style="text-align:right;">B</th>
                  <th style="text-align:right;">4s</th>
                  <th style="text-align:right;">6s</th>
                  <th style="text-align:right;">SR</th>
                </tr>
              </thead>
              <tbody>${batRows}</tbody>
            </table>
          </div>

          <h4 style="font-family:var(--f-athletic); font-size:1.5rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
            Bowling Attack (${esc(bowlingTeam)})
          </h4>
          <div class="scorecard-table-wrap">
            <table class="cricket-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th style="text-align:right;">O</th>
                  <th style="text-align:right;">M</th>
                  <th style="text-align:right;">R</th>
                  <th style="text-align:right;">W</th>
                  <th style="text-align:right;">Eco</th>
                </tr>
              </thead>
              <tbody>${bowlRows}</tbody>
            </table>
          </div>
        </div>
      `;
    }

    const matchHtml = `
${renderHead({
  title: `Dread Eleven vs Destroyers (${formatDate(m.matchDate)}) — Official Scorecard`,
  description: `Official scorecard and performance breakdown for Dread Eleven vs Destroyers on ${formatDate(m.matchDate)} at ${m.venue.name}, Rewa. Atal Bihari Vajpayee Memorial Tournament.`,
  canonicalUrl: `/matches/${m.slug}`,
  jsonLd: matchJsonLd
})}
${renderHeader('results')}

<section style="padding: 4rem 0;">
  <div class="container">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <a href="${isCompleted ? '/results' : '/fixtures'}" style="color:inherit; text-decoration:none;">${isCompleted ? 'Results' : 'Fixtures'}</a> / <span style="color:var(--c-volt);">${formatDate(m.matchDate)}</span>
    </nav>

    <!-- Match Header Banner Card -->
    <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); margin-bottom:2.5rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <span class="match-format-tag">${esc(m.format)} • Season ${esc(m.seasonYear)}</span>
        <span style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-volt); font-weight:800; text-transform:uppercase;">${esc(m.stage)}</span>
      </div>

      <h1 class="section-bigtitle" style="font-size:clamp(2.5rem, 5vw, 4.25rem); margin-bottom:0.75rem;">
        Dread Eleven vs Destroyers
      </h1>

      <div style="font-size:0.9rem; color:var(--c-gray-400); margin-bottom:1.5rem;">
        <span>${formatDate(m.matchDate)}</span> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}, ${esc(m.venue.city)}</span>
      </div>

      ${m.toss ? `
        <div style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-300); margin-bottom:1.5rem; background:var(--c-card-bg); padding:0.85rem 1.25rem; border:1px solid var(--b-subtle); border-radius:var(--radius-sm);">
          Toss: <strong>${esc(m.toss.winner)}</strong> won the toss and ${esc(m.toss.decision)}.
        </div>
      ` : ''}

      <div class="match-result-banner" style="font-size:1.15rem; padding:0.9rem 1.25rem;">
        ${esc(m.resultText)}
      </div>

      ${m.playerOfTheMatch ? `
        <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--b-subtle); display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <span class="badge-brutalist badge-gold">Player of the Match</span>
          <strong style="color:var(--c-white); font-family:var(--f-athletic); font-size:1.5rem;">${esc(m.playerOfTheMatch.name)}</strong>
          <span style="color:var(--c-gray-400); font-size:0.875rem;">(${esc(m.playerOfTheMatch.team)} • ${esc(m.playerOfTheMatch.reason)})</span>
        </div>
      ` : ''}
    </div>

    ${isCompleted ? `
      <!-- Innings Scorecards -->
      <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm);">
        <h2 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase; margin-bottom:2rem;">
          Official Innings Scorecards
        </h2>

        <!-- Innings 1 -->
        ${renderInningsTable(inn1, inn1.teamName, inn2.teamName)}

        <!-- Innings 2 -->
        ${renderInningsTable(inn2, inn2.teamName, inn1.teamName)}
      </div>
    ` : `
      <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:3.5rem 2rem; text-align:center; border-radius:var(--radius-sm);">
        <h2 style="font-family:var(--f-athletic); font-size:2.5rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          Fixture Scheduled
        </h2>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:56ch; margin:0 auto 2rem; line-height:1.6;">
          This fixture is slated for the upcoming 2026 Memorial Cup cycle at <strong>${esc(m.venue.name)}</strong>. Complete live scores, ball-by-ball analysis, and player performances will populate immediately following the match.
        </p>
        <a href="/fixtures" class="btn-athletic btn-volt">Back to Full Fixtures Schedule</a>
      </div>
    `}
  </div>
</section>

${renderFooter()}
    `;

    fs.writeFileSync(path.join(matchPageDir, 'index.html'), matchHtml);
  });

  console.log(`Generated /fixtures, /results, and ${matches.length} individual match pages.`);
}

// ------------------------------------------------------------
// 4. POINTS TABLE (/points-table)
// ------------------------------------------------------------
function generatePointsTablePage() {
  const tableDir = path.join(rootDir, 'points-table');
  ensureDir(tableDir);

  const html = `
${renderHead({
  title: 'Tournament Points Table & Standings (2021–2026) | Dread Eleven',
  description: 'Official tournament points table across all editions of the Atal Bihari Vajpayee Memorial Tournament, Rewa. Standings for 2026, 2025, 2024, 2023, 2022, 2021, and All-Time.',
  canonicalUrl: '/points-table'
})}
${renderHeader('table')}

<section style="padding: 4rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Official RDCA Standings</p>
        <h1 class="section-bigtitle">Tournament Points Table</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Certified standings and qualification records across all six seasons of the Atal Bihari Vajpayee Memorial Tournament in Rewa.
        </p>
      </div>
    </div>

    <!-- All-Time Master Standings -->
    <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); margin-bottom:3rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <h2 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">
          All-Time Derby Leaderboard (2021–2026 • 32 Completed Clashes)
        </h2>
        <span class="badge-brutalist badge-volt">32 DERBY MATCHES</span>
      </div>

      <div class="scorecard-table-wrap">
        <table class="cricket-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Franchise Team</th>
              <th style="text-align:right;">P</th>
              <th style="text-align:right;">W</th>
              <th style="text-align:right;">L</th>
              <th style="text-align:right;">T</th>
              <th style="text-align:right;">NR</th>
              <th style="text-align:right;">NRR</th>
              <th style="text-align:right;">Pts</th>
            </tr>
          </thead>
          <tbody>
            ${pointsTable.allTime.map((row) => `
              <tr>
                <td style="font-weight:800; font-family:var(--f-mono); color:${row.rank === 1 ? 'var(--c-gold)' : 'var(--c-white)'};">${row.rank}</td>
                <td style="font-weight:800; color:var(--c-white); font-family:var(--f-athletic); font-size:1.4rem;">
                  ${esc(row.team)}
                </td>
                <td class="tabular font-bold" style="text-align:right;">${row.played}</td>
                <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald);">${row.won}</td>
                <td class="tabular" style="text-align:right; color:var(--c-crimson);">${row.lost}</td>
                <td class="tabular" style="text-align:right;">${row.tied}</td>
                <td class="tabular" style="text-align:right;">${row.nr}</td>
                <td class="tabular" style="text-align:right; font-family:var(--f-mono); font-weight:700;">${row.nrr}</td>
                <td class="tabular font-bold" style="text-align:right; color:var(--c-volt); font-size:1.4rem;">${row.points}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Season by Season Standings Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(440px, 1fr)); gap:2rem;">
      <!-- 2026 Season -->
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1rem;">
          Season 2026 (Silver Jubilee Tournament Cycle)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${(pointsTable['2026'] || []).map((r) => `
                <tr>
                  <td style="font-weight:700; color:var(--c-white);">${esc(r.team)}</td>
                  <td class="tabular" style="text-align:right;">${r.played}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-emerald); font-weight:700;">${r.won}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-crimson);">${r.lost}</td>
                  <td class="tabular font-mono" style="text-align:right;">${r.nrr}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">${r.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2025 Season -->
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1rem;">
          Season 2025 (50-Over ODI Series)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${(pointsTable['2025'] || []).map((r) => `
                <tr>
                  <td style="font-weight:700; color:var(--c-white);">${esc(r.team)}</td>
                  <td class="tabular" style="text-align:right;">${r.played}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-emerald); font-weight:700;">${r.won}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-crimson);">${r.lost}</td>
                  <td class="tabular font-mono" style="text-align:right;">${r.nrr}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">${r.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2024 Season -->
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1rem;">
          Season 2024 (50-Over ODI Series)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${pointsTable['2024'].map((r) => `
                <tr>
                  <td style="font-weight:700; color:var(--c-white);">${esc(r.team)}</td>
                  <td class="tabular" style="text-align:right;">${r.played}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-emerald); font-weight:700;">${r.won}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-crimson);">${r.lost}</td>
                  <td class="tabular font-mono" style="text-align:right;">${r.nrr}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">${r.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2023 Season -->
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1rem;">
          Season 2023 (Dread Eleven 3–2 Series Win)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${pointsTable['2023'].map((r) => `
                <tr>
                  <td style="font-weight:700; color:var(--c-white);">${esc(r.team)}</td>
                  <td class="tabular" style="text-align:right;">${r.played}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-emerald); font-weight:700;">${r.won}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-crimson);">${r.lost}</td>
                  <td class="tabular font-mono" style="text-align:right;">${r.nrr}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">${r.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2022 Season (DE Champions) -->
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1rem;">
          Season 2022 (Dread Eleven Champions)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${pointsTable['2022'].map((r) => `
                <tr>
                  <td style="font-weight:700; color:var(--c-white);">${esc(r.team)}</td>
                  <td class="tabular" style="text-align:right;">${r.played}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-emerald); font-weight:700;">${r.won}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-crimson);">${r.lost}</td>
                  <td class="tabular font-mono" style="text-align:right;">${r.nrr}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">${r.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2021 Season (DE Champions) -->
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1rem;">
          Season 2021 (Dread Eleven 5–2 Series Win)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${pointsTable['2021'].map((r) => `
                <tr>
                  <td style="font-weight:700; color:var(--c-white);">${esc(r.team)}</td>
                  <td class="tabular" style="text-align:right;">${r.played}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-emerald); font-weight:700;">${r.won}</td>
                  <td class="tabular" style="text-align:right; color:var(--c-crimson);">${r.lost}</td>
                  <td class="tabular font-mono" style="text-align:right;">${r.nrr}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">${r.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(tableDir, 'index.html'), html);
  console.log('Generated /points-table/index.html');
}

// ------------------------------------------------------------
// 5. STATS & RECORDS (/stats)
// ------------------------------------------------------------
function generateStatsPage() {
  const statsDir = path.join(rootDir, 'stats');
  ensureDir(statsDir);

  const topRunScorers = [...squad].sort((a, b) => b.batting.runs - a.batting.runs).slice(0, 8);
  const topWicketTakers = [...squad].sort((a, b) => b.bowling.wickets - a.bowling.wickets).slice(0, 8);

  const html = `
${renderHead({
  title: 'All-Time Franchise Statistics & Records | Dread Eleven',
  description: 'Certified statistics and tournament records for Dread Eleven against Destroyers in Rewa. Top run scorers, leading wicket-takers, highest innings totals, and bowling milestones.',
  canonicalUrl: '/stats'
})}
${renderHeader('stats')}

<section style="padding: 4rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Record Books (2021–2026)</p>
        <h1 class="section-bigtitle">Dread Eleven Franchise Records</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Verified tournament records across all 35 clashes against Destroyers under the Rewa Division Cricket Association (RDCA).
        </p>
      </div>
    </div>

    <!-- Podiums Grid -->
    <div class="stats-podium-grid">
      <div class="podium-card podium-volt">
        <div class="podium-rank-badge">1</div>
        <div class="metric-title">All-Time Run Scorer</div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">Akhil Mishra</h3>
        <div class="metric-de tabular" style="font-size:2.5rem; margin:0.5rem 0;">1,342 Runs</div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Average: 49.7 • 11 Fifties • 1 Hundred (114 HS)</div>
      </div>

      <div class="podium-card">
        <div class="podium-rank-badge" style="background:var(--c-surface); color:var(--c-white); border:1px solid var(--b-medium);">2</div>
        <div class="metric-title">Second Leading Scorer</div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">Ritesh Shakya</h3>
        <div class="metric-de tabular" style="font-size:2.5rem; margin:0.5rem 0; color:var(--c-white);">560 Runs</div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Average: 38.2 • 4 Fifties</div>
      </div>

      <div class="podium-card">
        <div class="podium-rank-badge" style="background:var(--c-surface); color:var(--c-white); border:1px solid var(--b-medium);">3</div>
        <div class="metric-title">Third Leading Scorer</div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">Yash Dubey</h3>
        <div class="metric-de tabular" style="font-size:2.5rem; margin:0.5rem 0; color:var(--c-white);">512 Runs</div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Average: 36.5 • 3 Fifties</div>
      </div>
    </div>

    <!-- Tables Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(480px, 1fr)); gap:2.5rem;">
      <!-- Top Run Scorers -->
      <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h2 style="font-family:var(--f-athletic); font-size:1.85rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1.25rem;">
          Top Dread Eleven Run Scorers
        </h2>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Player</th><th style="text-align:right;">Mat</th><th style="text-align:right;">Runs</th><th style="text-align:right;">Avg</th><th style="text-align:right;">SR</th><th style="text-align:right;">50s</th></tr>
            </thead>
            <tbody>
              ${topRunScorers.map((p) => `
                <tr>
                  <td style="font-weight:800; color:var(--c-white);"><a href="/players/${p.slug}" style="color:inherit; text-decoration:none;">${esc(p.name)}</a></td>
                  <td class="tabular" style="text-align:right;">${p.matches}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-volt); font-size:1.1rem;">${esc(p.batting.runs)}</td>
                  <td class="tabular" style="text-align:right;">${esc(p.batting.average)}</td>
                  <td class="tabular" style="text-align:right;">${esc(p.batting.strikeRate)}</td>
                  <td class="tabular" style="text-align:right;">${esc(p.batting.fifties)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Leading Wicket Takers -->
      <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2rem; border-radius:var(--radius-sm);">
        <h2 style="font-family:var(--f-athletic); font-size:1.85rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1.25rem;">
          Top Dread Eleven Wicket Takers
        </h2>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Bowler</th><th style="text-align:right;">Mat</th><th style="text-align:right;">Wkts</th><th style="text-align:right;">Overs</th><th style="text-align:right;">BBI</th><th style="text-align:right;">Eco</th></tr>
            </thead>
            <tbody>
              ${topWicketTakers.map((p) => `
                <tr>
                  <td style="font-weight:800; color:var(--c-white);"><a href="/players/${p.slug}" style="color:inherit; text-decoration:none;">${esc(p.name)}</a></td>
                  <td class="tabular" style="text-align:right;">${p.matches}</td>
                  <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald); font-size:1.1rem;">${esc(p.bowling.wickets)}</td>
                  <td class="tabular" style="text-align:right;">${esc(p.bowling.overs)}</td>
                  <td class="tabular font-mono" style="text-align:right;">${esc(p.bowling.bestBowling)}</td>
                  <td class="tabular" style="text-align:right;">${esc(p.bowling.economy)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(statsDir, 'index.html'), html);
  console.log('Generated /stats/index.html');
}

// ------------------------------------------------------------
// 6. NEWS (/news) & INDIVIDUAL ARTICLES (/news/[slug])
// ------------------------------------------------------------
function generateNewsPages() {
  const newsDir = path.join(rootDir, 'news');
  ensureDir(newsDir);

  const newsHtml = `
${renderHead({
  title: 'Tournament News & Press Releases | Dread Eleven',
  description: 'Official press releases, series reviews, squad announcements, and match reports for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa.',
  canonicalUrl: '/news'
})}
${renderHeader('news')}

<section style="padding: 4rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Official Dispatch</p>
        <h1 class="section-bigtitle">Franchise News &amp; Features</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Official coverage of Dread Eleven matches, training camps, and RDCA tournament milestones.
        </p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2.5rem;">
      ${news.map((n) => `
        <article style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; display:flex; flex-direction:column; border-radius:var(--radius-sm);">
          <div style="font-family:var(--f-mono); font-size:0.6875rem; color:var(--c-volt); text-transform:uppercase; font-weight:800; margin-bottom:0.75rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))} • ${esc(n.readTime)}
          </div>
          <h2 style="font-family:var(--f-athletic); font-size:1.85rem; color:var(--c-white); text-transform:uppercase; line-height:1.05; margin-bottom:0.85rem;">
            <a href="/news/${n.slug}" style="color:inherit; text-decoration:none;">${esc(n.title)}</a>
          </h2>
          <p style="font-size:0.9rem; color:var(--c-gray-400); line-height:1.6; margin-bottom:1.75rem;">
            ${esc(n.summary)}
          </p>
          <a href="/news/${n.slug}" style="margin-top:auto; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); font-weight:800; text-transform:uppercase; text-decoration:none;">
            Read Full Dispatch &rarr;
          </a>
        </article>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(newsDir, 'index.html'), newsHtml);

  // Individual news articles
  news.forEach((n) => {
    const articleDir = path.join(newsDir, n.slug);
    ensureDir(articleDir);

    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: n.title,
      description: n.summary,
      datePublished: n.publishedAt,
      dateModified: n.updatedAt || n.publishedAt,
      author: {
        '@type': 'Person',
        name: n.author.name,
        jobTitle: n.author.role
      },
      publisher: {
        '@type': 'Organization',
        name: 'Dread Eleven Cricket Club'
      }
    };

    const articleHtml = `
${renderHead({
  title: `${n.title} | Dread Eleven News`,
  description: n.summary,
  canonicalUrl: `/news/${n.slug}`,
  jsonLd: articleJsonLd
})}
${renderHeader('news')}

<article style="padding: 4rem 0;">
  <div class="container" style="max-width:860px;">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <a href="/news" style="color:inherit; text-decoration:none;">News</a> / <span style="color:var(--c-volt);">${esc(n.category)}</span>
    </nav>

    <div class="hero-badge-strip">
      <span class="badge-brutalist badge-volt">${esc(n.category)}</span>
      <span class="badge-brutalist badge-gold">${esc(n.readTime)}</span>
    </div>

    <h1 class="section-bigtitle" style="font-size:clamp(2.5rem, 5vw, 4rem); margin-bottom:1.25rem;">
      ${esc(n.title)}
    </h1>

    <div style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-400); border-bottom:1px solid var(--b-medium); padding-bottom:1.5rem; margin-bottom:2.5rem;">
      By <strong>${esc(n.author.name)}</strong> (${esc(n.author.role)}) • Published on ${formatDate(n.publishedAt.slice(0, 10))}
    </div>

    <div style="font-size:1.1rem; color:var(--c-gray-300); line-height:1.8; margin-bottom:3rem;">
      ${n.body}
    </div>

    <div style="border-top:1px solid var(--b-medium); padding-top:2rem; display:flex; justify-content:space-between; align-items:center;">
      <a href="/news" class="btn-athletic btn-outline">Back to News Index</a>
      <a href="/results" class="btn-athletic btn-volt">Explore Match Archives</a>
    </div>
  </div>
</article>

${renderFooter()}
    `;

    fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);
  });

  console.log(`Generated /news and ${news.length} individual news articles.`);
}

// ------------------------------------------------------------
// 7. ABOUT (/about) & CONTACT (/contact) & 404 (404.html)
// ------------------------------------------------------------
function generateAboutAndContactPages() {
  const aboutDir = path.join(rootDir, 'about');
  const contactDir = path.join(rootDir, 'contact');
  ensureDir(aboutDir);
  ensureDir(contactDir);

  const aboutHtml = `
${renderHead({
  title: 'About Dread Eleven | History, Martand Fortress & RDCA',
  description: 'History and identity of Dread Eleven (DE) in Rewa. Affiliation with Rewa Division Cricket Association (RDCA), home fortress Martand School Ground No. 3 & APSU Stadium, and franchise leadership.',
  canonicalUrl: '/about'
})}
${renderHeader('about')}

<section style="padding: 4rem 0;">
  <div class="container" style="max-width:900px;">
    <div class="hero-badge-strip">
      <span class="badge-brutalist badge-volt">EST. 2021 • REWA DIVISION</span>
      <span class="badge-brutalist badge-gold">2022 MEMORIAL TROPHY CHAMPIONS</span>
    </div>

    <h1 class="section-bigtitle" style="font-size:clamp(3rem, 6vw, 4.5rem); margin-bottom:1.5rem;">
      The Dread Eleven Legacy
    </h1>

    <div style="font-size:1.05rem; color:var(--c-gray-300); line-height:1.8; margin-bottom:2.5rem;">
      <p style="margin-bottom:1.5rem;">
        Forged in 2021 in the heart of Rewa, Madhya Pradesh, <strong>Dread Eleven (DE)</strong> embodies the aggressive, clinical edge of Vindhya cricket. Sanctioned by the <strong>Rewa Division Cricket Association (RDCA)</strong>, Dread Eleven compete annually in the prestigious <strong>Atal Bihari Vajpayee Memorial Tournament</strong>.
      </p>
      <p style="margin-bottom:1.5rem;">
        The club's defining trial is its epic derby with <strong>Destroyers Cricket Club (DES)</strong>. Spanning 35 fiercely contested clashes from 2021 to 2026 across both T20 Blast and 50-over ODI formats, Dread Eleven captured the pinnacle of glory on <strong>12 August 2022</strong>, lifting the Atal Bihari Vajpayee Memorial Trophy Championship title at APSU Stadium.
      </p>
      <p style="margin-bottom:1.5rem;">
        Captained by top-order master <strong>Akhil Mishra</strong>, Dread Eleven play with venomous intent, utilizing the sharp spin and abrasive pace of Martand School Ground No. 3 to dismantle opposing batting lineups.
      </p>
    </div>

    <!-- Venues Section -->
    <div id="martand" style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); margin-bottom:2rem;">
      <h2 style="font-family:var(--f-athletic); font-size:2rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
        Martand School Ground No. 3 (The Fortress)
      </h2>
      <p style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-volt); margin-bottom:1rem;">
        Capacity: 5,000 • Surface: Dry Turning Turf / High Velocity • Rewa, MP
      </p>
      <p style="font-size:0.95rem; color:var(--c-gray-300); line-height:1.7;">
        The spiritual fortress of Dread Eleven. Characterized by abrasive dust surfaces that grip and turn violently from the 10th over onwards, Martand Ground has been the venue for DE's most famous tactical ambushes.
      </p>
    </div>

    <div id="apsu" style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm);">
      <h2 style="font-family:var(--f-athletic); font-size:2rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
        Awadhesh Pratap Singh University (APSU) Stadium
      </h2>
      <p style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-volt); margin-bottom:1rem;">
        Capacity: 10,000 • Surface: Hard Bounce Red-Clay Turf • Rewa, MP
      </p>
      <p style="font-size:0.95rem; color:var(--c-gray-300); line-height:1.7;">
        The grand theater of Rewa cricket. Host ground for the 2022 Championship Final where Dread Eleven defeated Destroyers before a capacity crowd of 10,000 spectators.
      </p>
    </div>
  </div>
</section>

${renderFooter()}
  `;
  fs.writeFileSync(path.join(aboutDir, 'index.html'), aboutHtml);
  console.log('Generated /about/index.html');

  const contactHtml = `
${renderHead({
  title: 'Contact Dread Eleven | RDCA & Scouting Desk',
  description: 'Official contact desk for Dread Eleven Cricket Club in Rewa, Madhya Pradesh. Media inquiries, academy registration, venue liaison, and RDCA communications.',
  canonicalUrl: '/contact'
})}
${renderHeader('contact')}

<section style="padding: 4rem 0;">
  <div class="container" style="max-width:860px;">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Official Communication Desk</p>
        <h1 class="section-bigtitle">Contact Dread Eleven</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Direct communication channels for divisional scouting, media credentials, and tournament affairs in Rewa.
        </p>
      </div>
    </div>

    <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); margin-bottom:2.5rem;">
      <h2 style="font-family:var(--f-athletic); font-size:1.85rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1.5rem;">
        Franchise Liaison Office
      </h2>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:2rem;">
        <div>
          <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); text-transform:uppercase; font-weight:800; margin-bottom:0.25rem;">Divisional Governing Body</div>
          <p style="color:var(--c-white); font-weight:700;">Rewa Division Cricket Association (RDCA)</p>
          <p style="color:var(--c-gray-400); font-size:0.875rem;">District Pavilion, Rewa 486001, MP</p>
        </div>

        <div>
          <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); text-transform:uppercase; font-weight:800; margin-bottom:0.25rem;">Franchise Captain</div>
          <p style="color:var(--c-white); font-weight:700;">Akhil Mishra</p>
          <p style="color:var(--c-gray-400); font-size:0.875rem;">Dread Eleven Talisman &amp; Batter</p>
        </div>
      </div>

      <!-- Quick Inquiry Form -->
      <form onsubmit="event.preventDefault(); alert('Inquiry received. The Dread Eleven management team will review your message.');">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.25rem;">
          <div>
            <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; margin-bottom:0.4rem;">Full Name</label>
            <input type="text" required style="width:100%; background:var(--c-card-bg); border:1px solid var(--b-medium); color:var(--c-white); padding:0.75rem; border-radius:var(--radius-sm); outline:none;">
          </div>
          <div>
            <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; margin-bottom:0.4rem;">Email Address</label>
            <input type="email" required style="width:100%; background:var(--c-card-bg); border:1px solid var(--b-medium); color:var(--c-white); padding:0.75rem; border-radius:var(--radius-sm); outline:none;">
          </div>
        </div>

        <div style="margin-bottom:1.5rem;">
          <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; margin-bottom:0.4rem;">Message / Inquiry</label>
          <textarea rows="4" required style="width:100%; background:var(--c-card-bg); border:1px solid var(--b-medium); color:var(--c-white); padding:0.75rem; border-radius:var(--radius-sm); outline:none;"></textarea>
        </div>

        <button type="submit" class="btn-athletic btn-volt">
          <span>Submit Communication &rarr;</span>
        </button>
      </form>
    </div>
  </div>
</section>

${renderFooter()}
  `;
  fs.writeFileSync(path.join(contactDir, 'index.html'), contactHtml);
  console.log('Generated /contact/index.html');

  // Custom 404.html
  const notFoundHtml = `
${renderHead({
  title: '404 Wicket Down — Page Not Found | Dread Eleven',
  description: 'The requested page or cricket match scorecard could not be located in the Dread Eleven archive.',
  canonicalUrl: '/404'
})}
${renderHeader()}

<section style="padding: 6rem 0 8rem; text-align:center;">
  <div class="container" style="max-width:640px;">
    <div style="font-family:var(--f-athletic); font-size:8rem; color:var(--c-volt); line-height:0.9; margin-bottom:1rem;">
      WICKET DOWN!
    </div>
    <h1 class="section-bigtitle" style="font-size:2.5rem; margin-bottom:1rem;">
      404 • Boundary Not Found
    </h1>
    <p style="color:var(--c-gray-400); font-size:1rem; line-height:1.6; margin-bottom:2.5rem;">
      The requested scorecard or page has been dismissed. Check the URL or return to the official match center to explore 2021–2026 derby archives.
    </p>
    <div style="display:flex; justify-content:center; gap:1.25rem; flex-wrap:wrap;">
      <a href="/" class="btn-athletic btn-volt">Back to Home</a>
      <a href="/results" class="btn-athletic btn-outline">Match Results Archive</a>
    </div>
  </div>
</section>

${renderFooter()}
  `;
  fs.writeFileSync(path.join(rootDir, '404.html'), notFoundHtml);
  console.log('Generated 404.html');
}

// ------------------------------------------------------------
// 8. SITEMAP.XML & ROBOTS.TXT GENERATOR
// ------------------------------------------------------------
function generateSitemapAndRobots() {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/players', changefreq: 'daily', priority: '0.9' },
    { loc: '/fixtures', changefreq: 'daily', priority: '0.9' },
    { loc: '/results', changefreq: 'weekly', priority: '0.8' },
    { loc: '/points-table', changefreq: 'weekly', priority: '0.8' },
    { loc: '/stats', changefreq: 'weekly', priority: '0.8' },
    { loc: '/news', changefreq: 'weekly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' }
  ];

  // Add all player pages (43 players)
  squad.forEach((p) => {
    urls.push({
      loc: `/players/${p.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Add all match pages (35 matches)
  matches.forEach((m) => {
    urls.push({
      loc: `/matches/${m.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Add all news articles
  news.forEach((n) => {
    urls.push({
      loc: `/news/${n.slug}`,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml);

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt);
  console.log(`Generated sitemap.xml with ${urls.length} indexable canonical URLs and robots.txt.`);
}

// ------------------------------------------------------------
// MASTER EXECUTION PIPELINE
// ------------------------------------------------------------
console.log('=== BUILDING DREAD ELEVEN CRICKET CLUB PRODUCTION SUITE (CAPT. AKHIL MISHRA) ===');
generateHomePage();
generateSquadPages();
generateMatchPages();
generatePointsTablePage();
generateStatsPage();
generateNewsPages();
generateAboutAndContactPages();
generateSitemapAndRobots();
console.log('=== BUILD COMPLETE! ALL PAGES GENERATED WITH $4K STUDIO CRAFT & ZERO BLUE ===');
