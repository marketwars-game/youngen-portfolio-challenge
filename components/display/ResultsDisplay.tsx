// FILE: components/display/ResultsDisplay.tsx — Display results phase (this-round P&L)
// VERSION: YG-V6 — 4–8 team layout: diverging bars; amount in fixed right column (no clip); Best/Worst show only on real gain/loss (no ฿0); EN
// LAST MODIFIED: 03 Jul 2026
// HISTORY: B16a extracted | B16c A-Z heatmap grid (~70 players) | YG-V0 fork | YG-V6 diverging bars for few teams + fixed amount column (fit fix) + EN
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface ResultsDisplayProps {
  players: any[];
  round: number;
}

const FLAT = 150;        // |change| under this counts as ~flat
const UPDN = 120;        // gained/lost threshold for the summary count

// this-round change = stock return (round_returns[round].total_return) + chance card cash (dormant in YG → 0)
function changeOf(p: any, round: number): number {
  const stock = p.round_returns?.[String(round)]?.total_return || 0;
  const hasChance = (p.duel_submitted_round || 0) >= round;
  const chance = hasChance ? (parseFloat(p.duel_money_change) || 0) : 0;
  return stock + chance;
}

function fmt(v: number) {
  const s = v > 0 ? '+' : v < 0 ? '−' : '';
  return `${s}฿${Math.abs(v).toLocaleString()}`;
}

export default function ResultsDisplay({ players, round }: ResultsDisplayProps) {
  const [revealed, setRevealed] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const [areaH, setAreaH] = useState(520);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setAreaH(el.clientHeight || 520);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = useMemo(() => {
    const rows = players.map((p) => ({ id: p.id, name: p.name, chg: changeOf(p, round) }));
    const ordered = [...rows].sort((a, b) => b.chg - a.chg);   // this round: biggest gain → biggest loss
    const maxAbs = Math.max(800, ...rows.map((r) => Math.abs(r.chg)));
    const up = rows.filter((r) => r.chg > UPDN).length;
    const dn = rows.filter((r) => r.chg < -UPDN).length;
    const best = rows.reduce((a, b) => (b.chg > a.chg ? b : a), rows[0] || { name: '—', chg: 0 });
    const worst = rows.reduce((a, b) => (b.chg < a.chg ? b : a), rows[0] || { name: '—', chg: 0 });
    return { ordered, maxAbs, up, dn, best, worst, count: rows.length };
  }, [players, round]);

  const N = Math.max(1, data.count);
  const gap = Math.max(8, Math.min(16, (areaH / N) * 0.16));
  const rowH = Math.max(34, (areaH - gap * (N - 1)) / N);
  const nameF = Math.round(Math.min(26, Math.max(17, rowH * 0.34)));
  const amtF = Math.round(nameF * 0.9);

  const legendScale = ['rgba(34,197,94,0.85)', 'rgba(34,197,94,0.5)', 'rgba(34,197,94,0.22)', 'rgba(255,255,255,0.06)', 'rgba(239,68,68,0.24)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.85)'];

  return (
    <div className="w-full h-full flex flex-col px-4 pt-1 overflow-hidden">
      {/* summary — Best shows only when someone actually gained; Worst only when someone actually lost (no misleading ฿0) */}
      <div className="flex items-center flex-wrap gap-x-7 gap-y-1 mb-3 flex-shrink-0" style={{ fontSize: 18, padding: '0 6px' }}>
        <span style={{ color: '#22c55e' }}>▲ <b style={{ fontWeight: 500 }}>{data.up}</b> gained</span>
        <span style={{ color: '#ef4444' }}>▼ <b style={{ fontWeight: 500 }}>{data.dn}</b> lost</span>
        {(data.best.chg > 0 || data.worst.chg < 0) && <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>}
        {data.best.chg > 0 && (
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>🏆 Best: <b style={{ color: '#4ade80', fontWeight: 500 }}>{data.best.name} {fmt(data.best.chg)}</b></span>
        )}
        {data.worst.chg < 0 && (
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>💀 Worst: <b style={{ color: '#f87171', fontWeight: 500 }}>{data.worst.name} {fmt(data.worst.chg)}</b></span>
        )}
      </div>

      {/* diverging bars — name | track (center=0) | amount (fixed right column, never clips) */}
      <div ref={areaRef} className="flex-1 min-h-0 flex flex-col" style={{ gap, padding: '0 6px' }}>
        {data.ordered.map((r, i) => {
          const pos = r.chg >= 0;
          const flat = Math.abs(r.chg) < FLAT;
          const col = flat ? 'rgba(255,255,255,0.4)' : pos ? '#22c55e' : '#ef4444';
          const w = (Math.abs(r.chg) / data.maxAbs) * 44;   // % of half-track (cap < 50 so bar never touches amount column)
          return (
            <div key={r.id} style={{ height: rowH, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 180, flexShrink: 0, textAlign: 'right', fontWeight: 700, fontSize: nameF, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.name}
              </span>
              <div style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0 }}>
                {/* zero line */}
                <div style={{ position: 'absolute', left: '50%', top: '8%', bottom: '8%', width: 2, background: 'rgba(255,255,255,0.18)' }} />
                {/* bar */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)', height: '56%', borderRadius: 7,
                  background: col, [pos ? 'left' : 'right']: '50%',
                  width: revealed ? `${w}%` : '0%',
                  transition: 'width 0.7s cubic-bezier(.3,1,.4,1)', transitionDelay: `${i * 70}ms`,
                }} />
              </div>
              {/* amount — fixed right column, right-aligned */}
              <span style={{
                width: 168, flexShrink: 0, textAlign: 'right', fontSize: amtF, fontWeight: 700,
                fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: revealed ? col : 'rgba(255,255,255,0.25)',
                transition: 'color 0.5s ease', transitionDelay: `${i * 70}ms`,
              }}>
                {fmt(r.chg)}
              </span>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div className="flex items-center gap-2 mt-2 flex-shrink-0" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', padding: '0 6px' }}>
        <span>Big gain</span>
        <span style={{ display: 'flex', gap: 2 }}>
          {legendScale.map((c, i) => (<span key={i} style={{ width: 24, height: 12, background: c, borderRadius: 2 }} />))}
        </span>
        <span>Big loss</span>
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.65)' }}>📱 Check your result on your phone</span>
      </div>
    </div>
  );
}
