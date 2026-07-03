// FILE: components/display/FinalRanking.tsx — Final step ② Full ranking (real teams only)
// VERSION: YG-V6 — 4–8 team rows + money bar + medals + 🎯/🧺 + return% + money; h-full (fit FitStage 720, was h-screen→overflow on >720 viewport); EN
// LAST MODIFIED: 03 Jul 2026
// HISTORY: B1..B20 (kids-camp lineage: scale-to-fit grid for ~70) | YG-V0 fork | YG-V5 real-teams-only | YG-V6 EN + rows rework for few teams
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { compareForRank } from '@/lib/ranking';
import { STARTING_MONEY, COMPANIES } from '@/lib/constants';

interface FinalRankingProps {
  players: any[];
  animate: boolean;
}

type Strat = 'allin' | 'div' | 'mix';

// เกณฑ์จำแนกกลยุทธ์ (mirror lib/awards.ts roundIsDiversified + เพิ่ม all-in)
const ALLIN_SINGLE_PCT = 90;   // ทุ่ม ≥90% กลุ่มเดียว = กระจุก/all-in รอบนั้น
const DIV_MIN_SECTORS = 3;
const DIV_MAX_SINGLE_PCT = 70;

const fmtPct = (v: number) => (v >= 0 ? '+' : '') + Math.round(v) + '%';
const retOf = (p: any) => ((parseFloat(p.money) || 0) - STARTING_MONEY) / STARTING_MONEY * 100;

function classifyStrategy(player: any): Strat {
  const rr = player?.round_returns || {};
  let played = 0, conc = 0, divr = 0;
  for (const key of Object.keys(rr)) {
    const pf = rr[key]?.portfolio_used;
    if (!pf) continue;
    const vals = (COMPANIES as any[]).map((c) => parseFloat(pf[c.id]) || 0);
    const maxAlloc = Math.max(...vals, 0);
    if (maxAlloc <= 0) continue; // ไม่ได้ลงทุนรอบนี้
    played++;
    const sectorCount = vals.filter((v) => v > 0).length;
    if (maxAlloc >= ALLIN_SINGLE_PCT) conc++;
    if (sectorCount >= DIV_MIN_SECTORS && maxAlloc <= DIV_MAX_SINGLE_PCT) divr++;
  }
  if (played === 0) return 'mix';
  if (conc * 2 > played) return 'allin';
  if (divr * 2 > played) return 'div';
  return 'mix';
}

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
    const stratOf: Record<string, Strat> = {};
    sortedPlayers.forEach((p) => { stratOf[p.id] = classifyStrategy(p); });
    return { sortedPlayers, n, greenCount, redCount, avg, maxRet, minRet, maxMoney, stratOf };
  }, [players]);

  const { sortedPlayers, n, greenCount, redCount, avg, maxRet, minRet, maxMoney, stratOf } = view;

  const N = Math.max(1, n);
  const gap = Math.max(8, Math.min(16, (areaH / N) * 0.14));
  const rowH = Math.max(40, (areaH - gap * (N - 1)) / N);
  const nameF = Math.round(Math.min(32, Math.max(20, rowH * 0.33)));
  const moneyF = Math.round(nameF * 0.92);
  const waveTotal = 1100;

  const stChip = (s: Strat) => {
    if (s === 'allin') return { icon: '🎯', label: 'Concentrated', color: '#fbbf24', bg: 'rgba(245,158,11,0.16)' };
    if (s === 'div') return { icon: '🧺', label: 'Diversified', color: '#4ade80', bg: 'rgba(34,197,94,0.14)' };
    return null;
  };

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
          const chip = stChip(stratOf[p.id]);
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
                {chip && (
                  <span style={{ flexShrink: 0, fontSize: Math.round(nameF * 0.5), fontWeight: 700, padding: '3px 10px', borderRadius: 999, color: chip.color, background: chip.bg }}>
                    {chip.icon} {chip.label}
                  </span>
                )}
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

      {/* legend */}
      <div className="mt-3 text-center flex-shrink-0" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
        🎯 Concentrated · 🧺 Diversified
      </div>
    </div>
  );
}
