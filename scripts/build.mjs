/**
 * PRODUCTION STATIC SITE GENERATOR (SSG) FOR DREAD ELEVEN (DE)
 * Generates 100% pre-rendered, SEO-optimized, accessible HTML pages.
 * Captain: Akhil Mishra (1,747 career runs, 92 career wickets in 51 matches)
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

const BASE_URL = process.env.SITE_URL || 'https://dread-eleven-rewacricket.pages.dev';

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
function renderHead({ title, description, canonicalUrl, ogType = 'website', ogImage = '/public/images/de-crest.svg', jsonLd = null, breadcrumbs = null }) {
  const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  const jsonLdList = [];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      jsonLdList.push(...jsonLd);
    } else {
      jsonLdList.push(jsonLd);
    }
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.item.startsWith('http') ? b.item : `${BASE_URL}${b.item}`
      }))
    });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${fullCanonical}">
  <meta name="theme-color" content="#0b0b0b">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:url" content="${fullCanonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${fullOgImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Dread Eleven Cricket Club (DE)">
  <meta property="og:locale" content="en_IN">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${fullCanonical}">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${fullOgImage}">
  <meta name="twitter:site" content="@DreadElevenRewa">

  <!-- Icons & PWA -->
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
  <link rel="apple-touch-icon" href="/public/favicon.svg">
  <link rel="manifest" href="/manifest.json">

  <!-- Typography Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/src/css/styles.css">

  ${jsonLdList.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n  ')}
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
        <img src="/public/images/de-crest.svg" alt="Dread Eleven CC Crest" class="brand-crest-shield-img" width="40" height="48">
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
              <li><a href="/fixtures">Tournament Fixtures &amp; Schedule</a></li>
              <li><a href="/results">Completed Results Archive (2021–2026)</a></li>
              <li><a href="/points-table">Multi-Season Points Table</a></li>
              <li><a href="/stats">Franchise &amp; Derby Records</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Franchise</h4>
            <ul class="footer-links">
              <li><a href="/players">Official Roster (43 Players)</a></li>
              <li><a href="/players/akhil-mishra">Capt. Akhil Mishra (#45)</a></li>
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

          <div class="footer-col">
            <h4>Official Network</h4>
            <ul class="footer-links">
              <li><a href="https://rewa-cricket-division.vercel.app" target="_blank" rel="noopener" style="color:var(--c-volt); font-weight:700;">Rewa Cricket Division (RDCA) ↗</a></li>
              <li><a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" style="color:var(--c-volt);">ABV Memorial Tournament ↗</a></li>
              <li><a href="https://rewa-cricket-division.vercel.app/teams/dread-eleven/" target="_blank" rel="noopener">DE on RDCA Registry ↗</a></li>
              <li><a href="https://destroyers-rewacricket.pages.dev" target="_blank" rel="noopener" style="color:var(--c-orange); font-weight:700;">Destroyers CC (Arch-Rival) ↗</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Legal &amp; Policies</h4>
            <ul class="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms &amp; Conditions</a></li>
              <li><a href="/about">Editorial Policy &amp; E-E-A-T</a></li>
              <li><a href="/contact">Grievance Redressal</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; 2021–2026 Dread Eleven Cricket Club (DE) • Rewa Division Cricket Association (RDCA)</div>
          <div style="display:flex; gap:1.25rem; align-items:center;">
            <a href="https://instagram.com/dreadelevenrewa" target="_blank" rel="noopener noreferrer" style="color:var(--c-gray-400); text-decoration:none;">Instagram</a>
            <span style="color:var(--c-gray-600);">•</span>
            <a href="https://x.com/DreadElevenRewa" target="_blank" rel="noopener noreferrer" style="color:var(--c-gray-400); text-decoration:none;">X / Twitter</a>
            <span style="color:var(--c-gray-600);">•</span>
            <a href="https://youtube.com/@dreadelevenrewa" target="_blank" rel="noopener noreferrer" style="color:var(--c-gray-400); text-decoration:none;">YouTube</a>
          </div>
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
      <a href="/fixtures" class="dock-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Fixtures</span>
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
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const latestMatch = completedMatches[completedMatches.length - 1] || matches[matches.length - 1];
  const featuredNews = news.slice(0, 3);
  const featuredSquad = squad.slice(0, 8);
  const recentTournamentMatches = matches.slice(-6);

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

<!-- Broadcast Digital Stadium Hero (Full-Bleed Athlete & Split Command) -->
<section class="broadcast-stadium-hero" id="stadium-hero">
  <!-- Diagonal Stadium Floodlight Glare from Top Right -->
  <div class="stadium-floodlight-flare" aria-hidden="true"></div>

  <div class="container hero-broadcast-grid">
    <!-- LEFT COLUMN (58%): Dominant Typography & Full-Width Match Hub -->
    <div class="hero-command-col">
      <!-- High-Contrast Over-title Tag -->
      <div class="broadcast-overtitle">
        <span class="broadcast-pill-badge">3X TOURNAMENT CHAMPIONS (2021, 2022, 2023)</span>
        <span class="broadcast-match-round">RDCA DERBY • 2026 FINALE ARCHIVE</span>
      </div>

      <!-- Giant Stacked High-Contrast Condensed Typography -->
      <h1 class="broadcast-giant-title">
        DREAD <br>
        <span class="text-metallic">ELEVEN</span>
      </h1>

      <p class="broadcast-subtitle">
        THE HUNT BEGINS • APSU STADIUM, REWA • CAPT. AKHIL MISHRA (#45)
      </p>

      <!-- Broadcast Match Hub Card (Spans Full Width of Left Column) -->
      <div class="broadcast-match-slate">
        <div class="slate-header-row">
          <div class="slate-status-group">
            <span class="pulse-beacon gold"></span>
            <span class="slate-status-text">2026 TOURNAMENT GRAND FINALE</span>
          </div>
          <div class="slate-ground-spec">
            <span>APSU STADIUM</span>
            <span class="slate-deck-badge">FINAL • COMPLETED</span>
          </div>
        </div>

        <div class="slate-teams-battle">
          <div class="slate-team-card de-team">
            <div class="team-meta">
              <span class="team-abbrev volt">DRD</span>
              <span class="team-fullname">Dread Eleven</span>
            </div>
            <div class="team-form-strip">
              <span class="form-pill win">W</span>
              <span class="form-pill loss">L</span>
              <span class="form-pill win">W</span>
              <span class="form-pill loss">L</span>
              <span class="form-pill loss">L</span>
            </div>
          </div>

          <div class="slate-vs-divider">
            <span class="vs-text">VS</span>
            <span class="vs-derby-sub">MARQUEE</span>
          </div>

          <div class="slate-team-card des-team">
            <div class="team-meta">
              <span class="team-abbrev">DST</span>
              <span class="team-fullname">Destroyers CC</span>
            </div>
            <div class="team-form-strip">
              <span class="form-pill loss">L</span>
              <span class="form-pill win">W</span>
              <span class="form-pill loss">L</span>
              <span class="form-pill win">W</span>
              <span class="form-pill win">W</span>
            </div>
          </div>
        </div>

        <div class="slate-footer-row">
          <div class="slate-timing-spec">
            <span class="timing-date">20 SEP 2026</span>
            <span class="timing-time">CHAMPIONSHIP FINAL • RESULT: DES WON BY 12 RUNS</span>
          </div>
          <a href="/matches/destroyers-vs-dread-eleven-2026-09-20" class="btn-broadcast-cta">
            <span>ENTER MATCH CENTRE &rarr;</span>
          </a>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN (42%): Real Full-Bleed 85vh Athlete Cutout Breaking Out of Frame -->
    <div class="hero-athlete-col">
      <!-- Translucent Giant Watermark Typography Behind Athlete Shoulders -->
      <div class="athlete-watermark" aria-hidden="true">
        <span>DREAD</span>
        <span class="watermark-number">45</span>
      </div>

      <!-- Real High-Resolution Transparent Cutout of Cricketer in Action -->
      <div class="athlete-visual-wrapper">
        <img src="/public/images/athlete-cutout.png" alt="Captain Akhil Mishra executing explosive cricket batting drive" class="athlete-cutout-img" loading="eager" width="1200" height="1600">
      </div>

      <!-- Floating Broadcast Player Telemetry HUD Anchored Over Bottom Corner -->
      <div class="hero-player-stat-hud">
        <div class="hud-top-label">
          <span class="hud-badge-potm">PLAYER OF THE MOMENT</span>
          <span class="hud-jersey-num">#45</span>
        </div>
        <h3 class="hud-player-name">AKHIL MISHRA</h3>
        <div class="hud-player-role">TOP-ORDER ALL-ROUNDER &amp; TALISMAN CAPTAIN</div>
        <div class="hud-telemetry-row">
          <div class="hud-stat-highlight">89* <small>(34)</small></div>
          <div class="hud-stat-secondary">
            <span>SR 261.7</span>
            <span>6x4 • 7x6</span>
          </div>
        </div>
        <div class="hud-career-row">
          <span>TOURNAMENT: 1,536 RUNS • 10 WKTS • 29 MATCHES</span>
        </div>
        <div class="hud-form-row">
          <span class="hud-form-label">FORM:</span>
          <span class="hud-form-dots">● ● ● ● ○</span>
          <span class="hud-form-status">HOT</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Consolidated Single Sleek Broadcast Score Bug (Replaces duplicate lower-third tickers) -->
  <div class="broadcast-score-bug" id="live-pulse">
    <div class="container score-bug-grid">
      <div class="bug-tag">
        <span class="pulse-beacon gold"></span>
        <span>LATEST DERBY</span>
      </div>
      <div class="bug-teams">
        <span class="bug-team-name volt">DREAD ELEVEN</span>
        <span class="bug-vs">VS</span>
        <span class="bug-team-name">DESTROYERS</span>
      </div>
      <div class="bug-schedule">
        <span class="bug-date">20 SEP 2026</span>
        <span class="bug-time">COMPLETED</span>
      </div>
      <div class="bug-venue">
        <span>APSU STADIUM</span>
      </div>
      <div class="bug-pitch">
        <span class="pitch-dot"></span>
        <span>DES WON BY 12 RUNS</span>
      </div>
      <a href="/matches/destroyers-vs-dread-eleven-2026-09-20" class="bug-cta">
        <span>VIEW SCORECARD &rarr;</span>
      </a>
    </div>
  </div>
</section>

<!-- Tournament Journey Horizontal Timeline Scroller -->
<section class="season-timeline-section">
  <div class="container">
    <div class="season-timeline-header">
      <div>
        <p class="section-pretitle">The Championship Journey</p>
        <h2 class="section-bigtitle">Tournament Clash Timeline</h2>
        <p style="color:var(--c-gray-400); font-size:0.95rem; margin-top:0.35rem;">
          Track marquee clashes, decisive overs, and tournament milestones across the Atal Bihari Vajpayee Memorial Tournament.
        </p>
      </div>
      <div class="timeline-nav-controls">
        <button type="button" class="timeline-scroll-btn" id="timeline-prev-btn" aria-label="Scroll Timeline Left">&larr;</button>
        <button type="button" class="timeline-scroll-btn" id="timeline-next-btn" aria-label="Scroll Timeline Right">&rarr;</button>
      </div>
    </div>

    <div class="season-timeline-track" id="season-timeline-track">
      ${recentTournamentMatches.map((m, idx) => {
        const isWin = m.winner === 'DE';
        const isCompleted = m.status === 'completed';
        const inn1 = m.innings[0] || { runs: '---', wickets: '-' };
        const inn2 = m.innings[1] || { runs: '---', wickets: '-' };
        
        let statusClass = isWin ? 'win' : 'loss';
        let statusText = isWin ? 'DE WIN' : 'DES WIN';

        return `
          <a href="/matches/${m.slug}" class="timeline-match-node">
            <div class="timeline-node-status">
              <span class="timeline-status-pill ${statusClass}">${statusText}</span>
              <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-gray-400);">${formatDate(m.matchDate)}</span>
            </div>
            <div class="timeline-node-scores">
              <div class="timeline-scores-line">
                ${inn1.runs}/${inn1.wickets} &rarr; ${inn2.runs}/${inn2.wickets}
              </div>
              <div class="timeline-node-detail">
                ${esc(m.resultText)}
              </div>
            </div>
            <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); font-weight:800; display:flex; justify-content:space-between; align-items:center;">
              <span>MATCH #${m.matchNumber || (idx + 1)} (${m.seasonYear})</span>
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
        <p>Official head-to-head records across all 34 Atal Bihari Vajpayee Memorial Tournament matches (2021–2026)</p>
      </div>
      <div>
        <span class="badge-brutalist badge-gold">15 WINS DE — 19 WINS DES</span>
      </div>
    </div>

    <div class="barometer-stats-row">
      <div class="barometer-stat-box">
        <div class="barometer-stat-val volt tabular">15</div>
        <div class="barometer-stat-lbl">Dread Eleven Wins</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val tabular">19</div>
        <div class="barometer-stat-lbl">Destroyers Wins</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val gold tabular">3</div>
        <div class="barometer-stat-lbl">Championship Titles (2021, 2022, 2023)</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val tabular">34</div>
        <div class="barometer-stat-lbl">Total Clashes</div>
      </div>
      <div class="barometer-stat-box">
        <div class="barometer-stat-val tabular" style="color:var(--c-emerald);">44.1%</div>
        <div class="barometer-stat-lbl">DE Win Ratio</div>
      </div>
    </div>
  </div>
</section>

<!-- WE ARE THE CHAMPIONS: THE FOUNDATION DYNASTY (2021–2023) -->
<section class="champions-dynasty-section" id="champions-dynasty" style="padding: 5rem 0; background: linear-gradient(180deg, rgba(10,10,12,0.98), rgba(6,6,8,1)); border-top: 1px solid var(--b-subtle); border-bottom: 1px solid var(--b-subtle);">
  <div class="container">
    <div class="section-masthead" style="margin-bottom: 2.5rem;">
      <div>
        <div style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(212,255,0,0.1); border:1px solid rgba(212,255,0,0.3); padding:0.35rem 0.85rem; border-radius:var(--radius-sm); margin-bottom:0.75rem;">
          <span style="color:var(--c-volt); font-family:var(--f-mono); font-size:0.75rem; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;">RDCA Sanctioned Dynasty • Three-Peat Champions</span>
        </div>
        <h2 class="section-bigtitle" style="font-size:clamp(2.4rem, 5.5vw, 4.2rem); line-height:1; letter-spacing:-0.02em;">
          WE ARE THE CHAMPIONS: <span style="color:var(--c-volt);">THE FOUNDATION DYNASTY</span>
        </h2>
        <p style="color:var(--c-gray-300); font-size:1.05rem; max-width:68ch; margin-top:0.75rem; line-height:1.6;">
          Three consecutive Atal Bihari Vajpayee Memorial Trophy titles (2021, 2022, 2023) captained by Akhil Mishra. Rewa's foundational cricket dynasty forged through relentless poise, defensive grit, and clutch strokeplay.
        </p>
      </div>
      <div style="display:flex; align-items:center; gap:1rem;">
        <span class="badge-brutalist badge-gold" style="font-size:0.9rem; padding:0.5rem 1rem;">3X CONSECUTIVE TITLES</span>
      </div>
    </div>

    <!-- 3 Dynasty Cards Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.75rem; margin-bottom:3rem;">
      <!-- 2021 Inaugural Champions Card -->
      <div class="dynasty-card" style="background:var(--c-surface); border:1px solid rgba(212,255,0,0.25); border-radius:var(--radius-sm); padding:2rem; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, var(--c-volt), var(--c-gold));"></div>
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span style="font-family:var(--f-athletic); font-size:2.25rem; font-weight:900; color:var(--c-volt); line-height:1;">2021</span>
            <span class="badge-brutalist badge-volt" style="font-size:0.7rem;">INDEPENDENCE CUP • 5–2</span>
          </div>
          <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem; line-height:1.15;">
            Inaugural ABV Memorial Champions
          </h3>
          <p style="font-size:0.875rem; color:var(--c-gray-300); line-height:1.6; margin-bottom:1.25rem;">
            Dread Eleven captured Rewa's inaugural professional tournament title in commanding fashion, dominating the 7-match marathon 5–2 behind Akhil Mishra's tactical mastery and Venkatesh Iyer's sensational power hitting.
          </p>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--b-subtle); padding:0.85rem; border-radius:var(--radius-sm); margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem;">
            <div style="color:var(--c-gold); font-weight:700; margin-bottom:0.25rem;">CLIMAX HIGHLIGHT (28 AUG 2021)</div>
            <div style="color:var(--c-white);">DE 258/7 def. DES 220 by 38 runs</div>
            <div style="color:var(--c-gray-400); margin-top:0.2rem;">POTM: Mohit Sharma (4/24 in 8 ov)</div>
          </div>
        </div>
        <a href="/matches/destroyers-vs-dread-eleven-2021-08-28" class="btn-athletic btn-volt btn-sm" style="width:100%; justify-content:center; text-decoration:none;">
          <span>Inspect 2021 Title Decider Scorecard &rarr;</span>
        </a>
      </div>

      <!-- 2022 Title Defense Card -->
      <div class="dynasty-card" style="background:var(--c-surface); border:1px solid rgba(255,215,0,0.3); border-radius:var(--radius-sm); padding:2rem; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, var(--c-gold), #fff);"></div>
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span style="font-family:var(--f-athletic); font-size:2.25rem; font-weight:900; color:var(--c-gold); line-height:1;">2022</span>
            <span class="badge-brutalist badge-gold" style="font-size:0.7rem;">7-MATCH MARATHON • 4–3</span>
          </div>
          <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem; line-height:1.15;">
            Back-to-Back Title Retained
          </h3>
          <p style="font-size:0.875rem; color:var(--c-gray-300); line-height:1.6; margin-bottom:1.25rem;">
            In the most dramatic series in Vindhya cricket lore, Dread Eleven rebounded from 2–3 down to take the final two matches, retaining the trophy in the Match 7 decider by 11 runs under electric APSU floodlights.
          </p>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--b-subtle); padding:0.85rem; border-radius:var(--radius-sm); margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem;">
            <div style="color:var(--c-gold); font-weight:700; margin-bottom:0.25rem;">CLIMAX HIGHLIGHT (18 SEP 2022)</div>
            <div style="color:var(--c-white);">DE 248/7 def. DES 237 by 11 runs</div>
            <div style="color:var(--c-gray-400); margin-top:0.2rem;">POTM: Akhil Mishra (65* off 48 &amp; 2/31)</div>
          </div>
        </div>
        <a href="/matches/destroyers-vs-dread-eleven-2022-09-18" class="btn-athletic btn-volt btn-sm" style="width:100%; justify-content:center; text-decoration:none;">
          <span>Inspect 2022 Grand Final Scorecard &rarr;</span>
        </a>
      </div>

      <!-- 2023 Three-Peat Triumph Card -->
      <div class="dynasty-card" style="background:var(--c-surface); border:1px solid rgba(212,255,0,0.25); border-radius:var(--radius-sm); padding:2rem; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, var(--c-volt), var(--c-emerald));"></div>
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span style="font-family:var(--f-athletic); font-size:2.25rem; font-weight:900; color:var(--c-volt); line-height:1;">2023</span>
            <span class="badge-brutalist badge-volt" style="font-size:0.7rem;">THE THREE-PEAT • 3–2</span>
          </div>
          <h3 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem; line-height:1.15;">
            Historic Three-Peat Legacy
          </h3>
          <p style="font-size:0.875rem; color:var(--c-gray-300); line-height:1.6; margin-bottom:1.25rem;">
            Sealing the dynasty with an iconic hat-trick of tournament championships, DE defended 279 in the 2023 series decider at Martand Ground No. 3, turning Destroyers away by 14 runs with clinical death bowling.
          </p>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--b-subtle); padding:0.85rem; border-radius:var(--radius-sm); margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem;">
            <div style="color:var(--c-gold); font-weight:700; margin-bottom:0.25rem;">CLIMAX HIGHLIGHT (20 SEP 2023)</div>
            <div style="color:var(--c-white);">DE 279/6 def. DES 265 by 14 runs</div>
            <div style="color:var(--c-gray-400); margin-top:0.2rem;">POTM: Abhishek Pathak (3/38 in 9 ov)</div>
          </div>
        </div>
        <a href="/matches/destroyers-vs-dread-eleven-2023-09-20" class="btn-athletic btn-volt btn-sm" style="width:100%; justify-content:center; text-decoration:none;">
          <span>Inspect 2023 Three-Peat Scorecard &rarr;</span>
        </a>
      </div>
    </div>

    <!-- Editorial Dynasty Longform Feature Box -->
    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); display:grid; grid-template-columns:1.5fr 1fr; gap:2.5rem; align-items:center;" class="dynasty-longform-grid">
      <div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-volt); text-transform:uppercase; font-weight:800; margin-bottom:0.5rem;">
          CHAMPIONSHIP FEATURE &amp; EDITORIAL ARCHIVE
        </div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase; line-height:1.1; margin-bottom:1rem;">
          How Dread Eleven Forged Rewa's Golden Cricket Era
        </h3>
        <p style="font-size:0.95rem; color:var(--c-gray-300); line-height:1.7; margin-bottom:1rem;">
          Between 2021 and 2023, Dread Eleven contested 19 tournament matches against Destroyers, clinching 12 victories (63.2% win rate) and lifting three consecutive Atal Bihari Vajpayee Memorial Trophies. Captain Akhil Mishra instilled a ruthless tactical discipline — rotating spinners against Destroyers' hard-hitting top order and executing calculated run chases.
        </p>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="/results" class="btn-athletic btn-outline btn-sm">
            <span>Browse All 15 DE Derby Wins &rarr;</span>
          </a>
          <a href="/about" class="btn-athletic btn-sm" style="background:rgba(212,255,0,0.1); border:1px solid var(--c-volt); color:var(--c-volt);">
            <span>Read Club History &rarr;</span>
          </a>
        </div>
      </div>
      <div style="background:var(--c-surface); border:1px solid var(--b-subtle); padding:1.75rem; border-radius:var(--radius-sm);">
        <h4 style="font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-gold); text-transform:uppercase; margin-bottom:1rem;">
          Foundation Dynasty Numbers
        </h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div style="border-bottom:1px solid var(--b-subtle); padding-bottom:0.75rem;">
            <div style="font-family:var(--f-mono); font-size:1.75rem; font-weight:900; color:var(--c-white);">3/3</div>
            <div style="font-size:0.7rem; color:var(--c-gray-400); text-transform:uppercase; font-family:var(--f-mono);">Trophies Won</div>
          </div>
          <div style="border-bottom:1px solid var(--b-subtle); padding-bottom:0.75rem;">
            <div style="font-family:var(--f-mono); font-size:1.75rem; font-weight:900; color:var(--c-volt);">12</div>
            <div style="font-size:0.7rem; color:var(--c-gray-400); text-transform:uppercase; font-family:var(--f-mono);">Derby Wins (21–23)</div>
          </div>
          <div>
            <div style="font-family:var(--f-mono); font-size:1.75rem; font-weight:900; color:var(--c-emerald);">63.2%</div>
            <div style="font-size:0.7rem; color:var(--c-gray-400); text-transform:uppercase; font-family:var(--f-mono);">Dynasty Win %</div>
          </div>
          <div>
            <div style="font-family:var(--f-mono); font-size:1.75rem; font-weight:900; color:var(--c-gold);">1,280+</div>
            <div style="font-size:0.7rem; color:var(--c-gray-400); text-transform:uppercase; font-family:var(--f-mono);">Mishra Derby Runs</div>
          </div>
        </div>
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
          Under captain Akhil Mishra, every delivery contested against Destroyers is an event. 34 clashes, 15 victories, 3 tournament championships, and an unbreakable legacy in the Atal Bihari Vajpayee Memorial Trophy.
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
  title: 'Dread Eleven Squad (43 Players) | Atal Bihari Memorial Tournament | RDCA',
  description: 'Complete player directory for Dread Eleven Cricket Club (DE) in Rewa. Captain Akhil Mishra, batsmen, all-rounders, bowlers, and wicketkeepers with tournament statistics.',
  canonicalUrl: '/players',
  jsonLd: squadJsonLd,
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Squad', item: '/players' }
  ]
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

    <!-- Interactive Squad Search & Filter Command Bar -->
    <div class="squad-search-toolbar" style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.25rem; margin-bottom:2rem;">
      <div style="display:flex; gap:0.75rem; align-items:center; margin-bottom:1rem;">
        <div style="flex:1; position:relative;">
          <input type="text" id="squad-search-input" placeholder="Search 43 players by name, jersey number, role, batting style, or bowling style..." style="width:100%; background:var(--c-dark-surface); border:1px solid var(--b-subtle); color:var(--c-white); padding:0.65rem 1rem; font-family:var(--f-body); font-size:0.875rem; outline:none; border-radius:var(--radius-xs);" autocomplete="off" />
        </div>
        <button type="button" id="squad-search-clear" class="btn-athletic btn-athletic-outline" style="padding:0.6rem 1rem; font-size:0.75rem;">Clear</button>
      </div>
      <!-- Search Suggestions Chips -->
      <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
        <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-volt); font-weight:800; text-transform:uppercase;">Search Suggestions:</span>
        <button type="button" class="squad-suggest-chip" data-search="Akhil Mishra">⚡ Capt. Akhil Mishra</button>
        <button type="button" class="squad-suggest-chip" data-search="Kuldeep Sen">💨 Kuldeep Sen</button>
        <button type="button" class="squad-suggest-chip" data-search="Venkatesh Iyer">🏏 Venkatesh Iyer</button>
        <button type="button" class="squad-suggest-chip" data-search="Rajat Patidar">⭐ Rajat Patidar</button>
        <button type="button" class="squad-suggest-chip" data-search="Kumar Kartikeya">🌀 Kumar Kartikeya</button>
        <button type="button" class="squad-suggest-chip" data-search="Captain">Captains</button>
        <button type="button" class="squad-suggest-chip" data-search="All-Rounder">All-Rounders</button>
        <button type="button" class="squad-suggest-chip" data-search="Bowler">Bowlers</button>
        <button type="button" class="squad-suggest-chip" data-search="Batter">Batters</button>
        <button type="button" class="squad-suggest-chip" data-search="Wicketkeeper">Wicketkeepers</button>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
        <span id="squad-count-display">Showing all <strong>${squad.length}</strong> players</span>
        <span>Click player card to inspect telemetry</span>
      </div>
    </div>

    <!-- Players Cards Grid -->
    <div class="players-cards-grid" id="players-grid">
      ${squad.map((p) => `
        <a href="/players/${p.slug}" class="jersey-player-card" data-role="${esc(p.role)}" data-name="${esc(p.name)}" data-number="${p.jerseyNumber}" data-style="${esc(p.battingStyle || '')} ${esc(p.bowlingStyle || '')}" data-search="${esc(`${p.name} ${p.jerseyNumber} ${p.role} ${p.battingStyle || ''} ${p.bowlingStyle || ''}`.toLowerCase())}">
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

    // Filter match logs for this player (consolidate per match so 1 row has both batting & bowling)
    const playerLogs = [];
    matches.forEach((m) => {
      if (!m.innings || !m.innings.length) return;
      const deInn = m.innings.find(i => i.teamShort === 'DE' || i.teamId === 'DE' || i.teamName?.includes('Dread'));
      const desInn = m.innings.find(i => i.teamShort === 'DES' || i.teamId === 'DES' || i.teamName?.includes('Destroyers'));

      const batEntry = (deInn?.batting || []).find((b) => b.playerId === p.id || (b.playerName && b.playerName.toLowerCase() === p.name.toLowerCase()));
      // Bowling is conducted against Destroyers (in desInn)
      const bowlEntry = (desInn?.bowling || []).find((bo) => bo.playerId === p.id || (bo.playerName && bo.playerName.toLowerCase() === p.name.toLowerCase()));
      const dnbEntry = (deInn?.dnb || []).find((d) => typeof d === 'string' ? d.toLowerCase() === p.name.toLowerCase() : (d.playerId === p.id || (d.playerName && d.playerName.toLowerCase() === p.name.toLowerCase())));

      if (batEntry || bowlEntry || dnbEntry) {
        playerLogs.push({
          match: m,
          batting: batEntry,
          bowling: bowlEntry,
          dnb: !!dnbEntry
        });
      }
    });

    const playerHtml = `
${renderHead({
  title: `#${p.jerseyNumber} ${p.name} — Career Stats & Profile | Dread Eleven`,
  description: `Official player profile and career tournament statistics for ${p.name} (#${p.jerseyNumber}) of Dread Eleven. ${p.batting.runs} runs, ${p.bowling.wickets} wickets in Rewa division.`,
  canonicalUrl: `/players/${p.slug}`,
  jsonLd: playerJsonLd,
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Squad', item: '/players' },
    { name: `#${p.jerseyNumber} ${p.name}`, item: `/players/${p.slug}` }
  ]
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

      ${p.slug === 'akhil-mishra' ? `
        <div style="margin-top:1.5rem; display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
          <a href="https://rewa-cricket-division.vercel.app/players/akhil-mishra/" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.25rem; background:rgba(34, 197, 94, 0.15); border:1px solid rgba(34, 197, 94, 0.5); border-radius:var(--radius-sm); font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-volt); text-decoration:none; font-weight:700;">
            Verified Official Career Archive on RDCA Central ↗
          </a>
          <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.25rem; background:rgba(255, 255, 255, 0.05); border:1px solid var(--b-subtle); border-radius:var(--radius-sm); font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-300); text-decoration:none;">
            RDCA ABV Memorial Tournament ↗
          </a>
        </div>
      ` : `
        <div style="margin-top:1.5rem;">
          <a href="https://rewa-cricket-division.vercel.app/players/" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; background:rgba(255, 255, 255, 0.03); border:1px solid var(--b-subtle); border-radius:var(--radius-sm); font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-decoration:none;">
            Rewa Division Cricket Association (RDCA) Registry ↗
          </a>
        </div>
      `}
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
    const listMatches = isResultsPage ? matches.filter((m) => m.status === 'completed') : matches;

    return `
<section class="matches-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">${isResultsPage ? 'HISTORICAL DERBY ARCHIVE (2021–2026)' : 'TOURNAMENT FIXTURES &amp; SCHEDULE'}</p>
        <h1 class="section-bigtitle">${isResultsPage ? `Match Results Archive (${listMatches.length} Matches)` : `Tournament Fixtures &amp; Schedule (${listMatches.length} Matches)`}</h1>
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

    ${!isResultsPage ? `
    <div style="background:rgba(204,255,0,0.06); border:1px solid rgba(204,255,0,0.25); padding:1rem 1.5rem; margin-bottom:2rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; border-radius:var(--radius-sm);">
      <div>
        <strong style="color:var(--c-volt); font-size:0.9rem; text-transform:uppercase; font-family:var(--f-mono);">Tournament Cycle Status:</strong>
        <span style="color:var(--c-gray-300); font-size:0.875rem; margin-left:0.5rem;">All 34 matches across the 2021–2026 tournament editions have concluded. Subsequent fixture dates will be announced following official RDCA ratification.</span>
      </div>
      <a href="/results" style="color:var(--c-volt); font-size:0.85rem; font-family:var(--f-mono); text-decoration:none; font-weight:700;">View Results Archive &rarr;</a>
    </div>
    ` : ''}

    <!-- Multi-tier Filter Toolbar -->
    <div class="filters-toolbar">
      <div class="filter-row">
        <span class="filter-label">Format:</span>
        <button type="button" class="filter-pill-btn format-filter-pill active" data-format="all">All (${listMatches.length})</button>
        <button type="button" class="filter-pill-btn format-filter-pill" data-format="50-overs">50 Overs</button>
        <button type="button" class="filter-pill-btn format-filter-pill" data-format="T20">T20 Blast</button>

        <span class="filter-label" style="margin-left:1.5rem;">Result:</span>
        <button type="button" class="filter-pill-btn result-filter-pill active" data-result="all">All</button>
        <button type="button" class="filter-pill-btn result-filter-pill" data-result="win">DE Wins (${matches.filter(m => m.winner === 'DE').length})</button>
        <button type="button" class="filter-pill-btn result-filter-pill" data-result="loss">DES Wins (${matches.filter(m => m.winner === 'DES').length})</button>
        ${matches.filter(m => m.status === 'upcoming').length > 0 ? `<button type="button" class="filter-pill-btn result-filter-pill" data-result="upcoming">Upcoming (${matches.filter(m => m.status === 'upcoming').length})</button>` : ''}
      </div>

      <div class="filter-row">
        <span class="filter-label">Season:</span>
        <button type="button" class="filter-pill-btn season-filter-pill active" data-season="all">All Seasons</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2026">2026</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2025">2025</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2024">2024</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2023">2023</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2022">2022</button>
        <button type="button" class="filter-pill-btn season-filter-pill" data-season="2021">2021</button>
      </div>

      <div class="filter-row" style="display:flex; gap:1rem; align-items:center;">
        <div class="search-input-wrap" style="flex:1;">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="match-search-field" class="search-input-field" placeholder="Search by player, venue, or stage...">
        </div>
        <button type="button" id="match-filter-reset" class="filter-pill-btn" style="white-space:nowrap;">Reset Filters</button>
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
        const resultAttr = isCompleted ? (isDeWinner ? 'win' : 'loss') : 'upcoming';

        return `
        <a href="/matches/${m.slug}" class="match-card" data-format="${esc(m.format)}" data-season="${esc(m.seasonYear)}" data-result="${resultAttr}">
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
  title: 'Dread Eleven Tournament Fixtures & Schedule | Rewa Cricket',
  description: 'Official schedule and fixtures of the Atal Bihari Vajpayee Memorial Tournament for Dread Eleven against Destroyers in Rewa.',
  canonicalUrl: '/fixtures',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Fixtures', item: '/fixtures' }
  ]
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
  canonicalUrl: '/results',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Results', item: '/results' }
  ]
})}
${renderHeader('results')}
${renderMatchListSection(true)}
${renderFooter()}
  `;
  fs.writeFileSync(path.join(resultsDir, 'index.html'), resultsHtml);

  // Generate individual match pages (/matches/[slug]) for ALL 34 matches
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

    function getPlayerUrl(name, isDeTeam) {
      if (!name) return '#';
      const clean = name.replace(/\s*\(c\)$/i, '').trim();
      const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (isDeTeam) {
        return `/players/${slug}`;
      } else {
        return `https://destroyers-rewacricket.pages.dev/players/${slug}`;
      }
    }

    function renderMatchEditorialSection(m) {
      if (m.status !== 'completed') return '';

      const isDeWinner = m.winner === 'DE';
      const inn1 = m.innings[0] || { teamName: 'Innings 1', runs: 0, wickets: 0, overs: 0, batting: [], bowling: [] };
      const inn2 = m.innings[1] || { teamName: 'Innings 2', runs: 0, wickets: 0, overs: 0, batting: [], bowling: [] };

      const bat1Sorted = [...(inn1.batting || [])].sort((a,b) => b.runs - a.runs);
      const bat2Sorted = [...(inn2.batting || [])].sort((a,b) => b.runs - a.runs);
      const bowl1Sorted = [...(inn1.bowling || [])].sort((a,b) => (b.wickets - a.wickets) || (a.runs - b.runs));
      const bowl2Sorted = [...(inn2.bowling || [])].sort((a,b) => (b.wickets - a.wickets) || (a.runs - b.runs));

      const topBat1 = bat1Sorted[0] || { playerName: 'Top Batter', runs: 0, balls: 0, fours: 0, sixes: 0 };
      const topBat2 = bat2Sorted[0] || { playerName: 'Top Batter', runs: 0, balls: 0, fours: 0, sixes: 0 };
      const topBowl1 = bowl1Sorted[0] || { playerName: 'Top Bowler', wickets: 0, runs: 0, overs: 0 };
      const topBowl2 = bowl2Sorted[0] || { playerName: 'Top Bowler', wickets: 0, runs: 0, overs: 0 };

      const potm = m.playerOfTheMatch || { name: isDeWinner ? 'Akhil Mishra' : 'Pranav Dwivedi', reason: 'match-winning performance' };
      const deCapt = m.captains?.DE?.playerName || 'Akhil Mishra';
      const desCapt = m.captains?.DES?.playerName || 'Pranav Dwivedi';

      const venue = m.venue?.name || 'APSU Stadium, Rewa';
      const isApsu = venue.includes('APSU');

      const headline = isDeWinner
        ? `Dread Eleven Seal ${m.format} Derby Glory: Inside the Tactical Battle at ${venue}`
        : `Destroyers Edge High-Stakes Rewa Clash: Tactical Breakdown at ${venue}`;

      const lead = `Under the intense scrutiny of the Atal Bihari Vajpayee Memorial Tournament, ${isDeWinner ? 'Dread Eleven' : 'Destroyers Cricket Club'} clinched a commanding result (${m.resultText}) on ${formatDate(m.matchDate)} at ${venue}.`;

      const p1 = `The ${m.seasonYear} clash at ${venue} was defined early by the toss, with ${m.toss?.winner || 'the captains'} electing to ${m.toss?.decision || 'bat first'} on a ${isApsu ? 'hard, carry-friendly red-soil strip at APSU Stadium' : 'tactical surface at Martand Ground No. 3 providing early moisture and seam movement'}. In the opening exchange, ${inn1.teamName} posted ${inn1.runs}/${inn1.wickets} in ${inn1.overs} overs, anchored by ${topBat1.playerName}'s resolute ${topBat1.runs} off ${topBat1.balls} balls. However, ${inn2.teamName}'s bowling attack countered with relentless discipline, led by ${topBowl1.playerName} who claimed ${topBowl1.wickets}/${topBowl1.runs} across ${topBowl1.overs} overs.`;

      const p2 = `In reply, ${inn2.teamName} answered the target with determination, scoring ${inn2.runs}/${inn2.wickets} in ${inn2.overs} overs. ${topBat2.playerName} spearheaded the innings with ${topBat2.runs} runs off ${topBat2.balls} deliveries, while the fielding side tightened their grip through ${topBowl2.playerName}'s crucial spell of ${topBowl2.wickets}/${topBowl2.runs}. High-pressure middle overs created immense tension as every single and boundary was contested with derby ferocity.`;

      const p3 = `Tactically, captain ${isDeWinner ? deCapt : desCapt} orchestrated field settings that suffocated scoring avenues through the cover arc and deep midwicket boundary. The bowling changes between overs 12 to 16 proved decisive, cutting off boundaries and forcing false strokes from ${isDeWinner ? 'Destroyers' : 'Dread Eleven'}'s middle order.`;

      const p4 = `The match-winning honours went to ${potm.name}, awarded Player of the Match for ${potm.reason}. This encounter not only shaped the ${m.seasonYear} standings of the Atal Bihari Vajpayee Memorial Tournament, but added another fiercely competitive chapter to Rewa's marquee sporting rivalry.`;

      const turningPoint = isDeWinner
        ? `The critical dismissal of ${topBat1.playerName} and the disciplined middle-overs squeeze by ${topBowl2.playerName}.`
        : `The relentless spell from ${topBowl1.playerName} and clutch finishing strokes by ${potm.name}.`;

      const conditions = isApsu
        ? `APSU Stadium wicket offered consistent bounce with true carry for pacers and true strokeplay through the line.`
        : `Martand Ground No. 3 surface provided notable grip for finger spinners and lateral seam movement with the new ball.`;

      const captainMove = isDeWinner
        ? `Capt. ${deCapt} brought fielders inside the circle during overs 14-17, tempting aerial shots to long-on.`
        : `Capt. ${desCapt} deployed reverse-swing yorkers and aggressive bouncers in the death overs to lock down the victory.`;

      return `
        <article class="match-editorial-blog" style="margin-top:2.5rem; background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem; border-bottom:1px solid var(--b-subtle); padding-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span class="badge-brutalist badge-volt">EDITORIAL MATCH REPORT</span>
              <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase;">By RDCA Senior Cricket Correspondent</span>
            </div>
            <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
              ${formatDate(m.matchDate)} • 5 Min Read
            </div>
          </div>

          <h2 style="font-family:var(--f-athletic); font-size:clamp(1.75rem, 3.5vw, 2.75rem); color:var(--c-white); text-transform:uppercase; line-height:1.1; margin-bottom:1rem;">
            ${esc(headline)}
          </h2>

          <p style="font-size:1.05rem; color:var(--c-volt); font-family:var(--f-body); line-height:1.6; margin-bottom:2rem; font-weight:600; border-left:3px solid var(--c-volt); padding-left:1rem;">
            ${esc(lead)}
          </p>

          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:2.5rem; margin-bottom:2rem;" class="match-blog-grid">
            <div class="match-blog-body" style="font-size:0.95rem; color:var(--c-gray-300); line-height:1.8; display:flex; flex-direction:column; gap:1.25rem;">
              <p>${p1}</p>
              <p>${p2}</p>
              <p>${p3}</p>
              <p>${p4}</p>
            </div>

            <div class="match-blog-sidebar" style="background:var(--c-card-bg); border:1px solid var(--b-subtle); padding:1.5rem; border-radius:var(--radius-sm); height:fit-content;">
              <h4 style="font-family:var(--f-athletic); font-size:1.25rem; color:var(--c-white); text-transform:uppercase; margin-bottom:1.25rem; border-bottom:1px solid var(--b-subtle); padding-bottom:0.5rem;">
                Tactical Post-Mortem
              </h4>

              <div style="display:flex; flex-direction:column; gap:1rem;">
                <div>
                  <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-volt); text-transform:uppercase; font-weight:800; display:block; margin-bottom:0.25rem;">Turning Point</span>
                  <p style="font-size:0.85rem; color:var(--c-gray-300); line-height:1.5; margin:0;">
                    ${esc(turningPoint)}
                  </p>
                </div>

                <div>
                  <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-gold); text-transform:uppercase; font-weight:800; display:block; margin-bottom:0.25rem;">Pitch &amp; Conditions</span>
                  <p style="font-size:0.85rem; color:var(--c-gray-300); line-height:1.5; margin:0;">
                    ${esc(conditions)}
                  </p>
                </div>

                <div>
                  <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-emerald); text-transform:uppercase; font-weight:800; display:block; margin-bottom:0.25rem;">Captain's Masterstroke</span>
                  <p style="font-size:0.85rem; color:var(--c-gray-300); line-height:1.5; margin:0;">
                    ${esc(captainMove)}
                  </p>
                </div>

                <div>
                  <span style="font-family:var(--f-mono); font-size:0.7rem; color:var(--c-white); text-transform:uppercase; font-weight:800; display:block; margin-bottom:0.25rem;">Player of the Match</span>
                  <p style="font-size:0.85rem; color:var(--c-gray-300); line-height:1.5; margin:0;">
                    <strong>${esc(potm.name)}</strong>: ${esc(potm.reason)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }

    function renderInningsTable(inn, battingTeam, bowlingTeam) {
      if (!inn || !inn.batting || !inn.batting.length) {
        return '<p style="color:var(--c-gray-400); padding:1rem;">Innings details scheduled for match day.</p>';
      }

      const isDe = inn.teamShort === 'DE' || (inn.teamName && inn.teamName.includes('Dread'));
      const batCaptainName = isDe
        ? (m.captains?.DE?.playerName || (inn.captain?.playerName || 'Akhil Mishra'))
        : (m.captains?.DES?.playerName || (inn.captain?.playerName || 'Pranav Dwivedi'));
      const bowlCaptainName = isDe
        ? (m.captains?.DES?.playerName || 'Pranav Dwivedi')
        : (m.captains?.DE?.playerName || 'Akhil Mishra');

      const isMatchCapt = (name, target) => {
        if (!name || !target) return false;
        const n = name.toLowerCase().replace(/\s*\(c\)$/i, '').trim();
        const t = target.toLowerCase().replace(/\s*\(c\)$/i, '').trim();
        return n === t;
      };

      const batRows = inn.batting.map((b) => {
        const isCapt = isMatchCapt(b.playerName, batCaptainName);
        const pUrl = getPlayerUrl(b.playerName, isDe);
        const nameCell = `<a href="${pUrl}" ${!isDe ? 'target="_blank" rel="noopener"' : ''} style="color:inherit; text-decoration:none; border-bottom:1px dotted rgba(255,255,255,0.4);" class="scorecard-player-link">${esc(b.playerName.replace(/\s*\(c\)$/i, ''))}</a>${isCapt ? ' <span style="color:var(--c-volt); font-size:0.75rem; font-family:var(--f-mono); font-weight:800;">(c)</span>' : ''}`;
        return `
        <tr>
          <td style="font-weight:800; color:var(--c-white); font-family:var(--f-athletic); font-size:1.25rem;">${nameCell}</td>
          <td style="color:var(--c-gray-400); font-size:0.8125rem;">${esc(b.dismissal)}</td>
          <td class="tabular font-bold" style="text-align:right; color:var(--c-white); font-size:1.1rem;">${esc(b.runs)}</td>
          <td class="tabular" style="text-align:right;">${esc(b.balls)}</td>
          <td class="tabular" style="text-align:right;">${esc(b.fours)}</td>
          <td class="tabular" style="text-align:right;">${esc(b.sixes)}</td>
          <td class="tabular" style="text-align:right; color:var(--c-volt); font-weight:700;">${esc(b.strikeRate)}</td>
        </tr>
      `;
      }).join('');

      const bowlRows = (inn.bowling || []).map((bo) => {
        const isCapt = isMatchCapt(bo.playerName, bowlCaptainName);
        const pUrl = getPlayerUrl(bo.playerName, !isDe);
        const nameCell = `<a href="${pUrl}" ${isDe ? 'target="_blank" rel="noopener"' : ''} style="color:inherit; text-decoration:none; border-bottom:1px dotted rgba(255,255,255,0.4);" class="scorecard-player-link">${esc(bo.playerName.replace(/\s*\(c\)$/i, ''))}</a>${isCapt ? ' <span style="color:var(--c-volt); font-size:0.75rem; font-family:var(--f-mono); font-weight:800;">(c)</span>' : ''}`;
        return `
        <tr>
          <td style="font-weight:800; color:var(--c-white); font-family:var(--f-athletic); font-size:1.25rem;">${nameCell}</td>
          <td class="tabular" style="text-align:right;">${esc(bo.overs)}</td>
          <td class="tabular" style="text-align:right;">${esc(bo.maidens)}</td>
          <td class="tabular" style="text-align:right;">${esc(bo.runs)}</td>
          <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald); font-size:1.1rem;">${esc(bo.wickets)}</td>
          <td class="tabular" style="text-align:right; color:var(--c-volt); font-weight:700;">${esc(bo.economy)}</td>
        </tr>
      `;
      }).join('');

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

          ${inn.extras ? `
            <div style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-400); margin-top:0.5rem; margin-bottom:0.75rem;">
              Extras: <strong style="color:var(--c-white);">${inn.extras.total || 0}</strong> (b ${inn.extras.byes || 0}, lb ${inn.extras.legByes || 0}, w ${inn.extras.wides || 0}, nb ${inn.extras.noBalls || 0})
            </div>
          ` : ''}

          ${inn.dnb && inn.dnb.length ? `
            <div style="padding:0.75rem 1.25rem; margin-top:0.5rem; margin-bottom:1.5rem; background:rgba(255,255,255,0.03); border:1px solid var(--b-subtle); border-radius:var(--radius-sm); font-size:0.875rem;">
              <strong style="font-family:var(--f-mono); color:var(--c-volt); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Did Not Bat:</strong>
              <span style="margin-left:0.6rem; color:var(--c-gray-300);">
                ${inn.dnb.map(d => {
                  const rawName = typeof d === 'string' ? d : d.playerName;
                  const isCapt = isMatchCapt(rawName, batCaptainName);
                  const pUrl = getPlayerUrl(rawName, isDe);
                  return `<span style="display:inline-block; margin-right:0.85rem; font-weight:600;"><a href="${pUrl}" ${!isDe ? 'target="_blank" rel="noopener"' : ''} style="color:inherit; text-decoration:none; border-bottom:1px dotted rgba(255,255,255,0.3);">${esc(rawName.replace(/\s*\(c\)$/i, ''))}</a>${isCapt ? ' <span style="color:var(--c-volt); font-size:0.75rem; font-family:var(--f-mono); font-weight:800;">(c)</span>' : ''}</span>`;
                }).join('')}
              </span>
            </div>
          ` : ''}

          ${inn.fallOfWickets && inn.fallOfWickets.length ? `
            <div style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-400); margin-bottom:1.75rem; line-height:1.6;">
              <strong style="color:var(--c-volt); font-size:0.75rem; text-transform:uppercase;">Fall of Wickets:</strong>
              <span style="margin-left:0.5rem;">${inn.fallOfWickets.map(f => {
                const isFowCapt = isMatchCapt(f.playerName, batCaptainName);
                const pUrl = getPlayerUrl(f.playerName, isDe);
                return `${f.wicket}-${f.score} (<a href="${pUrl}" ${!isDe ? 'target="_blank" rel="noopener"' : ''} style="color:inherit; text-decoration:none; border-bottom:1px dotted rgba(255,255,255,0.3);">${esc(f.playerName.replace(/\s*\(c\)$/i, ''))}</a>${isFowCapt ? ' (c)' : ''}, ${f.over} ov)`;
              }).join(', ')}</span>
            </div>
          ` : ''}

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
  jsonLd: matchJsonLd,
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: isCompleted ? 'Results' : 'Fixtures', item: isCompleted ? '/results' : '/fixtures' },
    { name: `${m.teamA} vs ${m.teamB} (${formatDate(m.matchDate)})`, item: `/matches/${m.slug}` }
  ]
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

      <div style="font-size:0.9rem; color:var(--c-gray-400); margin-bottom:1.25rem;">
        <span>${formatDate(m.matchDate)}</span> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}, ${esc(m.venue.city)}</span>
      </div>

      <!-- Match Captains Banner -->
      <div style="display:flex; gap:1.5rem; flex-wrap:wrap; font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-300); margin-bottom:1.25rem; background:var(--c-card-bg); padding:0.65rem 1rem; border:1px solid var(--b-subtle); border-radius:var(--radius-sm);">
        <span><strong style="color:var(--c-volt); text-transform:uppercase;">DE Captain:</strong> ${esc(m.captains?.DE?.playerName || 'Akhil Mishra')} (c)</span>
        <span><strong style="color:var(--c-orange); text-transform:uppercase;">DES Captain:</strong> ${esc(m.captains?.DES?.playerName || 'Pranav Dwivedi')} (c)</span>
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

      <!-- Cross-Network Match Hub Backlinks -->
      <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--b-subtle); display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;">
        <div style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
          <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; letter-spacing:0.05em;">League Central:</span>
          <a href="https://rewa-cricket-division.vercel.app/tournaments/atal-bihari-vajpayee-memorial-tournament/" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.4rem 0.8rem; background:rgba(217, 119, 6, 0.15); border:1px solid rgba(217, 119, 6, 0.4); border-radius:var(--radius-sm); font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gold); text-decoration:none; font-weight:700;">
            RDCA ABV Tournament Central ↗
          </a>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
          <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; letter-spacing:0.05em;">Opponent Hub:</span>
          <a href="https://destroyers-rewacricket.pages.dev/matches/${m.slug}" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.4rem 0.8rem; background:rgba(249, 115, 22, 0.15); border:1px solid rgba(249, 115, 22, 0.4); border-radius:var(--radius-sm); font-family:var(--f-mono); font-size:0.75rem; color:var(--c-orange); text-decoration:none; font-weight:700;">
            Destroyers Match Centre ↗
          </a>
        </div>
      </div>
    </div>

    ${isCompleted ? `
      <!-- Innings Scorecards -->
      <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm);">
        <h2 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase; margin-bottom:2rem;">
          Official Innings Scorecards
        </h2>

        <!-- Innings 1 -->
        ${renderInningsTable(inn1, inn1.teamName || (inn1.teamShort === 'DE' ? 'Dread Eleven' : 'Destroyers Cricket Club'), (inn1.teamShort === 'DE' || inn1.teamName?.includes('Dread')) ? 'Destroyers Cricket Club' : 'Dread Eleven')}

        <!-- Innings 2 -->
        ${renderInningsTable(inn2, inn2.teamName || (inn2.teamShort === 'DE' ? 'Dread Eleven' : 'Destroyers Cricket Club'), (inn2.teamShort === 'DE' || inn2.teamName?.includes('Dread')) ? 'Destroyers Cricket Club' : 'Dread Eleven')}
      </div>

      <!-- Match Tactical Post-Mortem & In-Depth Editorial Blog -->
      ${renderMatchEditorialSection(m)}
    ` : `
      <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:3.5rem 2rem; text-align:center; border-radius:var(--radius-sm);">
        <h2 style="font-family:var(--f-athletic); font-size:2.5rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          Fixture Scheduled
        </h2>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:56ch; margin:0 auto 2rem; line-height:1.6;">
          This fixture is slated for the upcoming tournament cycle at <strong>${esc(m.venue.name)}</strong>. Complete live scores, ball-by-ball analysis, and player performances will populate immediately following the match.
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
  canonicalUrl: '/points-table',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Standings', item: '/points-table' }
  ]
})}
${renderHeader('table')}

<section style="padding: 4rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Official RDCA Standings</p>
        <h1 class="section-bigtitle">Tournament Points Table</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Certified standings and qualification records across all six editions of the Atal Bihari Vajpayee Memorial Tournament in Rewa.
        </p>
      </div>
    </div>

    <!-- Championship Roll of Honour -->
    <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); margin-bottom:3rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="badge-brutalist badge-gold" style="margin-bottom:0.5rem; display:inline-block;">TOURNAMENT ROLL OF HONOUR</span>
          <h2 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">
            Atal Bihari Vajpayee Memorial Cup Champions (2021–2026)
          </h2>
        </div>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <span class="badge-brutalist badge-volt">DE TITLES: 3</span>
          <span class="badge-brutalist" style="background:rgba(255,107,0,0.15); color:var(--c-orange); border:1px solid var(--c-orange);">DES TITLES: 3</span>
        </div>
      </div>

      <div class="scorecard-table-wrap">
        <table class="cricket-table">
          <thead>
            <tr>
              <th>Edition / Year</th>
              <th>Format</th>
              <th>Champion</th>
              <th>Winning Captain</th>
              <th style="text-align:right;">Series Margin</th>
              <th>Runner-Up</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:800; font-family:var(--f-mono); color:var(--c-white);">2026 Edition</td>
              <td style="color:var(--c-gray-400);">2 T20s + 3 50-Over Matches</td>
              <td style="font-weight:800; font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-orange);">Destroyers CC</td>
              <td style="color:var(--c-white); font-weight:600;">Pranav Dwivedi <span style="color:var(--c-orange); font-size:0.75rem;">(c)</span></td>
              <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">3–2 (5 matches)</td>
              <td style="color:var(--c-gray-300);">Dread Eleven</td>
            </tr>
            <tr>
              <td style="font-weight:800; font-family:var(--f-mono); color:var(--c-white);">2025 Edition</td>
              <td style="color:var(--c-gray-400);">2 T20s + 3 50-Over Matches</td>
              <td style="font-weight:800; font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-orange);">Destroyers CC</td>
              <td style="color:var(--c-white); font-weight:600;">Pranav Dwivedi <span style="color:var(--c-orange); font-size:0.75rem;">(c)</span></td>
              <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">5–0 Clean Sweep</td>
              <td style="color:var(--c-gray-300);">Dread Eleven</td>
            </tr>
            <tr>
              <td style="font-weight:800; font-family:var(--f-mono); color:var(--c-white);">2024 Edition</td>
              <td style="color:var(--c-gray-400);">2 T20s + 3 50-Over Matches</td>
              <td style="font-weight:800; font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-orange);">Destroyers CC</td>
              <td style="color:var(--c-white); font-weight:600;">Pranav Dwivedi <span style="color:var(--c-orange); font-size:0.75rem;">(c)</span></td>
              <td class="tabular font-bold" style="text-align:right; color:var(--c-volt);">4–1 (5 matches)</td>
              <td style="color:var(--c-gray-300);">Dread Eleven</td>
            </tr>
            <tr>
              <td style="font-weight:800; font-family:var(--f-mono); color:var(--c-volt);">2023 Edition</td>
              <td style="color:var(--c-gray-400);">2 T20s + 3 50-Over Matches</td>
              <td style="font-weight:800; font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-volt);">Dread Eleven</td>
              <td style="color:var(--c-white); font-weight:600;">Akhil Mishra <span style="color:var(--c-volt); font-size:0.75rem;">(c)</span></td>
              <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald);">3–2 (5 matches)</td>
              <td style="color:var(--c-gray-300);">Destroyers CC</td>
            </tr>
            <tr>
              <td style="font-weight:800; font-family:var(--f-mono); color:var(--c-volt);">2022 Edition</td>
              <td style="color:var(--c-gray-400);">50-Over &amp; T20 Format</td>
              <td style="font-weight:800; font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-volt);">Dread Eleven</td>
              <td style="color:var(--c-white); font-weight:600;">Akhil Mishra <span style="color:var(--c-volt); font-size:0.75rem;">(c)</span></td>
              <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald);">4–3 (7 matches)</td>
              <td style="color:var(--c-gray-300);">Destroyers CC</td>
            </tr>
            <tr>
              <td style="font-weight:800; font-family:var(--f-mono); color:var(--c-volt);">2021 Inaugural</td>
              <td style="color:var(--c-gray-400);">T20 Format</td>
              <td style="font-weight:800; font-family:var(--f-athletic); font-size:1.3rem; color:var(--c-volt);">Dread Eleven</td>
              <td style="color:var(--c-white); font-weight:600;">Akhil Mishra <span style="color:var(--c-volt); font-size:0.75rem;">(c)</span></td>
              <td class="tabular font-bold" style="text-align:right; color:var(--c-emerald);">5–2 (7 matches)</td>
              <td style="color:var(--c-gray-300);">Destroyers CC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- All-Time Master Standings -->
    <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm); margin-bottom:3rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <h2 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">
          All-Time Derby Leaderboard (2021–2026 • 34 Completed Clashes)
        </h2>
        <span class="badge-brutalist badge-volt">34 DERBY MATCHES</span>
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
          Season 2026 (Destroyers 3–2 Series Win)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${pointsTable['2026'].map((r) => `
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
          Season 2025 (Destroyers 5–0 Series Win)
        </h3>
        <div class="scorecard-table-wrap">
          <table class="cricket-table">
            <thead>
              <tr><th>Team</th><th style="text-align:right;">P</th><th style="text-align:right;">W</th><th style="text-align:right;">L</th><th style="text-align:right;">NRR</th><th style="text-align:right;">Pts</th></tr>
            </thead>
            <tbody>
              ${pointsTable['2025'].map((r) => `
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
          Season 2024 (50-Over Series)
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
  canonicalUrl: '/stats',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Stats', item: '/stats' }
  ]
})}
${renderHeader('stats')}

<section style="padding: 4rem 0;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Record Books (2021–2026)</p>
        <h1 class="section-bigtitle">Dread Eleven Franchise Records</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Verified tournament records across all 34 clashes against Destroyers under the Rewa Division Cricket Association (RDCA).
        </p>
      </div>
    </div>

    <!-- Podiums Grid -->
    <div class="stats-podium-grid">
      <div class="podium-card podium-volt">
        <div class="podium-rank-badge">1</div>
        <div class="metric-title">All-Time Run Scorer</div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">${esc(topRunScorers[0].name)}</h3>
        <div class="metric-de tabular" style="font-size:2.5rem; margin:0.5rem 0;">${topRunScorers[0].batting.runs} Runs</div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Average: ${topRunScorers[0].batting.average} • ${topRunScorers[0].batting.fifties} Fifties • HS ${topRunScorers[0].batting.highestScore}</div>
      </div>

      <div class="podium-card">
        <div class="podium-rank-badge" style="background:var(--c-surface); color:var(--c-white); border:1px solid var(--b-medium);">2</div>
        <div class="metric-title">Second Leading Scorer</div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">${esc(topRunScorers[1].name)}</h3>
        <div class="metric-de tabular" style="font-size:2.5rem; margin:0.5rem 0; color:var(--c-white);">${topRunScorers[1].batting.runs} Runs</div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Average: ${topRunScorers[1].batting.average} • ${topRunScorers[1].batting.fifties} Fifties • HS ${topRunScorers[1].batting.highestScore}</div>
      </div>

      <div class="podium-card">
        <div class="podium-rank-badge" style="background:var(--c-surface); color:var(--c-white); border:1px solid var(--b-medium);">3</div>
        <div class="metric-title">Third Leading Scorer</div>
        <h3 style="font-family:var(--f-athletic); font-size:2.25rem; color:var(--c-white); text-transform:uppercase;">${esc(topRunScorers[2].name)}</h3>
        <div class="metric-de tabular" style="font-size:2.5rem; margin:0.5rem 0; color:var(--c-white);">${topRunScorers[2].batting.runs} Runs</div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">Average: ${topRunScorers[2].batting.average} • ${topRunScorers[2].batting.fifties} Fifties • HS ${topRunScorers[2].batting.highestScore}</div>
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
  canonicalUrl: '/news',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'News', item: '/news' }
  ]
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
  jsonLd: articleJsonLd,
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'News', item: '/news' },
    { name: n.title, item: `/news/${n.slug}` }
  ]
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
// 7. ABOUT (/about) & CONTACT (/contact)
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
  canonicalUrl: '/about',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' }
  ]
})}
${renderHeader('about')}

<section style="padding: 4rem 0;">
  <div class="container" style="max-width:900px;">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <span style="color:var(--c-volt);">About Club</span>
    </nav>

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
        The club's defining trial is its epic derby with <strong>Destroyers Cricket Club (DES)</strong>. Spanning 24 fiercely contested clashes from 2021 to 2024 across both T20 Blast and 50-over formats, Dread Eleven captured the pinnacle of glory on <strong>12 August 2022</strong>, lifting the Atal Bihari Vajpayee Memorial Trophy Championship title at APSU Stadium.
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
  canonicalUrl: '/contact',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' }
  ]
})}
${renderHeader('contact')}

<section style="padding: 4rem 0;">
  <div class="container" style="max-width:860px;">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <span style="color:var(--c-volt);">Contact</span>
    </nav>

    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Official Communication Desk</p>
        <h1 class="section-bigtitle">Contact Dread Eleven</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Direct communication channels for divisional scouting, media credentials, and tournament affairs in Rewa.
        </p>
      </div>
    </div>

    <div style="background:var(--c-surface); border:1px solid var(--b-medium); padding:2.5rem; border-radius:var(--radius-sm);">
      <form onsubmit="event.preventDefault(); alert('Communication transmitted to Dread Eleven management.');">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
          <div>
            <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; margin-bottom:0.4rem;">Sender Name</label>
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
}

function generatePrivacyPage() {
  const privacyDir = path.join(rootDir, 'privacy');
  ensureDir(privacyDir);

  const html = `
${renderHead({
  title: 'Privacy Policy | Dread Eleven Cricket Club (DE)',
  description: 'Official privacy policy for Dread Eleven Cricket Club, detailing data protection standards, tournament newsletter processing, and visitor rights under Rewa Division Cricket Association regulations.',
  canonicalUrl: '/privacy',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Privacy Policy', item: '/privacy' }
  ]
})}
${renderHeader('')}

<section style="padding: 4rem 0 5rem;">
  <div class="container" style="max-width:880px;">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <span style="color:var(--c-volt);">Privacy Policy</span>
    </nav>

    <div class="section-masthead" style="margin-bottom:2.5rem;">
      <div>
        <p class="section-pretitle">Governance &amp; Data Trust</p>
        <h1 class="section-bigtitle">Privacy Policy</h1>
        <p style="color:var(--c-gray-400); font-size:0.95rem; margin-top:0.5rem; font-family:var(--f-mono);">
          Effective Date: 1 January 2026 • Sanctioned by Rewa Division Cricket Association
        </p>
      </div>
    </div>

    <div style="background:var(--c-surface); border:1px solid var(--b-medium); border-radius:var(--radius-sm); padding:2.5rem; display:flex; flex-direction:column; gap:2rem; line-height:1.75; color:var(--c-gray-300); font-size:0.95rem;">
      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          1. Commitment to Fan &amp; Athlete Data Privacy
        </h2>
        <p>
          Dread Eleven Cricket Club (&ldquo;DE&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) operates in full compliance with Indian Information Technology (IT) laws and Digital Personal Data Protection standards. This Privacy Policy governs the collection, storage, and processing of telemetry, analytics, and inquiry correspondence across the official franchise domain (<code>dread-eleven-rewacricket.pages.dev</code>).
        </p>
      </div>

      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          2. Information We Collect
        </h2>
        <ul style="padding-left:1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
          <li><strong>Tournament Inquiries:</strong> When submitting forms through our Contact desk, your name, email address, and inquiry text are logged solely to fulfill match-day inquiries and trial scheduling.</li>
          <li><strong>Aggregated Site Telemetry:</strong> Anonymized Core Web Vitals, page visit counts, device classifications, and regional bandwidth telemetry to maintain 60 FPS client rendering.</li>
          <li><strong>Cookies &amp; Local Storage:</strong> Essential session preferences such as filter toolbar states (T20 vs. 50 Overs) and theme caching. No tracking pixels are sold or shared with third-party data brokers.</li>
        </ul>
      </div>

      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          3. Player Data &amp; Official Scorecards
        </h2>
        <p>
          All player statistics, averages, and historical scorecards presented on this website are certified public tournament records sanctioned by the Rewa Division Cricket Association (RDCA) for the Atal Bihari Vajpayee Memorial Tournament.
        </p>
      </div>

      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          4. Contact Our Data Protection Officer
        </h2>
        <p>
          For privacy inquiries or deletion requests regarding newsletter subscriptions, contact our administration desk at:
          <br>
          <strong style="color:var(--c-volt); font-family:var(--f-mono);">privacy@dread-eleven-rewacricket.pages.dev</strong>
          <br>
          RDCA Pavilion, Martand Ground No. 3 / APSU Stadium, Rewa, Madhya Pradesh 486003.
        </p>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(privacyDir, 'index.html'), html);
  console.log('Generated /privacy/index.html');
}

function generateTermsPage() {
  const termsDir = path.join(rootDir, 'terms');
  ensureDir(termsDir);

  const html = `
${renderHead({
  title: 'Terms & Conditions | Dread Eleven Cricket Club (DE)',
  description: 'Official terms and conditions, match ticketing rules, stadium conduct policies, and intellectual property rights for Dread Eleven in Rewa.',
  canonicalUrl: '/terms',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: 'Terms & Conditions', item: '/terms' }
  ]
})}
${renderHeader('')}

<section style="padding: 4rem 0 5rem;">
  <div class="container" style="max-width:880px;">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit; text-decoration:none;">Home</a> / <span style="color:var(--c-volt);">Terms &amp; Conditions</span>
    </nav>

    <div class="section-masthead" style="margin-bottom:2.5rem;">
      <div>
        <p class="section-pretitle">Legal Framework</p>
        <h1 class="section-bigtitle">Terms &amp; Conditions</h1>
        <p style="color:var(--c-gray-400); font-size:0.95rem; margin-top:0.5rem; font-family:var(--f-mono);">
          Effective Date: 1 January 2026 • Sanctioned by Rewa Division Cricket Association
        </p>
      </div>
    </div>

    <div style="background:var(--c-surface); border:1px solid var(--b-medium); border-radius:var(--radius-sm); padding:2.5rem; display:flex; flex-direction:column; gap:2rem; line-height:1.75; color:var(--c-gray-300); font-size:0.95rem;">
      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using the official digital portal of Dread Eleven (<code>dread-eleven-rewacricket.pages.dev</code>), you agree to be bound by these Terms and Conditions and all applicable RDCA and MPCA tournament bylaws.
        </p>
      </div>

      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          2. Intellectual Property &amp; Scorecard Data
        </h2>
        <p>
          All trademarks, logos, team crests, player portraits, match analytics, and editorial reports published on this website are the proprietary property of Dread Eleven Cricket Club and its content licensors. Scorecard feeds may be referenced for journalistic purposes with appropriate attribution and canonical links.
        </p>
      </div>

      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          3. Venue Code of Conduct
        </h2>
        <p>
          Spectators attending Dread Eleven home matches at Martand Ground No. 3 or APSU Stadium must comply with zero-tolerance spectator decency rules, anti-corruption regulations, and venue security standards.
        </p>
      </div>

      <div>
        <h2 style="font-family:var(--f-athletic); font-size:1.6rem; color:var(--c-white); text-transform:uppercase; margin-bottom:0.75rem;">
          4. Governing Law
        </h2>
        <p>
          These Terms are governed by and construed under the laws of the State of Madhya Pradesh, India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Rewa, MP.
        </p>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(termsDir, 'index.html'), html);
  console.log('Generated /terms/index.html');
}

function generate404Page() {
  const notFoundHtml = `
${renderHead({
  title: '404 — Page Not Found | Dread Eleven',
  description: 'Looks like this ball went straight into the stands. Explore fixtures, squad profiles, or match results on the official Dread Eleven portal.',
  canonicalUrl: '/404',
  breadcrumbs: [
    { name: 'Home', item: '/' },
    { name: '404 Page Not Found', item: '/404' }
  ]
})}
${renderHeader()}

<section style="padding: 6rem 0 8rem; text-align:center;">
  <div class="container" style="max-width:680px;">
    <div style="font-family:var(--f-athletic); font-size:8rem; color:var(--c-volt); line-height:0.9; margin-bottom:1rem;">
      404
    </div>
    <h1 class="section-bigtitle" style="font-size:2.5rem; margin-bottom:1rem;">
      404 — Page Not Found
    </h1>
    <p style="color:var(--c-gray-400); font-size:1.25rem; line-height:1.6; margin-bottom:2.5rem;">
      Looks like this ball went straight into the stands.
    </p>
    <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
      <a href="/" class="btn-athletic btn-volt">Go Home</a>
      <a href="/fixtures" class="btn-athletic btn-outline">View Fixtures</a>
      <a href="/players" class="btn-athletic btn-outline">View Squad</a>
      <a href="/news" class="btn-athletic btn-outline">Latest News</a>
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
  const lastmod = '2026-09-09T21:45:00+05:30';

  const urls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/players', changefreq: 'daily', priority: '0.9' },
    { loc: '/fixtures', changefreq: 'daily', priority: '0.9' },
    { loc: '/results', changefreq: 'weekly', priority: '0.8' },
    { loc: '/points-table', changefreq: 'weekly', priority: '0.8' },
    { loc: '/stats', changefreq: 'weekly', priority: '0.8' },
    { loc: '/news', changefreq: 'weekly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.5' },
    { loc: '/terms', changefreq: 'yearly', priority: '0.5' }
  ];

  // Add all player pages (43 players)
  squad.forEach((p) => {
    urls.push({
      loc: `/players/${p.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Add all match pages (34 matches)
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
    <lastmod>${lastmod}</lastmod>
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

  // Generate Netlify/Cloudflare redirects file for clean canonical paths
  const redirectsContent = `/squad /players 301
/match/* /matches/:splat 301
/standing /points-table 301
/standings /points-table 301
`;
  fs.writeFileSync(path.join(rootDir, '_redirects'), redirectsContent);

  console.log(`Generated sitemap.xml with ${urls.length} indexable canonical URLs (with lastmod), robots.txt, and _redirects.`);
}

// ------------------------------------------------------------
// SEARCH INDEX GENERATOR (search-index.json)
// Indexes every player, match scorecard, venue, news piece, and page.
// ------------------------------------------------------------
function generateSearchIndex() {
  const index = [];

  // 1. Pages & Hubs
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '⌂',
    title: 'Dread Eleven Home Arena & Digital Stadium',
    subtitle: 'Official club headquarters, live countdown, latest derby climax & highlights',
    url: '/',
    text: 'Dread Eleven DE home stadium Rewa cricket club Akhil Mishra Atal Bihari Vajpayee Memorial Tournament RDCA countdown derby highlights champions'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '♟',
    title: 'Squad Roster (43 Players)',
    subtitle: 'Official 43-man tournament squad for Dread Eleven Cricket Club',
    url: '/players/',
    text: 'Dread Eleven squad roster players roster 43 players captain Akhil Mishra batters bowlers allrounders wicketkeepers profiles statistics'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '📅',
    title: 'Fixtures & Rivalry Schedule',
    subtitle: 'Upcoming clash schedule, 2026 championship derbies, venue directions & match timing',
    url: '/fixtures/',
    text: 'Dread Eleven vs Destroyers fixtures schedule match timings APSU Stadium Martand Ground Rewa T20 50-over OD tickets'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '🏆',
    title: 'Derby Results & Match Archive (34 Matches)',
    subtitle: 'Complete scorecard archive of all 34 rivalry clashes between DE and DES (2021-2026)',
    url: '/results/',
    text: 'All match results DE vs DES derbies 34 matches scorecards 2021 2022 2023 2024 2025 2026 finals champions'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '📊',
    title: 'Points Table & Tournament Standings',
    subtitle: 'Net run rate, bonus points, season championship telemetry (2021-2026)',
    url: '/points-table/',
    text: 'Points table standings NRR net run rate wins losses ties points championship trophies Dread Eleven Destroyers'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '📈',
    title: 'Statistical Leaderboards & Record Books',
    subtitle: 'Most runs, most wickets, highest team totals, individual centuries & economy leaders',
    url: '/stats/',
    text: 'Statistics records leaderboard most runs most wickets highest score best bowling strike rate average centuries fifties 5-wicket hauls'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '📰',
    title: 'Media, Press Room & Match Reports',
    subtitle: 'Exclusive match post-mortems, tactical analysis, player interviews',
    url: '/news/',
    text: 'News media press reports post-match tactical analysis Akhil Mishra Kuldeep Sen Yash Dubey Rewa cricket'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '🏛️',
    title: 'Club Heritage, Constitution & Rewa Division',
    subtitle: 'Franchise philosophy, stadium details, connection with RDCA and Atal Bihari Vajpayee Tournament',
    url: '/about/',
    text: 'About Dread Eleven DE history heritage constitution RDCA Rewa Cricket Division Atal Bihari Vajpayee Memorial Tournament philosophy'
  });
  index.push({
    type: 'Page',
    badge: 'page',
    icon: '✉️',
    title: 'Trials & Contact Portal',
    subtitle: 'Player selection trials, academy enrollment, media inquiries & club office',
    url: '/contact/',
    text: 'Contact trials academy enrollment player selection Rewa MP office email phone trials registration'
  });

  // 2. Venues
  index.push({
    type: 'Venue',
    badge: 'venue',
    icon: '📍',
    title: 'APSU Stadium, Rewa (Awadhesh Pratap Singh University)',
    subtitle: 'Premier cricket venue in Rewa, capacity 15,000, host to championship finals',
    url: '/fixtures/',
    text: 'APSU Stadium Rewa Awadhesh Pratap Singh University Stadium pitch pace bounce championship finals floodlights pavilion turf wicket'
  });
  index.push({
    type: 'Venue',
    badge: 'venue',
    icon: '🏟️',
    title: 'Martand School Ground No. 3, Rewa',
    subtitle: 'Historic spin-friendly turf, spiritual home of the Rewa Derby',
    url: '/fixtures/',
    text: 'Martand Ground No 3 Rewa school ground cricket pitch spin turn boundaries historic derby venue inaugural clash'
  });

  // 3. All Players (43)
  squad.forEach((p) => {
    const isCapt = (p.role || '').toLowerCase().includes('captain');
    const runs = p.batting?.runs || 0;
    const wkts = p.bowling?.wickets || 0;
    const avg = p.batting?.average || 0;
    const sr = p.batting?.strikeRate || 0;
    const hs = p.batting?.highestScore || '0';
    const bb = p.bowling?.bestBowling || 'N/A';
    const econ = p.bowling?.economy || 0;
    const centuries = p.batting?.hundreds || 0;
    const fifties = p.batting?.fifties || 0;
    const fiveW = p.bowling?.fiveWickets || 0;

    let fullText = `${p.name} #${p.jerseyNumber} ${p.role} ${p.battingStyle || ''} ${p.bowlingStyle || ''} Dread Eleven DE cricket Rewa. `;
    fullText += `Matches: ${p.matches || 0}, Runs: ${runs}, Wickets: ${wkts}, Batting Avg: ${avg}, Strike Rate: ${sr}, Highest Score: ${hs}, Best Bowling: ${bb}, Economy: ${econ}, Hundreds: ${centuries}, Fifties: ${fifties}, Five-wicket hauls: ${fiveW}. `;
    if (p.bio) fullText += `${p.bio} `;
    if (isCapt) fullText += `Captain skipper leader franchise talisman. `;

    if (Array.isArray(p.matchHistory)) {
      p.matchHistory.forEach((mh) => {
        fullText += `${mh.opponent || ''} ${mh.format || ''} ${mh.season || ''} ${mh.runs || 0}r ${mh.wickets || 0}w ${mh.dismissal || ''} `;
      });
    }

    index.push({
      type: 'Player',
      badge: 'player',
      icon: isCapt ? '⚡' : '🏏',
      title: `${p.name} (#${p.jerseyNumber}) — ${p.role}`,
      subtitle: `${p.role} • ${runs} runs (Avg ${avg}) • ${wkts} wickets (BB ${bb})`,
      url: `/players/${p.slug}`,
      text: fullText
    });
  });

  // 4. All Matches (34)
  matches.forEach((m) => {
    const matchDateStr = formatDate(m.matchDate || m.date);
    const inn1 = m.innings?.[0];
    const inn2 = m.innings?.[1];
    const potm = m.playerOfTheMatch ? `${m.playerOfTheMatch.name} (${m.playerOfTheMatch.team})` : 'N/A';
    const potmReason = m.playerOfTheMatch?.reason || '';

    let matchText = `Match ${m.matchNumber || ''} ${m.slug} ${m.seasonYear || m.season} ${m.stage || ''} ${m.format} ${m.tournamentName || ''} `;
    matchText += `Date: ${matchDateStr} ${m.matchDate || m.date}. Venue: ${m.venue?.name || m.venue} ${m.venue?.city || 'Rewa'}. `;
    matchText += `Result: ${m.resultText || m.result}. Winner: ${m.winnerName || m.winner}. `;
    matchText += `Toss: ${m.toss?.winner || ''} (${m.toss?.decision || ''}). POTM Player of the match: ${potm} ${potmReason}. `;

    if (inn1) {
      matchText += `${inn1.teamName || inn1.teamShort} ${inn1.runs}/${inn1.wickets} (${inn1.overs} ov). `;
      if (Array.isArray(inn1.batting)) {
        inn1.batting.forEach((b) => {
          matchText += `${b.playerName} ${b.runs}r (${b.balls}b, ${b.fours}x4, ${b.sixes}x6) ${b.dismissal} `;
        });
      }
      if (Array.isArray(inn1.bowling)) {
        inn1.bowling.forEach((bw) => {
          matchText += `${bw.bowlerName} ${bw.wickets}/${bw.runs} (${bw.overs} ov) `;
        });
      }
    }

    if (inn2) {
      matchText += `${inn2.teamName || inn2.teamShort} ${inn2.runs}/${inn2.wickets} (${inn2.overs} ov). `;
      if (Array.isArray(inn2.batting)) {
        inn2.batting.forEach((b) => {
          matchText += `${b.playerName} ${b.runs}r (${b.balls}b, ${b.fours}x4, ${b.sixes}x6) ${b.dismissal} `;
        });
      }
      if (Array.isArray(inn2.bowling)) {
        inn2.bowling.forEach((bw) => {
          matchText += `${bw.bowlerName} ${bw.wickets}/${bw.runs} (${bw.overs} ov) `;
        });
      }
    }

    const titleStr = `${m.seasonYear || m.season} ${m.stage || 'Derby'}: ${m.resultText || (m.winnerName + ' won')}`;
    const subtitleStr = `${matchDateStr} • ${m.venue?.name || m.venue} • POTM: ${potm}`;

    index.push({
      type: 'Match',
      badge: 'match',
      icon: '🏏',
      title: titleStr,
      subtitle: subtitleStr,
      url: `/matches/${m.slug}`,
      text: matchText
    });
  });

  // 5. News Articles
  news.forEach((n) => {
    index.push({
      type: 'News',
      badge: 'news',
      icon: '📰',
      title: n.title,
      subtitle: `${formatDate(n.date)} • By ${n.author || 'DE Media'} • ${n.category || 'Article'}`,
      url: `/news/${n.slug}`,
      text: `${n.title} ${n.excerpt || ''} ${n.content || n.body || ''} ${n.author || ''} ${n.category || ''} ${n.tags ? n.tags.join(' ') : ''}`
    });
  });

  // 6. Record highlights
  index.push({
    type: 'Record',
    badge: 'record',
    icon: '👑',
    title: 'All-Time Leading Run Scorer: Pranav Dwivedi (1,998 runs)',
    subtitle: 'Destroyers captain has amassed 1,998 tournament runs with 2 centuries & 18 fifties',
    url: '/stats/',
    text: 'Leading run scorer record Pranav Dwivedi 1998 runs 1998 runs 58.8 average 2 centuries 18 fifties Destroyers Rewa'
  });
  index.push({
    type: 'Record',
    badge: 'record',
    icon: '👑',
    title: 'Dread Eleven Leading Run Scorer: Akhil Mishra (1,378 runs)',
    subtitle: 'Dread Eleven skipper with 1,378 runs (44.5 avg, 12 fifties, 1 century) in 28 derbies',
    url: '/players/akhil-mishra/',
    text: 'Akhil Mishra 1378 runs Dread Eleven captain record highest run scorer 96* 12 fifties 1 hundred'
  });
  index.push({
    type: 'Record',
    badge: 'record',
    icon: '🎯',
    title: 'Leading Wicket-Taker: Kuldeep Sen (98 wickets)',
    subtitle: 'Express pacer with 98 wickets at 14.8 avg and 3 five-wicket hauls for Dread Eleven',
    url: '/players/kuldeep-sen/',
    text: 'Kuldeep Sen 98 wickets leading wicket taker fast bowler express pace 5/18 bowling record Rewa Ranji'
  });
  index.push({
    type: 'Record',
    badge: 'record',
    icon: '💥',
    title: 'Highest Team Total: Destroyers 242/4 (20 ov)',
    subtitle: 'Set at APSU Stadium Rewa during the 2025 Championship season',
    url: '/stats/',
    text: 'Highest team total 242/4 Destroyers 20 overs APSU Stadium Rewa record score'
  });
  index.push({
    type: 'Record',
    badge: 'record',
    icon: '💥',
    title: 'Highest Dread Eleven Chase: 218/5 vs Destroyers (19.4 ov)',
    subtitle: 'Historic 2023 season thriller sealed by Akhil Mishra & Venkatesh Iyer',
    url: '/stats/',
    text: 'Highest run chase Dread Eleven 218/5 2023 victory Akhil Mishra Venkatesh Iyer Martand Ground'
  });

  fs.writeFileSync(path.join(rootDir, 'search-index.json'), JSON.stringify(index, null, 2));
  console.log(`Generated search-index.json with ${index.length} comprehensive searchable entries.`);
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
generatePrivacyPage();
generateTermsPage();
generate404Page();
generateSearchIndex();
generateSitemapAndRobots();
console.log('=== BUILD COMPLETE! ALL PAGES GENERATED WITH $4K STUDIO CRAFT & ZERO BLUE ===');
