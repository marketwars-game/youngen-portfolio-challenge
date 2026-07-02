// FILE: components/player/LeaderboardView.tsx — Player Leaderboard
// VERSION: YG-V1 — NextGen Royal re-theme (brand tokens; kids-camp neon retired)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme
'use client';

import { compareForRank } from '@/lib/ranking';

interface LeaderboardViewProps {
  player: any;
  players: any[];
  round: number;
}

export default function LeaderboardView({ player, players, round }: LeaderboardViewProps) {
  const currentRanked = [...players].sort(compareForRank);
  let myRank = 0;
  let myMovement = 0;
  const prevRankMap: Record<string, number> = {};

  if (round > 1) {
    const prev = [...players].sort((a, b) => {
      const aB = a.round_returns?.[String(round)]?.money_before || parseFloat(a.money) || 0;
      const bB = b.round_returns?.[String(round)]?.money_before || parseFloat(b.money) || 0;
      return bB - aB;
    });
    prev.forEach((p, i) => { prevRankMap[p.id] = i + 1; });
  }

  const ranked = currentRanked.map((p, i) => {
    const rank = i + 1;
    const mov = round > 1 ? (prevRankMap[p.id] || rank) - rank : 0;
    if (p.id === player.id) { myRank = rank; myMovement = mov; }
    return { ...p, rank, movement: mov, money: parseFloat(p.money) || 0 };
  });

  const top5 = ranked.slice(0, 5);
  const myMoney = parseFloat(player.money) || 0;
  const isInTop5 = myRank >= 1 && myRank <= 5;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-[var(--mw-surface)] rounded-lg p-4">
      <div className="text-center mb-4">
        <div className="text-[10px] tracking-[3px] text-gray-600 mb-1">YOUR RANK</div>
        <div className="text-5xl font-bold text-neon-green">#{myRank}</div>
        <div className="text-xs text-gray-500 mt-1">of {ranked.length} players</div>
        <div className="text-xl font-bold text-white mt-2">฿{myMoney.toLocaleString()}</div>
        {round > 1 && (
          <div className="mt-2">
            <span className="inline-block text-xs px-3 py-1 rounded-full" style={{
              background: myMovement > 0 ? 'rgba(34,197,94,0.15)' : myMovement < 0 ? 'rgba(239,68,68,0.15)' : 'rgba(107,114,128,0.15)',
              color: myMovement > 0 ? '#22c55e' : myMovement < 0 ? '#ef4444' : '#888'
            }}>
              {myMovement > 0 ? `↑${myMovement} from last round` : myMovement < 0 ? `↓${Math.abs(myMovement)} from last round` : '— same position'}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 my-3" />
      <div className="text-[10px] tracking-[2px] text-gray-600 mb-2">TOP 5</div>

      <div className="space-y-1">
        {top5.map((p, i) => {
          const isMe = p.id === player.id;
          return (
            <div key={p.id} className={`flex items-center py-1.5 px-2 rounded text-sm ${isMe ? 'bg-neon-green/10' : ''}`}>
              <span className="w-6 text-center">{i < 3 ? medals[i] : <span className="text-xs text-gray-500">#{p.rank}</span>}</span>
              <span className={`flex-1 ml-1 ${isMe ? 'text-neon-green font-bold' : i === 0 ? 'text-[#FFD700]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-[#CD9B6A]' : 'text-gray-400'}`}>{isMe ? `You (${p.name})` : p.name}</span>
              <span className={`${isMe ? 'text-neon-green font-bold' : i === 0 ? 'text-[#FFD700]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-[#CD9B6A]' : 'text-gray-400'}`}>฿{p.money.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {!isInTop5 && (
        <>
          <div className="border-t border-dashed border-gray-700 my-2" />
          <div className="flex items-center py-1.5 px-2 rounded text-sm bg-neon-green/10">
            <span className="w-6 text-center text-xs text-neon-green font-bold">#{myRank}</span>
            <span className="flex-1 ml-1 text-neon-green font-bold">You ({player.name})</span>
            <span className="text-neon-green font-bold">฿{myMoney.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
