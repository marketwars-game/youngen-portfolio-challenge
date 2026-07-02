// FILE: components/display/InvestDisplay.tsx — Display invest phase (MASKED submit wall)
// VERSION: YG-V4 — invest wall now shows submit status only (no allocations); reveal happens in RevealDisplay
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B16a extracted invest block | B16b live allocation wall | YG-V4 masked (LiveNameBoard invest variant hides bars)
'use client';

import LiveNameBoard from '@/components/display/LiveNameBoard';

export default function InvestDisplay({ players, round }: { players: any[]; round: number }) {
  return <LiveNameBoard players={players} round={round} variant="invest" />;
}
