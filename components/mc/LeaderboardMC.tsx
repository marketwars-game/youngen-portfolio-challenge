// FILE: components/mc/LeaderboardMC.tsx — MC Full Leaderboard
// VERSION: YG-V1 — NextGen Royal re-theme (brand tokens; kids-camp neon retired)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme
'use client';

interface LeaderboardMCProps {
  round: number;
  players: any[];
}

export default function LeaderboardMC({ round, players }: LeaderboardMCProps) {
  const currentRanked = [...players].sort((a, b) => (parseFloat(b.money) || 0) - (parseFloat(a.money) || 0));
  const prevRankMap: Record<string, number> = {};

  if (round > 1) {
    const prev = [...players].sort((a, b) => {
      const aB = a.round_returns?.[String(round)]?.money_before || parseFloat(a.money) || 0;
      const bB = b.round_returns?.[String(round)]?.money_before || parseFloat(b.money) || 0;
      return bB - aB;
    });
    prev.forEach((p, i) => { prevRankMap[p.id] = i + 1; });
  }

  const ranked = currentRanked.map((p, i) => ({
    id: p.id, name: p.name, money: parseFloat(p.money) || 0,
    rank: i + 1, movement: round > 1 ? (prevRankMap[p.id] || i + 1) - (i + 1) : 0
  }));
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-[var(--mw-surface)] rounded-lg p-3 mb-3 border border-[#FFD700]/30">
      <p className="text-[#FFD700] text-sm font-bold mb-2">🏆 Leaderboard — Round {round}</p>
      <div className="max-h-64 overflow-y-auto space-y-0.5">
        {ranked.map((p, i) => (
          <div key={p.id} className={`flex items-center text-xs py-1 ${i < 3 ? 'font-bold' : ''}`}>
            <span className="w-6 text-center">{i < 3 ? medals[i] : <span className="text-gray-500">#{p.rank}</span>}</span>
            <span className="flex-1 ml-1" style={{ color: i === 0 ? '#FFD700' : i === 1 ? '#E0E0E0' : i === 2 ? '#CD9B6A' : '#999' }}>{p.name}</span>
            {round > 1 && <span className="text-[10px] mr-2" style={{ color: p.movement > 0 ? '#22c55e' : p.movement < 0 ? '#ef4444' : '#555' }}>{p.movement > 0 ? `↑${p.movement}` : p.movement < 0 ? `↓${Math.abs(p.movement)}` : '—'}</span>}
            <span style={{ color: i === 0 ? '#FFD700' : i === 1 ? '#E0E0E0' : i === 2 ? '#CD9B6A' : '#999' }}>฿{p.money.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 bg-base rounded p-2 text-neon-cyan text-xs">💡 ประกาศ Top 3! ถามเด็กว่าใครขึ้นมาเยอะสุด? แล้วกด Next</div>
    </div>
  );
}
