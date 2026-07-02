// FILE: components/display/RevealDisplay.tsx — Display reveal phase (all teams' allocations, together)
// VERSION: YG-V4 — new: shown after MC presses Reveal; every team's allocation bar at once
// LAST MODIFIED: 02 Jul 2026
// HISTORY: YG-V4 created (mirrors InvestDisplay; uses LiveNameBoard 'reveal' variant)
'use client';

import LiveNameBoard from '@/components/display/LiveNameBoard';

export default function RevealDisplay({ players, round }: { players: any[]; round: number }) {
  return <LiveNameBoard players={players} round={round} variant="reveal" />;
}
