// FILE: lib/constants.ts — Game Configuration (Single Source of Truth)
// VERSION: YG-V6.3 — palette v3 (dark blue/green/dark red/magenta, projector high-contrast) + assetTextColor() (% labels) + diversification consts (Ch5–7: MIN_ASSET_CLASSES=3, MAX_ALLOCATION_PER_ASSET=50)
//   • 6 Thai sectors → 8 asset classes (EN) · RETURN_TABLE 6x6 → 8x7
//   • STARTING_MONEY 10,000 → 1,000,000 · TOTAL_ROUNDS 6 → 7
//   • NEW: AVAILABLE_ASSETS (progressive unlock) + per-asset cap mechanism (generic; no asset capped as of YG-V3)
//   • Quiz/Chance/Golden constants kept (imported by dormant components) but their phases are removed in game-engine
// LAST MODIFIED: 08 Jul 2026
// HISTORY: market-wars B1..B20 (see main repo) | YG-V0 fork: asset classes + scripted 8x7 returns + 1M capital + 7 challenges + unlock/cap | YG-V3: allocation step 5% + crypto cap removed | YG-V4: timers removed + reveal phase

// ==============================================
// KKP YoungGen 2026 — Portfolio Challenge
// Single Source of Truth — all game data lives here
// ==============================================

// Bilingual type kept for compatibility with <Bi> and dormant quiz/chance data.
// YoungGen V.0 runs EN-only; these fields simply aren't rendered.
export type LocalizedText = { th: string; en: string };

// --- Game Settings ---
export const MAX_PLAYERS = 60;              // teams (1 device = 1 team)
export const TOTAL_ROUNDS = 7;              // 7 challenges
export const STARTING_MONEY = 1000000;      // ฿1,000,000 virtual capital
export const ALLOCATION_STEP = 5;           // 5% steps (YG-V3 — team decision; brief spec 1% deferred)

// YG-V6: diversification rules (team requested, applies Challenge 5–7 only; 1–4 kept as-played)
export const DIVERSIFY_FROM_ROUND = 5;      // rules active when round >= this
export const MAX_ALLOCATION_PER_ASSET = 50; // no single asset class over 50%
export const MIN_ASSET_CLASSES = 3;         // must spread across at least 3 asset classes

// ==============================================
// 8 Asset Classes (exported as COMPANIES to reuse the existing engine/routes unchanged)
//   id            → stable key used in portfolio / RETURN_TABLE / round_returns
//   cap           → optional single-asset max % (none set as of YG-V3; add per asset if a cap is needed)
//   unlockRound   → first challenge the asset is selectable (documentation; source of truth = AVAILABLE_ASSETS)
// ==============================================
export const COMPANIES = [
  {
    id: 'cash',
    name: 'Cash & Bank Deposit',
    type: 'Cash',
    risk: 'Very Low',
    color: '#94A3B8',
    icon: '💵',
    description: 'Thai bank savings; earns the prevailing deposit rate. Your floor return.',
  },
  {
    id: 'bonds',
    name: 'Thai Government Bonds',
    type: 'Fixed Income',
    risk: 'Low',
    color: '#1D4ED8',
    icon: '🏦',
    description: '5-year Thai gov bond; price moves inversely to interest rates.',
  },
  {
    id: 'thai_eq',
    name: 'Thai Equity (SET)',
    type: 'Equity',
    risk: 'Medium-High',
    color: '#F97316',
    icon: '🇹🇭',
    description: 'SET Index — Thai listed companies: banks, energy, retail, tech.',
  },
  {
    id: 'global_eq',
    name: 'Global Equity',
    type: 'Equity',
    risk: 'Medium-High',
    color: '#22C55E',
    icon: '🌐',
    description: 'MSCI World / S&P 500 proxy — US & developed-market large-caps.',
  },
  {
    id: 'mutual',
    name: 'Mutual Funds (Mixed)',
    type: 'Balanced Fund',
    risk: 'Medium',
    color: '#A855F7',
    icon: '🧺',
    description: 'Balanced fund ≈ 50% Thai equity + 50% Thai gov bonds.',
  },
  {
    id: 'gold',
    name: 'Gold',
    type: 'Commodity',
    risk: 'Medium',
    color: '#FACC15',
    icon: '🥇',
    description: 'Spot gold in THB — classic safe-haven and inflation hedge.',
  },
  {
    id: 'oil',
    name: 'Crude Oil',
    type: 'Commodity',
    risk: 'High',
    color: '#991B1B',
    icon: '🛢️',
    description: 'Brent crude proxy — tracks energy supply/demand. (Unlocks Challenge 5)',
    unlockRound: 5,
  },
  {
    id: 'crypto',
    name: 'Digital Assets / Crypto',
    type: 'Digital Asset',
    risk: 'Very High',
    color: '#DB2777',
    icon: '🪙',
    description: 'Bitcoin + Ether basket. Extreme volatility. (Unlocks Challenge 6)',
    unlockRound: 6,
  },
];

// ==============================================
// Progressive Unlock — which asset ids are selectable each challenge (1-7)
//   Ch1-4: 6 core · Ch5: +Oil · Ch6: +Crypto, −Oil · Ch7: all 8
// ==============================================
const CORE_6 = ['cash', 'bonds', 'thai_eq', 'global_eq', 'mutual', 'gold'];

export const AVAILABLE_ASSETS: Record<number, string[]> = {
  1: [...CORE_6],
  2: [...CORE_6],
  3: [...CORE_6],
  4: [...CORE_6],
  5: [...CORE_6, 'oil'],
  6: [...CORE_6, 'crypto'],
  7: [...CORE_6, 'oil', 'crypto'],
};

// Return the asset objects selectable in a given challenge (preserves COMPANIES order).
export function getAvailableAssets(round: number): typeof COMPANIES[number][] {
  const ids = AVAILABLE_ASSETS[round] || AVAILABLE_ASSETS[1];
  return COMPANIES.filter((a) => ids.includes(a.id));
}

// Per-asset cap lookup (undefined = no cap). Source of truth for InvestmentPanel clamp.
export function getAssetCap(id: string): number | undefined {
  const a = COMPANIES.find((c) => c.id === id) as unknown as { cap?: number } | undefined;
  return a?.cap;
}

// ==============================================
// RETURN_TABLE — scripted returns per asset per challenge (8 assets × 7 challenges)
// Values are % (may be fractional). Source: KKP YoungGen Master Brief v3.
// Locked-round cells are 0 (asset cannot be allocated there, so it never contributes).
//              Ch1     Ch2     Ch3     Ch4     Ch5     Ch6     Ch7
// ==============================================
export const RETURN_TABLE: Record<string, number[]> = {
  cash:      [  1.0,   1.2,   3.8,   2.0,   2.0,   1.8,   0.8 ],
  bonds:     [  1.8,   3.5,  -6.0,   3.0,  -1.5,   3.0,   6.5 ],
  thai_eq:   [  5.0,  -2.0, -10.0,  13.0, -12.0,  -3.0, -14.0 ],
  global_eq: [  6.5,   4.0, -14.0,  22.0, -10.0,  -1.0,   3.0 ],
  mutual:    [  4.0,   1.5,  -7.0,   9.0,  -6.0,   0.0,  -4.0 ],
  gold:      [  3.0,   5.0,  14.0,  -3.0,  18.0,   7.0,  20.0 ],
  oil:       [  0.0,   0.0,   0.0,   0.0,  30.0,   0.0, -25.0 ],  // available Ch5, Ch7
  crypto:    [  0.0,   0.0,   0.0,   0.0,   0.0, -35.0,  30.0 ],  // available Ch6, Ch7
};

// --- Room Code ---
export const ROOM_CODE_CONFIG = {
  characters: 'ABCDEFGHJKMNPQRSTUVWXYZ',
  length: 4,
};

// --- Phase Flow (documentation; source of truth = game-engine getPhaseOrder) ---
// YG-V0: pure allocation loop — quiz/research/chance removed.
export const GAME_PHASES = [
  'lobby',
  'year_intro',
  'invest',
  'market_open',
  'event',
  'event_result',
  'results',
  'leaderboard',
  'final',
] as const;

export const GOLDEN_DEAL_ROUNDS: number[] = [];

// --- Phase Timers (seconds) — only phases where teams act ---
// YG-V4: all timers removed — untimed play, MC drives pacing manually. (kept as empty map so PHASE_TIMERS[phase] === undefined → every timer guard is a no-op)
export const PHASE_TIMERS: Record<string, number> = {};

// --- Phase Display Info ---
export const PHASE_DISPLAY: Record<string, {
  name: string;
  icon: string;
  displayMessage: string;
  playerMessage: string;
  mcTip: string;
  hasTimer: boolean;
}> = {
  lobby: {
    name: 'Lobby',
    icon: '🏠',
    displayMessage: 'Waiting for teams...',
    playerMessage: 'Waiting for the facilitator to start...',
    mcTip: 'Wait until all teams have joined, then press Start.',
    hasTimer: false,
  },
  year_intro: {
    name: 'Challenge Brief',
    icon: '📅',
    displayMessage: 'A new challenge begins!',
    playerMessage: 'Read the brief on the big screen.',
    mcTip: 'Read the challenge story + macro backdrop, then Next → allocation.',
    hasTimer: false,
  },
  invest: {
    name: 'Allocation',
    icon: '💰',
    displayMessage: 'Teams are allocating...',
    playerMessage: 'Allocate your portfolio — weights must total 100%.',
    mcTip: 'Teams rebalance from scratch each challenge. When all have submitted, press Reveal.',
    hasTimer: false,
  },
  reveal: {
    name: 'Reveal',
    icon: '🔓',
    displayMessage: 'Revealing every team\'s allocation...',
    playerMessage: 'Allocations are on the big screen — watch together.',
    mcTip: 'All allocations are shown together. Continue to the market when ready.',
    hasTimer: false,
  },
  market_open: {
    name: 'Market Open',
    icon: '📈',
    displayMessage: 'The market is opening...',
    playerMessage: '📺 Watch the big screen!',
    mcTip: 'Build suspense — "let us see how this period played out..." then Next.',
    hasTimer: false,
  },
  event: {
    name: 'The Period',
    icon: '📰',
    displayMessage: 'What happened this period',
    playerMessage: '📺 Watch the big screen!',
    mcTip: 'Walk through the event, ask which asset classes won/lost, then Next.',
    hasTimer: false,
  },
  event_result: {
    name: 'Period Returns',
    icon: '📊',
    displayMessage: 'Returns revealed!',
    playerMessage: '📺 Watch the big screen!',
    mcTip: 'Explain why each asset class moved. Then Next.',
    hasTimer: false,
  },
  results: {
    name: 'Round Results',
    icon: '💰',
    displayMessage: 'Portfolios updated!',
    playerMessage: 'Check your portfolio result.',
    mcTip: 'Teams see their new value. Ask who gained, who lost. Then Next.',
    hasTimer: false,
  },
  leaderboard: {
    name: 'Leaderboard',
    icon: '🏆',
    displayMessage: 'Standings updated!',
    playerMessage: 'Check your rank!',
    mcTip: 'Dramatic reveal — who moved up? who dropped? Then Next.',
    hasTimer: false,
  },
  final: {
    name: 'Final Summary',
    icon: '🎉',
    displayMessage: 'The challenge is complete!',
    playerMessage: 'Final results!',
    mcTip: 'Announce the Top 3 by final portfolio value + debrief the 4 habits.',
    hasTimer: false,
  },
};

// ==============================================
// Step Groups — progress indicator (matches YG-V0 flow)
// ==============================================
export const STEP_GROUPS = [
  { id: 'allocate', icon: '💰', label: 'Allocate', phases: ['year_intro', 'invest', 'reveal'] },
  { id: 'market', icon: '📰', label: 'Market', phases: ['market_open', 'event', 'event_result'] },
  { id: 'results', icon: '📊', label: 'Results', phases: ['results'] },
  { id: 'leaderboard', icon: '🏆', label: 'Ranking', phases: ['leaderboard'] },
];

// ==============================================
// Challenge Briefs — shown on the Challenge Brief (year_intro) screen
// ==============================================
export const YEAR_INTRO_TEXT: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Challenge 1 · The First Allocation', subtitle: 'Your first day on the desk. The market is calm. Build the foundation.' },
  2: { title: 'Challenge 2 · Regulation Shake-Up', subtitle: 'A sweeping SEC rulebook drops + fresh tariffs. The map just changed.' },
  3: { title: 'Challenge 3 · The Inflation Storm', subtitle: 'Prices off the leash. Central banks hike. Almost everything bleeds.' },
  4: { title: 'Challenge 4 · AI Industry Disruption', subtitle: 'Compute costs collapse 90%. Every growth stock is on fire.' },
  5: { title: 'Challenge 5 · Geopolitical Crisis', subtitle: 'Conflict in an oil shipping lane. Brent spikes. Crude Oil unlocks.' },
  6: { title: 'Challenge 6 · Digital Asset Surprise', subtitle: 'Crypto goes mainstream — weights lock before the reveal. Crypto unlocks.' },
  7: { title: 'Challenge 7 · The Black Swan Pandemic', subtitle: 'A pandemic hits. Your final exam — this one counts the most.' },
};

// ==============================================
// Events — shown on The Period (event) + Period Returns (event_result) screens
// EventDisplay reads EVENTS[round - 1]
// ==============================================
export const EVENTS = [
  {
    round: 1,
    title: 'The First Allocation',
    emoji: '📊',
    description: 'A calm mid-cycle market. BOT holds at 2.25%, oil range-bound near $75. Equities lead gently on earnings; cash just earns its floor.',
    image: null as string | null,
  },
  {
    round: 2,
    title: 'Regulation Shake-Up',
    emoji: '📜',
    description: 'Sweeping Thai SEC reform + fresh US-China tariffs. Central banks pivot to insurance cuts → bonds and gold benefit; Thai equity stumbles.',
    image: null as string | null,
  },
  {
    round: 3,
    title: 'The Inflation Storm',
    emoji: '🔥',
    description: 'Inflation hits 6.8% (TH) / 8.1% (US). Every central bank hikes. Bonds AND stocks bleed together — only cash and gold win.',
    image: null as string | null,
  },
  {
    round: 4,
    title: 'AI Industry Disruption',
    emoji: '🤖',
    description: 'A new AI model cuts compute cost 90%. Growth stocks rip, global tech +22%. Gold pulls back as risk-on returns.',
    image: null as string | null,
  },
  {
    round: 5,
    title: 'Geopolitical Crisis',
    emoji: '⛽',
    description: 'Conflict shuts a key oil chokepoint. Brent jumps 78 → 112. Oil and gold surge; equities sell off. Crude Oil is now available.',
    image: null as string | null,
  },
  {
    round: 6,
    title: 'Digital Asset Surprise',
    emoji: '🪙',
    description: 'Crypto goes mainstream — then a $2.3B exchange hack + emergency rules. Bitcoin −40%. Gold rallies. (Weights were locked before the reveal.)',
    image: null as string | null,
  },
  {
    round: 7,
    title: 'The Black Swan Pandemic',
    emoji: '🦠',
    description: 'A pandemic shuts borders; Thai tourism halts. Rates slashed to zero. Bonds, gold and crypto surge; oil collapses. The final exam.',
    image: null as string | null,
  },
];

// --- MC Tips per challenge ---
export const MC_TIPS: Record<number, string> = {
  1: 'First challenge — explain the flow: read brief → allocate to 100% → returns revealed → compound.',
  2: 'Ask: "when the rules change, do you stay or move?" Rate cuts favour bonds and gold.',
  3: 'The year the 60/40 failed. Ask who held cash + gold. Bonds are safe from default, not from rate moves.',
  4: 'Growth crushed value. Ask: would you have predicted the AI breakthrough six months ago?',
  5: 'Oil + gold both win in geopolitics. Use oil as a hedge, not a bet — it can reverse fast.',
  6: 'Weights are LOCKED before the surprise. Position size matters more than direction.',
  7: 'Final challenge — everything comes together. Black swans can be prepared for, not predicted.',
};

// ==============================================
// DORMANT DATA (kept only so dormant components still compile)
// These phases are removed from the YG-V0 flow and never render.
// ==============================================

export const QUIZ_BONUS = { CORRECT_2: 0, CORRECT_1: 0, CORRECT_0: 0 };

export const CHANCE_CARDS: { id: number; text: LocalizedText; emoji: string; amount: number }[] = [
  { id: 1, text: { th: '-', en: '-' }, emoji: '🎁', amount: 0 },
];

export function getChanceCard(_roomId: string, _round: number, _playerId: string): typeof CHANCE_CARDS[number] {
  return CHANCE_CARDS[0];
}

export const GOLDEN_DEALS: { round: number; name: string; description: string; actual_return: number; is_trap: boolean }[] = [];

export const QUIZ_POOL: { id: number; question: LocalizedText; choices: LocalizedText[]; correct: number }[] = [
  { id: 1, question: { th: '-', en: '-' }, choices: [{ th: '-', en: '-' }], correct: 0 },
];

export const QUIZ_PER_ROUND: Record<number, number[]> = { 1: [1] };

export function getQuizForRound(_roomId: string, _round: number): typeof QUIZ_POOL[number][] {
  return [];
}

// YG-V6: readable text color for a % label sitting on top of an asset-color segment
// (dark text on light colors like gold/teal, white text on dark colors like blue/purple)
export function assetTextColor(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.95)';
}
