// FILE: components/display/LeaderboardDisplay.tsx — Display Leaderboard (spectator)
// VERSION: YG-V6 — 4–8 team layout: single-column big rows + money bar (fill ∝ leader), medals, movement, inline dark horse; EN; drop TOP8/#9+ split
// LAST MODIFIED: 03 Jul 2026
// HISTORY: B6..B19 (kids-camp: TOP8 racing + #9+ grid for ~70 players) | YG-V0 fork | YG-V6 rework for few teams (rows + bars, EN)
'use client';

import { useEffect, useRef, useState } from 'react';
import { compareForRank } from '@/lib/ranking';

interface LeaderboardDisplayProps {
  players: any[];
  round: number;
}

const HOLD_MS = 900;                       // freeze at previous-round positions before racing (synced w/ sfx_rankup in display/page)
const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#FFD700', '#E0E0E0', '#CD9B6A'];

export default function LeaderboardDisplay({ players, round }: LeaderboardDisplayProps) {
  const [settled, setSettled] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const [areaH, setAreaH] = useState(560);

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setAreaH(el.clientHeight || 560);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // current ranking (money desc via central comparator)
  const ranked = [...players].sort(compareForRank);
  const N = Math.max(1, ranked.length);
  const maxMoney = Math.max(1, ...ranked.map((p) => parseFloat(p.money) || 0));

  // previous-round rank index (by money_before) for movement + racing start
  const prevIndex: Record<string, number> = {};
  if (round > 1) {
    const prev = [...players].sort((a, b) => {
      const aB = a.round_returns?.[String(round)]?.money_before ?? parseFloat(a.money) ?? 0;
      const bB = b.round_returns?.[String(round)]?.money_before ?? parseFloat(b.money) ?? 0;
      return bB - aB;
    });
    prev.forEach((p, i) => { prevIndex[p.id] = i; });
  }
  const movementOf = (p: any, i: number) => (round <= 1 ? 0 : (prevIndex[p.id] ?? i) - i);

  // dark horse = biggest positive climb this round
  let darkHorse: any = null;
  let dhJump = 0;
  if (round > 1) {
    ranked.forEach((p, i) => {
      const m = movementOf(p, i);
      if (m > dhJump) { dhJump = m; darkHorse = p; }
    });
  }

  // responsive row sizing (fits 4–8 teams into measured height)
  const gap = Math.max(8, Math.min(16, (areaH / N) * 0.14));
  const rowH = Math.max(40, (areaH - gap * (N - 1)) / N);
  const nameF = Math.round(Math.min(34, Math.max(22, rowH * 0.34)));
  const moneyF = Math.round(nameF * 0.92);
  const rankF = Math.round(rowH * 0.40);

  const Arrow = ({ m, size }: { m: number; size: number }) => {
    if (round <= 1) return <span style={{ width: 64, textAlign: 'right', color: 'rgba(255,255,255,0.3)', fontSize: size }}>—</span>;
    const up = m > 0, flat = m === 0;
    return (
      <span style={{ width: 64, textAlign: 'right', fontWeight: 600, fontSize: size, whiteSpace: 'nowrap',
        color: flat ? 'rgba(255,255,255,0.3)' : up ? '#22c55e' : '#ef4444' }}>
        {flat ? '—' : up ? `▲${m}` : `▼${Math.abs(m)}`}
      </span>
    );
  };

  return (
    <div className="w-full h-full flex flex-col px-4 pt-2 overflow-hidden">
      <style>{`
        @keyframes lbPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } 35% { box-shadow: 0 0 26px 3px rgba(34,197,94,0.5); } 100% { box-shadow: 0 0 0 1.5px rgba(34,197,94,0.7); } }
        .lb-dh { animation: lbPulse 1.1s ease-out 0.9s both; }
      `}</style>

      {/* header */}
      <div className="flex items-baseline justify-between flex-shrink-0" style={{ padding: '4px 8px 12px' }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: 3,
          background: 'linear-gradient(90deg, var(--mw-violet), var(--mw-rose))',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LEADERBOARD
        </h1>
        <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: 1, color: 'rgba(255,255,255,0.55)' }}>
          After Challenge {round}
        </span>
      </div>

      {/* rows */}
      <div ref={areaRef} className="flex-1 min-h-0 relative" style={{ padding: '0 8px' }}>
        {ranked.map((p, i) => {
          const money = parseFloat(p.money) || 0;
          const m = movementOf(p, i);
          const top3 = i < 3;
          const col = top3 ? MEDAL_COLORS[i] : '#fff';
          const startIdx = round > 1 ? Math.min(N - 1, prevIndex[p.id] ?? i) : i;
          const y = (settled ? i : startIdx) * (rowH + gap);
          const isDH = !!darkHorse && darkHorse.id === p.id;
          const leader = i === 0;
          const fillPct = (money / maxMoney) * 100;
          const fillBg = leader
            ? 'linear-gradient(90deg, rgba(255,215,0,0.28), rgba(var(--mw-rose-rgb),0.22))'
            : 'linear-gradient(90deg, rgba(var(--mw-violet-rgb),0.30), rgba(var(--mw-rose-rgb),0.22))';
          return (
            <div
              key={p.id}
              className={isDH ? 'lb-dh' : ''}
              style={{
                position: 'absolute', left: 8, right: 8, height: rowH,
                transform: `translateY(${y}px)`,
                transition: 'transform 0.9s cubic-bezier(.34,1.4,.5,1)',
                borderRadius: 14, overflow: 'hidden',
                background: 'rgba(255,255,255,0.035)',
                border: `1px solid ${isDH ? 'rgba(34,197,94,0.6)' : leader ? 'rgba(255,215,0,0.45)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: leader && !isDH ? '0 0 0 1px rgba(255,215,0,0.25) inset' : 'none',
              }}
            >
              {/* money bar fill */}
              <div style={{
                position: 'absolute', inset: 0, width: settled ? `${fillPct}%` : '0%', borderRadius: 14,
                background: fillBg, transition: 'width 1.1s cubic-bezier(.4,0,.2,1) 0.2s',
              }} />
              {/* content */}
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px' }}>
                <span style={{ width: 52, textAlign: 'center', flexShrink: 0, fontWeight: 700,
                  fontSize: top3 ? Math.round(rowH * 0.5) : rankF, color: top3 ? MEDAL_COLORS[i] : 'rgba(255,255,255,0.5)' }}>
                  {top3 ? MEDALS[i] : i + 1}
                </span>
                {isDH && <span style={{ fontSize: Math.round(rowH * 0.4), flexShrink: 0 }}>🐎</span>}
                <span style={{ fontSize: nameF, fontWeight: 700, color: col, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '0 1 auto' }}>
                  {p.name}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: moneyF, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                  ฿{money.toLocaleString()}
                </span>
                {settled && <Arrow m={m} size={Math.round(nameF * 0.55)} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
