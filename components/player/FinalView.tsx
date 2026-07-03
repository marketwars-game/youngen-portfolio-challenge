// FILE: components/player/FinalView.tsx — Player Final Phase
// VERSION: YG-V6 — EN sweep (return-by-challenge labels); spoiler guard/recap unchanged
// LAST MODIFIED: 03 Jul 2026
// HISTORY: B1..B20 (kids-camp lineage) | YG-V0 fork | YG-V1 re-theme | YG-V5 spoiler guard | YG-V6 EN

import { STARTING_MONEY, TOTAL_ROUNDS } from '@/lib/constants';
import { compareForRank } from '@/lib/ranking';

interface FinalViewProps {
  player: any;
  players: any[];
  phase: string;
}

export default function FinalView({ player, players, phase }: FinalViewProps) {
  if (!player) return null;

  // YG-V5: spoiler guard — while the champion is revealed on the projector (final / final_podium),
  // hold the player's own result. Reveal the personal recap only at final_ranking.
  if (phase === 'final' || phase === 'final_podium') {
    return (
      <div className="p-4 max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">👀</div>
        <p className="text-lg font-bold" style={{ color: '#C4B5FD' }}>Watch the big screen</p>
        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Champions are being revealed together on the projector
        </p>
        <div className="flex gap-1.5 mt-6">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--mw-violet)', opacity: 0.9 }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--mw-violet)', opacity: 0.5 }} />
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--mw-violet)', opacity: 0.3 }} />
        </div>
        <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>🔒 Your result is hidden until standings</p>
      </div>
    );
  }

  const sorted = [...players].sort(compareForRank);
  const rank = sorted.findIndex((p) => p.id === player.id) + 1;
  const money = parseFloat(player.money) || STARTING_MONEY;
  const profit = money - STARTING_MONEY;
  const pctReturn = ((profit) / STARTING_MONEY) * 100;
  const isProfit = profit >= 0;

  // Round-by-round bars
  const roundBars: { round: number; pct: number }[] = [];
  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    const rr = player.round_returns?.[String(r)];
    if (!rr) {
      roundBars.push({ round: r, pct: 0 });
      continue;
    }
    const before = parseFloat(rr.money_before) || STARTING_MONEY;
    const after = parseFloat(rr.money_after) || before;
    const pct = before > 0 ? ((after - before) / before) * 100 : 0;
    roundBars.push({ round: r, pct });
  }
  const maxAbsPct = Math.max(...roundBars.map((b) => Math.abs(b.pct)), 1);

  // Top 5
  const top5 = sorted.slice(0, 5);
  const isInTop5 = top5.some((p) => p.id === player.id);

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* YOUR RANK */}
      <div className="text-center mb-4">
        <div className="text-5xl font-black text-white">#{rank}</div>
        <div className="text-gray-400 text-sm">of {players.length} players</div>
      </div>

      {/* Total Profit */}
      <div className="text-center mb-4">
        <div
          className="text-2xl font-bold"
          style={{ color: isProfit ? '#22c55e' : '#ef4444' }}
        >
          {isProfit ? '+' : '-'}฿{Math.abs(profit).toLocaleString()}
        </div>
        <div className="text-gray-500 text-xs">
          {isProfit ? '+' : ''}{pctReturn.toFixed(1)}% from ฿{STARTING_MONEY.toLocaleString()}
        </div>
      </div>

      {/* Round-by-round bars — ✅ B13: R → ปี */}
      <div className="bg-[var(--mw-surface)] rounded-lg p-3 mb-4">
        <div className="text-xs tracking-widest text-gray-500 mb-2">RETURN BY CHALLENGE</div>
        <div className="flex items-end justify-around gap-1" style={{ height: '80px' }}>
          {roundBars.map((bar) => {
            const heightPct = Math.abs(bar.pct) / maxAbsPct;
            const h = Math.max(heightPct * 60, 4);
            const color = bar.pct >= 0 ? '#22c55e' : '#ef4444';
            return (
              <div key={bar.round} className="flex flex-col items-center" style={{ width: '40px' }}>
                <span className="text-xs font-bold mb-1" style={{ color }}>
                  {bar.pct >= 0 ? '+' : ''}{bar.pct.toFixed(0)}%
                </span>
                <div
                  className="w-6 rounded-t"
                  style={{ height: `${h}px`, backgroundColor: color, opacity: 0.8 }}
                />
                <span className="text-xs text-gray-600 mt-1">Ch {bar.round}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 */}
      <div className="bg-[var(--mw-surface)] rounded-lg p-3 mb-4">
        <div className="text-xs tracking-widest text-gray-500 mb-2">TOP 5</div>
        <div className="space-y-1">
          {top5.map((p, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const isMe = p.id === player.id;
            const m = parseFloat(p.money) || 0;
            return (
              <div
                key={p.id}
                className={`flex justify-between items-center px-2 py-1 rounded ${isMe ? 'bg-green-900/20 border border-green-800/30' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm w-6 text-center">
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span className={`text-sm ${isMe ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
                    {isMe ? `You (${p.name})` : p.name}
                  </span>
                </div>
                <span className="text-sm text-gray-400">฿{m.toLocaleString()}</span>
              </div>
            );
          })}
          {!isInTop5 && (
            <>
              <div className="border-t border-dashed border-gray-700 my-1" />
              <div className="flex justify-between items-center px-2 py-1 rounded bg-green-900/20 border border-green-800/30">
                <div className="flex items-center gap-2">
                  <span className="text-sm w-6 text-center">#{rank}</span>
                  <span className="text-sm text-green-400 font-bold">You ({player.name})</span>
                </div>
                <span className="text-sm text-gray-400">฿{money.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thank you */}
      <p className="text-center text-gray-500 text-sm mt-4">Thank you for playing!</p>
    </div>
  );
}
