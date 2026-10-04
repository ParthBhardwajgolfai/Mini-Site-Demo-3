import raw from './tournament-data.json';

/* ── Models (ready to be wired to a real API later) ─────────────── */

export interface Player {
  id: number;
  name: string;
  country: string;
  flag: string;
  image: string | null;
  position: string;
  score: number | null;
  scoreDisplay: string;
  total: number | null;
}

export interface LeaderboardEntry {
  id: number;
  pos: string;
  name: string;
  country: string;
  flag: string;
  toPar: number;
  toParDisplay: string;
  total: number;
  totalDisplay: string;
  rounds: (number | null)[];
  roundPars: (number | null)[];
  status: string;
}
export interface LeaderboardRound {
  round: number;
  items: LeaderboardEntry[];
}

export interface DrawEntry {
  id: number;
  name: string;
  country: string;
  teeTime: string | null;
  tee: string | null;
  flight: number | null;
  position: string;
  totalScore: string;
  toPar: string;
}
export interface DrawRound {
  round: number;
  items: DrawEntry[];
}

export interface ResultEntry {
  id: number;
  name: string;
  country: string;
  madeCut: boolean;
  rounds: (number | null)[];
  pos: string;
  toPar: number | null;
  toParDisplay: string;
  total: number;
  prize: string | null;
}

export interface PrizeEntry {
  pos: string;
  name: string;
  country: string;
  amount: number;
  display: string;
  toPar: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  image: string;
}

export interface GalleryItem {
  id: number;
  caption: string;
  image: string;
}

interface TournamentData {
  players: Player[];
  leaderboard: LeaderboardRound[];
  draws: DrawRound[];
  results: ResultEntry[];
  prizes: PrizeEntry[];
  news: NewsItem[];
  gallery: GalleryItem[];
  scorecard: {
    par: number[];
    yardage: number[];
    strokeIndex: number[];
    totals: { par: number; yardage: number };
  };
}

export interface HoleScore {
  hole: number;
  par: number;
  score: number;
  delta: number;
  result: string; // EAGLE | BIRDIE | PAR | BOGEY | DOUBLE | …
}

export interface PlayerHoleData {
  roundScore: number;
  roundToPar: number;
  out: number; // front nine total
  in: number; // back nine total
  holes: HoleScore[];
}

const data = raw as TournamentData & {
  holeByHole: Record<string, Record<string, PlayerHoleData>>;
};

export const players = data.players;
export const leaderboard = data.leaderboard;
export const draws = data.draws;
export const results = data.results;
export const prizes = data.prizes;
export const news = data.news;
export const gallery = data.gallery;
export const scorecard = data.scorecard;

/** Real hole-by-hole scorecards per round, keyed by player id. */
export const holeByHole = data.holeByHole;

export function getHoleData(playerId: number, round: number): PlayerHoleData | null {
  return holeByHole[String(round)]?.[String(playerId)] ?? null;
}

/** Rounds a player actually has hole data for (missed-cut players only played two). */
export function availableRounds(playerId: number): number[] {
  return [1, 2, 3, 4].filter((r) => Boolean(holeByHole[String(r)]?.[String(playerId)]));
}

/* ── Tournament identity (from the official PGTI tournament record) ─ */

export const tournament = {
  name: 'DP World Players Championship',
  year: '2026',
  fullName: 'DP World Players Championship 2026',
  dates: '10 – 13 February 2026',
  datesShort: '10–13 Feb 2026',
  venue: 'Qutab Golf Course',
  city: 'New Delhi',
  country: 'India',
  purse: '₹1.5 Crore',
  purseFull: '₹1,51,33,502',
  format: 'Stroke Play · 72 Holes',
  field: '126 Players',
  cut: 'Top 50 & ties',
  status: 'Tournament Complete',
  par: 70,
  yardage: '6,204 yds',
  champion: {
    name: 'Honey Baisoya',
    country: 'India',
    score: '-23',
    total: 257,
    rounds: [63, 65, 64, 65],
    prize: '₹22,50,000',
    margin: '3 strokes',
    image: '/assets/players/5266.jpg',
  },
  journey: [
    { label: 'Pro-Am', date: 'Sun · 8 Feb', detail: 'Professionals and amateurs share the fairways' },
    { label: 'Practice Round', date: 'Mon · 9 Feb', detail: 'Final preparations at Qutab Golf Course' },
    { label: 'Round 1', date: 'Tue · 10 Feb', detail: 'Kaul fires a course-record 62 to lead' },
    { label: 'Round 2', date: 'Wed · 11 Feb', detail: 'Hack goes bogey-free to take the halfway lead' },
    { label: 'The Cut', date: 'Top 50 & ties', detail: 'Field reduced to 56 professionals' },
    { label: 'Round 3', date: 'Thu · 12 Feb', detail: 'Baisoya’s 64 builds a five-shot cushion' },
    { label: 'Final Round', date: 'Fri · 13 Feb', detail: 'Baisoya closes with 65 to lift the trophy' },
  ],
};

export const partners = {
  title: { name: 'DP World', role: 'Title Partner & Official Umbrella Partner of the PGTI' },
  official: [
    { name: 'PGTI', role: 'Sanctioning Tour' },
    { name: 'IndusInd Bank', role: 'Banking Partner' },
  ],
  supporting: [
    { name: 'Amul', role: 'Official Partner' },
    { name: 'Campa', role: 'Beverage Partner' },
    { name: 'Victorious Choice', role: 'Lifestyle Partner' },
    { name: 'Electro+', role: 'Hydration Partner' },
    { name: 'Golf Plus Monthly', role: 'Media Partner' },
  ],
};

export const fmtToPar = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return '—';
  if (v === 0) return 'E';
  return v > 0 ? `+${v}` : `${v}`;
};
