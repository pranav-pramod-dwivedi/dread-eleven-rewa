import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const matchesPath = path.join(rootDir, 'data/matches.json');
const pointsTablePath = path.join(rootDir, 'data/pointsTable.json');
const statsPath = path.join(rootDir, 'data/stats.json');

const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

// Filter only the 24 base matches from 2021-2024
const baseMatches = matches.filter((m) => parseInt(m.seasonYear, 10) <= 2024);

const newMatches = [
  // 2025 Season (50-over ODI Series)
  {
    id: "m-de-des-2025-1",
    matchNumber: 25,
    slug: "destroyers-vs-dread-eleven-2025-09-04",
    seasonYear: "2025",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Series Match 1",
    format: "ODI",
    status: "completed",
    matchDate: "2025-09-04",
    time: "09:30 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: {
      winner: "Dread Eleven",
      decision: "elected to bat first"
    },
    innings: [
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 248,
        wickets: 8,
        overs: 50,
        runRate: "4.96",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "c sub b Pranav Dwivedi", runs: 72, balls: 84, fours: 7, sixes: 2, strikeRate: "85.71" },
          { playerId: "p-yash-dubey", playerName: "Yash Dubey", dismissal: "c & b Kuldeep Sen", runs: 54, balls: 68, fours: 5, sixes: 0, strikeRate: "79.41" },
          { playerId: "p-ritesh-shakya", playerName: "Ritesh Shakya", dismissal: "run out (Pranav Dwivedi)", runs: 42, balls: 46, fours: 3, sixes: 1, strikeRate: "91.30" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", dismissal: "not out", runs: 38, balls: 32, fours: 4, sixes: 1, strikeRate: "118.75" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 10, maidens: 1, runs: 42, wickets: 3, economy: "4.20" },
          { playerId: "p-kulwant-khejroliya", playerName: "Kulwant Khejroliya", overs: 10, maidens: 0, runs: 51, wickets: 2, economy: "5.10" }
        ]
      },
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 252,
        wickets: 6,
        overs: 48.2,
        runRate: "5.21",
        batting: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "not out", runs: 88, balls: 82, fours: 9, sixes: 3, strikeRate: "107.32" },
          { playerId: "p-aryan-deshmukh", playerName: "Aryan Deshmukh", dismissal: "c Yash Dubey b Kuldeep Sen", runs: 64, balls: 74, fours: 6, sixes: 1, strikeRate: "86.49" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 10, maidens: 1, runs: 48, wickets: 3, economy: "4.80" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 9.2, maidens: 0, runs: 52, wickets: 2, economy: "5.57" }
        ]
      }
    ],
    winner: "DES",
    resultText: "Destroyers won by 4 wickets",
    playerOfTheMatch: {
      name: "Pranav Dwivedi",
      team: "Destroyers",
      reason: "88* (82) & 3/42"
    }
  },
  {
    id: "m-de-des-2025-2",
    matchNumber: 26,
    slug: "destroyers-vs-dread-eleven-2025-09-08",
    seasonYear: "2025",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Series Match 2",
    format: "ODI",
    status: "completed",
    matchDate: "2025-09-08",
    time: "09:30 IST",
    venue: {
      id: "v-martand",
      name: "Martand School Ground No. 3",
      city: "Rewa"
    },
    toss: {
      winner: "Destroyers",
      decision: "elected to bowl first"
    },
    innings: [
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 235,
        wickets: 9,
        overs: 50,
        runRate: "4.70",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "b Saransh Jain", runs: 61, balls: 78, fours: 6, sixes: 1, strikeRate: "78.21" },
          { playerId: "p-rishab-verma", playerName: "Rishab Verma", dismissal: "c & b Pranav Dwivedi", runs: 48, balls: 56, fours: 4, sixes: 1, strikeRate: "85.71" },
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", dismissal: "not out", runs: 29, balls: 20, fours: 2, sixes: 2, strikeRate: "145.00" }
        ],
        bowling: [
          { playerId: "p-saransh-jain", playerName: "Saransh Jain", overs: 10, maidens: 2, runs: 38, wickets: 3, economy: "3.80" },
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 10, maidens: 1, runs: 45, wickets: 2, economy: "4.50" }
        ]
      },
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 218,
        wickets: 10,
        overs: 47.4,
        runRate: "4.57",
        batting: [
          { playerId: "p-aryan-deshmukh", playerName: "Aryan Deshmukh", dismissal: "c Yash Dubey b Kuldeep Sen", runs: 58, balls: 70, fours: 5, sixes: 1, strikeRate: "82.86" },
          { playerId: "p-shivam-shukla", playerName: "Shivam Shukla", dismissal: "b Anubhav Agarwal", runs: 44, balls: 52, fours: 4, sixes: 0, strikeRate: "84.62" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 9.4, maidens: 2, runs: 36, wickets: 4, economy: "3.72" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 10, maidens: 1, runs: 44, wickets: 3, economy: "4.40" }
        ]
      }
    ],
    winner: "DE",
    resultText: "Dread Eleven won by 17 runs",
    playerOfTheMatch: {
      name: "Kuldeep Sen",
      team: "Dread Eleven",
      reason: "4/36 (9.4 ov) & 29* (20)"
    }
  },
  {
    id: "m-de-des-2025-3",
    matchNumber: 27,
    slug: "destroyers-vs-dread-eleven-2025-09-12",
    seasonYear: "2025",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Series Match 3",
    format: "ODI",
    status: "completed",
    matchDate: "2025-09-12",
    time: "09:30 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: {
      winner: "Destroyers",
      decision: "elected to bat first"
    },
    innings: [
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 274,
        wickets: 7,
        overs: 50,
        runRate: "5.48",
        batting: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "c Akhil Mishra b Anubhav Agarwal", runs: 94, balls: 88, fours: 10, sixes: 3, strikeRate: "106.82" },
          { playerId: "p-shubham-sharma", playerName: "Shubham Sharma", dismissal: "b Kuldeep Sen", runs: 62, balls: 66, fours: 7, sixes: 1, strikeRate: "93.94" }
        ],
        bowling: [
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 10, maidens: 0, runs: 58, wickets: 3, economy: "5.80" },
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 10, maidens: 1, runs: 49, wickets: 2, economy: "4.90" }
        ]
      },
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 246,
        wickets: 10,
        overs: 48.1,
        runRate: "5.10",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "c & b Pranav Dwivedi", runs: 68, balls: 72, fours: 6, sixes: 2, strikeRate: "94.44" },
          { playerId: "p-yash-dubey", playerName: "Yash Dubey", dismissal: "lbw b Saransh Jain", runs: 46, balls: 54, fours: 4, sixes: 0, strikeRate: "85.19" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 9.1, maidens: 1, runs: 44, wickets: 3, economy: "4.80" },
          { playerId: "p-saransh-jain", playerName: "Saransh Jain", overs: 10, maidens: 0, runs: 46, wickets: 3, economy: "4.60" }
        ]
      }
    ],
    winner: "DES",
    resultText: "Destroyers won by 28 runs",
    playerOfTheMatch: {
      name: "Pranav Dwivedi",
      team: "Destroyers",
      reason: "94 (88) & 3/44"
    }
  },
  {
    id: "m-de-des-2025-4",
    matchNumber: 28,
    slug: "destroyers-vs-dread-eleven-2025-09-16",
    seasonYear: "2025",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Series Match 4",
    format: "ODI",
    status: "completed",
    matchDate: "2025-09-16",
    time: "09:30 IST",
    venue: {
      id: "v-martand",
      name: "Martand School Ground No. 3",
      city: "Rewa"
    },
    toss: {
      winner: "Dread Eleven",
      decision: "elected to field first"
    },
    innings: [
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 260,
        wickets: 8,
        overs: 50,
        runRate: "5.20",
        batting: [
          { playerId: "p-shivam-shukla", playerName: "Shivam Shukla", dismissal: "c Yash Dubey b Kuldeep Sen", runs: 76, balls: 84, fours: 7, sixes: 2, strikeRate: "90.48" },
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "c Akhil Mishra b Anubhav Agarwal", runs: 55, balls: 58, fours: 5, sixes: 1, strikeRate: "94.83" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 10, maidens: 1, runs: 46, wickets: 3, economy: "4.60" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 10, maidens: 0, runs: 54, wickets: 2, economy: "5.40" }
        ]
      },
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 239,
        wickets: 10,
        overs: 47.3,
        runRate: "5.03",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "c & b Pranav Dwivedi", runs: 58, balls: 64, fours: 5, sixes: 1, strikeRate: "90.63" },
          { playerId: "p-ritesh-shakya", playerName: "Ritesh Shakya", dismissal: "b Kulwant Khejroliya", runs: 44, balls: 48, fours: 4, sixes: 1, strikeRate: "91.67" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 9.3, maidens: 1, runs: 40, wickets: 4, economy: "4.21" },
          { playerId: "p-kulwant-khejroliya", playerName: "Kulwant Khejroliya", overs: 10, maidens: 1, runs: 48, wickets: 3, economy: "4.80" }
        ]
      }
    ],
    winner: "DES",
    resultText: "Destroyers won by 21 runs",
    playerOfTheMatch: {
      name: "Pranav Dwivedi",
      team: "Destroyers",
      reason: "55 (58) & 4/40"
    }
  },
  {
    id: "m-de-des-2025-5",
    matchNumber: 29,
    slug: "destroyers-vs-dread-eleven-2025-09-20",
    seasonYear: "2025",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Championship Final",
    format: "ODI",
    status: "completed",
    matchDate: "2025-09-20",
    time: "09:30 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: {
      winner: "Destroyers",
      decision: "elected to bat first"
    },
    innings: [
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 285,
        wickets: 5,
        overs: 50,
        runRate: "5.70",
        batting: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "c Akhil Mishra b Kuldeep Sen", runs: 104, balls: 96, fours: 11, sixes: 4, strikeRate: "108.33" },
          { playerId: "p-aryan-deshmukh", playerName: "Aryan Deshmukh", dismissal: "c Yash Dubey b Anubhav Agarwal", runs: 74, balls: 80, fours: 8, sixes: 1, strikeRate: "92.50" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 10, maidens: 0, runs: 58, wickets: 2, economy: "5.80" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 10, maidens: 1, runs: 52, wickets: 2, economy: "5.20" }
        ]
      },
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 253,
        wickets: 10,
        overs: 47.1,
        runRate: "5.36",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "c sub b Pranav Dwivedi", runs: 82, balls: 86, fours: 8, sixes: 2, strikeRate: "95.35" },
          { playerId: "p-yash-dubey", playerName: "Yash Dubey", dismissal: "b Saransh Jain", runs: 51, balls: 56, fours: 5, sixes: 0, strikeRate: "91.07" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 9.1, maidens: 0, runs: 46, wickets: 4, economy: "5.02" },
          { playerId: "p-saransh-jain", playerName: "Saransh Jain", overs: 10, maidens: 1, runs: 45, wickets: 3, economy: "4.50" }
        ]
      }
    ],
    winner: "DES",
    resultText: "Destroyers won by 32 runs",
    playerOfTheMatch: {
      name: "Pranav Dwivedi",
      team: "Destroyers",
      reason: "104 (96) & 4/46"
    }
  },

  // 2026 Season (Silver Jubilee Cycle: 3 Completed + 3 Upcoming)
  {
    id: "m-de-des-2026-1",
    matchNumber: 30,
    slug: "destroyers-vs-dread-eleven-2026-02-10",
    seasonYear: "2026",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "T20 Derby Blast 1",
    format: "T20",
    status: "completed",
    matchDate: "2026-02-10",
    time: "14:00 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: {
      winner: "Dread Eleven",
      decision: "elected to field first"
    },
    innings: [
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 188,
        wickets: 4,
        overs: 20,
        runRate: "9.40",
        batting: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "not out", runs: 76, balls: 44, fours: 7, sixes: 4, strikeRate: "172.73" },
          { playerId: "p-shubham-sharma", playerName: "Shubham Sharma", dismissal: "c Akhil Mishra b Kuldeep Sen", runs: 52, balls: 36, fours: 5, sixes: 2, strikeRate: "144.44" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 4, maidens: 0, runs: 34, wickets: 2, economy: "8.50" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 4, maidens: 0, runs: 38, wickets: 1, economy: "9.50" }
        ]
      },
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 172,
        wickets: 8,
        overs: 20,
        runRate: "8.60",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "c & b Pranav Dwivedi", runs: 64, balls: 42, fours: 6, sixes: 3, strikeRate: "152.38" },
          { playerId: "p-yash-dubey", playerName: "Yash Dubey", dismissal: "b Kulwant Khejroliya", runs: 38, balls: 28, fours: 4, sixes: 1, strikeRate: "135.71" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 4, maidens: 0, runs: 28, wickets: 3, economy: "7.00" },
          { playerId: "p-kulwant-khejroliya", playerName: "Kulwant Khejroliya", overs: 4, maidens: 0, runs: 33, wickets: 2, economy: "8.25" }
        ]
      }
    ],
    winner: "DES",
    resultText: "Destroyers won by 16 runs",
    playerOfTheMatch: {
      name: "Pranav Dwivedi",
      team: "Destroyers",
      reason: "76* (44) & 3/28"
    }
  },
  {
    id: "m-de-des-2026-2",
    matchNumber: 31,
    slug: "destroyers-vs-dread-eleven-2026-02-14",
    seasonYear: "2026",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "T20 Derby Blast 2",
    format: "T20",
    status: "completed",
    matchDate: "2026-02-14",
    time: "14:00 IST",
    venue: {
      id: "v-martand",
      name: "Martand School Ground No. 3",
      city: "Rewa"
    },
    toss: {
      winner: "Destroyers",
      decision: "elected to bat first"
    },
    innings: [
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 164,
        wickets: 7,
        overs: 20,
        runRate: "8.20",
        batting: [
          { playerId: "p-shivam-shukla", playerName: "Shivam Shukla", dismissal: "b Kuldeep Sen", runs: 51, balls: 38, fours: 5, sixes: 2, strikeRate: "134.21" },
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "c Yash Dubey b Anubhav Agarwal", runs: 38, balls: 26, fours: 3, sixes: 2, strikeRate: "146.15" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 4, maidens: 1, runs: 24, wickets: 3, economy: "6.00" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 4, maidens: 0, runs: 30, wickets: 2, economy: "7.50" }
        ]
      },
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 168,
        wickets: 5,
        overs: 19.1,
        runRate: "8.76",
        batting: [
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "not out", runs: 78, balls: 48, fours: 8, sixes: 3, strikeRate: "162.50" },
          { playerId: "p-ritesh-shakya", playerName: "Ritesh Shakya", dismissal: "c & b Pranav Dwivedi", runs: 34, balls: 24, fours: 3, sixes: 1, strikeRate: "141.67" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 4, maidens: 0, runs: 32, wickets: 2, economy: "8.00" },
          { playerId: "p-saransh-jain", playerName: "Saransh Jain", overs: 4, maidens: 0, runs: 29, wickets: 1, economy: "7.25" }
        ]
      }
    ],
    winner: "DE",
    resultText: "Dread Eleven won by 5 wickets",
    playerOfTheMatch: {
      name: "Akhil Mishra",
      team: "Dread Eleven",
      reason: "78* (48) in match-winning chase"
    }
  },
  {
    id: "m-de-des-2026-3",
    matchNumber: 32,
    slug: "destroyers-vs-dread-eleven-2026-02-18",
    seasonYear: "2026",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "T20 Derby Blast 3",
    format: "T20",
    status: "completed",
    matchDate: "2026-02-18",
    time: "14:00 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: {
      winner: "Dread Eleven",
      decision: "elected to bat first"
    },
    innings: [
      {
        teamId: "DE",
        teamName: "Dread Eleven",
        runs: 158,
        wickets: 8,
        overs: 20,
        runRate: "7.90",
        batting: [
          { playerId: "p-yash-dubey", playerName: "Yash Dubey", dismissal: "c sub b Pranav Dwivedi", runs: 45, balls: 36, fours: 4, sixes: 1, strikeRate: "125.00" },
          { playerId: "p-akhil-mishra", playerName: "Akhil Mishra", dismissal: "lbw b Kulwant Khejroliya", runs: 42, balls: 32, fours: 4, sixes: 1, strikeRate: "131.25" }
        ],
        bowling: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", overs: 4, maidens: 0, runs: 26, wickets: 3, economy: "6.50" },
          { playerId: "p-kulwant-khejroliya", playerName: "Kulwant Khejroliya", overs: 4, maidens: 0, runs: 30, wickets: 2, economy: "7.50" }
        ]
      },
      {
        teamId: "DES",
        teamName: "Destroyers Cricket Club",
        runs: 161,
        wickets: 4,
        overs: 18.3,
        runRate: "8.70",
        batting: [
          { playerId: "p-pranav-dwivedi", playerName: "Pranav Dwivedi", dismissal: "not out", runs: 68, balls: 41, fours: 6, sixes: 3, strikeRate: "165.85" },
          { playerId: "p-aryan-deshmukh", playerName: "Aryan Deshmukh", dismissal: "c Yash Dubey b Kuldeep Sen", runs: 46, balls: 34, fours: 5, sixes: 1, strikeRate: "135.29" }
        ],
        bowling: [
          { playerId: "p-kuldeep-sen", playerName: "Kuldeep Sen", overs: 4, maidens: 0, runs: 32, wickets: 2, economy: "8.00" },
          { playerId: "p-anubhav-agarwal", playerName: "Anubhav Agarwal", overs: 3.3, maidens: 0, runs: 36, wickets: 1, economy: "10.28" }
        ]
      }
    ],
    winner: "DES",
    resultText: "Destroyers won by 6 wickets",
    playerOfTheMatch: {
      name: "Pranav Dwivedi",
      team: "Destroyers",
      reason: "68* (41) & 3/26"
    }
  },

  // 2026 Upcoming Marquee Fixtures
  {
    id: "m-de-des-2026-4",
    matchNumber: 33,
    slug: "destroyers-vs-dread-eleven-2026-09-06",
    seasonYear: "2026",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Super Clash 1",
    format: "ODI",
    status: "upcoming",
    matchDate: "2026-09-06",
    time: "09:30 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: null,
    innings: [],
    winner: null,
    resultText: "Scheduled • 09:30 IST at APSU Stadium, Rewa",
    playerOfTheMatch: null
  },
  {
    id: "m-de-des-2026-5",
    matchNumber: 34,
    slug: "destroyers-vs-dread-eleven-2026-09-12",
    seasonYear: "2026",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "ODI Super Clash 2",
    format: "ODI",
    status: "upcoming",
    matchDate: "2026-09-12",
    time: "09:30 IST",
    venue: {
      id: "v-martand",
      name: "Martand School Ground No. 3",
      city: "Rewa"
    },
    toss: null,
    innings: [],
    winner: null,
    resultText: "Scheduled • 09:30 IST at Martand Ground No. 3, Rewa",
    playerOfTheMatch: null
  },
  {
    id: "m-de-des-2026-6",
    matchNumber: 35,
    slug: "destroyers-vs-dread-eleven-2026-09-20",
    seasonYear: "2026",
    tournamentName: "Atal Bihari Vajpayee Memorial Tournament",
    stage: "2026 Grand Championship Final",
    format: "ODI",
    status: "upcoming",
    matchDate: "2026-09-20",
    time: "09:30 IST",
    venue: {
      id: "v-apsu",
      name: "Awadhesh Pratap Singh University (APSU) Stadium",
      city: "Rewa"
    },
    toss: null,
    innings: [],
    winner: null,
    resultText: "Scheduled • 09:30 IST at APSU Stadium, Rewa",
    playerOfTheMatch: null
  }
];

const all35Matches = [...baseMatches, ...newMatches];
fs.writeFileSync(matchesPath, JSON.stringify(all35Matches, null, 2));
console.log('Saved 35 matches to matches.json');

// Points Table
const pointsTableData = {
  allTime: [
    { rank: 1, team: "Destroyers Cricket Club", teamCode: "DES", played: 32, won: 17, lost: 15, tied: 0, nr: 0, nrr: "+0.185", points: 34, form: ["W", "L", "W", "W", "W"] },
    { rank: 2, team: "Dread Eleven", teamCode: "DE", played: 32, won: 15, lost: 17, tied: 0, nr: 0, nrr: "-0.185", points: 30, form: ["L", "W", "L", "L", "L"] }
  ],
  "2026": [
    { rank: 1, team: "Destroyers Cricket Club", teamCode: "DES", played: 3, won: 2, lost: 1, tied: 0, nr: 0, nrr: "+0.420", points: 4 },
    { rank: 2, team: "Dread Eleven", teamCode: "DE", played: 3, won: 1, lost: 2, tied: 0, nr: 0, nrr: "-0.420", points: 2 }
  ],
  "2025": [
    { rank: 1, team: "Destroyers Cricket Club", teamCode: "DES", played: 5, won: 4, lost: 1, tied: 0, nr: 0, nrr: "+0.540", points: 8 },
    { rank: 2, team: "Dread Eleven", teamCode: "DE", played: 5, won: 1, lost: 4, tied: 0, nr: 0, nrr: "-0.540", points: 2 }
  ],
  "2024": [
    { rank: 1, team: "Destroyers Cricket Club", teamCode: "DES", played: 5, won: 4, lost: 1, tied: 0, nr: 0, nrr: "+0.485", points: 8 },
    { rank: 2, team: "Dread Eleven", teamCode: "DE", played: 5, won: 1, lost: 4, tied: 0, nr: 0, nrr: "-0.485", points: 2 }
  ],
  "2023": [
    { rank: 1, team: "Dread Eleven", teamCode: "DE", played: 5, won: 3, lost: 2, tied: 0, nr: 0, nrr: "+0.240", points: 6 },
    { rank: 2, team: "Destroyers Cricket Club", teamCode: "DES", played: 5, won: 2, lost: 3, tied: 0, nr: 0, nrr: "-0.240", points: 4 }
  ],
  "2022": [
    { rank: 1, team: "Dread Eleven (Champions)", teamCode: "DE", played: 7, won: 4, lost: 3, tied: 0, nr: 0, nrr: "+0.315", points: 8 },
    { rank: 2, team: "Destroyers Cricket Club", teamCode: "DES", played: 7, won: 3, lost: 4, tied: 0, nr: 0, nrr: "-0.315", points: 6 }
  ],
  "2021": [
    { rank: 1, team: "Dread Eleven (Champions)", teamCode: "DE", played: 7, won: 5, lost: 2, tied: 0, nr: 0, nrr: "+0.610", points: 10 },
    { rank: 2, team: "Destroyers Cricket Club", teamCode: "DES", played: 7, won: 2, lost: 5, tied: 0, nr: 0, nrr: "-0.610", points: 4 }
  ]
};

fs.writeFileSync(pointsTablePath, JSON.stringify(pointsTableData, null, 2));
console.log('Saved pointsTable.json');

// Stats Data
const statsData = {
  headToHead: {
    totalMatches: 35,
    completedMatches: 32,
    upcomingMatches: 3,
    dreadElevenWins: 15,
    destroyersWins: 17,
    deWinPercentage: "46.9%",
    desWinPercentage: "53.1%",
    t20Matches: {
      total: 15,
      deWins: 9,
      desWins: 6
    },
    odiMatches: {
      total: 17,
      deWins: 6,
      desWins: 11
    }
  },
  records: {
    highestTotal: {
      team: "Dread Eleven",
      score: "278/6",
      overs: "50.0",
      opponent: "Destroyers",
      season: "2022",
      venue: "APSU Stadium, Rewa"
    },
    highestIndividualScore: {
      player: "Akhil Mishra",
      score: 114,
      balls: 98,
      season: "2022",
      opponent: "Destroyers"
    },
    bestBowlingFigures: {
      player: "Kuldeep Sen",
      figures: "5/28",
      overs: 9.2,
      season: "2022",
      opponent: "Destroyers"
    }
  }
};

fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2));
console.log('Saved stats.json');
