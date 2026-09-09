/**
 * DREAD ELEVEN (DE) — OFFICIAL ROYAL KNIGHT FRANCHISE SSG
 * Flow & Aesthetic inspired by Kolkata Knight Riders (KKR) & Championship Franchise Portals
 * Port: 8086
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

  <!-- Google Fonts: Chakra Petch & Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,600;0,700;0,800;0,900;1,700;1,900&family=JetBrains+Mono:wght@500;700&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/src/css/styles.css">
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
`;
}

function renderHeader(activeNav = '') {
  const links = [
    { label: 'Home', href: '/', key: 'home' },
    { label: 'Knight Squad', href: '/players', key: 'squad' },
    { label: 'Fixtures', href: '/fixtures', key: 'fixtures' },
    { label: 'Derby Log', href: '/results', key: 'results' },
    { label: 'Standings', href: '/points-table', key: 'table' },
    { label: 'Stats', href: '/stats', key: 'stats' },
    { label: 'News', href: '/news', key: 'news' },
    { label: 'The Lore', href: '/about', key: 'about' },
    { label: 'Contact', href: '/contact', key: 'contact' }
  ];

  return `
  <!-- KKR-style Top Chant Bar -->
  <div class="knight-top-bar">
    <div class="container top-bar-inner">
      <div><span class="gold-star-tag">★ 2022 TOURNAMENT CHAMPIONS</span> • ATAL BIHARI VAJPAYEE CUP</div>
      <div>SERIES ADVANTAGE: <strong style="color:var(--kkr-gold-bright);">DE LEADS 13–11 (54.2%)</strong></div>
      <div>CAPT. AKHIL MISHRA (905 RUNS • 47.6 AVG)</div>
    </div>
  </div>

  <!-- Royal Shield Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="knight-brand-crest" aria-label="Dread Eleven Home">
        <div class="shield-monogram">DE</div>
        <div class="knight-title-group">
          <h1>DREAD <span>ELEVEN</span></h1>
          <div class="knight-subline">Rewa Division Cricket Association (RDCA)</div>
        </div>
      </a>

      <nav class="header-nav" aria-label="Main Navigation">
        ${links.map((l) => `
          <a href="${l.href}" class="nav-link ${activeNav === l.key ? 'active' : ''}" ${activeNav === l.key ? 'aria-current="page"' : ''}>
            ${esc(l.label)}
          </a>
        `).join('')}
      </nav>

      <a href="/about" class="btn-knight-gold">
        2022 Trophy
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
            <div class="knight-title-group" style="margin-bottom: 0.75rem;">
              <h2 style="font-family: var(--f-display); font-size: 2.3rem; color: #fff; text-transform: uppercase;">
                DREAD <span>ELEVEN</span>
              </h2>
            </div>
            <p style="font-size: 0.9375rem; color: var(--kkr-gray-400); max-width: 44ch; line-height: 1.7;">
              Official franchise portal of Dread Eleven (DE), captained by Akhil Mishra. 
              Champions of the 2022 Atal Bihari Vajpayee Memorial Trophy and all-time series leaders against Destroyers under RDCA.
            </p>
          </div>

          <div>
            <h4 style="font-family: var(--f-headline); font-size: 1rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem; font-weight: 800;">
              Derby Center
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.875rem; color: var(--kkr-gray-400);">
              <li><a href="/fixtures" style="color: inherit; text-decoration: none;">2025–26 Fixtures</a></li>
              <li><a href="/results" style="color: inherit; text-decoration: none;">24 Derby Clashes Archive</a></li>
              <li><a href="/points-table" style="color: inherit; text-decoration: none;">Division Points Table</a></li>
              <li><a href="/stats" style="color: inherit; text-decoration: none;">Performance Records</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--f-headline); font-size: 1rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem; font-weight: 800;">
              Franchise
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.875rem; color: var(--kkr-gray-400);">
              <li><a href="/players" style="color: inherit; text-decoration: none;">Squad (43 Players)</a></li>
              <li><a href="/about" style="color: inherit; text-decoration: none;">2022 Championship Victory</a></li>
              <li><a href="/news" style="color: inherit; text-decoration: none;">Franchise Media</a></li>
              <li><a href="/contact" style="color: inherit; text-decoration: none;">Martand Ground Desk</a></li>
            </ul>
          </div>

          <div>
            <h4 style="font-family: var(--f-headline); font-size: 1rem; color: var(--kkr-gold-bright); text-transform: uppercase; margin-bottom: 1rem; font-weight: 800;">
              Dread Legion
            </h4>
            <p style="font-size: 0.8125rem; color: var(--kkr-gray-400); line-height: 1.6; margin-bottom: 1rem;">
              Stand with the Titans of Rewa. Backing Akhil Mishra, Kuldeep Sen, and Kumar Kartikeya.
            </p>
            <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); font-weight: 700;">
              #DREADTHETITANS
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--kkr-border-subtle); padding-top: 2rem; font-size: 0.8125rem; color: var(--kkr-gray-600); flex-wrap: wrap; gap: 1rem;">
          <div>&copy; 2021–2026 Dread Eleven (DE). All rights reserved.</div>
          <div>Martand Ground No. 3 • Rewa, Madhya Pradesh</div>
        </div>
      </div>
    </footer>

    <script src="/src/js/app.js"></script>
  </body>
  </html>
  `;
}

// ------------------------------------------------------------
// 1. HOME PAGE
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
      jobTitle: 'Captain & Opening Anchor'
    }
  };

  const html = `
${renderHead({
  title: 'Dread Eleven (DE) — Royal Knight Cricket Franchise | Capt. Akhil Mishra',
  description: 'Official franchise website for Dread Eleven (DE), captained by Akhil Mishra. 2022 Atal Bihari Vajpayee Memorial Trophy winners, 13 derby victories, verified player telemetry.',
  canonicalUrl: '/',
  jsonLd
})}
${renderHeader('home')}

<!-- KKR-style Championship Trophy Hall of Fame Hero -->
<section class="trophy-hero-section">
  <div class="container">
    <div class="trophy-hero-grid">
      <div>
        <div class="champions-laurel-badge">
          <span>👑 2022 CHAMPIONSHIP TROPHY WINNERS</span>
        </div>

        <h1 class="trophy-headline">
          THE TITAN EMPIRE. <br>
          <span class="gold-gradient-text">DREAD ELEVEN.</span>
        </h1>

        <p class="trophy-prose">
          The official royal domain of <strong>Dread Eleven (DE)</strong>, led by top-order anchor <strong>Akhil Mishra</strong> (905 runs, 47.6 avg). 
          Proud champions of the <strong>2022 Atal Bihari Vajpayee Memorial Trophy</strong> and all-time series leaders with <strong>13 derby victories</strong> against Destroyers Cricket Club.
        </p>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/fixtures" class="btn-knight-gold">
            <span>2025–26 Schedule</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="/players" class="btn-knight-outline">
            <span>Knight Squad (43)</span>
          </a>
          <a href="/about" class="btn-knight-outline">
            <span>2022 Final Dossier</span>
          </a>
        </div>
      </div>

      <!-- Trophy Showcase Box -->
      <div class="trophy-pedestal-card">
        <div class="trophy-laurel-header">
          ATAL BIHARI VAJPAYEE MEMORIAL CUP
        </div>

        <!-- Trophy SVG -->
        <svg class="trophy-svg-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 20H70V45C70 56.0457 61.0457 65 50 65C38.9543 65 30 56.0457 30 45V20Z" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
          <path d="M30 28C22 28 16 34 16 42C16 50 22 55 30 55" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
          <path d="M70 28C78 28 84 34 84 42C84 50 78 55 70 55" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
          <path d="M50 65V80" stroke="#ffd700" stroke-width="6"/>
          <rect x="32" y="80" width="36" height="10" rx="2" fill="#cca047"/>
          <circle cx="50" cy="40" r="10" fill="#2b1452"/>
          <text x="50" y="44" font-family="'Chakra Petch', sans-serif" font-size="10" font-weight="900" fill="#ffd700" text-anchor="middle">2022</text>
        </svg>

        <div class="trophy-match-score tabular">
          <span style="color: var(--kkr-gold-bright);">DE 183</span> <span style="font-size: 1.2rem; color: var(--kkr-gray-400);">DEF</span> <span style="color: #fff;">DES 162/6</span>
        </div>
        <div class="trophy-margin-call">
          Dread Eleven won by 21 runs
        </div>

        <div class="trophy-countdown-strip">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700;">
            <span>Next Derby Clash</span>
            <span>10 SEPT 2025</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center;" id="match-countdown">
            <div style="background: var(--kkr-purple-surface); padding: 0.5rem; border-radius: 4px;"><div style="font-family: var(--f-display); font-size: 1.4rem; color: #fff;" id="cd-days">182</div><div style="font-size: 0.5625rem; color: var(--kkr-gray-400); font-family: var(--f-mono);">DAYS</div></div>
            <div style="background: var(--kkr-purple-surface); padding: 0.5rem; border-radius: 4px;"><div style="font-family: var(--f-display); font-size: 1.4rem; color: #fff;" id="cd-hours">14</div><div style="font-size: 0.5625rem; color: var(--kkr-gray-400); font-family: var(--f-mono);">HOURS</div></div>
            <div style="background: var(--kkr-purple-surface); padding: 0.5rem; border-radius: 4px;"><div style="font-family: var(--f-display); font-size: 1.4rem; color: #fff;" id="cd-mins">35</div><div style="font-size: 0.5625rem; color: var(--kkr-gray-400); font-family: var(--f-mono);">MINS</div></div>
            <div style="background: var(--kkr-purple-surface); padding: 0.5rem; border-radius: 4px;"><div style="font-family: var(--f-display); font-size: 1.4rem; color: var(--kkr-gold-bright);" id="cd-secs">48</div><div style="font-size: 0.5625rem; color: var(--kkr-gray-400); font-family: var(--f-mono);">SECS</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Derby Telemetry Ribbon -->
<div class="derby-telemetry-ribbon">
  <div class="container ribbon-grid">
    <div class="ribbon-metric">
      <div class="ribbon-metric-val tabular" style="color: var(--kkr-gold-bright);">13 WINS</div>
      <div class="ribbon-metric-lbl">All-Time Derby Superiority (54.2%)</div>
    </div>
    <div class="ribbon-metric">
      <div class="ribbon-metric-val tabular">905 RUNS</div>
      <div class="ribbon-metric-lbl">Capt. Akhil Mishra (47.63 Avg)</div>
    </div>
    <div class="ribbon-metric">
      <div class="ribbon-metric-val tabular">28 WKTS</div>
      <div class="ribbon-metric-lbl">Pace Attack (Sen &amp; Das)</div>
    </div>
    <div class="ribbon-metric">
      <div class="ribbon-metric-val tabular" style="color: var(--kkr-gold-bright);">2022 FINAL</div>
      <div class="ribbon-metric-lbl">Champions Silverware Lifted</div>
    </div>
  </div>
</div>

<!-- Knight Squadron Roster -->
<section class="squad-section">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// THE TITANS</div>
        <h2 class="section-title">The Knight Squadron</h2>
      </div>
      <a href="/players" class="btn-knight-gold">Full Squad (43)</a>
    </div>

    <div class="knight-roster-grid">
      ${featuredSquad.map((p) => `
        <a href="/players/${p.slug}" class="knight-player-card">
          <div class="card-shield-badge">#${p.jerseyNumber}</div>
          <div class="knight-player-role">${esc(p.role)}</div>
          <h3 class="knight-player-name">${esc(p.name)}</h3>
          <div class="knight-player-meta">Dread Eleven • ${p.matches} Matches</div>

          <div class="knight-stat-strip">
            <div>
              <div class="knight-stat-val tabular" style="color: var(--kkr-gold-bright);">${esc(p.batting.runs)}</div>
              <div class="knight-stat-lbl">Runs</div>
            </div>
            <div>
              <div class="knight-stat-val tabular">${esc(p.batting.average)}</div>
              <div class="knight-stat-lbl">Avg</div>
            </div>
            <div>
              <div class="knight-stat-val tabular" style="color: var(--kkr-violet-bright);">${esc(p.bowling.wickets)}</div>
              <div class="knight-stat-lbl">Wkts</div>
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- Latest News Dispatches -->
<section class="squad-section" style="background: var(--kkr-purple-dark); border-top: 1px solid var(--kkr-border);">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// PRESS &amp; MEDIA</div>
        <h2 class="section-title">Latest Dispatches</h2>
      </div>
      <a href="/news" class="btn-knight-outline">All Articles</a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
      ${featuredNews.map((n) => `
        <article style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700; margin-bottom: 0.6rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}
          </div>
          <h3 style="font-family: var(--f-display); font-size: 1.5rem; color: #fff; text-transform: uppercase; line-height: 1.15; margin-bottom: 0.75rem;">
            <a href="/news/${n.slug}" style="color: inherit; text-decoration: none;">${esc(n.title)}</a>
          </h3>
          <p style="font-size: 0.875rem; color: var(--kkr-gray-400); line-height: 1.6; margin-bottom: 1.5rem;">${esc(n.summary)}</p>
          <a href="/news/${n.slug}" style="margin-top: auto; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); font-weight: 700; text-transform: uppercase; text-decoration: none;">
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
  console.log('Generated index.html (KKR-style Dread Eleven Home)');
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
  title: 'Knight Squad (43 Players) | Dread Eleven (DE)',
  description: 'Official roster for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa. Captain Akhil Mishra, Kuldeep Sen, Kumar Kartikeya.',
  canonicalUrl: '/players',
  jsonLd: jsonLdDirectory
})}
${renderHeader('squad')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// THE TITANS</div>
        <h1 class="section-title">Dread Eleven Roster (43 Players)</h1>
        <p style="color: var(--kkr-gray-400); font-size: 1rem; max-width: 65ch; margin-top: 0.4rem;">
          Verified tournament records for every Dread Eleven player against Destroyers Cricket Club. Led by captain <strong>Akhil Mishra</strong>.
        </p>
      </div>
    </div>

    <!-- Role Filter Controls -->
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2.5rem;" id="squad-filter-controls">
      <button type="button" class="btn-knight-gold role-btn" data-filter="all" style="padding: 0.45rem 1.1rem; font-size: 0.75rem;">All (43)</button>
      <button type="button" class="btn-knight-outline role-btn" data-filter="Batter" style="padding: 0.45rem 1.1rem; font-size: 0.75rem;">Batters</button>
      <button type="button" class="btn-knight-outline role-btn" data-filter="All-rounder" style="padding: 0.45rem 1.1rem; font-size: 0.75rem;">All-Rounders</button>
      <button type="button" class="btn-knight-outline role-btn" data-filter="Bowler" style="padding: 0.45rem 1.1rem; font-size: 0.75rem;">Bowlers</button>
    </div>

    <div class="knight-roster-grid" id="players-grid">
      ${squad.map((p) => `
        <a href="/players/${p.slug}" class="knight-player-card" data-role="${esc(p.role)}">
          <div class="card-shield-badge">#${p.jerseyNumber}</div>
          <div class="knight-player-role">${esc(p.role)}</div>
          <h2 class="knight-player-name">${esc(p.name)}</h2>
          <div class="knight-player-meta">Dread Eleven • ${p.matches} Matches</div>

          <div class="knight-stat-strip">
            <div>
              <div class="knight-stat-val tabular" style="color: var(--kkr-gold-bright);">${esc(p.batting.runs)}</div>
              <div class="knight-stat-lbl">Runs</div>
            </div>
            <div>
              <div class="knight-stat-val tabular">${esc(p.batting.average)}</div>
              <div class="knight-stat-lbl">Avg</div>
            </div>
            <div>
              <div class="knight-stat-val tabular" style="color: var(--kkr-violet-bright);">${esc(p.bowling.wickets)}</div>
              <div class="knight-stat-lbl">Wkts</div>
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

  // Generate each player profile
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
  title: `${p.name} (#${p.jerseyNumber}) — Dread Eleven Knight Profile`,
  description: `${p.name} profile for Dread Eleven in the Atal Bihari Vajpayee Tournament, Rewa. ${p.batting.runs} runs, ${p.bowling.wickets} wickets.`,
  canonicalUrl: `/players/${p.slug}`,
  jsonLd: playerJsonLd
})}
${renderHeader('squad')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400);">
      <a href="/" style="color: inherit;">Home</a> / <a href="/players" style="color: inherit;">Squad</a> / <span style="color: var(--kkr-gold-bright);">${esc(p.name)}</span>
    </nav>

    <!-- Player Banner -->
    <div style="background: var(--kkr-purple-card); border: 2px solid var(--kkr-border); border-radius: 8px; padding: 2.5rem; margin-bottom: 3rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); font-weight: 700;">JERSEY #${p.jerseyNumber} // ${esc(p.role)}</span>
        <span style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400);">DE-ID: ${p.id}</span>
      </div>

      <h1 class="section-title" style="font-size: clamp(2.4rem, 5vw, 4rem); margin-bottom: 0.5rem;">
        #${p.jerseyNumber} ${esc(p.name)}
      </h1>
      <p style="font-family: var(--f-mono); font-size: 0.8125rem; color: var(--kkr-gray-400); margin-bottom: 1.5rem;">
        ${esc(p.battingStyle)} • ${esc(p.bowlingStyle)} • Dread Eleven
      </p>

      <p style="font-size: 0.9375rem; color: var(--kkr-gray-200); max-width: 70ch; line-height: 1.75; margin-bottom: 2rem;">
        ${esc(p.bio)}
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Matches</div>
          <div class="knight-stat-val tabular">${p.matches}</div>
        </div>
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Runs</div>
          <div class="knight-stat-val tabular" style="color: var(--kkr-gold-bright);">${esc(p.batting.runs)}</div>
        </div>
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Highest Score</div>
          <div class="knight-stat-val tabular">${esc(p.batting.highestScore)}</div>
        </div>
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Batting Avg</div>
          <div class="knight-stat-val tabular">${esc(p.batting.average)}</div>
        </div>
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Strike Rate</div>
          <div class="knight-stat-val tabular">${esc(p.batting.strikeRate)}</div>
        </div>
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Wickets</div>
          <div class="knight-stat-val tabular" style="color: var(--kkr-violet-bright);">${esc(p.bowling.wickets)}</div>
        </div>
        <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); border-radius: 4px; padding: 1rem; text-align: center;">
          <div class="knight-stat-lbl">Best Bowling</div>
          <div class="knight-stat-val tabular">${esc(p.bowling.bestBowling)}</div>
        </div>
      </div>
    </div>

    <!-- Match Appearances Table -->
    <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
      <h2 style="font-family: var(--f-display); font-size: 1.8rem; color: #fff; text-transform: uppercase; margin-bottom: 1.5rem;">
        Match Telemetry Log vs Destroyers
      </h2>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--kkr-border);">
              <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Date</th>
              <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Format</th>
              <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Scorecard</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Batting</th>
              <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Dismissal</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Bowling</th>
              <th style="padding: 0.75rem; text-align: center; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${playerLogs.length ? playerLogs.map((item) => `
              <tr style="border-bottom: 1px solid var(--kkr-border-subtle);">
                <td style="padding: 0.85rem 0.75rem; font-weight: 700; color: #fff;">${formatDate(item.match.matchDate)}</td>
                <td style="padding: 0.85rem 0.75rem;"><span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); background: rgba(255, 215, 0, 0.1); padding: 0.2rem 0.45rem; border-radius: 3px;">${esc(item.match.format)}</span></td>
                <td style="padding: 0.85rem 0.75rem;"><a href="/matches/${item.match.slug}" style="color: var(--kkr-gold-bright); font-family: var(--f-mono); font-weight: 700; text-decoration: none;">Scorecard &rarr;</a></td>
                <td style="padding: 0.85rem 0.75rem; text-align: right; font-weight: 700; color: #fff;" class="tabular">${item.batting ? `${item.batting.runs} (${item.batting.balls}b)` : '—'}</td>
                <td style="padding: 0.85rem 0.75rem; font-size: 0.75rem; color: var(--kkr-gray-400);">${item.batting ? esc(item.batting.dismissal) : 'Did Not Bat'}</td>
                <td style="padding: 0.85rem 0.75rem; text-align: right; font-weight: 700; color: var(--kkr-violet-bright);" class="tabular">${item.bowling ? `${item.bowling.wickets}/${item.bowling.runs} (${item.bowling.overs} ov)` : '—'}</td>
                <td style="padding: 0.85rem 0.75rem; text-align: center;"><span style="font-family: var(--f-mono); font-size: 0.6875rem; padding: 0.25rem 0.6rem; border-radius: 4px; ${item.match.winner === 'DE' ? 'background: rgba(255, 215, 0, 0.15); color: var(--kkr-gold-bright);' : 'background: rgba(239, 68, 68, 0.15); color: #f87171;'}">${item.match.winner === 'DE' ? 'DE Win' : 'DES Win'}</span></td>
              </tr>
            `).join('') : '<tr><td colspan="7" style="text-align: center; color: var(--kkr-gray-400); padding: 2rem;">No individual match appearances recorded.</td></tr>'}
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

  console.log(`Generated /players directory and ${squad.length} individual player profiles (Dread Eleven).`);
}

// ------------------------------------------------------------
// 3. FIXTURES, RESULTS, MATCH PAGES
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

  // A. /fixtures
  const fixturesHtml = `
${renderHead({
  title: 'Fixtures & Schedule (2025–2026) | Dread Eleven (DE)',
  description: 'Upcoming tournament fixtures and schedule for Dread Eleven in the Atal Bihari Vajpayee Cup, Rewa.',
  canonicalUrl: '/fixtures'
})}
${renderHeader('fixtures')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// BATTLE GRID</div>
        <h1 class="section-title">Dread Eleven Fixtures (2025–2026)</h1>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.75rem;">
      ${upcomingMatches.map((m) => `
        <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); background: rgba(255, 215, 0, 0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${esc(m.format)} • SEASON ${esc(m.seasonYear)}</span>
            <span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); font-weight: 700;">${esc(m.stage)}</span>
          </div>

          <div style="font-size: 0.75rem; color: var(--kkr-gray-400); margin-bottom: 1.25rem;">
            <strong style="color: #fff;">${formatDate(m.matchDate)}</strong> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}</span>
          </div>

          <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border-subtle); border-radius: 6px; padding: 1.25rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: var(--f-display); font-size: 1.2rem; font-weight: 800; color: #fff;">Dread Eleven</span>
              <span style="font-family: var(--f-mono); font-weight: 800; color: var(--kkr-gold-bright);">UPCOMING</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: var(--f-display); font-size: 1.2rem; font-weight: 800; color: var(--kkr-gray-400);">Destroyers</span>
              <span style="font-family: var(--f-mono); font-weight: 800; color: var(--kkr-gray-400);">UPCOMING</span>
            </div>
          </div>

          <div style="padding: 0.5rem 0.75rem; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 4px; color: var(--kkr-gold-bright); font-family: var(--f-mono); font-size: 0.75rem; font-weight: 700; text-align: center; margin-bottom: 1.25rem;">
            ${esc(m.resultText)}
          </div>

          <a href="/matches/${m.slug}" class="btn-knight-outline" style="margin-top: auto; font-size: 0.75rem; padding: 0.6rem 1rem; text-align: center;">
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

  // B. /results
  const resultsHtml = `
${renderHead({
  title: 'Derby Results Archive (24 Matches) | Dread Eleven (DE)',
  description: 'Complete match records and scorecards for all 24 clashes between Dread Eleven (13 wins) and Destroyers in Rewa.',
  canonicalUrl: '/results'
})}
${renderHeader('results')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// HISTORICAL LEDGER</div>
        <h1 class="section-title">Derby Results Archive (24 Matches)</h1>
        <p style="color: var(--kkr-gray-400); font-size: 1rem; margin-top: 0.4rem;">
          Dread Eleven holds a commanding 13–11 all-time series advantage across 4 seasons in Rewa.
        </p>
      </div>
      <div>
        <span class="tabular font-bold" style="font-family: var(--f-display); font-size: 1.8rem; color: var(--kkr-gold-bright);">DE LEADS 13–11</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.75rem;">
      ${completedMatches.map((m) => {
        const isDeWinner = m.winner === 'DE';
        const isFinal = m.stage && m.stage.toLowerCase().includes('final');
        const desInnings = m.innings[0] || { runs: 0, wickets: 0, overs: 0 };
        const deInnings = m.innings[1] || { runs: 0, wickets: 0, overs: 0 };

        return `
          <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); background: rgba(255, 215, 0, 0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${esc(m.format)} • SEASON ${esc(m.seasonYear)}</span>
              ${isFinal ? '<span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); font-weight: 800;">👑 2022 FINAL</span>' : `<span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gray-400);">MATCH #${esc(m.matchNumber)}</span>`}
            </div>

            <div style="font-size: 0.75rem; color: var(--kkr-gray-400); margin-bottom: 1rem;">
              <strong style="color: #fff;">${formatDate(m.matchDate)}</strong> • <span>${esc(m.venue.name)}</span>
            </div>

            <div style="background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border-subtle); border-radius: 6px; padding: 1.25rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-family: var(--f-display); font-size: 1.2rem; font-weight: 800; color: ${isDeWinner ? '#fff' : 'var(--kkr-gray-400)'};">Dread Eleven</span>
                <span class="tabular" style="font-family: var(--f-mono); font-weight: 800; color: ${isDeWinner ? 'var(--kkr-gold-bright)' : 'var(--kkr-gray-400)'};">
                  ${deInnings.runs}/${deInnings.wickets} <span style="font-size: 0.6875rem; font-weight: 400;">(${deInnings.overs} ov)</span>
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-family: var(--f-display); font-size: 1.2rem; font-weight: 800; color: ${!isDeWinner ? '#fff' : 'var(--kkr-gray-400)'};">Destroyers</span>
                <span class="tabular" style="font-family: var(--f-mono); font-weight: 800; color: ${!isDeWinner ? 'var(--kkr-gold-bright)' : 'var(--kkr-gray-400)'};">
                  ${desInnings.runs}/${desInnings.wickets} <span style="font-size: 0.6875rem; font-weight: 400;">(${desInnings.overs} ov)</span>
                </span>
              </div>
            </div>

            <div style="padding: 0.5rem 0.75rem; border-radius: 4px; font-family: var(--f-mono); font-size: 0.75rem; font-weight: 700; text-align: center; margin-bottom: 1.25rem; ${isDeWinner ? 'background: rgba(255, 215, 0, 0.12); color: var(--kkr-gold-bright); border: 1px solid rgba(255, 215, 0, 0.3);' : 'background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);'}">
              <span>${esc(m.resultText)}</span>
            </div>

            ${m.playerOfTheMatch ? `
              <div style="font-size: 0.75rem; color: var(--kkr-gray-400); margin-bottom: 1rem; border-top: 1px solid var(--kkr-border-subtle); padding-top: 0.5rem; font-family: var(--f-mono);">
                POTM: <strong style="color: var(--kkr-gold-bright);">${esc(m.playerOfTheMatch.name)}</strong>
              </div>
            ` : ''}

            <a href="/matches/${m.slug}" class="btn-knight-outline" style="margin-top: auto; font-size: 0.75rem; padding: 0.6rem 1rem; text-align: center;">
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

  // C. /matches/[slug]
  matches.forEach((m) => {
    const matchPageDir = path.join(matchesDir, m.slug);
    ensureDir(matchPageDir);

    const isCompleted = m.status === 'completed';
    const isDeWinner = m.winner === 'DE';
    const innDES = m.innings[0];
    const innDE = m.innings[1];

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
        return '<p style="color: var(--kkr-gray-400); padding: 1rem;">Innings not yet contested.</p>';
      }

      const batRows = inn.batting.map((b) => `
        <tr style="border-bottom: 1px solid var(--kkr-border-subtle);">
          <td style="padding: 0.75rem; font-weight: 700; color: #fff; font-family: var(--f-display); font-size: 1.1rem;">${esc(b.playerName)}</td>
          <td style="padding: 0.75rem; color: var(--kkr-gray-400); font-size: 0.75rem;">${esc(b.dismissal)}</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 800; color: #fff;" class="tabular">${esc(b.runs)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(b.balls)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(b.fours)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(b.sixes)}</td>
          <td style="padding: 0.75rem; text-align: right; color: var(--kkr-gold-bright); font-weight: 700;" class="tabular">${esc(b.strikeRate)}</td>
        </tr>
      `).join('');

      const bowlRows = (inn.bowling || []).map((bo) => `
        <tr style="border-bottom: 1px solid var(--kkr-border-subtle);">
          <td style="padding: 0.75rem; font-weight: 700; color: #fff; font-family: var(--f-display); font-size: 1.1rem;">${esc(bo.playerName)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(bo.overs)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(bo.maidens)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(bo.runs)}</td>
          <td style="padding: 0.75rem; text-align: right; font-weight: 800; color: var(--kkr-gold-bright);" class="tabular">${esc(bo.wickets)}</td>
          <td style="padding: 0.75rem; text-align: right;" class="tabular">${esc(bo.economy)}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom: 2.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--kkr-border); padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <div>
              <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400); text-transform: uppercase;">Batting: ${esc(battingTeam)}</div>
              <h3 style="font-family: var(--f-display); font-size: 1.8rem; color: #fff; text-transform: uppercase;">
                ${esc(inn.teamName)} Innings
              </h3>
            </div>
            <div class="tabular" style="font-family: var(--f-display); font-size: 2rem; font-weight: 900; color: #fff;">
              ${inn.runs}/${inn.wickets} <span style="font-size: 0.875rem; color: var(--kkr-gray-400); font-weight: 400;">(${inn.overs} ov • RR ${inn.runRate})</span>
            </div>
          </div>

          <div style="overflow-x: auto; margin-bottom: 2rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--kkr-border);">
                  <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Batter</th>
                  <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Dismissal</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">R</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">B</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">4s</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">6s</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">SR</th>
                </tr>
              </thead>
              <tbody>${batRows}</tbody>
            </table>
          </div>

          <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">
            Bowling Attack (${esc(bowlingTeam)})
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--kkr-border);">
                  <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Bowler</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">O</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">M</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">R</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">W</th>
                  <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Eco</th>
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
  title: `Dread Eleven vs Destroyers (${formatDate(m.matchDate)}) — Scorecard`,
  description: `Scorecard for Dread Eleven vs Destroyers Cricket Club on ${formatDate(m.matchDate)} at ${m.venue.name}, Rewa.`,
  canonicalUrl: `/matches/${m.slug}`,
  jsonLd: matchJsonLd
})}
${renderHeader('results')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400);">
      <a href="/" style="color: inherit;">Home</a> / <a href="${isCompleted ? '/results' : '/fixtures'}" style="color: inherit;">${isCompleted ? 'Results' : 'Fixtures'}</a> / <span style="color: var(--kkr-gold-bright);">${formatDate(m.matchDate)}</span>
    </nav>

    <div style="background: var(--kkr-purple-card); border: 2px solid var(--kkr-border); border-radius: 8px; padding: 2.5rem; margin-bottom: 3rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <span style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); background: rgba(255, 215, 0, 0.1); padding: 0.25rem 0.6rem; border-radius: 4px;">${esc(m.format)} • Season ${esc(m.seasonYear)}</span>
        <span style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); font-weight: 700;">${esc(m.stage)}</span>
      </div>

      <h1 class="section-title" style="font-size: clamp(2.4rem, 5vw, 4rem); margin-bottom: 0.75rem;">
        Dread Eleven vs Destroyers
      </h1>

      <div style="font-size: 0.875rem; color: var(--kkr-gray-400); margin-bottom: 1.5rem; font-family: var(--f-mono);">
        <span>${formatDate(m.matchDate)}</span> • <span>${esc(m.time)}</span> • <span>${esc(m.venue.name)}, ${esc(m.venue.city)}</span>
      </div>

      ${m.toss ? `
        <div style="font-family: var(--f-mono); font-size: 0.8125rem; color: var(--kkr-gray-200); margin-bottom: 1.25rem; background: var(--kkr-purple-surface); padding: 0.75rem 1rem; border: 1px solid var(--kkr-border); border-radius: 4px;">
          Toss: <strong>${esc(m.toss.winner)}</strong> won the toss and ${esc(m.toss.decision)}.
        </div>
      ` : ''}

      <div style="padding: 0.75rem 1.25rem; border-radius: 4px; font-family: var(--f-headline); font-size: 1.1rem; font-weight: 800; ${isDeWinner ? 'background: rgba(255, 215, 0, 0.15); color: var(--kkr-gold-bright); border: 1px solid rgba(255, 215, 0, 0.4);' : (isCompleted ? 'background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);' : 'background: var(--kkr-purple-surface); color: #fff;')}">
        <span>${esc(m.resultText)}</span>
      </div>

      ${m.playerOfTheMatch ? `
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--kkr-border); display: flex; align-items: center; gap: 0.6rem; font-family: var(--f-mono); font-size: 0.8125rem;">
          <span style="color: var(--kkr-gold-bright); font-weight: 700;">Player of the Match:</span>
          <strong style="color: #fff; font-family: var(--f-display); font-size: 1.3rem;">${esc(m.playerOfTheMatch.name)}</strong>
          <span style="color: var(--kkr-gray-400);">(${esc(m.playerOfTheMatch.team)} • ${esc(m.playerOfTheMatch.reason)})</span>
        </div>
      ` : ''}
    </div>

    ${isCompleted ? `
      <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2.5rem;">
        <h2 style="font-family: var(--f-display); font-size: 2rem; color: #fff; text-transform: uppercase; margin-bottom: 2rem;">
          Innings Scorecards
        </h2>

        <!-- Innings 2: Dread Eleven -->
        ${renderInningsTable(innDE, 'Dread Eleven', 'Destroyers Cricket Club')}

        <!-- Innings 1: Destroyers -->
        ${renderInningsTable(innDES, 'Destroyers Cricket Club', 'Dread Eleven')}
      </div>
    ` : `
      <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 3rem; text-align: center;">
        <h2 style="font-family: var(--f-display); font-size: 2rem; color: #fff; text-transform: uppercase; margin-bottom: 0.75rem;">
          Upcoming Fixture
        </h2>
        <p style="color: var(--kkr-gray-400); font-size: 0.9375rem; margin-bottom: 1.5rem;">
          Official scorecards will populate after match conclusion.
        </p>
        <a href="/fixtures" class="btn-knight-outline">Back to Fixtures</a>
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
// 4. POINTS TABLE
// ------------------------------------------------------------
function generatePointsTablePage() {
  const tableDir = path.join(rootDir, 'points-table');
  ensureDir(tableDir);

  const html = `
${renderHead({
  title: 'Tournament Points Table & Standings | Dread Eleven (DE)',
  description: 'Official standings and points table for the Atal Bihari Vajpayee Memorial Tournament, Rewa. Dread Eleven leads with 13 wins.',
  canonicalUrl: '/points-table'
})}
${renderHeader('table')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// DIVISION TABLE</div>
        <h1 class="section-title">Tournament Points Table</h1>
        <p style="color: var(--kkr-gray-400); font-size: 1rem; margin-top: 0.4rem;">
          Sanctioned standings across all editions of the Atal Bihari Vajpayee Memorial Tournament in Rewa.
        </p>
      </div>
    </div>

    <!-- All-Time Standings -->
    <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2.5rem; margin-bottom: 3rem;">
      <h2 style="font-family: var(--f-display); font-size: 1.85rem; color: #fff; text-transform: uppercase; margin-bottom: 1.5rem;">
        All-Time Derby Table (2021–2024 • 24 Encounters)
      </h2>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--kkr-border);">
              <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Pos</th>
              <th style="padding: 0.75rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Franchise</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">P</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">W</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">L</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">T</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">NR</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">NRR</th>
              <th style="padding: 0.75rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Pts</th>
            </tr>
          </thead>
          <tbody>
            ${pointsTable.allTime.map((row) => `
              <tr style="border-bottom: 1px solid var(--kkr-border-subtle);">
                <td style="padding: 0.9rem 0.75rem; font-weight: 800; font-family: var(--f-mono); color: ${row.rank === 1 ? 'var(--kkr-gold-bright)' : '#fff'};">${row.rank}</td>
                <td style="padding: 0.9rem 0.75rem; font-weight: 800; color: #fff; font-family: var(--f-display); font-size: 1.4rem;">
                  ${esc(row.team)} ${row.rank === 1 ? '<span style="color: var(--kkr-gold-bright); font-size: 0.75rem; margin-left: 0.5rem;">👑 SERIES LEADER</span>' : ''}
                </td>
                <td style="padding: 0.9rem 0.75rem; text-align: right; font-weight: 800;" class="tabular">${row.played}</td>
                <td style="padding: 0.9rem 0.75rem; text-align: right; font-weight: 800; color: var(--kkr-gold-bright);" class="tabular">${row.won}</td>
                <td style="padding: 0.9rem 0.75rem; text-align: right; color: #f87171;" class="tabular">${row.lost}</td>
                <td style="padding: 0.9rem 0.75rem; text-align: right;" class="tabular">${row.tied}</td>
                <td style="padding: 0.9rem 0.75rem; text-align: right;" class="tabular">${row.nr}</td>
                <td style="padding: 0.9rem 0.75rem; text-align: right; font-family: var(--f-mono);" class="tabular">${row.nrr}</td>
                <td style="padding: 0.9rem 0.75rem; text-align: right; font-weight: 900; color: var(--kkr-gold-bright); font-size: 1.3rem;" class="tabular">${row.points}</td>
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
  title: 'Stats & Records | Dread Eleven (DE)',
  description: 'Official statistical records for Dread Eleven in Rewa. Top run scorers, bowling figures, and strike rates.',
  canonicalUrl: '/stats'
})}
${renderHeader('stats')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// PERFORMANCE RECORDS</div>
        <h1 class="section-title">Dread Eleven All-Time Records</h1>
        <p style="color: var(--kkr-gray-400); font-size: 1rem; margin-top: 0.4rem;">
          Verified performance records across all 24 clashes against Destroyers in Rewa.
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 3rem;">
      <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
        <h2 style="font-family: var(--f-display); font-size: 1.75rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Top Run Scorers
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--kkr-border);">
              <th style="padding: 0.6rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Player</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Mat</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Runs</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Avg</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">SR</th>
            </tr>
          </thead>
          <tbody>
            ${topRunScorers.map((p) => `
              <tr style="border-bottom: 1px solid var(--kkr-border-subtle);">
                <td style="padding: 0.75rem 0.6rem; font-weight: 700; color: #fff;"><a href="/players/${p.slug}" style="color: inherit; text-decoration: none;">${esc(p.name)}</a></td>
                <td style="padding: 0.75rem 0.6rem; text-align: right;" class="tabular">${p.matches}</td>
                <td style="padding: 0.75rem 0.6rem; text-align: right; font-weight: 800; color: var(--kkr-gold-bright);" class="tabular">${esc(p.batting.runs)}</td>
                <td style="padding: 0.75rem 0.6rem; text-align: right;" class="tabular">${esc(p.batting.average)}</td>
                <td style="padding: 0.75rem 0.6rem; text-align: right;" class="tabular">${esc(p.batting.strikeRate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
        <h2 style="font-family: var(--f-display); font-size: 1.75rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Top Wicket Takers
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--kkr-border);">
              <th style="padding: 0.6rem; text-align: left; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Bowler</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Mat</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Wkts</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Overs</th>
              <th style="padding: 0.6rem; text-align: right; font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright);">Eco</th>
            </tr>
          </thead>
          <tbody>
            ${topWicketTakers.map((p) => `
              <tr style="border-bottom: 1px solid var(--kkr-border-subtle);">
                <td style="padding: 0.75rem 0.6rem; font-weight: 700; color: #fff;"><a href="/players/${p.slug}" style="color: inherit; text-decoration: none;">${esc(p.name)}</a></td>
                <td style="padding: 0.75rem 0.6rem; text-align: right;" class="tabular">${p.matches}</td>
                <td style="padding: 0.75rem 0.6rem; text-align: right; font-weight: 800; color: var(--kkr-violet-bright);" class="tabular">${esc(p.bowling.wickets)}</td>
                <td style="padding: 0.75rem 0.6rem; text-align: right;" class="tabular">${esc(p.bowling.overs)}</td>
                <td style="padding: 0.75rem 0.6rem; text-align: right;" class="tabular">${esc(p.bowling.economy)}</td>
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
// 6. NEWS & ARTICLES
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
  title: 'Media & Bulletins | Dread Eleven (DE)',
  description: 'Official announcements and tactical dispatches for Dread Eleven in the Atal Bihari Vajpayee Memorial Tournament, Rewa.',
  canonicalUrl: '/news',
  jsonLd: directoryJsonLd
})}
${renderHeader('news')}

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// DISPATCHES</div>
        <h1 class="section-title">Dread Eleven Media Center</h1>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 2rem;">
      ${news.map((n) => `
        <article style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem; display: flex; flex-direction: column;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700; margin-bottom: 0.6rem;">
            ${esc(n.category)} • ${formatDate(n.publishedAt.slice(0, 10))}
          </div>
          <h2 style="font-family: var(--f-display); font-size: 1.6rem; color: #fff; text-transform: uppercase; line-height: 1.15; margin-bottom: 0.75rem;">
            <a href="/news/${n.slug}" style="color: inherit; text-decoration: none;">${esc(n.title)}</a>
          </h2>
          <p style="font-size: 0.875rem; color: var(--kkr-gray-400); line-height: 1.6; margin-bottom: 1.5rem;">
            ${esc(n.summary)}
          </p>
          <a href="/news/${n.slug}" style="margin-top: auto; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); font-weight: 700; text-transform: uppercase; text-decoration: none;">
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

<article class="squad-section" style="padding-top: 4rem;">
  <div class="container" style="max-width: 860px;">
    <nav aria-label="Breadcrumb" style="margin-bottom: 1.5rem; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400);">
      <a href="/" style="color: inherit;">Home</a> / <a href="/news" style="color: inherit;">News</a> / <span style="color: var(--kkr-gold-bright);">${esc(n.category)}</span>
    </nav>

    <div style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700; margin-bottom: 0.75rem;">
      ${esc(n.category)} • Published ${formatDate(n.publishedAt.slice(0, 10))} • ${esc(n.readTime)}
    </div>

    <h1 class="section-title" style="font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1; margin-bottom: 1.5rem;">
      ${esc(n.title)}
    </h1>

    <div style="display: flex; align-items: center; gap: 0.75rem; border-top: 1px solid var(--kkr-border); border-bottom: 1px solid var(--kkr-border); padding: 0.75rem 0; margin-bottom: 2rem; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400);">
      <span>By <strong style="color: #fff;">${esc(n.author.name)}</strong></span>
      <span>•</span>
      <span>${esc(n.author.role)}</span>
    </div>

    <div style="font-size: 1.0625rem; line-height: 1.8; color: var(--kkr-gray-200); margin-bottom: 3.5rem;">
      ${n.body}
    </div>

    <!-- Related Articles -->
    <div style="border-top: 1px solid var(--kkr-border); padding-top: 2rem;">
      <h3 style="font-family: var(--f-display); font-size: 1.6rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem;">
        Related Dispatches
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        ${related.map((r) => `
          <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 6px; padding: 1.25rem;">
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase; margin-bottom: 0.4rem;">${esc(r.category)}</div>
            <h4 style="font-family: var(--f-display); font-size: 1.3rem; text-transform: uppercase; line-height: 1.2; margin-bottom: 0.5rem;">
              <a href="/news/${r.slug}" style="color: #fff; text-decoration: none;">${esc(r.title)}</a>
            </h4>
            <a href="/news/${r.slug}" style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gold-bright); font-weight: 700; text-decoration: none;">Read &rarr;</a>
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
// 7. ABOUT, CONTACT, 404
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

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-tag">// THE TITANS</div>
        <h1 class="section-title">About Dread Eleven &amp; 2022 Silverware</h1>
        <p style="color: var(--kkr-gray-400); font-size: 1rem; max-width: 65ch; margin-top: 0.4rem;">
          Established in 2021 as a premier divisional trial franchise under the Rewa Division Cricket Association (RDCA).
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; margin-bottom: 3.5rem;">
      <div style="background: var(--kkr-purple-card); border: 2px solid var(--kkr-border); border-radius: 8px; padding: 2.5rem;">
        <h2 style="font-family: var(--f-display); font-size: 2rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          The Strike Power of Rewa Cricket
        </h2>
        <div style="font-size: 0.9375rem; color: var(--kkr-gray-200); line-height: 1.8; display: flex; flex-direction: column; gap: 1rem;">
          <p>
            <strong>Dread Eleven (DE)</strong> was created in 2021 to harness the finest cricketing talent across Rewa and the Vindhya division.
          </p>
          <p>
            Captained by opening maestro <strong>Akhil Mishra</strong> and powered by premier pace and spin bowlers including <strong>Kuldeep Sen</strong> and <strong>Kumar Kartikeya</strong>, Dread Eleven have asserted their dominance across 24 derby clashes, winning 13 matches (54.2% WR).
          </p>
          <p>
            Dread Eleven captured the coveted <strong>2022 Atal Bihari Vajpayee Memorial Trophy</strong> on 12 August 2022, defending 183 to defeat Destroyers in a thrilling 21-run championship finale.
          </p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700;">Accreditation</div>
          <h3 style="font-family: var(--f-display); font-size: 1.4rem; color: #fff; text-transform: uppercase; margin: 0.35rem 0 0.75rem;">
            RDCA, MPCA &amp; BCCI Sanctioned
          </h3>
          <p style="font-size: 0.8125rem; color: var(--kkr-gray-400); line-height: 1.6;">
            Sanctioned under the Rewa Division Cricket Association (RDCA), affiliated with the Madhya Pradesh Cricket Association (MPCA) and BCCI.
          </p>
        </div>

        <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
          <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase; font-weight: 700;">Home Fortress</div>
          <h3 style="font-family: var(--f-display); font-size: 1.4rem; color: #fff; text-transform: uppercase; margin: 0.35rem 0 0.75rem;">
            Martand Ground No. 3, Rewa
          </h3>
          <p style="font-size: 0.8125rem; color: var(--kkr-gray-400); line-height: 1.6;">
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

<section class="squad-section" style="padding-top: 4rem;">
  <div class="container" style="max-width: 960px;">
    <div class="section-head">
      <div>
        <div class="section-tag">// ADMINISTRATION</div>
        <h1 class="section-title">Contact Dread Eleven</h1>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
      <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
        <h2 style="font-family: var(--f-display); font-size: 1.5rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Headquarters Desk
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.875rem; color: var(--kkr-gray-200);">
          <div>
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Sanctioning Body</div>
            <p>Rewa Division Cricket Association (RDCA)</p>
          </div>
          <div>
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Home Venue</div>
            <p>Martand School Ground No. 3, Rewa, MP 486001</p>
          </div>
          <div>
            <div style="font-family: var(--f-mono); font-size: 0.6875rem; color: var(--kkr-gold-bright); text-transform: uppercase;">Email Dispatch</div>
            <p style="font-family: var(--f-mono);">admin@dread-eleven.cricket</p>
          </div>
        </div>
      </div>

      <div style="background: var(--kkr-purple-card); border: 1px solid var(--kkr-border); border-radius: 8px; padding: 2rem;">
        <h2 style="font-family: var(--f-display); font-size: 1.5rem; color: #fff; text-transform: uppercase; margin-bottom: 1.25rem;">
          Send Transmission
        </h2>
        <form onsubmit="event.preventDefault(); alert('Transmission logged. Desk will respond within 24h.');" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400); margin-bottom: 0.35rem; text-transform: uppercase;">Full Name</label>
            <input type="text" required placeholder="Name" style="width: 100%; background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); color: #fff; padding: 0.65rem 0.9rem; font-family: var(--f-body); font-size: 0.875rem; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400); margin-bottom: 0.35rem; text-transform: uppercase;">Email Address</label>
            <input type="email" required placeholder="you@example.com" style="width: 100%; background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); color: #fff; padding: 0.65rem 0.9rem; font-family: var(--f-body); font-size: 0.875rem; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; font-family: var(--f-mono); font-size: 0.75rem; color: var(--kkr-gray-400); margin-bottom: 0.35rem; text-transform: uppercase;">Message</label>
            <textarea rows="4" required placeholder="Your message..." style="width: 100%; background: var(--kkr-purple-surface); border: 1px solid var(--kkr-border); color: #fff; padding: 0.65rem 0.9rem; font-family: var(--f-body); font-size: 0.875rem; resize: vertical; border-radius: 4px;"></textarea>
          </div>
          <button type="submit" class="btn-knight-gold" style="margin-top: 0.5rem; width: 100%;">
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
  description: 'The requested ledger could not be located in the Dread Eleven registry.',
  canonicalUrl: '/404'
})}
${renderHeader('')}

<section class="squad-section" style="padding: 8rem 0; text-align: center;">
  <div class="container" style="max-width: 600px;">
    <div style="font-family: var(--f-display); font-size: 8rem; color: var(--kkr-gold-bright); line-height: 0.8; margin-bottom: 1rem;">404</div>
    <h1 style="font-family: var(--f-display); font-size: 2.4rem; color: #fff; text-transform: uppercase; margin-bottom: 1rem;">
      Out of Bounds — Signal Lost
    </h1>
    <p style="color: var(--kkr-gray-400); font-size: 1rem; margin-bottom: 2rem;">
      The match log or player profile you requested does not exist or has been relocated in the Dread Eleven registry.
    </p>
    <a href="/" class="btn-knight-gold">Return to Home</a>
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

  console.log(`Generated sitemap.xml with ${urls.length} indexable URLs and robots.txt (Dread Eleven).`);
}

function main() {
  console.log('=== BUILDING KKR-INSPIRED ROYAL DREAD ELEVEN SUITE ===');
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
  console.log('=== DREAD ELEVEN KKR-STYLE BUILD COMPLETE ===');
}

main();
