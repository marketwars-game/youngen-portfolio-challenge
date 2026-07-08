// FILE: components/display/FinalRanking.tsx — Final step ② Full ranking (real teams only)
// VERSION: YG-V6.3 — 4–8 team rows + money bar + medals + return% + money; strategy tags removed (diversification now enforced); h-full fit; EN
// LAST MODIFIED: 08 Jul 2026
// HISTORY: B1..B20 (kids-camp lineage: scale-to-fit grid for ~70) | YG-V0 fork | YG-V5 real-teams-only | YG-V6 EN + rows rework for few teams
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { compareForRank } from '@/lib/ranking';
import { STARTING_MONEY } from '@/lib/constants';

interface FinalRankingProps {
  players: any[];
  animate: boolean;
}

const fmtPct = (v: number) => (v >= 0 ? '+' : '') + Math.round(v) + '%';
const retOf = (p: any) => ((parseFloat(p.money) || 0) - STARTING_MONEY) / STARTING_MONEY * 100;


const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const medalGlow = ['rgba(255,215,0,0.35)', 'rgba(192,192,192,0.3)', 'rgba(205,127,50,0.3)'];
const medals = ['🥇', '🥈', '🥉'];

export default function FinalRanking({ players, animate }: FinalRankingProps) {
  const [doAnim] = useState(animate);
  const areaRef = useRef<HTMLDivElement>(null);
  const [areaH, setAreaH] = useState(560);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setAreaH(el.clientHeight || 560);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const view = useMemo(() => {
    const sortedPlayers = [...players].sort(compareForRank);
    const n = sortedPlayers.length;
    const greenCount = sortedPlayers.filter((p) => (parseFloat(p.money) || 0) >= STARTING_MONEY).length;
    const redCount = n - greenCount;
    const rets = sortedPlayers.map(retOf);
    const avg = n ? rets.reduce((a, b) => a + b, 0) / n : 0;
    const maxRet = n ? Math.max(...rets) : 0;
    const minRet = n ? Math.min(...rets) : 0;
    const maxMoney = Math.max(1, ...sortedPlayers.map((p) => parseFloat(p.money) || 0));
    return { sortedPlayers, n, greenCount, redCount, avg, maxRet, minRet, maxMoney };
  }, [players]);

  const { sortedPlayers, n, greenCount, redCount, avg, maxRet, minRet, maxMoney } = view;

  const N = Math.max(1, n);
  const gap = Math.max(8, Math.min(16, (areaH / N) * 0.14));
  const rowH = Math.max(40, (areaH - gap * (N - 1)) / N);
  const nameF = Math.round(Math.min(32, Math.max(20, rowH * 0.33)));
  const moneyF = Math.round(nameF * 0.92);
  const waveTotal = 1100;


  return (
    <div className="relative h-full flex flex-col px-6 pt-10 pb-6 overflow-hidden">
      <style>{`@keyframes mwRowIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* header: title + teaching stats */}
      <div className="flex items-baseline gap-5 mb-4 flex-wrap flex-shrink-0">
        <h1 className="text-4xl font-black whitespace-nowrap" style={{ color: '#FCD34D' }}>🏆 FINAL STANDINGS</h1>
        <div className="flex items-baseline gap-5 text-lg font-bold ml-auto whitespace-nowrap">
          <span style={{ color: '#22c55e' }}>🟢 {greenCount} up</span>
          <span style={{ color: '#ef4444' }}>🔴 {redCount} down</span>
          <span style={{ color: 'rgba(255,255,255,0.82)' }}>📊 Avg {fmtPct(avg)}</span>
          <span style={{ color: 'rgba(255,255,255,0.82)' }}>↑ {fmtPct(maxRet)}</span>
          <span style={{ color: 'rgba(255,255,255,0.82)' }}>↓ {fmtPct(minRet)}</span>
        </div>
      </div>

      {/* rows */}
      <div ref={areaRef} className="flex-1 min-h-0 flex flex-col" style={{ gap }}>
        {sortedPlayers.map((p, i) => {
          const money = parseFloat(p.money) || 0;
          const profit = money >= STARTING_MONEY;
          const top3 = i < 3;
          const col = top3 ? rankColors[i] : '#fff';
          const fillPct = (money / maxMoney) * 100;
          const fillBg = top3
            ? `linear-gradient(90deg, ${rankColors[i]}33, rgba(var(--mw-rose-rgb),0.18))`
            : profit
              ? 'linear-gradient(90deg, rgba(34,197,94,0.20), rgba(var(--mw-violet-rgb),0.14))'
              : 'linear-gradient(90deg, rgba(239,68,68,0.20), rgba(239,68,68,0.06))';
          return (
            <div key={p.id} style={{
              height: rowH, flexShrink: 0, position: 'relative', borderRadius: 14, overflow: 'hidden',
              background: 'rgba(255,255,255,0.035)',
              border: `1px solid ${top3 ? rankColors[i] : profit ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.26)'}`,
              boxShadow: top3 ? `0 0 16px ${medalGlow[i]}` : 'none',
              animation: doAnim ? 'mwRowIn 0.45s ease-out both' : 'none',
              animationDelay: doAnim ? `${(i * (waveTotal / Math.max(1, N))).toFixed(0)}ms` : '0ms',
            }}>
              {/* money bar fill */}
              <div style={{ position: 'absolute', inset: 0, width: `${fillPct}%`, borderRadius: 14, background: fillBg }} />
              {/* content */}
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px' }}>
                <span style={{ width: 52, textAlign: 'center', flexShrink: 0, fontWeight: 700,
                  fontSize: top3 ? Math.round(rowH * 0.46) : Math.round(rowH * 0.36), color: top3 ? rankColors[i] : 'rgba(255,255,255,0.5)' }}>
                  {top3 ? medals[i] : `#${i + 1}`}
                </span>
                <span style={{ fontSize: nameF, fontWeight: 700, color: col, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '0 1 auto' }}>
                  {p.name}
                </span>
                <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: Math.round(nameF * 0.62), fontWeight: 700, color: profit ? '#22c55e' : '#ef4444', letterSpacing: 0.3 }}>
                  {profit ? '▲' : '▼'} {fmtPct(retOf(p))}
                </span>
                <span style={{ flexShrink: 0, fontSize: moneyF, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums', minWidth: 160, textAlign: 'right' }}>
                  ฿{money.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
