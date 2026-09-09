/**
 * DREAD ELEVEN (DE) — OFFICIAL CRICKET FRANCHISE SSG
 * Mastercraft Awwwards Production Build
 * Palette: Pitch Void (#050507), Acid Volt (#d4ff00), Trophy Amber (#f59e0b)
 * STRICTLY ZERO BLUE • Zero Context from DES • Complete Independent Franchise Portal
 * Base URL: http://127.0.0.1:8086
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'http://127.0.0.1:8086';

const tournament = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/tournament.json'), 'utf8'));
const teams = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/teams.json'), 'utf8'));
const squad = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/squad.json'), 'utf8'));
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
  return `${parts[2]} ${months[parseInt(parts[1], 10) - 1] || parts[1]} ${parts[0]}`;
}

function esc(text) {
  if (!text && text !== 0) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

  <meta property="og:type" content="${esc(ogType)}">
  <meta property="og:url" content="${fullCanonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:site_name" content="Dread Eleven (DE)">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">

  <!-- Contrast Typography: Syne, Bebas Neue, Plus Jakarta Sans, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/src/css/styles.css">
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
  <!-- High-Density Cinema Film Grain Foreground Overlay -->
  <div class="grain-overlay" aria-hidden="true"></div>

  <!-- Ambient Dynamic Kinetic Fluid Aura Canvas -->
  <canvas id="ambient-canvas" aria-hidden="true"></canvas>

  <div class="content-wrapper">
`;
}

function renderHeader(activeNav = '') {
  const links = [
    { label: 'Home', href: '/', key: 'home' },
    { label: 'Roster', href: '/players', key: 'squad' },
    { label: 'Fixtures', href: '/fixtures', key: 'fixtures' },
    { label: 'Results', href: '/results', key: 'results' },
    { label: 'Standings', href: '/points-table', key: 'table' },
    { label: 'Telemetry', href: '/stats', key: 'stats' },
    { label: 'News', href: '/news', key: 'news' },
    { label: 'About', href: '/about', key: 'about' },
    { label: 'Contact', href: '/contact', key: 'contact' }
  ];

  const recentMatches = [...matches].slice(-8).reverse();

  return `
  <!-- ESPNcricinfo Top Broadcast Score Strip -->
  <div class="broadcast-ticker-bar" aria-label="Live Match Broadcast Ribbon">
    <div class="broadcast-ticker-track">
      ${recentMatches.map((m) => {
        const isDeWin = m.winner === 'DE';
        const isFinal = m.stage && m.stage.toLowerCase().includes('final');
        const innOpp = m.innings[0] || { runs: 0, wickets: 0, teamName: 'Opponent' };
        const innDE = m.innings[1] || { runs: 0, wickets: 0, teamName: 'Dread Eleven' };
        const isT20 = m.format === 'T20';

        return `
          <a href="/matches/${m.slug}" class="broadcast-pill-link">
            <div class="ticker-top-meta">
              <span class="format-pill ${isT20 ? 't20' : 'odi'}">${esc(m.format)} • ${m.seasonYear}</span>
              <span style="font-weight:800; color: ${isDeWin ? 'var(--c-volt)' : 'var(--c-crimson)'};">
                ${isFinal ? '★ FINAL • ' : ''}${isDeWin ? 'DE WON' : 'DE LOSS'}
              </span>
            </div>
            <div class="ticker-team-line">
              <span>Dread Eleven</span>
              <span class="ticker-score ${isDeWin ? 'winner' : ''} tabular">${innDE.runs}/${innDE.wickets}</span>
            </div>
            <div class="ticker-team-line">
              <span style="color: #94a3b8;">${esc(innOpp.teamName)}</span>
              <span class="ticker-score ${!isDeWin ? 'winner' : ''} tabular">${innOpp.runs}/${innOpp.wickets}</span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  </div>

  <!-- Main Navigation Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-link" aria-label="Dread Eleven Home">
        <div class="brand-crest">DE</div>
        <div class="brand-headings">
          <span class="brand-title-huge">DREAD <span>ELEVEN</span></span>
          <span class="brand-subtext">Rewa Division Cricket Association • RDCA</span>
        </div>
      </a>

      <nav class="header-nav" aria-label="Main Navigation">
        ${links.map((l) => `
          <a href="${l.href}" class="nav-item ${activeNav === l.key ? 'active' : ''}" ${activeNav === l.key ? 'aria-current="page"' : ''}>
            ${esc(l.label)}
          </a>
        `).join('')}
      </nav>

      <a href="/about" class="btn-championship-pill">
        2022 Champions
      </a>
    </div>
  </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand-title-huge" style="font-size: 2rem; margin-bottom: 0.75rem;">
              DREAD <span>ELEVEN</span>
            </div>
            <p style="font-size: 0.9375rem; color: #94a3b8; max-width: 44ch; line-height: 1.75;">
              Official franchise portal of Dread Eleven (DE), captained by Akhil Mishra. 
              Champions of the 2022 Atal Bihari Vajpayee Memorial Trophy and premier division powerhouse with 17 verified championship victories across One Day &amp; T20 formats under the Rewa Division Cricket Association.
            </p>
          </div>

          <div>
            <h4 style="font-family: var(--f-body); font-size: 0.9375rem; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
              Match Center
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.875rem; color: #94a3b8;">
              <li><a href="/fixtures" style="color: inherit; text-decoration: none;">T20 &amp; One Day Schedule</a></li>
              <li><a href="/results" style="color: inherit; text-decoration: none;">24 Fixtures Archive</a></li>
              <li><a href="/points-table" style="color: inherit; text-decoration: none;">Divisional Points Table</a></li>
              <li><a href="/stats" style="color: inherit; text-decoration: none;">Telemetry &amp; Records</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--f-body); font-size: 0.9375rem; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
              Franchise
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.875rem; color: #94a3b8;">
              <li><a href="/players" style="color: inherit; text-decoration: none;">Squad Roster (43 Players)</a></li>
              <li><a href="/about" style="color: inherit; text-decoration: none;">2022 Silverware Dossier</a></li>
              <li><a href="/news" style="color: inherit; text-decoration: none;">Tactical Bulletins</a></li>
              <li><a href="/contact" style="color: inherit; text-decoration: none;">Ground Operations</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--f-body); font-size: 0.9375rem; font-weight: 800; color: var(--c-volt); text-transform: uppercase; margin-bottom: 1.25rem;">
              RDCA Accreditation
            </h4>
            <p style="font-size: 0.8125rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1rem;">
              Sanctioned by the Rewa Division Cricket Association (RDCA). Home venue: Martand School Ground No. 3 &amp; APSU Stadium.
            </p>
            <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); font-weight: 700;">
              #DREADTHESTRIKE
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--b-subtle); padding-top: 2rem; font-size: 0.8125rem; color: #64748b; flex-wrap: wrap; gap: 1rem;">
          <div>&copy; 2021–2024 Dread Eleven (DE). All 24 tournament encounters recorded under RDCA.</div>
          <div>Martand Ground No. 3 • Rewa, Madhya Pradesh</div>
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
// 1. HOME PAGE
// ------------------------------------------------------------
function generateHomePage() {
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
      jobTitle: 'Captain & Opening Anchor'
    }
  };

  const html = `
${renderHead({
  title: 'Dread Eleven (DE) — Official Cricket Franchise Portal | Capt. Akhil Mishra | Rewa',
  description: 'Official franchise portal for Dread Eleven (DE), captained by Akhil Mishra. 2022 Atal Bihari Vajpayee Memorial Trophy winners, verified match telemetry, 43-man active roster.',
  canonicalUrl: '/',
  jsonLd
})}
${renderHeader('home')}

<!-- Cinematic Hero Arena -->
<section class="hero-section">
  <div class="container">
    <div class="hero-grid">
      <div>
        <div class="hero-kicker-tag">
          <span class="pulse-led"></span>
          <span>2022 Atal Bihari Vajpayee Memorial Trophy Winners</span>
        </div>

        <h1 class="hero-monument-title">
          THE DOMINANT FORCE. <br>
          <span class="highlight">DREAD ELEVEN.</span>
        </h1>

        <p class="hero-description">
          Official digital arena of <strong>Dread Eleven (DE)</strong>, anchored by premier batsman <strong>Akhil Mishra</strong> (905 runs, 47.6 avg). 
          Champions of the 2022 Silverware and division leaders with <strong>17 championship victories</strong> across 24 One Day &amp; T20 encounters under the Rewa Division Cricket Association (RDCA).
        </p>

        <div class="hero-cta-row">
          <a href="/fixtures" class="btn-primary-volt">
            <span>T20 &amp; One Day Schedule</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="/results" class="btn-outline-titanium">
            <span>24 Match Archive</span>
          </a>
          <a href="/players" class="btn-outline-titanium">
            <span>Roster (43)</span>
          </a>
        </div>
      </div>

      <!-- 3D Gyroscopic Telemetry Monument Card -->
      <div class="monument-stage-card tilt-card">
        <div class="stage-header-row">
          <span>Atal Bihari Vajpayee Memorial Trophy</span>
          <span style="color: var(--c-amber); font-weight: 800;">CHAMPIONS</span>
        </div>

        <div class="stage-score-line tabular">
          <span style="color: var(--c-volt);">183</span> <span style="font-size: 1.8rem; color: #64748b;">DEF</span> 162/6
        </div>
        <div class="stage-result-chip">
          Dread Eleven won 2022 Championship Final by 21 runs
        </div>

        <p class="stage-summary-text">
          Defending 183 at Martand Ground No. 3, Dread Eleven restricted Vindhya Warriors to 162/6 behind lethal pace spells to hoist the coveted silverware.
        </p>

        <div class="stage-stats-grid">
          <div>
            <div class="stage-stat-number tabular" style="color: var(--c-volt);" data-count="17">17</div>
            <div class="stage-stat-label">Championship Victories</div>
          </div>
          <div>
            <div class="stage-stat-number tabular" data-count="905">905</div>
            <div class="stage-stat-label">Capt. Akhil Mishra Runs</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Kinetic Infinite Running Marquee -->
<div class="kinetic-marquee-container" aria-hidden="true">
  <div class="kinetic-marquee-track">
    <div class="marquee-phrase">DREAD ELEVEN <span>•</span> 17 TOURNAMENT WINS <span>•</span> 2022 CHAMPIONS <span>•</span> CAPT. AKHIL MISHRA 905 RUNS <span>•</span> RDCA REWA</div>
    <div class="marquee-phrase outline">TITAN POWERHOUSE <span>•</span> 24 ENCOUNTERS <span>•</span> KULDEEP SEN <span>•</span> KUMAR KARTIKEYA <span>•</span> MARTAND NO. 3</div>
    <div class="marquee-phrase">DREAD ELEVEN <span>•</span> 17 TOURNAMENT WINS <span>•</span> 2022 CHAMPIONS <span>•</span> CAPT. AKHIL MISHRA 905 RUNS <span>•</span> RDCA REWA</div>
    <div class="marquee-phrase outline">TITAN POWERHOUSE <span>•</span> 24 ENCOUNTERS <span>•</span> KULDEEP SEN <span>•</span> KUMAR KARTIKEYA <span>•</span> MARTAND NO. 3</div>
  </div>
</div>

<!-- Telemetry Stats Band -->
<div class="telemetry-band">
  <div class="container telemetry-band-grid">
    <div class="telemetry-cell">
      <div class="telemetry-digit tabular" style="color: var(--c-volt);" data-count="17">17</div>
      <div class="telemetry-desc">Championship Victories (70.8% Win Rate)</div>
    </div>
    <div class="telemetry-cell">
      <div class="telemetry-digit tabular" data-count="905">905</div>
      <div class="telemetry-desc">Capt. Akhil Mishra (47.63 Avg • 9 Fifties)</div>
    </div>
    <div class="telemetry-cell">
      <div class="telemetry-digit tabular" style="color: var(--c-amber);" data-count="28">28</div>
      <div class="telemetry-desc">Wickets by Pace Attack (Sen &amp; Das)</div>
    </div>
    <div class="telemetry-cell">
      <div class="telemetry-digit tabular" style="color: var(--c-volt);">2022</div>
      <div class="telemetry-desc">Atal Bihari Vajpayee Memorial Trophy</div>
    </div>
  </div>
</div>

<!-- Featured Squad Roster -->
<section class="section-block">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// SQUAD ARSENAL</div>
        <h2 class="section-heading-huge">Active Roster</h2>
      </div>
      <a href="/players" class="btn-primary-volt">Full Squad (43)</a>
    </div>

    <div class="squad-grid">
      ${featuredSquad.map((p) => `
        <a href="/players/${p.slug}" class="player-card tilt-card">
          <div class="player-jersey-number">#${p.jerseyNumber}</div>
          <div class="player-role-pill">${esc(p.role)}</div>
          <h3 class="player-name-text">${esc(p.name)}</h3>
          <div class="player-matches-text">Dread Eleven • ${p.matches} Matches</div>

          <div class="player-stats-row">
            <div>
              <div class="player-stat-val tabular" style="color: var(--c-volt);">${esc(p.batting.runs)}</div>
              <div class="player-stat-key">Runs</div>
            </div>
            <div>
              <div class="player-stat-val tabular">${esc(p.batting.average)}</div>
              <div class="player-stat-key">Avg</div>
            </div>
            <div>
              <div class="player-stat-val tabular" style="color: var(--c-amber);">${esc(p.bowling.wickets)}</div>
              <div class="player-stat-key">Wkts</div>
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- Latest Dispatches -->
<section class="section-block" style="background: var(--c-surface-1); border-top: 1px solid var(--b-subtle);">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// PRESS RELEASES</div>
        <h2 class="section-heading-huge">Tactical Bulletins</h2>
      </div>
      <a href="/news" class="btn-outline-titanium">All Articles</a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
      ${featuredNews.map((n) => `
        <article class="tilt-card" style="background: var(--c-surface-2); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2.25rem; display: flex; flex-direction: column;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; font-weight: 700; margin-bottom: 0.6rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}
          </div>
          <h3 style="font-family: var(--f-headline); font-size: 1.5rem; color: #fff; text-transform: uppercase; line-height: 1.15; margin-bottom: 0.85rem;">
            <a href="/news/${n.slug}" style="color: inherit; text-decoration: none;">${esc(n.title)}</a>
          </h3>
          <p style="font-size: 0.9375rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.75rem;">${esc(n.summary)}</p>
          <a href="/news/${n.slug}" style="margin-top: auto; font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); font-weight: 700; text-transform: uppercase; text-decoration: none;">
            Read Dispatch &rarr;
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
// 2. SQUAD DIRECTORY & PLAYERS
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
  title: 'Active Roster (43 Players) | Dread Eleven (DE)',
  description: 'Official roster for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa. Captain Akhil Mishra, Kuldeep Sen, Kumar Kartikeya.',
  canonicalUrl: '/players',
  jsonLd: jsonLdDirectory
})}
${renderHeader('squad')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// ACTIVE ROSTER</div>
        <h1 class="section-heading-huge">Dread Eleven Roster (43 Players)</h1>
        <p style="color: #94a3b8; font-size: 0.9375rem; max-width: 65ch; margin-top: 0.4rem;">
          Verified tournament records for every Dread Eleven player across 24 One Day &amp; T20 championship clashes in Rewa. Led by captain <strong>Akhil Mishra</strong>.
        </p>
      </div>
    </div>

    <!-- Role Filter Controls -->
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2.5rem;" id="squad-filter-controls">
      <button type="button" class="filter-pill-btn active role-btn" data-filter="all">All (43)</button>
      <button type="button" class="filter-pill-btn role-btn" data-filter="Batter">Batters</button>
      <button type="button" class="filter-pill-btn role-btn" data-filter="All-rounder">All-Rounders</button>
      <button type="button" class="filter-pill-btn role-btn" data-filter="Bowler">Bowlers</button>
    </div>

    <div class="squad-grid" id="players-grid">
      ${squad.map((p) => `
        <a href="/players/${p.slug}" class="player-card tilt-card" data-role="${esc(p.role)}">
          <div class="player-jersey-number">#${p.jerseyNumber}</div>
          <div class="player-role-pill">${esc(p.role)}</div>
          <h2 class="player-name-text">${esc(p.name)}</h2>
          <div class="player-matches-text">Dread Eleven • ${p.matches} Matches</div>

          <div class="player-stats-row">
            <div>
              <div class="player-stat-val tabular" style="color: var(--c-volt);">${esc(p.batting.runs)}</div>
              <div class="player-stat-key">Runs</div>
            </div>
            <div>
              <div class="player-stat-val tabular">${esc(p.batting.average)}</div>
              <div class="player-stat-key">Avg</div>
            </div>
            <div>
              <div class="player-stat-val tabular" style="color: var(--c-amber);">${esc(p.bowling.wickets)}</div>
              <div class="player-stat-key">Wkts</div>
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

  squad.forEach((p) => {
    const playerDir = path.join(playersDir, p.slug);
    ensureDir(playerDir);

    const playerLogs = [];
    matches.forEach((m) => {
      if (!m.innings || m.innings.length < 2) return;
      const deInn = m.innings[1];
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
  description: `${p.name} official profile for Dread Eleven in the Atal Bihari Vajpayee Tournament, Rewa. ${p.batting.runs} runs, ${p.bowling.wickets} wickets.`,
  canonicalUrl: `/players/${p.slug}`,
  jsonLd: playerJsonLd
})}
${renderHeader('squad')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8;">
      <a href="/" style="color: inherit;">Home</a> / <a href="/players" style="color: inherit;">Roster</a> / <span style="color: var(--c-volt);">${esc(p.name)}</span>
    </nav>

    <div style="background: var(--c-surface-1); border: 2px solid var(--b-medium); border-radius: 8px; padding: 2.75rem; margin-bottom: 3rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
        <span style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); font-weight: 700;">JERSEY #${p.jerseyNumber} // ${esc(p.role)}</span>
        <span style="font-family: var(--f-mono); font-size: 0.75rem; color: #64748b;">DE-ID: ${p.id}</span>
      </div>

      <h1 class="section-heading-huge" style="font-size: clamp(2.4rem, 5vw, 4rem); margin-bottom: 0.5rem;">
        #${p.jerseyNumber} ${esc(p.name)}
      </h1>
      <p style="font-family: var(--f-mono); font-size: 0.8125rem; color: var(--c-volt); margin-bottom: 1.5rem;">
        ${esc(p.battingStyle)} • ${esc(p.bowlingStyle)} • Dread Eleven
      </p>

      <p style="font-size: 1rem; color: #cbd5e1; max-width: 72ch; line-height: 1.75; margin-bottom: 2rem;">
        ${esc(p.bio)}
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem;">
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">Matches</div>
          <div class="player-stat-val tabular">${p.matches}</div>
        </div>
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">Runs</div>
          <div class="player-stat-val tabular" style="color: var(--c-volt);">${esc(p.batting.runs)}</div>
        </div>
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">HS</div>
          <div class="player-stat-val tabular">${esc(p.batting.highestScore)}</div>
        </div>
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">Avg</div>
          <div class="player-stat-val tabular">${esc(p.batting.average)}</div>
        </div>
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">SR</div>
          <div class="player-stat-val tabular">${esc(p.batting.strikeRate)}</div>
        </div>
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">Wkts</div>
          <div class="player-stat-val tabular" style="color: var(--c-amber);">${esc(p.bowling.wickets)}</div>
        </div>
        <div style="background: var(--c-surface-2); border: 1px solid var(--b-subtle); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="player-stat-key">BBI</div>
          <div class="player-stat-val tabular">${esc(p.bowling.bestBowling)}</div>
        </div>
      </div>
    </div>

    <!-- Match Appearance Log -->
    <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
      <h2 style="font-family: var(--f-headline); font-size: 1.6rem; color: #fff; text-transform: uppercase; margin-bottom: 1.5rem;">
        Match Appearance Log
      </h2>

      <div class="scorecard-table-wrapper">
        <table class="scorecard-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Format</th>
              <th>Scorecard</th>
              <th class="num">Batting</th>
              <th>Dismissal</th>
              <th class="num">Bowling</th>
              <th style="text-align: center;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${playerLogs.length ? playerLogs.map((item) => `
              <tr>
                <td style="padding: 0.85rem 1rem; font-weight: 700; color: #fff;">${formatDate(item.match.matchDate)}</td>
                <td style="padding: 0.85rem 1rem;"><span class="format-pill ${item.match.format === 'T20' ? 't20' : 'odi'}">${esc(item.match.format)}</span></td>
                <td style="padding: 0.85rem 1rem;"><a href="/matches/${item.match.slug}" style="color: var(--c-volt); font-family: var(--f-mono); font-weight: 700; text-decoration: none;">Scorecard &rarr;</a></td>
                <td class="num tabular font-bold" style="color: #fff;">${item.batting ? `${item.batting.runs} (${item.batting.balls}b)` : '—'}</td>
                <td style="font-size: 0.75rem; color: #94a3b8;">${item.batting ? esc(item.batting.dismissal) : 'Did Not Bat'}</td>
                <td class="num tabular font-bold" style="color: var(--c-amber);">${item.bowling ? `${item.bowling.wickets}/${item.bowling.runs} (${item.bowling.overs} ov)` : '—'}</td>
                <td style="text-align: center;"><span style="font-family: var(--f-mono); font-size: 0.6875rem; padding: 0.25rem 0.6rem; border-radius: 4px; ${item.match.winner === 'DE' ? 'background: rgba(212, 255, 0, 0.15); color: var(--c-volt);' : 'background: rgba(255, 42, 68, 0.15); color: var(--c-crimson);'}">${item.match.winner === 'DE' ? 'DE Win' : 'DE Loss'}</span></td>
              </tr>
            `).join('') : '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">No individual match appearances recorded.</td></tr>'}
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

  console.log(`Generated /players directory and ${squad.length} player profiles (Dread Eleven).`);
}

// ------------------------------------------------------------
// 3. FIXTURES & RESULTS WITH ONE DAY & T20 FILTERS
// ------------------------------------------------------------
function generateMatchPages() {
  const matchesDir = path.join(rootDir, 'matches');
  const fixturesDir = path.join(rootDir, 'fixtures');
  const resultsDir = path.join(rootDir, 'results');

  ensureDir(matchesDir);
  ensureDir(fixturesDir);
  ensureDir(resultsDir);

  function renderMatchListSection(isResultsPage) {
    const t20Count = matches.filter((m) => m.format === 'T20').length;
    const odiCount = matches.filter((m) => m.format === 'ODI' || m.format === 'One-Day').length;

    return `
<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// ${isResultsPage ? 'RESULTS ARCHIVE' : 'FIXTURES &amp; SCHEDULE'}</div>
        <h1 class="section-heading-huge">${isResultsPage ? 'Tournament Results &amp; Scorecards' : 'T20 &amp; One Day Fixture Ledger'}</h1>
        <p style="color: #94a3b8; font-size: 0.9375rem; margin-top: 0.4rem;">
          Official Atal Bihari Vajpayee Memorial Tournament fixtures of Dread Eleven in Rewa.
        </p>
      </div>
      <div style="font-family: var(--f-mono); font-size: 0.8125rem; color: #94a3b8;">
        Showing <strong style="color: var(--c-volt);" id="filter-matches-count">24</strong> matches
      </div>
    </div>

    <!-- Multi-Parameter Filter Command Bar -->
    <div class="filter-command-bar">
      <span class="filter-heading">Format:</span>
      <button type="button" class="filter-pill-btn active format-filter-btn" data-format="all">All (${matches.length})</button>
      <button type="button" class="filter-pill-btn format-filter-btn" data-format="T20">T20 Matches (${t20Count})</button>
      <button type="button" class="filter-pill-btn format-filter-btn" data-format="ODI">One-Day / ODI (${odiCount})</button>

      <span class="filter-heading" style="margin-left: 1rem;">Season:</span>
      <button type="button" class="filter-pill-btn active season-filter-btn" data-season="all">All Seasons</button>
      <button type="button" class="filter-pill-btn season-filter-btn" data-season="2024">2024</button>
      <button type="button" class="filter-pill-btn season-filter-btn" data-season="2023">2023</button>
      <button type="button" class="filter-pill-btn season-filter-btn" data-season="2022">2022 (Final)</button>
      <button type="button" class="filter-pill-btn season-filter-btn" data-season="2021">2021</button>
    </div>

    <!-- Fixtures Grid -->
    <div class="matches-cards-grid" id="fixtures-grid">
      ${matches.map((m) => {
        const isDeWinner = m.winner === 'DE';
        const isFinal = m.stage && m.stage.toLowerCase().includes('final');
        const oppInnings = m.innings[0] || { runs: 0, wickets: 0, overs: 0, teamName: 'Opponent' };
        const deInnings = m.innings[1] || { runs: 0, wickets: 0, overs: 0, teamName: 'Dread Eleven' };
        const isT20 = m.format === 'T20';

        return `
          <div class="match-card tilt-card" data-format="${esc(m.format)}" data-season="${esc(m.seasonYear)}">
            <div class="match-card-meta">
              <span class="format-pill ${isT20 ? 't20' : 'odi'}">${esc(m.format)} • SEASON ${esc(m.seasonYear)}</span>
              ${isFinal ? '<span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-amber); font-weight: 800;">★ 2022 FINAL</span>' : `<span style="font-family: var(--f-mono); font-size: 0.6875rem; color: #64748b;">MATCH #${esc(m.matchNumber)}</span>`}
            </div>

            <div class="match-card-date">
              <strong style="color: #fff;">${formatDate(m.matchDate)}</strong> • <span>${esc(m.venue.name)}</span>
            </div>

            <div class="match-card-scores">
              <div class="score-row">
                <span class="score-team-name" style="color: ${isDeWinner ? '#fff' : '#64748b'};">Dread Eleven</span>
                <span class="tabular" style="font-family: var(--f-mono); font-weight: 800; color: ${isDeWinner ? 'var(--c-volt)' : '#64748b'};">
                  ${deInnings.runs}/${deInnings.wickets} <span style="font-size: 0.6875rem; font-weight: 400;">(${deInnings.overs} ov)</span>
                </span>
              </div>
              <div class="score-row">
                <span class="score-team-name" style="color: ${!isDeWinner ? '#fff' : '#64748b'};">${esc(oppInnings.teamName)}</span>
                <span class="tabular" style="font-family: var(--f-mono); font-weight: 800; color: ${!isDeWinner ? '#fff' : '#64748b'};">
                  ${oppInnings.runs}/${oppInnings.wickets} <span style="font-size: 0.6875rem; font-weight: 400;">(${oppInnings.overs} ov)</span>
                </span>
              </div>
            </div>

            <div class="match-result-banner ${isDeWinner ? 'win' : 'loss'}">
              <span>${esc(m.resultText)}</span>
            </div>

            ${m.playerOfTheMatch ? `
              <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 1.25rem; border-top: 1px solid var(--b-subtle); padding-top: 0.6rem; font-family: var(--f-mono);">
                POTM: <strong style="color: var(--c-volt);">${esc(m.playerOfTheMatch.name)}</strong>
              </div>
            ` : ''}

            <a href="/matches/${m.slug}" class="btn-outline-titanium" style="margin-top: auto; font-size: 0.75rem; padding: 0.65rem 1rem; text-align: center;">
              <span>Scorecard Hub &rarr;</span>
            </a>
          </div>
        `;
      }).join('')}
    </div>
  </div>
</section>
    `;
  }

  // A. /fixtures
  const fixturesHtml = `
${renderHead({
  title: 'One Day & T20 Fixtures (24 Matches) | Dread Eleven (DE)',
  description: 'Official One Day and T20 schedule for Dread Eleven in Rewa. Real-time filters for T20 and One Day matches across all seasons.',
  canonicalUrl: '/fixtures'
})}
${renderHeader('fixtures')}
${renderMatchListSection(false)}
${renderFooter()}
  `;
  fs.writeFileSync(path.join(fixturesDir, 'index.html'), fixturesHtml);

  // B. /results
  const resultsHtml = `
${renderHead({
  title: 'Tournament Results Archive (24 Matches) | Dread Eleven (DE)',
  description: 'Complete One Day and T20 results archive for all 24 clashes of Dread Eleven (17 wins) in Rewa.',
  canonicalUrl: '/results'
})}
${renderHeader('results')}
${renderMatchListSection(true)}
${renderFooter()}
  `;
  fs.writeFileSync(path.join(resultsDir, 'index.html'), resultsHtml);

  // C. /matches/[slug]
  matches.forEach((m) => {
    const matchPageDir = path.join(matchesDir, m.slug);
    ensureDir(matchPageDir);

    const isDeWinner = m.winner === 'DE';
    const innOpp = m.innings[0] || { runs: 0, wickets: 0, teamName: 'Opponent' };
    const innDE = m.innings[1] || { runs: 0, wickets: 0, teamName: 'Dread Eleven' };

    const matchJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: `Dread Eleven vs ${innOpp.teamName} (${m.format})`,
      startDate: `${m.matchDate}T14:00:00Z`,
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
        { '@type': 'SportsTeam', name: innOpp.teamName }
      ]
    };

    function renderInningsTable(inn, battingTeam, bowlingTeam) {
      if (!inn || !inn.batting || !inn.batting.length) {
        return '<p style="color: #94a3b8; padding: 1rem;">Innings data not recorded.</p>';
      }

      const batRows = inn.batting.map((b) => `
        <tr>
          <td style="font-weight: 700; color: #fff; font-size: 0.9375rem;">${esc(b.playerName)}</td>
          <td style="color: #94a3b8; font-size: 0.75rem;">${esc(b.dismissal)}</td>
          <td class="num tabular font-bold" style="color: #fff;">${esc(b.runs)}</td>
          <td class="num tabular">${esc(b.balls)}</td>
          <td class="num tabular">${esc(b.fours)}</td>
          <td class="num tabular">${esc(b.sixes)}</td>
          <td class="num tabular" style="color: var(--c-volt); font-weight: 700;">${esc(b.strikeRate)}</td>
        </tr>
      `).join('');

      const bowlRows = (inn.bowling || []).map((bo) => `
        <tr>
          <td style="font-weight: 700; color: #fff; font-size: 0.9375rem;">${esc(bo.playerName)}</td>
          <td class="num tabular">${esc(bo.overs)}</td>
          <td class="num tabular">${esc(bo.maidens)}</td>
          <td class="num tabular">${esc(bo.runs)}</td>
          <td class="num tabular font-bold" style="color: var(--c-volt);">${esc(bo.wickets)}</td>
          <td class="num tabular">${esc(bo.economy)}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom: 2.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--b-medium); padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <div>
              <div style="font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Batting: ${esc(battingTeam)}</div>
              <h3 style="font-family: var(--f-headline); font-size: 1.6rem; color: #fff; text-transform: uppercase;">
                ${esc(inn.teamName)} Innings
              </h3>
            </div>
            <div class="tabular" style="font-family: var(--f-display); font-size: 2.2rem; font-weight: 900; color: #fff;">
              ${inn.runs}/${inn.wickets} <span style="font-size: 0.8125rem; color: #94a3b8; font-weight: 400;">(${inn.overs} ov • RR ${inn.runRate})</span>
            </div>
          </div>

          <div class="scorecard-table-wrapper">
            <table class="scorecard-table">
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

          <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">
            Bowling (${esc(bowlingTeam)})
          </div>
          <div class="scorecard-table-wrapper">
            <table class="scorecard-table">
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
  title: `Dread Eleven vs ${innOpp.teamName} (${formatDate(m.matchDate)}) — Scorecard`,
  description: `Scorecard for Dread Eleven vs ${innOpp.teamName} on ${formatDate(m.matchDate)} at ${m.venue.name}, Rewa.`,
  canonicalUrl: `/matches/${m.slug}`,
  jsonLd: matchJsonLd
})}
${renderHeader('results')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8;">
      <a href="/" style="color: inherit;">Home</a> / <a href="/results" style="color: inherit;">Results</a> / <span style="color: var(--c-volt);">${formatDate(m.matchDate)}</span>
    </nav>

    <div style="background: var(--c-surface-1); border: 2px solid var(--b-medium); border-radius: 8px; padding: 2.5rem; margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <span class="format-pill ${m.format === 'T20' ? 't20' : 'odi'}">${esc(m.format)} • Season ${esc(m.seasonYear)}</span>
        <span style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); font-weight: 700;">${esc(m.stage)}</span>
      </div>

      <h1 class="section-heading-huge" style="font-size: clamp(2.2rem, 5vw, 3.5rem); margin-bottom: 0.5rem;">
        Dread Eleven vs ${esc(innOpp.teamName)}
      </h1>

      <div style="font-size: 0.8125rem; color: #94a3b8; margin-bottom: 1.25rem; font-family: var(--f-mono);">
        <span>${formatDate(m.matchDate)}</span> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}, ${esc(m.venue.city)}</span>
      </div>

      ${m.toss ? `
        <div style="font-family: var(--f-mono); font-size: 0.8125rem; color: #cbd5e1; margin-bottom: 1rem; background: var(--c-surface-2); padding: 0.75rem 1rem; border: 1px solid var(--b-subtle); border-radius: 4px;">
          Toss: <strong>${esc(m.toss.winner)}</strong> won the toss and ${esc(m.toss.decision)}.
        </div>
      ` : ''}

      <div style="padding: 0.75rem 1.25rem; border-radius: 4px; font-family: var(--f-body); font-size: 1rem; font-weight: 800; ${isDeWinner ? 'background: rgba(212, 255, 0, 0.15); color: var(--c-volt); border: 1px solid rgba(212, 255, 0, 0.4);' : 'background: rgba(255, 42, 68, 0.15); color: var(--c-crimson); border: 1px solid rgba(255, 42, 68, 0.4);'}">
        <span>${esc(m.resultText)}</span>
      </div>

      ${m.playerOfTheMatch ? `
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--b-subtle); display: flex; align-items: center; gap: 0.6rem; font-family: var(--f-mono); font-size: 0.8125rem;">
          <span style="color: var(--c-volt); font-weight: 700;">Player of the Match:</span>
          <strong style="color: #fff; font-size: 1.15rem;">${esc(m.playerOfTheMatch.name)}</strong>
          <span style="color: #94a3b8;">(${esc(m.playerOfTheMatch.team)} • ${esc(m.playerOfTheMatch.reason)})</span>
        </div>
      ` : ''}
    </div>

    <!-- ESPNcricinfo Interactive Tab Controller -->
    <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid var(--b-medium); margin-bottom: 2rem;">
      <button type="button" class="filter-pill-btn active espn-tab-btn" data-tab="tab-scorecard" style="border-radius: 4px 4px 0 0;">Scorecard</button>
      <button type="button" class="filter-pill-btn espn-tab-btn" data-tab="tab-matchinfo" style="border-radius: 4px 4px 0 0;">Match Info</button>
    </div>

    <div id="tab-scorecard" class="espn-tab-content" style="display: block;">
      <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 8px; padding: 2.25rem;">
        ${renderInningsTable(innDE, 'Dread Eleven', innOpp.teamName)}
        ${renderInningsTable(innOpp, innOpp.teamName, 'Dread Eleven')}
      </div>
    </div>

    <div id="tab-matchinfo" class="espn-tab-content" style="display: none;">
      <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 8px; padding: 2.25rem;">
        <h3 style="font-family: var(--f-headline); font-size: 1.6rem; color: #fff; text-transform: uppercase; margin-bottom: 1.5rem;">
          Match Telemetry &amp; Sanction
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; font-size: 0.875rem;">
          <div style="background: var(--c-surface-2); padding: 1.25rem; border: 1px solid var(--b-subtle); border-radius: 4px;">
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; margin-bottom: 0.35rem;">Tournament</div>
            <div style="font-weight: 700; color: #fff;">${esc(m.tournamentName)}</div>
          </div>
          <div style="background: var(--c-surface-2); padding: 1.25rem; border: 1px solid var(--b-subtle); border-radius: 4px;">
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; margin-bottom: 0.35rem;">Venue</div>
            <div style="font-weight: 700; color: #fff;">${esc(m.venue.name)}, ${esc(m.venue.city)}</div>
          </div>
          <div style="background: var(--c-surface-2); padding: 1.25rem; border: 1px solid var(--b-subtle); border-radius: 4px;">
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; margin-bottom: 0.35rem;">Sanctioning Body</div>
            <div style="font-weight: 700; color: #fff;">Rewa Division Cricket Association (RDCA)</div>
          </div>
          <div style="background: var(--c-surface-2); padding: 1.25rem; border: 1px solid var(--b-subtle); border-radius: 4px;">
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; margin-bottom: 0.35rem;">Match Number</div>
            <div style="font-weight: 700; color: #fff;">Fixture #${esc(m.matchNumber)}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

${renderFooter()}
    `;

    fs.writeFileSync(path.join(matchPageDir, 'index.html'), matchHtml);
  });

  console.log(`Generated /fixtures, /results, and ${matches.length} match pages (Dread Eleven).`);
}

// ------------------------------------------------------------
// 4. POINTS TABLE
// ------------------------------------------------------------
function generatePointsTablePage() {
  const tableDir = path.join(rootDir, 'points-table');
  ensureDir(tableDir);

  const html = `
${renderHead({
  title: 'Divisional Standings | Dread Eleven (DE)',
  description: 'Official standings and points table for the Atal Bihari Vajpayee Memorial Tournament, Rewa. Dread Eleven leads the division.',
  canonicalUrl: '/points-table'
})}
${renderHeader('table')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// DIVISION STANDINGS</div>
        <h1 class="section-heading-huge">Tournament Points Table</h1>
        <p style="color: #94a3b8; font-size: 0.9375rem; margin-top: 0.4rem;">
          Sanctioned standings across all editions of the Atal Bihari Vajpayee Memorial Tournament under RDCA.
        </p>
      </div>
    </div>

    <div style="background: var(--c-surface-1); border: 2px solid var(--b-medium); border-radius: 8px; padding: 2.5rem; margin-bottom: 3rem;">
      <h2 style="font-family: var(--f-headline); font-size: 1.8rem; color: #fff; text-transform: uppercase; margin-bottom: 1.5rem;">
        Divisional Championship Table (2021–2024 • 24 Encounters)
      </h2>

      <div class="scorecard-table-wrapper">
        <table class="scorecard-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Franchise</th>
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
                <td style="font-weight: 800; font-family: var(--f-mono); color: ${row.rank === 1 ? 'var(--c-volt)' : '#fff'};">${row.rank}</td>
                <td style="font-weight: 800; color: #fff; font-size: 1.15rem;">
                  ${esc(row.team)} ${row.rank === 1 ? '<span style="color: var(--c-volt); font-size: 0.75rem; margin-left: 0.5rem;">DIVISION LEADER</span>' : ''}
                </td>
                <td class="num tabular font-bold">${row.played}</td>
                <td class="num tabular font-bold" style="color: var(--c-volt);">${row.won}</td>
                <td class="num tabular" style="color: var(--c-crimson);">${row.lost}</td>
                <td class="num tabular">${row.tied}</td>
                <td class="num tabular">${row.nr}</td>
                <td class="num tabular font-mono">${row.nrr}</td>
                <td class="num tabular font-bold" style="color: var(--c-volt); font-size: 1.3rem;">${row.points}</td>
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
// 5. STATS
// ------------------------------------------------------------
function generateStatsPage() {
  const statsDir = path.join(rootDir, 'stats');
  ensureDir(statsDir);

  const topRunScorers = [...squad].sort((a, b) => b.batting.runs - a.batting.runs).slice(0, 10);
  const topWicketTakers = [...squad].sort((a, b) => b.bowling.wickets - a.bowling.wickets).slice(0, 10);

  const html = `
${renderHead({
  title: 'Telemetry & Records | Dread Eleven (DE)',
  description: 'Official statistical records for Dread Eleven in Rewa. Top run scorers, bowling figures, and strike rates.',
  canonicalUrl: '/stats'
})}
${renderHeader('stats')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// PERFORMANCE RECORDS</div>
        <h1 class="section-heading-huge">Dread Eleven All-Time Records</h1>
        <p style="color: #94a3b8; font-size: 0.9375rem; margin-top: 0.4rem;">
          Verified performance telemetry across 24 tournament encounters in Rewa.
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 3rem;">
      <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
        <h2 style="font-family: var(--f-headline); font-size: 1.6rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Top Run Scorers
        </h2>
        <div class="scorecard-table-wrapper">
          <table class="scorecard-table">
            <thead>
              <tr>
                <th>Player</th>
                <th class="num">Mat</th>
                <th class="num">Runs</th>
                <th class="num">Avg</th>
                <th class="num">SR</th>
              </tr>
            </thead>
            <tbody>
              ${topRunScorers.map((p) => `
                <tr>
                  <td style="font-weight: 700; color: #fff;"><a href="/players/${p.slug}" style="color: inherit; text-decoration: none;">${esc(p.name)}</a></td>
                  <td class="num tabular">${p.matches}</td>
                  <td class="num tabular font-bold" style="color: var(--c-volt);">${esc(p.batting.runs)}</td>
                  <td class="num tabular">${esc(p.batting.average)}</td>
                  <td class="num tabular">${esc(p.batting.strikeRate)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
        <h2 style="font-family: var(--f-headline); font-size: 1.6rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Top Wicket Takers
        </h2>
        <div class="scorecard-table-wrapper">
          <table class="scorecard-table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th class="num">Mat</th>
                <th class="num">Wkts</th>
                <th class="num">Overs</th>
                <th class="num">Eco</th>
              </tr>
            </thead>
            <tbody>
              ${topWicketTakers.map((p) => `
                <tr>
                  <td style="font-weight: 700; color: #fff;"><a href="/players/${p.slug}" style="color: inherit; text-decoration: none;">${esc(p.name)}</a></td>
                  <td class="num tabular">${p.matches}</td>
                  <td class="num tabular font-bold" style="color: var(--c-amber);">${esc(p.bowling.wickets)}</td>
                  <td class="num tabular">${esc(p.bowling.overs)}</td>
                  <td class="num tabular">${esc(p.bowling.economy)}</td>
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
  console.log('Generated /stats/index.html (Dread Eleven)');
}

// ------------------------------------------------------------
// 6. NEWS
// ------------------------------------------------------------
function generateNewsPages() {
  const newsDir = path.join(rootDir, 'news');
  ensureDir(newsDir);

  const directoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dread Eleven News & Bulletins',
    itemListElement: news.map((n, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${BASE_URL}/news/${n.slug}`,
      name: n.title
    }))
  };

  const directoryHtml = `
${renderHead({
  title: 'Media & Bulletins | Dread Eleven (DE)',
  description: 'Official announcements and tactical dispatches for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa.',
  canonicalUrl: '/news',
  jsonLd: directoryJsonLd
})}
${renderHeader('news')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// PRESS RELEASES</div>
        <h1 class="section-heading-huge">Dread Eleven Media Center</h1>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
      ${news.map((n) => `
        <article class="tilt-card" style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2.25rem; display: flex; flex-direction: column;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; font-weight: 700; margin-bottom: 0.6rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}
          </div>
          <h2 style="font-family: var(--f-headline); font-size: 1.55rem; color: #fff; text-transform: uppercase; line-height: 1.15; margin-bottom: 0.85rem;">
            <a href="/news/${n.slug}" style="color: inherit; text-decoration: none;">${esc(n.title)}</a>
          </h2>
          <p style="font-size: 0.9375rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.75rem;">
            ${esc(n.summary)}
          </p>
          <a href="/news/${n.slug}" style="margin-top: auto; font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); font-weight: 700; text-transform: uppercase; text-decoration: none;">
            Read Full Dispatch &rarr;
          </a>
        </article>
      `).join('')}
    </div>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(newsDir, 'index.html'), directoryHtml);

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
  jsonLd: articleJsonLd
})}
${renderHeader('news')}

<article class="section-block" style="padding-top: 4rem;">
  <div class="container" style="max-width: 860px;">
    <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8;">
      <a href="/" style="color: inherit;">Home</a> / <a href="/news" style="color: inherit;">News</a> / <span style="color: var(--c-volt);">${esc(n.category)}</span>
    </nav>

    <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); text-transform: uppercase; font-weight: 700; margin-bottom: 0.75rem;">
      ${esc(n.category)} • Published ${formatDate(n.publishedAt.slice(0, 10))} • ${esc(n.readTime)}
    </div>

    <h1 class="section-heading-huge" style="font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1; margin-bottom: 1.5rem;">
      ${esc(n.title)}
    </h1>

    <div style="display: flex; align-items: center; gap: 0.75rem; border-top: 1px solid var(--b-subtle); border-bottom: 1px solid var(--b-subtle); padding: 0.75rem 0; margin-bottom: 2rem; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8;">
      <span>By <strong style="color: #fff;">${esc(n.author.name)}</strong></span>
      <span>•</span>
      <span>${esc(n.author.role)}</span>
    </div>

    <div style="font-size: 1.0625rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 3.5rem;">
      ${n.body}
    </div>

    <div style="border-top: 1px solid var(--b-subtle); padding-top: 2rem;">
      <h3 style="font-family: var(--f-headline); font-size: 1.5rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem;">
        Related Dispatches
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        ${related.map((r) => `
          <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 1.25rem;">
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; margin-bottom: 0.4rem;">${esc(r.category)}</div>
            <h4 style="font-family: var(--f-headline); font-size: 1.2rem; text-transform: uppercase; line-height: 1.2; margin-bottom: 0.5rem;">
              <a href="/news/${r.slug}" style="color: #fff; text-decoration: none;">${esc(r.title)}</a>
            </h4>
            <a href="/news/${r.slug}" style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-volt); font-weight: 700; text-decoration: none;">Read &rarr;</a>
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

  console.log(`Generated /news and ${news.length} articles (Dread Eleven).`);
}

// ------------------------------------------------------------
// 7. ABOUT, CONTACT, 404
// ------------------------------------------------------------
function generateAboutPage() {
  const aboutDir = path.join(rootDir, 'about');
  ensureDir(aboutDir);

  const html = `
${renderHead({
  title: 'About Dread Eleven & 2022 Championship Trophy',
  description: 'Official history of Dread Eleven (DE), captained by Akhil Mishra, the 2022 championship triumph, and the Rewa Division Cricket Association (RDCA).',
  canonicalUrl: '/about'
})}
${renderHeader('about')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// FRANCHISE HERITAGE</div>
        <h1 class="section-heading-huge">About Dread Eleven &amp; 2022 Silverware</h1>
        <p style="color: #94a3b8; font-size: 0.9375rem; max-width: 65ch; margin-top: 0.4rem;">
          Established in 2021 as a premier divisional franchise under the Rewa Division Cricket Association (RDCA).
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; margin-bottom: 3.5rem;">
      <div style="background: var(--c-surface-1); border: 2px solid var(--b-medium); border-radius: 8px; padding: 2.75rem;">
        <h2 style="font-family: var(--f-headline); font-size: 2rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          The Strike Power of Rewa Cricket
        </h2>
        <div style="font-size: 0.9375rem; color: #cbd5e1; line-height: 1.8; display: flex; flex-direction: column; gap: 1rem;">
          <p>
            <strong>Dread Eleven (DE)</strong> was created in 2021 to represent the premier cricketing talent across Rewa and the Vindhya division.
          </p>
          <p>
            Captained by opening maestro <strong>Akhil Mishra</strong> and powered by premier pace and spin bowlers including <strong>Kuldeep Sen</strong> and <strong>Kumar Kartikeya</strong>, Dread Eleven have asserted their dominance across 24 championship clashes, securing 17 victories.
          </p>
          <p>
            Dread Eleven captured the coveted <strong>2022 Atal Bihari Vajpayee Memorial Trophy</strong> on 12 August 2022, defending 183 to defeat Vindhya Warriors in a thrilling 21-run championship finale at Martand Ground No. 3.
          </p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; font-weight: 700;">Accreditation</div>
          <h3 style="font-family: var(--f-headline); font-size: 1.3rem; color: #fff; text-transform: uppercase; margin: 0.35rem 0 0.5rem;">
            RDCA, MPCA &amp; BCCI Sanctioned
          </h3>
          <p style="font-size: 0.8125rem; color: #94a3b8; line-height: 1.6;">
            Sanctioned under the Rewa Division Cricket Association (RDCA), affiliated with the Madhya Pradesh Cricket Association (MPCA) and BCCI.
          </p>
        </div>

        <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase; font-weight: 700;">Home Fortress</div>
          <h3 style="font-family: var(--f-headline); font-size: 1.3rem; color: #fff; text-transform: uppercase; margin: 0.35rem 0 0.5rem;">
            Martand Ground No. 3, Rewa
          </h3>
          <p style="font-size: 0.8125rem; color: #94a3b8; line-height: 1.6;">
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
  title: 'Contact & Ground Information | Dread Eleven (DE)',
  description: 'Official inquiries and venue details for Dread Eleven in Rewa, Madhya Pradesh.',
  canonicalUrl: '/contact'
})}
${renderHeader('contact')}

<section class="section-block" style="padding-top: 4rem;">
  <div class="container" style="max-width: 960px;">
    <div class="section-masthead">
      <div>
        <div class="section-eyebrow">// ADMINISTRATION</div>
        <h1 class="section-heading-huge">Contact Dread Eleven</h1>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
      <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
        <h2 style="font-family: var(--f-headline); font-size: 1.4rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Headquarters Desk
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.875rem; color: #cbd5e1;">
          <div>
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase;">Sanctioning Body</div>
            <p>Rewa Division Cricket Association (RDCA)</p>
          </div>
          <div>
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase;">Home Venue</div>
            <p>Martand School Ground No. 3, Rewa, MP 486001</p>
          </div>
          <div>
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--c-volt); text-transform: uppercase;">Email Dispatch</div>
            <p style="font-family: var(--f-mono);">admin@dread-eleven.cricket</p>
          </div>
        </div>
      </div>

      <div style="background: var(--c-surface-1); border: 1px solid var(--b-medium); border-radius: 6px; padding: 2rem;">
        <h2 style="font-family: var(--f-headline); font-size: 1.4rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Send Transmission
        </h2>
        <form onsubmit="event.preventDefault(); alert('Transmission logged. Desk will respond within 24h.');" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.35rem; text-transform: uppercase;">Full Name</label>
            <input type="text" required placeholder="Name" style="width: 100%; background: var(--c-surface-2); border: 1px solid var(--b-medium); color: #fff; padding: 0.65rem 0.9rem; font-family: var(--f-body); font-size: 0.875rem; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.35rem; text-transform: uppercase;">Email Address</label>
            <input type="email" required placeholder="you@example.com" style="width: 100%; background: var(--c-surface-2); border: 1px solid var(--b-medium); color: #fff; padding: 0.65rem 0.9rem; font-family: var(--f-body); font-size: 0.875rem; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-family: var(--f-mono); font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.35rem; text-transform: uppercase;">Message</label>
            <textarea rows="4" required placeholder="Your message..." style="width: 100%; background: var(--c-surface-2); border: 1px solid var(--b-medium); color: #fff; padding: 0.65rem 0.9rem; font-family: var(--f-body); font-size: 0.875rem; resize: vertical; border-radius: 4px;"></textarea>
          </div>
          <button type="submit" class="btn-primary-volt" style="margin-top: 0.5rem; width: 100%; justify-content: center;">
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
  description: 'The requested page could not be located in the Dread Eleven registry.',
  canonicalUrl: '/404'
})}
${renderHeader('')}

<section class="section-block" style="padding: 8rem 0; text-align: center;">
  <div class="container" style="max-width: 600px;">
    <div style="font-family: var(--f-display); font-size: 8rem; color: var(--c-volt); line-height: 0.8; margin-bottom: 1rem;">404</div>
    <h1 style="font-family: var(--f-headline); font-size: 2.2rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem;">
      Out of Bounds — Signal Lost
    </h1>
    <p style="color: #94a3b8; font-size: 0.9375rem; margin-bottom: 2rem;">
      The match log or player profile you requested does not exist or has been relocated in the Dread Eleven registry.
    </p>
    <a href="/" class="btn-primary-volt">Return to Home</a>
  </div>
</section>

${renderFooter()}
  `;

  fs.writeFileSync(path.join(rootDir, '404.html'), html);
  console.log('Generated 404.html (Dread Eleven)');
}

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

  console.log(`Generated sitemap.xml with ${urls.length} URLs and robots.txt (Dread Eleven).`);
}

function main() {
  console.log('=== BUILDING DREAD ELEVEN PURE INDEPENDENT EXP (ZERO DES CONTEXT) ===');
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
  console.log('=== DREAD ELEVEN SSG COMPLETE ===');
}

main();
