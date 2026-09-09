/**
 * PRODUCTION STATIC SITE GENERATOR (SSG) FOR DREAD ELEVEN (DE)
 * Captain: Akhil Mishra (905 runs, 47.6 avg, 9 fifties)
 * Colorway: Hyper-Electric Cyan & Void Obsidian
 * Base URL: http://127.0.0.1:8086
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'http://127.0.0.1:8086';

// Load Datasets
const tournament = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/tournament.json'), 'utf8'));
const teams = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/teams.json'), 'utf8'));
const squad = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/squad.json'), 'utf8'));
const rivals = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/rivals.json'), 'utf8'));
const matches = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/matches.json'), 'utf8'));
const news = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/news.json'), 'utf8'));
const pointsTable = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/pointsTable.json'), 'utf8'));

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
function renderHead({ title, description, canonicalUrl, ogType = 'website', ogImage = '/public/de-hero.jpg', jsonLd = null }) {
  const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;
  const fullOgImage = `${BASE_URL}${ogImage}`;

  return `
<!DOCTYPE html>
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
  <meta property="og:image" content="${fullOgImage}">
  <meta property="og:site_name" content="Dread Eleven (DE)">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${fullCanonical}">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${fullOgImage}">

  <!-- Fonts Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,600;0,700;0,800;0,900;1,700;1,900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/src/css/styles.css">
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
  <canvas id="ambient-canvas" aria-hidden="true"></canvas>
  <div class="content-wrapper">
  `;
}

function renderHeader(activeNav = '') {
  const links = [
    { label: 'Home', href: '/', key: 'home' },
    { label: 'Squad', href: '/players', key: 'squad' },
    { label: 'Fixtures', href: '/fixtures', key: 'fixtures' },
    { label: 'Results', href: '/results', key: 'results' },
    { label: 'Points Table', href: '/points-table', key: 'table' },
    { label: 'Stats', href: '/stats', key: 'stats' },
    { label: 'News', href: '/news', key: 'news' },
    { label: 'About', href: '/about', key: 'about' },
    { label: 'Contact', href: '/contact', key: 'contact' }
  ];

  return `
  <!-- Top Marquee Ticker -->
  <div class="top-ticker" aria-hidden="true" style="background:#02040a; border-bottom:1px solid rgba(0,240,255,0.15); padding:0.4rem 0; font-family:var(--f-mono); font-size:0.6875rem; letter-spacing:0.12em; color:var(--c-gray-400); overflow:hidden; white-space:nowrap;">
    <div class="ticker-track" style="display:inline-flex; gap:3rem; animation:tickerScroll 28s linear infinite;">
      <span style="display:inline-flex; align-items:center; gap:0.5rem;"><span class="live-dot"></span> DREAD ELEVEN (DE)</span>
      <span style="display:inline-flex; align-items:center; gap:0.5rem;"><span class="live-dot"></span> ALL-TIME SERIES LEADERS: 13 WINS VS DESTROYERS</span>
      <span style="display:inline-flex; align-items:center; gap:0.5rem;"><span class="live-dot"></span> 2022 CHAMPIONSHIP TITLE WINNERS</span>
      <span style="display:inline-flex; align-items:center; gap:0.5rem;"><span class="live-dot"></span> CAPTAIN: AKHIL MISHRA (905 RUNS • 47.6 AVG)</span>
      <span style="display:inline-flex; align-items:center; gap:0.5rem;"><span class="live-dot"></span> ATAL BIHARI VAJPAYEE MEMORIAL TOURNAMENT • REWA</span>
    </div>
  </div>

  <!-- Header Navigation -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-block" aria-label="Dread Eleven Home">
        <svg class="brand-crest-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,4 94,28 94,72 50,96 6,72 6,28" fill="#060913" stroke="#00f0ff" stroke-width="4"/>
          <polygon points="50,14 84,32 84,68 50,86 16,68 16,32" fill="#080e1e" stroke="#7928ca" stroke-width="1.5" stroke-dasharray="3 3"/>
          <circle cx="50" cy="50" r="28" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.4"/>
          <text x="50" y="58" font-family="'Chakra Petch', sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">DE</text>
        </svg>
        <div class="brand-title-group">
          <span class="brand-franchise-name">DREAD <span style="color:var(--c-cyan-neon);">ELEVEN</span></span>
          <span class="brand-subline">Atal Bihari Vajpayee Cup • Rewa</span>
        </div>
      </a>

      <nav class="header-nav" aria-label="Main Navigation">
        ${links.map((l) => `
          <a href="${l.href}" class="header-nav-link ${activeNav === l.key ? 'active' : ''}" ${activeNav === l.key ? 'aria-current="page"' : ''}>
            ${esc(l.label)}
          </a>
        `).join('')}
      </nav>

      <div class="header-status-badge">
        <span class="live-dot"></span>
        <span>CAPT. AKHIL MISHRA</span>
      </div>
    </div>
  </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-columns">
          <div>
            <div class="brand-franchise-name" style="font-size: 2rem;">
              DREAD <span style="color:var(--c-cyan-neon);">ELEVEN</span>
            </div>
            <p style="font-size:0.875rem; color:var(--c-gray-400); max-width:48ch; margin-top:0.75rem; line-height:1.7;">
              Official franchise website for Dread Eleven (DE), captained by Akhil Mishra. 
              2022 Atal Bihari Vajpayee Memorial Trophy winners under the Rewa Division Cricket Association (RDCA).
            </p>
          </div>

          <div>
            <h4 style="font-family:var(--f-brand); font-size:1.2rem; color:#fff; text-transform:uppercase; margin-bottom:1rem;">Match Center</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem; color:var(--c-gray-400);">
              <li><a href="/fixtures" style="color:inherit; text-decoration:none;">Upcoming Fixtures (2025–26)</a></li>
              <li><a href="/results" style="color:inherit; text-decoration:none;">Completed Derby Archive</a></li>
              <li><a href="/points-table" style="color:inherit; text-decoration:none;">Tournament Points Table</a></li>
              <li><a href="/stats" style="color:inherit; text-decoration:none;">Dread Eleven Leaderboards</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family:var(--f-brand); font-size:1.2rem; color:#fff; text-transform:uppercase; margin-bottom:1rem;">Franchise Dossier</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem; color:var(--c-gray-400);">
              <li><a href="/players" style="color:inherit; text-decoration:none;">Dread Squad (43 Players)</a></li>
              <li><a href="/about" style="color:inherit; text-decoration:none;">About Dread Eleven &amp; 2022 Title</a></li>
              <li><a href="/news" style="color:inherit; text-decoration:none;">News &amp; Media Bulletins</a></li>
              <li><a href="/contact" style="color:inherit; text-decoration:none;">Ground Info &amp; Inquiries</a></li>
            </ul>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--b-subtle); padding-top:2rem; font-size:0.75rem; color:var(--c-gray-600); flex-wrap:wrap; gap:1rem;">
          <div>&copy; 2021–2026 Dread Eleven (DE). Sanctioned under RDCA.</div>
          <div>Martand Ground No. 3 &amp; APSU Stadium • Rewa, Madhya Pradesh</div>
        </div>
      </div>
    </footer>
  </div>

  <script src="/src/js/app.js"></script>
</body>
</html>
  `;
}

// ------------------------------------------------------------
// 1. HOME PAGE GENERATOR (/)
// ------------------------------------------------------------
function generateHomePage() {
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const nextMatch = upcomingMatches[0];
  const featuredNews = news.slice(0, 3);
  const featuredSquad = squad.slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: 'Dread Eleven',
    alternateName: 'DE',
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
      jobTitle: 'Captain & Top-Order Anchor'
    }
  };

  const html = `
${renderHead({
  title: 'Dread Eleven (DE) — Official Cricket Franchise Website | Capt. Akhil Mishra',
  description: 'Official franchise website for Dread Eleven (DE), captained by Akhil Mishra. 2022 Atal Bihari Vajpayee Memorial Trophy winners, 13 derby victories, verified player telemetry, and match center.',
  canonicalUrl: '/',
  jsonLd
})}
${renderHeader('home')}

<!-- Hero Section -->
<section class="hero-section" id="home">
  <div class="hero-watermark" aria-hidden="true">DREAD ELEVEN</div>
  <div class="container hero-grid-layout">
    <div>
      <div class="hero-eyebrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
        <span>Tactical Stealth Command • Rewa Division (RDCA)</span>
      </div>

      <h1 class="hero-headline-massive">
        PRECISION. POWER. <br>
        <span class="hero-gradient-text">THE TITAN FLEET.</span> <br>
        DREAD ELEVEN.
      </h1>

      <p class="hero-statement">
        The official digital command of <strong>Dread Eleven (DE)</strong>, captained by <strong>Akhil Mishra</strong> (905 runs, 47.6 avg). 
        Leading the all-time derby series <strong>13–11</strong> against Destroyers Cricket Club (DES) in the <strong>Atal Bihari Vajpayee Memorial Tournament</strong>, Rewa.
      </p>

      <div class="hero-cta-row">
        <a href="/fixtures" class="btn-cyber btn-cyber-primary">
          <span>2025–26 Schedule</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/players" class="btn-cyber btn-cyber-outline">
          <span>Explore Squad (43)</span>
        </a>
        <a href="/results" class="btn-cyber btn-cyber-outline">
          <span>Derby Archive</span>
        </a>
      </div>
    </div>

    <!-- Battle HUD Card -->
    <div class="battle-hud-card">
      <div class="hud-topline">
        <span class="hud-tag">Derby Telemetry (2021–2024)</span>
        <span class="hud-status-tag" style="color:var(--c-cyan-neon); background:rgba(0,240,255,0.12); border:1px solid var(--b-glow);">DE LEADS 13–11 (54.2%)</span>
      </div>

      <div class="hud-clash-display">
        <div class="hud-team-column">
          <div class="hud-team-emblem de">DE</div>
          <div class="hud-team-name" style="color:var(--c-cyan-neon);">DREAD ELEVEN</div>
          <div style="font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; font-family:var(--f-mono);">Capt. Akhil Mishra</div>
          <div class="hud-win-count tabular" style="color:var(--c-cyan-neon);">13</div>
        </div>

        <div class="hud-vs-badge">VS</div>

        <div class="hud-team-column">
          <div class="hud-team-emblem des">DES</div>
          <div class="hud-team-name" style="color:var(--c-gray-400);">DESTROYERS</div>
          <div style="font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase; font-family:var(--f-mono);">Capt. Pranav Dwivedi</div>
          <div class="hud-win-count tabular" style="color:var(--c-gray-400);">11</div>
        </div>
      </div>

      <div class="hud-dominance-bar" title="54.2% Dread Eleven vs 45.8% Destroyers">
        <div class="hud-bar-de" style="width:54.2%;"></div>
        <div class="hud-bar-des" style="width:45.8%;"></div>
      </div>

      <!-- Live Match Countdown Widget -->
      <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1.25rem; margin-top:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
          <span style="font-family:var(--f-mono); font-size:0.6875rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800; letter-spacing:0.1em;">Next Derby Countdown</span>
          <span class="live-dot"></span>
        </div>
        <div id="match-countdown" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem; text-align:center;">
          <div style="background:#040711; border:1px solid var(--b-subtle); padding:0.5rem;"><div style="font-family:var(--f-brand); font-size:1.5rem; color:#fff;" id="cd-days">182</div><div style="font-size:0.625rem; color:var(--c-gray-400); font-family:var(--f-mono); text-transform:uppercase;">Days</div></div>
          <div style="background:#040711; border:1px solid var(--b-subtle); padding:0.5rem;"><div style="font-family:var(--f-brand); font-size:1.5rem; color:#fff;" id="cd-hours">14</div><div style="font-size:0.625rem; color:var(--c-gray-400); font-family:var(--f-mono); text-transform:uppercase;">Hours</div></div>
          <div style="background:#040711; border:1px solid var(--b-subtle); padding:0.5rem;"><div style="font-family:var(--f-brand); font-size:1.5rem; color:#fff;" id="cd-mins">35</div><div style="font-size:0.625rem; color:var(--c-gray-400); font-family:var(--f-mono); text-transform:uppercase;">Mins</div></div>
          <div style="background:#040711; border:1px solid var(--b-subtle); padding:0.5rem;"><div style="font-family:var(--f-brand); font-size:1.5rem; color:var(--c-cyan-neon);" id="cd-secs">48</div><div style="font-size:0.625rem; color:var(--c-gray-400); font-family:var(--f-mono); text-transform:uppercase;">Secs</div></div>
        </div>
      </div>

      <!-- Next Match Preview -->
      <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1.25rem; margin-top:1rem;">
        <div style="font-family:var(--f-mono); font-size:0.6875rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800; letter-spacing:0.1em; margin-bottom:0.4rem;">
          Next Scheduled Battle
        </div>
        <div style="font-family:var(--f-brand); font-size:1.25rem; color:#fff; text-transform:uppercase;">
          Dread Eleven vs Destroyers (${nextMatch.format})
        </div>
        <div style="font-size:0.75rem; color:var(--c-gray-400); margin-top:0.2rem;">
          ${formatDate(nextMatch.matchDate)} • ${nextMatch.time} • ${esc(nextMatch.venue.name)}
        </div>
        <a href="/matches/${nextMatch.slug}" style="display:inline-flex; align-items:center; gap:0.4rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); font-weight:700; margin-top:0.6rem; text-decoration:none;">
          <span>Inspect Match Hub &rarr;</span>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- 2022 Championship Spotlight -->
<section class="spotlight-banner-section">
  <div class="container">
    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:3rem; display:grid; grid-template-columns:1.3fr 0.7fr; gap:3rem; align-items:center;">
      <div>
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800; margin-bottom:0.75rem;">
          2022 Atal Bihari Vajpayee Trophy Winners
        </div>
        <h2 style="font-family:var(--f-brand); font-size:clamp(2rem, 4vw, 3rem); text-transform:uppercase; color:#fff; line-height:1.05; margin-bottom:1rem;">
          DREAD ELEVEN HOISTS 2022 CHAMPIONSHIP TROPHY
        </h2>
        <p style="font-size:0.9375rem; color:var(--c-gray-300); line-height:1.7; margin-bottom:1.5rem;">
          On 12 August 2022 at APSU Stadium, Dread Eleven defended 183 against Destroyers Cricket Club. 
          Led by Kuldeep Sen’s fierce pace spell and Kumar Kartikeya’s spin mastery, Dread Eleven restricted Destroyers to 162/6 to capture the championship title.
        </p>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="/matches/destroyers-vs-dread-eleven-2022-08-12" class="btn-cyber btn-cyber-primary">
            <span>2022 Final Scorecard</span>
          </a>
          <a href="/about" class="btn-cyber btn-cyber-outline">
            <span>Read Title History</span>
          </a>
        </div>
      </div>

      <div style="background:var(--c-void-surface); border:1px solid var(--b-glow); padding:2rem; text-align:center;">
        <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); font-weight:800; text-transform:uppercase;">2022 FINAL RESULT</div>
        <div class="tabular" style="font-family:var(--f-brand); font-size:2.4rem; font-weight:900; color:#fff; margin:0.6rem 0;">
          <span style="color:var(--c-cyan-neon);">DE 183</span> <span style="font-size:1.3rem; color:var(--c-gray-600);">DEF</span> <span style="color:var(--c-gray-400);">DES 162/6</span>
        </div>
        <div style="font-size:0.875rem; color:var(--c-cyan-neon); font-weight:800; text-transform:uppercase; font-family:var(--f-brand);">
          Dread Eleven won by 21 runs
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Featured Squad Pillars -->
<section class="spotlight-banner-section" style="background:#040711;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Strike Force</p>
        <h2 class="section-bigtitle">Dread Eleven Core Pillars</h2>
        <p style="color:var(--c-gray-400); font-size:0.9375rem; max-width:60ch; margin-top:0.4rem;">
          The frontline anchors steering Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament.
        </p>
      </div>
      <a href="/players" class="btn-cyber btn-cyber-outline">
        <span>View Full Squad (43)</span>
      </a>
    </div>

    <div class="players-cards-grid">
      ${featuredSquad.map((p) => `
        <a href="/players/${p.slug}" class="cyber-player-card" style="text-decoration:none;">
          <div class="cyber-jersey-num">${p.jerseyNumber}</div>
          <div class="cyber-player-role">${esc(p.role)}</div>
          <h3 class="cyber-player-name">#${p.jerseyNumber} ${esc(p.name)}</h3>
          <div class="cyber-player-subtitle">Dread Eleven Squad • ${p.matches} Encounters</div>
          <div class="cyber-stats-strip">
            <div><div class="cyber-stat-val tabular" style="color:var(--c-cyan-neon);">${esc(p.batting.runs)}</div><div class="cyber-stat-lbl">Runs</div></div>
            <div><div class="cyber-stat-val tabular">${esc(p.batting.average)}</div><div class="cyber-stat-lbl">Avg</div></div>
            <div><div class="cyber-stat-val tabular" style="color:var(--c-emerald);">${esc(p.bowling.wickets)}</div><div class="cyber-stat-lbl">Wkts</div></div>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- Latest News -->
<section class="spotlight-banner-section">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Franchise Media</p>
        <h2 class="section-bigtitle">Latest News &amp; Bulletins</h2>
      </div>
      <a href="/news" class="btn-cyber btn-cyber-outline">All Articles</a>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:2rem;">
      ${featuredNews.map((n) => `
        <article style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:1.75rem; display:flex; flex-direction:column; clip-path:polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);">
          <div style="font-family:var(--f-mono); font-size:0.6875rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800; margin-bottom:0.6rem;">${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}</div>
          <h3 style="font-family:var(--f-brand); font-size:1.45rem; color:#fff; text-transform:uppercase; line-height:1.15; margin-bottom:0.75rem;">
            <a href="/news/${n.slug}" style="color:inherit; text-decoration:none;">${esc(n.title)}</a>
          </h3>
          <p style="font-size:0.875rem; color:var(--c-gray-400); line-height:1.6; margin-bottom:1.5rem;">${esc(n.summary)}</p>
          <a href="/news/${n.slug}" style="margin-top:auto; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); font-weight:800; text-transform:uppercase; text-decoration:none;">
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
  console.log('Generated index.html (Dread Eleven Home)');
}

// ------------------------------------------------------------
// 2. SQUAD DIRECTORY (/players) & INDIVIDUAL PLAYERS (/players/[slug])
// ------------------------------------------------------------
function generateSquadPages() {
  const playersDir = path.join(rootDir, 'players');
  ensureDir(playersDir);

  const jsonLdDirectory = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dread Eleven Squad Directory',
    itemListElement: squad.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE_URL}/players/${p.slug}`,
      name: p.name
    }))
  };

  const directoryHtml = `
${renderHead({
  title: 'Squad Roster (43 Players) | Dread Eleven (DE)',
  description: 'Official roster for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa. Captain Akhil Mishra, Kuldeep Sen, Kumar Kartikeya, and verified player analytics.',
  canonicalUrl: '/players',
  jsonLd: jsonLdDirectory
})}
${renderHeader('squad')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Armada</p>
        <h1 class="section-bigtitle">Dread Eleven Roster (43 Players)</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:68ch; margin-top:0.4rem;">
          Verified tournament records for every Dread Eleven player against Destroyers Cricket Club. Led by captain <strong>Akhil Mishra</strong>.
        </p>
      </div>
    </div>

    <!-- Interactive Role Filter -->
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:2rem;" id="squad-filter-controls">
      <button type="button" class="btn-cyber btn-cyber-primary role-btn" data-filter="all" style="padding:0.45rem 1rem; font-size:0.75rem;">All (43)</button>
      <button type="button" class="btn-cyber btn-cyber-outline role-btn" data-filter="Batter" style="padding:0.45rem 1rem; font-size:0.75rem;">Batters</button>
      <button type="button" class="btn-cyber btn-cyber-outline role-btn" data-filter="All-rounder" style="padding:0.45rem 1rem; font-size:0.75rem;">All-Rounders</button>
      <button type="button" class="btn-cyber btn-cyber-outline role-btn" data-filter="Bowler" style="padding:0.45rem 1rem; font-size:0.75rem;">Bowlers</button>
    </div>

    <div class="players-cards-grid" id="players-grid">
      ${squad.map((p) => `
        <a href="/players/${p.slug}" class="cyber-player-card" data-role="${esc(p.role)}" style="text-decoration:none;">
          <div class="cyber-jersey-num">${p.jerseyNumber}</div>
          <div class="cyber-player-role">${esc(p.role)}</div>
          <h2 class="cyber-player-name">#${p.jerseyNumber} ${esc(p.name)}</h2>
          <div class="cyber-player-subtitle">Dread Eleven • ${p.matches} Encounters</div>

          <div class="cyber-stats-strip">
            <div>
              <div class="cyber-stat-val tabular" style="color:var(--c-cyan-neon);">${esc(p.batting.runs)}</div>
              <div class="cyber-stat-lbl">Runs</div>
            </div>
            <div>
              <div class="cyber-stat-val tabular">${esc(p.batting.average)}</div>
              <div class="cyber-stat-lbl">Avg</div>
            </div>
            <div>
              <div class="cyber-stat-val tabular" style="color:var(--c-emerald);">${esc(p.bowling.wickets)}</div>
              <div class="cyber-stat-lbl">Wkts</div>
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(playersDir, 'index.html'), directoryHtml);

  // Generate each player's dedicated profile
  squad.forEach((p) => {
    const playerDir = path.join(playersDir, p.slug);
    ensureDir(playerDir);

    // Find all match appearances for this player (in Dread Eleven innings = innings[1])
    const playerLogs = [];
    matches.forEach((m) => {
      if (!m.innings || m.innings.length < 2) return;
      const deInn = m.innings[1]; // Dread Eleven innings
      const b = (deInn.batting || []).find((x) => x.playerId === p.id);
      const bo = (deInn.bowling || []).find((x) => x.playerId === p.id);

      if (b || bo) {
        playerLogs.push({ match: m, batting: b, bowling: bo });
      }
    });

    const playerJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p.name,
      jobTitle: `${p.role} for Dread Eleven`,
      worksFor: {
        '@type': 'SportsTeam',
        name: 'Dread Eleven'
      },
      description: p.bio,
      identifier: `DE-${p.jerseyNumber}`
    };

    const playerHtml = `
${renderHead({
  title: `${p.name} (#${p.jerseyNumber}) — Dread Eleven Profile`,
  description: `${p.name} official profile for Dread Eleven in the Atal Bihari Vajpayee Tournament, Rewa. ${p.batting.runs} runs, ${p.bowling.wickets} wickets, career statistics, and match log.`,
  canonicalUrl: `/players/${p.slug}`,
  jsonLd: playerJsonLd
})}
${renderHeader('squad')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit;">Home</a> / <a href="/players" style="color:inherit;">Squad</a> / <span style="color:var(--c-cyan-neon);">${esc(p.name)}</span>
    </nav>

    <!-- Player Header Banner -->
    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem; margin-bottom:3rem; position:relative; overflow:hidden;">
      <div class="cyber-jersey-num" style="font-size:10rem; right:1.5rem; top:0;">${p.jerseyNumber}</div>
      <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
        <span class="pro-fmt-tag t20">JERSEY #${p.jerseyNumber}</span>
        <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); font-weight:800; text-transform:uppercase;">${esc(p.role)}</span>
      </div>

      <h1 class="section-bigtitle" style="font-size:clamp(2.6rem, 5vw, 4.2rem); margin-bottom:0.5rem;">
        #${p.jerseyNumber} ${esc(p.name)}
      </h1>
      <p style="font-family:var(--f-mono); font-size:0.875rem; color:var(--c-gray-400); margin-bottom:1.5rem;">
        ${esc(p.battingStyle)} • ${esc(p.bowlingStyle)} • Dread Eleven
      </p>

      <p style="font-size:1rem; color:var(--c-gray-300); max-width:72ch; line-height:1.7; margin-bottom:2rem;">
        ${esc(p.bio)}
      </p>

      <!-- Key Telemetry Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem;">
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Matches</div>
          <div class="cyber-stat-val tabular">${p.matches}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Runs</div>
          <div class="cyber-stat-val tabular" style="color:var(--c-cyan-neon);">${esc(p.batting.runs)}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Highest Score</div>
          <div class="cyber-stat-val tabular">${esc(p.batting.highestScore)}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Batting Avg</div>
          <div class="cyber-stat-val tabular">${esc(p.batting.average)}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Strike Rate</div>
          <div class="cyber-stat-val tabular">${esc(p.batting.strikeRate)}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">50s / 100s</div>
          <div class="cyber-stat-val tabular">${esc(p.batting.fifties)} / ${esc(p.batting.hundreds)}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Wickets</div>
          <div class="cyber-stat-val tabular" style="color:var(--c-emerald);">${esc(p.bowling.wickets)}</div>
        </div>
        <div style="background:var(--c-void-surface); border:1px solid var(--b-subtle); padding:1rem; text-align:center;">
          <div class="cyber-stat-lbl">Best Bowling</div>
          <div class="cyber-stat-val tabular">${esc(p.bowling.bestBowling)}</div>
        </div>
      </div>
    </div>

    <!-- Match Appearances Table -->
    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem;">
      <h2 style="font-family:var(--f-brand); font-size:1.8rem; color:#fff; text-transform:uppercase; margin-bottom:1.25rem;">
        Match-by-Match Derby Telemetry vs Destroyers
      </h2>

      <div style="overflow-x:auto;">
        <table class="scorecard-data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Format</th>
              <th>Match Hub</th>
              <th class="num">Batting</th>
              <th>Dismissal</th>
              <th class="num">Bowling</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${playerLogs.length ? playerLogs.map((item) => `
              <tr>
                <td style="font-weight:700; color:#fff;">${formatDate(item.match.matchDate)}</td>
                <td><span class="pro-fmt-tag ${item.match.format.toLowerCase()}">${esc(item.match.format)}</span></td>
                <td><a href="/matches/${item.match.slug}" style="color:var(--c-cyan-neon); font-weight:700; text-decoration:none;">Scorecard &rarr;</a></td>
                <td class="num tabular font-bold" style="color:#fff;">${item.batting ? `${item.batting.runs} (${item.batting.balls}b)` : '—'}</td>
                <td style="font-size:0.75rem; color:var(--c-gray-400);">${item.batting ? esc(item.batting.dismissal) : 'Did Not Bat'}</td>
                <td class="num tabular font-bold" style="color:var(--c-emerald);">${item.bowling ? `${item.bowling.wickets}/${item.bowling.runs} (${item.bowling.overs} ov)` : '—'}</td>
                <td><span class="pro-result-strip ${item.match.winner === 'DE' ? 'de-victory' : 'des-victory'}" style="margin:0; padding:0.25rem 0.6rem; font-size:0.75rem;">${item.match.winner === 'DE' ? 'DE Win' : 'DES Win'}</span></td>
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

  console.log(`Generated /players directory and ${squad.length} individual player pages (Dread Eleven).`);
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

  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');

  // A. Generate /fixtures/index.html
  const fixturesHtml = `
${renderHead({
  title: 'Fixtures & Schedule (2025–2026) | Dread Eleven (DE)',
  description: 'Upcoming tournament fixtures and schedule for Dread Eleven in the Atal Bihari Vajpayee Cup, Rewa. Dates, grounds, and timings.',
  canonicalUrl: '/fixtures'
})}
${renderHeader('fixtures')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Battle Grid</p>
        <h1 class="section-bigtitle">Dread Eleven Fixtures (2025–2026)</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Official match schedule sanctioned by the Rewa Division Cricket Association (RDCA).
        </p>
      </div>
    </div>

    <div class="matches-pro-grid">
      ${upcomingMatches.map((m) => `
        <div class="cyber-match-card">
          <div class="cyber-match-header">
            <span class="pro-fmt-tag ${m.format.toLowerCase()}">${esc(m.format)} • SEASON ${esc(m.seasonYear)}</span>
            <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); font-weight:700;">${esc(m.stage)}</span>
          </div>

          <div style="font-size:0.75rem; color:var(--c-gray-400); margin-bottom:1rem;">
            <span style="font-weight:700; color:#fff;">${formatDate(m.matchDate)}</span> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}</span>
          </div>

          <div class="cyber-scoreboard-box">
            <div class="cyber-score-entry">
              <div class="cyber-team-ident">
                <div class="cyber-team-circle de">DE</div>
                <span class="cyber-team-name winner">Dread Eleven</span>
              </div>
              <div class="cyber-score-numbers">UPCOMING</div>
            </div>
            <div class="cyber-score-entry">
              <div class="cyber-team-ident">
                <div class="cyber-team-circle des">DES</div>
                <span class="cyber-team-name">Destroyers</span>
              </div>
              <div class="cyber-score-numbers">UPCOMING</div>
            </div>
          </div>

          <div class="pro-result-strip de-victory">
            <span>${esc(m.resultText)}</span>
          </div>

          <a href="/matches/${m.slug}" class="btn-cyber btn-cyber-outline" style="margin-top:auto; font-size:0.75rem; padding:0.6rem 1rem;">
            <span>Inspect Match Hub &rarr;</span>
          </a>
        </div>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;
  fs.writeFileSync(path.join(fixturesDir, 'index.html'), fixturesHtml);

  // B. Generate /results/index.html
  const resultsHtml = `
${renderHead({
  title: 'Derby Results Archive (2021–2024) | Dread Eleven (DE)',
  description: 'Complete match records and scorecards for all 24 clashes between Dread Eleven (13 wins) and Destroyers in Rewa.',
  canonicalUrl: '/results'
})}
${renderHeader('results')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Derby Ledger</p>
        <h1 class="section-bigtitle">Derby Results Archive (24 Matches)</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Dread Eleven holds a commanding 13–11 all-time series advantage across 4 seasons in Rewa.
        </p>
      </div>
      <div>
        <span class="tabular font-bold" style="font-family:var(--f-mono); font-size:1.1rem; color:var(--c-cyan-neon);">DE LEADS 13–11</span>
      </div>
    </div>

    <div class="matches-pro-grid">
      ${completedMatches.map((m) => {
        const isDeWinner = m.winner === 'DE';
        const isFinal = m.stage && m.stage.toLowerCase().includes('final');
        const desInnings = m.innings[0] || { runs: 0, wickets: 0, overs: 0 };
        const deInnings = m.innings[1] || { runs: 0, wickets: 0, overs: 0 };

        return `
          <div class="cyber-match-card">
            <div class="cyber-match-header">
              <span class="pro-fmt-tag ${m.format.toLowerCase()}">${esc(m.format)} • SEASON ${esc(m.seasonYear)}</span>
              ${isFinal ? '<span style="font-family:var(--f-brand); font-size:1rem; color:var(--c-cyan-neon);">2022 CHAMPIONSHIP FINAL</span>' : `<span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">MATCH #${esc(m.matchNumber)}</span>`}
            </div>

            <div style="font-size:0.75rem; color:var(--c-gray-400); margin-bottom:1rem;">
              <span style="font-weight:700; color:#fff;">${formatDate(m.matchDate)}</span> • <span>${esc(m.venue.name)}</span>
            </div>

            <div class="cyber-scoreboard-box">
              <div class="cyber-score-entry">
                <div class="cyber-team-ident">
                  <div class="cyber-team-circle de">DE</div>
                  <span class="cyber-team-name ${isDeWinner ? 'winner' : ''}">Dread Eleven</span>
                </div>
                <div class="cyber-score-numbers tabular">
                  ${deInnings.runs}/${deInnings.wickets} <span style="font-size:0.75rem; color:var(--c-gray-400); font-weight:400;">(${deInnings.overs} ov)</span>
                </div>
              </div>

              <div class="cyber-score-entry">
                <div class="cyber-team-ident">
                  <div class="cyber-team-circle des">DES</div>
                  <span class="cyber-team-name ${!isDeWinner ? 'winner' : ''}">Destroyers</span>
                </div>
                <div class="cyber-score-numbers tabular">
                  ${desInnings.runs}/${desInnings.wickets} <span style="font-size:0.75rem; color:var(--c-gray-400); font-weight:400;">(${desInnings.overs} ov)</span>
                </div>
              </div>
            </div>

            <div class="pro-result-strip ${isDeWinner ? 'de-victory' : 'des-victory'}">
              <span>${esc(m.resultText)}</span>
            </div>

            ${m.playerOfTheMatch ? `
              <div style="font-size:0.75rem; color:var(--c-gray-400); margin-bottom:1rem; border-top:1px solid var(--b-subtle); padding-top:0.6rem;">
                POTM: <strong style="color:var(--c-cyan-neon);">${esc(m.playerOfTheMatch.name)}</strong> (${esc(m.playerOfTheMatch.reason)})
              </div>
            ` : ''}

            <a href="/matches/${m.slug}" class="btn-cyber btn-cyber-outline" style="margin-top:auto; font-size:0.75rem; padding:0.6rem 1rem;">
              <span>Scorecard Hub &rarr;</span>
            </a>
          </div>
        `;
      }).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;
  fs.writeFileSync(path.join(resultsDir, 'index.html'), resultsHtml);

  // C. Generate each individual match page (/matches/[slug])
  matches.forEach((m) => {
    const matchPageDir = path.join(matchesDir, m.slug);
    ensureDir(matchPageDir);

    const isCompleted = m.status === 'completed';
    const isDeWinner = m.winner === 'DE';
    const innDES = m.innings[0]; // Destroyers
    const innDE = m.innings[1];  // Dread Eleven

    const matchJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: `Dread Eleven vs Destroyers Cricket Club (${m.format})`,
      startDate: `${m.matchDate}T${m.time.includes('09') ? '09:30:00' : '14:00:00'}Z`,
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
        return '<p style="color:var(--c-gray-400); padding:1rem;">Innings not yet contested.</p>';
      }

      const batRows = inn.batting.map((b) => `
        <tr>
          <td style="font-weight:800; color:#fff; font-family:var(--f-brand); font-size:1.1rem;">${esc(b.playerName)}</td>
          <td style="color:var(--c-gray-400); font-size:0.75rem;">${esc(b.dismissal)}</td>
          <td class="num tabular font-bold" style="color:#fff; font-size:1.05rem;">${esc(b.runs)}</td>
          <td class="num tabular">${esc(b.balls)}</td>
          <td class="num tabular">${esc(b.fours)}</td>
          <td class="num tabular">${esc(b.sixes)}</td>
          <td class="num tabular" style="color:var(--c-cyan-neon); font-weight:700;">${esc(b.strikeRate)}</td>
        </tr>
      `).join('');

      const bowlRows = (inn.bowling || []).map((bo) => `
        <tr>
          <td style="font-weight:800; color:#fff; font-family:var(--f-brand); font-size:1.1rem;">${esc(bo.playerName)}</td>
          <td class="num tabular">${esc(bo.overs)}</td>
          <td class="num tabular">${esc(bo.maidens)}</td>
          <td class="num tabular">${esc(bo.runs)}</td>
          <td class="num tabular font-bold" style="color:var(--c-emerald); font-size:1.05rem;">${esc(bo.wickets)}</td>
          <td class="num tabular" style="color:var(--c-cyan-neon); font-weight:700;">${esc(bo.economy)}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom:2.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:1px solid var(--b-medium); padding-bottom:0.75rem; margin-bottom:1rem;">
            <div>
              <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); text-transform:uppercase;">Batting Side: ${esc(battingTeam)}</div>
              <h3 style="font-family:var(--f-brand); font-size:1.7rem; color:#fff; text-transform:uppercase;">
                ${esc(inn.teamName)} Innings
              </h3>
            </div>
            <div class="tabular" style="font-family:var(--f-mono); font-size:1.75rem; font-weight:900; color:#fff;">
              ${inn.runs}/${inn.wickets} <span style="font-size:0.875rem; color:var(--c-gray-400); font-weight:500;">(${inn.overs} ov • RR ${inn.runRate})</span>
            </div>
          </div>

          <div style="overflow-x:auto; margin-bottom:2rem;">
            <table class="scorecard-data-table">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Dismissal</th>
                  <th class="num">R</th>
                  <th class="num">B</th>
                  <th class="num">4s</th>
                  <th class="num">6s</th>
                  <th class="num">SR</th>
                </tr>
              </thead>
              <tbody>${batRows}</tbody>
            </table>
          </div>

          <h4 style="font-family:var(--f-brand); font-size:1.25rem; color:#fff; text-transform:uppercase; margin-bottom:0.75rem;">
            Bowling Attack (${esc(bowlingTeam)})
          </h4>
          <div style="overflow-x:auto;">
            <table class="scorecard-data-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th class="num">O</th>
                  <th class="num">M</th>
                  <th class="num">R</th>
                  <th class="num">W</th>
                  <th class="num">Eco</th>
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
  title: `Dread Eleven vs Destroyers (${formatDate(m.matchDate)}) — Scorecard Hub`,
  description: `Official match report & scorecard for Dread Eleven vs Destroyers Cricket Club on ${formatDate(m.matchDate)} at ${m.venue.name}, Rewa.`,
  canonicalUrl: `/matches/${m.slug}`,
  jsonLd: matchJsonLd
})}
${renderHeader('results')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit;">Home</a> / <a href="${isCompleted ? '/results' : '/fixtures'}" style="color:inherit;">${isCompleted ? 'Results' : 'Fixtures'}</a> / <span style="color:var(--c-cyan-neon);">${formatDate(m.matchDate)}</span>
    </nav>

    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem; margin-bottom:3rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
        <span class="pro-fmt-tag ${m.format.toLowerCase()}">${esc(m.format)} • Season ${esc(m.seasonYear)}</span>
        <span style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-cyan-neon); font-weight:800; text-transform:uppercase;">${esc(m.stage)}</span>
      </div>

      <h1 class="section-bigtitle" style="font-size:clamp(2.4rem, 5vw, 3.8rem); margin-bottom:0.75rem;">
        Dread Eleven vs Destroyers
      </h1>

      <div style="font-size:0.875rem; color:var(--c-gray-400); margin-bottom:1.5rem;">
        <span>${formatDate(m.matchDate)}</span> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}, ${esc(m.venue.city)}</span>
      </div>

      ${m.toss ? `
        <div style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-300); margin-bottom:1.5rem; background:var(--c-void-surface); padding:0.75rem 1rem; border:1px solid var(--b-subtle);">
          Toss: <strong>${esc(m.toss.winner)}</strong> won the toss and ${esc(m.toss.decision)}.
        </div>
      ` : ''}

      <div class="pro-result-strip ${isDeWinner ? 'de-victory' : (isCompleted ? 'des-victory' : '')}" style="font-size:1.15rem; padding:0.9rem 1.25rem;">
        <span>${esc(m.resultText)}</span>
      </div>

      ${m.playerOfTheMatch ? `
        <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--b-subtle); display:flex; align-items:center; gap:0.75rem;">
          <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800;">Player of the Match:</span>
          <strong style="color:#fff; font-family:var(--f-brand); font-size:1.25rem;">${esc(m.playerOfTheMatch.name)}</strong>
          <span style="color:var(--c-gray-400); font-size:0.8125rem;">(${esc(m.playerOfTheMatch.team)} • ${esc(m.playerOfTheMatch.reason)})</span>
        </div>
      ` : ''}
    </div>

    ${isCompleted ? `
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem;">
        <h2 style="font-family:var(--f-brand); font-size:1.9rem; color:#fff; text-transform:uppercase; margin-bottom:2rem;">
          Innings Scorecards
        </h2>

        <!-- Innings 2: Dread Eleven -->
        ${renderInningsTable(innDE, 'Dread Eleven', 'Destroyers Cricket Club')}

        <!-- Innings 1: Destroyers -->
        ${renderInningsTable(innDES, 'Destroyers Cricket Club', 'Dread Eleven')}
      </div>
    ` : `
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:3rem; text-align:center;">
        <h2 style="font-family:var(--f-brand); font-size:2rem; color:#fff; text-transform:uppercase; margin-bottom:0.75rem;">
          Fixture Scheduled
        </h2>
        <p style="color:var(--c-gray-400); font-size:0.9375rem; max-width:54ch; margin:0 auto 1.5rem;">
          This fixture is slated for the upcoming tournament cycle. Official scorecards and bowling records will populate following match settlement.
        </p>
        <a href="/fixtures" class="btn-cyber btn-cyber-outline">Back to Fixtures Schedule</a>
      </div>
    `}
  </div>
</section>

${renderFooter()}
    `;

    fs.writeFileSync(path.join(matchPageDir, 'index.html'), matchHtml);
  });

  console.log(`Generated /fixtures, /results, and ${matches.length} individual match pages (Dread Eleven).`);
}

// ------------------------------------------------------------
// 4. POINTS TABLE (/points-table)
// ------------------------------------------------------------
function generatePointsTablePage() {
  const tableDir = path.join(rootDir, 'points-table');
  ensureDir(tableDir);

  const html = `
${renderHead({
  title: 'Tournament Points Table & Standings | Dread Eleven (DE)',
  description: 'Official standings and points table for the Atal Bihari Vajpayee Memorial Tournament, Rewa. Dread Eleven all-time series lead (13 wins, 26 pts).',
  canonicalUrl: '/points-table'
})}
${renderHeader('table')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Division Standings</p>
        <h1 class="section-bigtitle">Tournament Points Table</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Sanctioned standings across all editions of the Atal Bihari Vajpayee Memorial Tournament in Rewa.
        </p>
      </div>
    </div>

    <!-- All-Time Standings -->
    <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem; margin-bottom:3rem;">
      <h2 style="font-family:var(--f-brand); font-size:1.85rem; color:#fff; text-transform:uppercase; margin-bottom:1.5rem;">
        All-Time Derby Table (2021–2024 • 24 Encounters)
      </h2>

      <div style="overflow-x:auto;">
        <table class="scorecard-data-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Franchise Team</th>
              <th class="num">P</th>
              <th class="num">W</th>
              <th class="num">L</th>
              <th class="num">T</th>
              <th class="num">NR</th>
              <th class="num">NRR</th>
              <th class="num">Pts</th>
            </tr>
          </thead>
          <tbody>
            ${pointsTable.allTime.map((row) => `
              <tr>
                <td style="font-weight:800; font-family:var(--f-mono); color:${row.rank === 1 ? 'var(--c-cyan-neon)' : '#fff'};">${row.rank}</td>
                <td style="font-weight:800; color:#fff; font-family:var(--f-brand); font-size:1.3rem;">
                  ${esc(row.team)} ${row.rank === 1 ? '<span style="color:var(--c-cyan-neon); font-size:0.75rem; margin-left:0.5rem;">🏆 ALL-TIME LEADER</span>' : ''}
                </td>
                <td class="num tabular font-bold">${row.played}</td>
                <td class="num tabular font-bold" style="color:var(--c-cyan-neon);">${row.won}</td>
                <td class="num tabular" style="color:var(--c-ruby);">${row.lost}</td>
                <td class="num tabular">${row.tied}</td>
                <td class="num tabular">${row.nr}</td>
                <td class="num tabular" style="font-family:var(--f-mono); font-weight:700;">${row.nrr}</td>
                <td class="num tabular font-bold" style="color:var(--c-cyan-neon); font-size:1.25rem;">${row.points}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(tableDir, 'index.html'), html);
  console.log('Generated /points-table/index.html (Dread Eleven)');
}

// ------------------------------------------------------------
// 5. STATS & RECORDS (/stats)
// ------------------------------------------------------------
function generateStatsPage() {
  const statsDir = path.join(rootDir, 'stats');
  ensureDir(statsDir);

  const topRunScorers = [...squad].sort((a, b) => b.batting.runs - a.batting.runs).slice(0, 10);
  const topWicketTakers = [...squad].sort((a, b) => b.bowling.wickets - a.bowling.wickets).slice(0, 10);
  const highestScores = [...squad].filter((p) => p.batting.runs > 50).sort((a, b) => parseInt(b.batting.highestScore) - parseInt(a.batting.highestScore)).slice(0, 8);
  const topAverages = [...squad].filter((p) => p.matches >= 5 && p.batting.average > 20).sort((a, b) => b.batting.average - a.batting.average);

  const html = `
${renderHead({
  title: 'Stats & Records | Dread Eleven (DE)',
  description: 'Official statistical records for Dread Eleven in Rewa. Top run scorers, bowling figures, and strike rates.',
  canonicalUrl: '/stats'
})}
${renderHeader('stats')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Tactical Telemetry</p>
        <h1 class="section-bigtitle">Dread Eleven All-Time Records</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Verified performance records across all 24 clashes against Destroyers in Rewa.
        </p>
      </div>
    </div>

    <!-- Top Run Scorers & Leading Wicket Takers Grid -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; margin-bottom:3rem;">
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem;">
        <h2 style="font-family:var(--f-brand); font-size:1.75rem; color:#fff; text-transform:uppercase; margin-bottom:1.25rem;">
          Top Dread Eleven Run Scorers
        </h2>
        <table class="scorecard-data-table">
          <thead>
            <tr><th>Player</th><th class="num">Mat</th><th class="num">Runs</th><th class="num">Avg</th><th class="num">SR</th><th class="num">50s</th></tr>
          </thead>
          <tbody>
            ${topRunScorers.map((p) => `
              <tr>
                <td style="font-weight:800; color:#fff;"><a href="/players/${p.slug}" style="color:inherit; text-decoration:none;">${esc(p.name)}</a></td>
                <td class="num tabular">${p.matches}</td>
                <td class="num tabular font-bold" style="color:var(--c-cyan-neon); font-size:1rem;">${esc(p.batting.runs)}</td>
                <td class="num tabular">${esc(p.batting.average)}</td>
                <td class="num tabular">${esc(p.batting.strikeRate)}</td>
                <td class="num tabular">${esc(p.batting.fifties)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem;">
        <h2 style="font-family:var(--f-brand); font-size:1.75rem; color:#fff; text-transform:uppercase; margin-bottom:1.25rem;">
          Top Dread Eleven Wicket Takers
        </h2>
        <table class="scorecard-data-table">
          <thead>
            <tr><th>Bowler</th><th class="num">Mat</th><th class="num">Wkts</th><th class="num">Overs</th><th class="num">BBI</th><th class="num">Eco</th></tr>
          </thead>
          <tbody>
            ${topWicketTakers.map((p) => `
              <tr>
                <td style="font-weight:800; color:#fff;"><a href="/players/${p.slug}" style="color:inherit; text-decoration:none;">${esc(p.name)}</a></td>
                <td class="num tabular">${p.matches}</td>
                <td class="num tabular font-bold" style="color:var(--c-emerald); font-size:1rem;">${esc(p.bowling.wickets)}</td>
                <td class="num tabular">${esc(p.bowling.overs)}</td>
                <td class="num tabular font-mono">${esc(p.bowling.bestBowling)}</td>
                <td class="num tabular">${esc(p.bowling.economy)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(statsDir, 'index.html'), html);
  console.log('Generated /stats/index.html (Dread Eleven)');
}

// ------------------------------------------------------------
// 6. NEWS DIRECTORY (/news) & ARTICLE PAGES (/news/[slug])
// ------------------------------------------------------------
function generateNewsPages() {
  const newsDir = path.join(rootDir, 'news');
  ensureDir(newsDir);

  const directoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dread Eleven News & Media',
    itemListElement: news.map((n, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE_URL}/news/${n.slug}`,
      name: n.title
    }))
  };

  const directoryHtml = `
${renderHead({
  title: 'News & Press Releases | Dread Eleven (DE)',
  description: 'Official announcements and tactical dispatches for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa.',
  canonicalUrl: '/news',
  jsonLd: directoryJsonLd
})}
${renderHeader('news')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Dispatches</p>
        <h1 class="section-bigtitle">Dread Eleven Media Center</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Official updates on squad preparations and derby performance reviews.
        </p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2.5rem;">
      ${news.map((n) => `
        <article style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem; display:flex; flex-direction:column; clip-path:polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);">
          <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800; margin-bottom:0.75rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}
          </div>
          <h2 style="font-family:var(--f-brand); font-size:1.65rem; color:#fff; text-transform:uppercase; line-height:1.15; margin-bottom:0.85rem;">
            <a href="/news/${n.slug}" style="color:inherit; text-decoration:none;">${esc(n.title)}</a>
          </h2>
          <p style="font-size:0.9375rem; color:var(--c-gray-300); line-height:1.6; margin-bottom:2rem;">
            ${esc(n.summary)}
          </p>
          <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--b-subtle); padding-top:1rem;">
            <span style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">${esc(n.readTime)}</span>
            <a href="/news/${n.slug}" style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-cyan-neon); font-weight:800; text-transform:uppercase; text-decoration:none;">
              Read Full Article &rarr;
            </a>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(newsDir, 'index.html'), directoryHtml);

  // Generate individual news article pages
  news.forEach((n) => {
    const articleDir = path.join(newsDir, n.slug);
    ensureDir(articleDir);

    const related = news.filter((x) => x.slug !== n.slug).slice(0, 2);

    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: n.title,
      description: n.summary,
      datePublished: n.publishedAt,
      dateModified: n.updatedAt,
      author: {
        '@type': 'Person',
        name: n.author.name,
        jobTitle: n.author.role
      },
      publisher: {
        '@type': 'Organization',
        name: 'Dread Eleven (DE)',
        url: BASE_URL
      }
    };

    const articleHtml = `
${renderHead({
  title: `${n.title} | Dread Eleven News`,
  description: n.summary,
  canonicalUrl: `/news/${n.slug}`,
  ogType: 'article',
  ogImage: n.heroImage,
  jsonLd: articleJsonLd
})}
${renderHeader('news')}

<article class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container" style="max-width:880px;">
    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400);">
      <a href="/" style="color:inherit;">Home</a> / <a href="/news" style="color:inherit;">News</a> / <span style="color:var(--c-cyan-neon);">${esc(n.category)}</span>
    </nav>

    <div style="font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800; margin-bottom:0.75rem;">
      ${esc(n.category)} • Published ${formatDate(n.publishedAt.slice(0, 10))} • ${esc(n.readTime)}
    </div>

    <h1 class="section-bigtitle" style="font-size:clamp(2.4rem, 5vw, 3.8rem); line-height:1; margin-bottom:1.5rem;">
      ${esc(n.title)}
    </h1>

    <div style="display:flex; align-items:center; gap:0.85rem; border-top:1px solid var(--b-subtle); border-bottom:1px solid var(--b-subtle); padding:1rem 0; margin-bottom:2.5rem; font-family:var(--f-mono); font-size:0.8125rem; color:var(--c-gray-400);">
      <span>By <strong style="color:#fff;">${esc(n.author.name)}</strong></span>
      <span>•</span>
      <span>${esc(n.author.role)}</span>
    </div>

    <div style="font-size:1.0625rem; line-height:1.8; color:var(--c-gray-300); margin-bottom:3.5rem;">
      ${n.body}
    </div>

    <!-- Related Articles -->
    <div style="border-top:1px solid var(--b-medium); padding-top:2.5rem; margin-top:3rem;">
      <h3 style="font-family:var(--f-brand); font-size:1.75rem; color:#fff; text-transform:uppercase; margin-bottom:1.5rem;">
        Related Features
      </h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
        ${related.map((r) => `
          <div style="background:var(--c-card-bg); border:1px solid var(--b-subtle); padding:1.5rem;">
            <div style="font-family:var(--f-mono); font-size:0.6875rem; color:var(--c-cyan-neon); text-transform:uppercase; margin-bottom:0.5rem;">${esc(r.category)}</div>
            <h4 style="font-family:var(--f-brand); font-size:1.25rem; text-transform:uppercase; line-height:1.2; margin-bottom:0.5rem;">
              <a href="/news/${r.slug}" style="color:#fff; text-decoration:none;">${esc(r.title)}</a>
            </h4>
            <a href="/news/${r.slug}" style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); font-weight:800; text-decoration:none;">Read &rarr;</a>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</article>

${renderFooter()}
    `;

    fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);
  });

  console.log(`Generated /news and ${news.length} individual news articles (Dread Eleven).`);
}

// ------------------------------------------------------------
// 7. ABOUT (/about) & CONTACT (/contact) & 404 (/404.html)
// ------------------------------------------------------------
function generateAboutPage() {
  const aboutDir = path.join(rootDir, 'about');
  ensureDir(aboutDir);

  const html = `
${renderHead({
  title: 'About Dread Eleven & 2022 Championship Silverware',
  description: 'Official history of Dread Eleven (DE), captained by Akhil Mishra, the 2022 championship triumph, and the Rewa Division Cricket Association (RDCA).',
  canonicalUrl: '/about'
})}
${renderHeader('about')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">The Franchise Dossier</p>
        <h1 class="section-bigtitle">About Dread Eleven</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Established in 2021 as a premier divisional franchise under the Rewa Division Cricket Association (RDCA).
        </p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:3rem; margin-bottom:3.5rem;">
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2.5rem;">
        <h2 style="font-family:var(--f-brand); font-size:2rem; color:#fff; text-transform:uppercase; margin-bottom:1.25rem;">
          The Strike Power of Rewa Cricket
        </h2>
        <div style="font-size:0.9375rem; color:var(--c-gray-300); line-height:1.8; display:flex; flex-direction:column; gap:1rem;">
          <p>
            <strong>Dread Eleven (DE)</strong> was created in 2021 to harness the finest cricketing talent across Rewa and the Vindhya division.
          </p>
          <p>
            Captained by opening maestro <strong>Akhil Mishra</strong> and powered by premier pace and spin bowlers including <strong>Kuldeep Sen</strong> and <strong>Kumar Kartikeya</strong>, Dread Eleven have asserted their dominance across 24 derby clashes, winning 13 matches (54.2% WR).
          </p>
          <p>
            Dread Eleven captured the coveted <strong>2022 Atal Bihari Vajpayee Memorial Trophy</strong> on 12 August 2022, defeating Destroyers in a thrilling 21-run championship finale.
          </p>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem;">
          <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase; font-weight:800;">Accreditation</div>
          <h3 style="font-family:var(--f-brand); font-size:1.4rem; color:#fff; text-transform:uppercase; margin:0.35rem 0 0.75rem;">
            RDCA, MPCA &amp; BCCI Sanctioned
          </h3>
          <p style="font-size:0.8125rem; color:var(--c-gray-400); line-height:1.6;">
            Sanctioned under the Rewa Division Cricket Association (RDCA), affiliated with the Madhya Pradesh Cricket Association (MPCA) and BCCI.
          </p>
        </div>

        <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem;">
          <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-uv-bright); text-transform:uppercase; font-weight:800;">Home Fortress</div>
          <h3 style="font-family:var(--f-brand); font-size:1.4rem; color:#fff; text-transform:uppercase; margin:0.35rem 0 0.75rem;">
            Martand Ground No. 3, Rewa
          </h3>
          <p style="font-size:0.8125rem; color:var(--c-gray-400); line-height:1.6;">
            Historic turf ground hosting high-intensity trial fixtures and tournament matches in Rewa.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(aboutDir, 'index.html'), html);
  console.log('Generated /about/index.html (Dread Eleven)');
}

function generateContactPage() {
  const contactDir = path.join(rootDir, 'contact');
  ensureDir(contactDir);

  const html = `
${renderHead({
  title: 'Contact & Administration | Dread Eleven (DE)',
  description: 'Official inquiries and venue details for Dread Eleven in Rewa, Madhya Pradesh.',
  canonicalUrl: '/contact'
})}
${renderHeader('contact')}

<section class="spotlight-banner-section" style="padding-top:4rem;">
  <div class="container" style="max-width:960px;">
    <div class="section-masthead">
      <div>
        <p class="section-pretitle">Administration</p>
        <h1 class="section-bigtitle">Contact Dread Eleven</h1>
        <p style="color:var(--c-gray-400); font-size:1rem; max-width:64ch; margin-top:0.4rem;">
          Official inquiries regarding the Atal Bihari Vajpayee Memorial Tournament and match accreditation.
        </p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; margin-bottom:3rem;">
      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem;">
        <h2 style="font-family:var(--f-brand); font-size:1.5rem; color:#fff; text-transform:uppercase; margin-bottom:1.25rem;">
          Dread Eleven Administrative Desk
        </h2>
        <div style="display:flex; flex-direction:column; gap:1rem; font-size:0.875rem; color:var(--c-gray-300);">
          <div>
            <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase;">Sanctioning Body</div>
            <p>Rewa Division Cricket Association (RDCA)</p>
          </div>
          <div>
            <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase;">Home Venue</div>
            <p>Martand School Ground No. 3, Rewa, MP 486001</p>
          </div>
          <div>
            <div style="font-family:var(--f-mono); font-size:0.75rem; color:var(--c-cyan-neon); text-transform:uppercase;">Email Inquiries</div>
            <p style="font-family:var(--f-mono);">admin@dread-eleven.cricket</p>
          </div>
        </div>
      </div>

      <div style="background:var(--c-card-bg); border:1px solid var(--b-medium); padding:2rem;">
        <h2 style="font-family:var(--f-brand); font-size:1.5rem; color:#fff; text-transform:uppercase; margin-bottom:1.25rem;">
          Send Official Transmission
        </h2>
        <form onsubmit="event.preventDefault(); alert('Transmission logged. RDCA desk will respond shortly.');" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); margin-bottom:0.35rem; text-transform:uppercase;">Full Name</label>
            <input type="text" required placeholder="Name" style="width:100%; background:#040711; border:1px solid var(--b-medium); color:#fff; padding:0.65rem 0.9rem; font-family:var(--f-body); font-size:0.875rem;">
          </div>
          <div>
            <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); margin-bottom:0.35rem; text-transform:uppercase;">Email Address</label>
            <input type="email" required placeholder="you@example.com" style="width:100%; background:#040711; border:1px solid var(--b-medium); color:#fff; padding:0.65rem 0.9rem; font-family:var(--f-body); font-size:0.875rem;">
          </div>
          <div>
            <label style="display:block; font-family:var(--f-mono); font-size:0.75rem; color:var(--c-gray-400); margin-bottom:0.35rem; text-transform:uppercase;">Message</label>
            <textarea rows="4" required placeholder="Your message..." style="width:100%; background:#040711; border:1px solid var(--b-medium); color:#fff; padding:0.65rem 0.9rem; font-family:var(--f-body); font-size:0.875rem; resize:vertical;"></textarea>
          </div>
          <button type="submit" class="btn-cyber btn-cyber-primary" style="margin-top:0.5rem;">
            Submit Transmission
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(contactDir, 'index.html'), html);
  console.log('Generated /contact/index.html (Dread Eleven)');
}

function generate404Page() {
  const html = `
${renderHead({
  title: '404 — Signal Lost | Dread Eleven',
  description: 'The requested telemetry ledger could not be located in the RDCA archives.',
  canonicalUrl: '/404'
})}
${renderHeader('')}

<section class="spotlight-banner-section" style="padding:8rem 0; text-align:center;">
  <div class="container" style="max-width:600px;">
    <div style="font-family:var(--f-brand); font-size:8rem; color:var(--c-cyan-neon); line-height:0.8; margin-bottom:1rem;">404</div>
    <h1 style="font-family:var(--f-brand); font-size:2.5rem; color:#fff; text-transform:uppercase; margin-bottom:1rem;">
      Signal Lost — Out of Bounds
    </h1>
    <p style="color:var(--c-gray-400); font-size:1rem; margin-bottom:2rem; line-height:1.6;">
      The match log or player profile you requested does not exist or has been relocated in the Dread Eleven registry.
    </p>
    <a href="/" class="btn-cyber btn-cyber-primary">Return to Command Citadel</a>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(rootDir, '404.html'), html);
  console.log('Generated 404.html (Dread Eleven)');
}

// ------------------------------------------------------------
// 8. SITEMAP.XML & ROBOTS.TXT
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

  squad.forEach((p) => {
    urls.push({ loc: `/players/${p.slug}`, changefreq: 'weekly', priority: '0.8' });
  });

  matches.forEach((m) => {
    urls.push({ loc: `/matches/${m.slug}`, changefreq: 'weekly', priority: '0.8' });
  });

  news.forEach((n) => {
    urls.push({ loc: `/news/${n.slug}`, changefreq: 'monthly', priority: '0.7' });
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

  console.log(`Generated sitemap.xml with ${urls.length} indexable URLs and robots.txt (Dread Eleven).`);
}

// ------------------------------------------------------------
// MAIN BUILD EXECUTION
// ------------------------------------------------------------
function main() {
  console.log('=== BUILDING DREAD ELEVEN (DE) PRODUCTION SUITE (CAPT. AKHIL MISHRA) ===');
  generateHomePage();
  generateSquadPages();
  generateMatchPages();
  generatePointsTablePage();
  generateStatsPage();
  generateNewsPages();
  generateAboutPage();
  generateContactPage();
  generate404Page();
  generateSitemapAndRobots();
  console.log('=== DREAD ELEVEN BUILD COMPLETE! ===');
}

main();
