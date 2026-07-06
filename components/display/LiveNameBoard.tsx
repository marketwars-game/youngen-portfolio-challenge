// FILE: components/display/LiveNameBoard.tsx — Spectator wall (invest submit / reveal allocations)
// VERSION: YG-V6 — 4–8 team rows (invest ✓/waiting · reveal allocation bar + per-asset % labels + 🎯/🧺 + legend); drop tier/paginate; EN
// LAST MODIFIED: 03 Jul 2026
// HISTORY: B16b (grid wall for ~70 players) | YG-V4 mask invest + reveal variant + EN | YG-V6 rework for few teams (rows + big allocation bars)
'use client';

import { useEffect, useRef, useState } from 'react';
import { COMPANIES, getAvailableAssets, assetTextColor } from '@/lib/constants';

interface LiveNameBoardProps {
  players: any[];
  round: number;
  variant: 'invest' | 'reveal' | 'chance';
}

function sortByName(players: any[]) {
  return [...players].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' })
  );
}

function isSubmitted(p: any, round: number, variant: 'invest' | 'reveal' | 'chance') {
  return variant === 'chance'
    ? (p.duel_submitted_round || 0) >= round
    : p.portfolio_submitted_round === round;
}

function assetCount(portfolio: any) {
  return COMPANIES.reduce((n, c) => n + ((parseFloat(portfolio?.[c.id]) || 0) > 0 ? 1 : 0), 0);
}

export default function LiveNameBoard({ players, round, variant }: LiveNameBoardProps) {
  const sorted = sortByName(players);
  const N = Math.max(1, sorted.length);
  const submittedCount = sorted.filter((p) => isSubmitted(p, round, variant)).length;

  const areaRef = useRef<HTMLDivElement>(null);
  const [areaH, setAreaH] = useState(520);
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setAreaH(el.clientHeight || 520);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // "just submitted" pop animation — diff across throttled reloads
  const prevSubmitted = useRef<Set<string>>(new Set());
  const firstRun = useRef(true);
  const prevRound = useRef(round);
  const [justIds, setJustIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    const cur = new Set<string>(
      players.filter((p) => isSubmitted(p, round, variant)).map((p) => p.id)
    );
    if (prevRound.current !== round) {
      prevRound.current = round; prevSubmitted.current = cur; setJustIds(new Set()); return;
    }
    if (firstRun.current) { firstRun.current = false; prevSubmitted.current = cur; return; }
    const fresh = new Set<string>();
    cur.forEach((id) => { if (!prevSubmitted.current.has(id)) fresh.add(id); });
    prevSubmitted.current = cur;
    if (fresh.size) {
      setJustIds(fresh);
      const t = setTimeout(() => setJustIds(new Set()), 600);
      return () => clearTimeout(t);
    }
  }, [players, round, variant]);

  const gap = Math.max(9, Math.min(15, (areaH / N) * 0.13));
  const rowH = Math.max(38, (areaH - gap * (N - 1)) / N);
  const nameF = Math.round(Math.min(32, Math.max(20, rowH * 0.36)));
  const label = variant === 'chance' ? 'Opened' : variant === 'reveal' ? 'Allocations revealed' : 'Submitted';
  const showLegend = variant === 'reveal';

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      {/* count strip */}
      <div className="flex items-center justify-between flex-shrink-0" style={{ marginBottom: 10, padding: '0 4px' }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.62)', letterSpacing: 1 }}>{label}</span>
        <span>
          <span style={{ color: '#4ade80', fontSize: 32, fontWeight: 800 }}>{submittedCount}</span>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20 }}> / {N}</span>
        </span>
      </div>

      {/* rows */}
      <div ref={areaRef} className="flex-1 min-h-0 flex flex-col" style={{ gap }}>
        {sorted.map((p) => {
          const submitted = isSubmitted(p, round, variant);
          const just = justIds.has(p.id);
          const portfolio = p.portfolio || {};
          const na = assetCount(portfolio);
          const concentrated = na > 0 && na <= 2;
          const diversified = na >= 4;

          const segs = COMPANIES
            .map((c) => ({ color: c.color, pct: parseFloat(portfolio[c.id]) || 0 }))
            .filter((s) => s.pct > 0);

          return (
            <div
              key={p.id}
              style={{
                height: rowH, flexShrink: 0, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 20,
                padding: '0 24px', boxSizing: 'border-box',
                background: submitted ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${submitted ? 'rgba(var(--mw-violet-rgb),0.3)' : 'rgba(255,255,255,0.06)'}`,
                transform: just ? 'scale(1.015)' : 'scale(1)',
                transition: 'transform .25s ease, background .3s ease, border-color .5s ease',
              }}
            >
              <span style={{ fontSize: nameF, fontWeight: 700, color: submitted ? '#fff' : 'rgba(255,255,255,0.4)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                width: variant === 'reveal' ? 210 : undefined, flexShrink: 0 }}>
                {p.name}
              </span>

              {variant === 'invest' && (
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: Math.round(nameF * 0.9), fontWeight: 700 }}>
                  {submitted
                    ? <span style={{ color: 'var(--mw-violet)' }}>✓ Submitted</span>
                    : <><span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', animation: 'lnbBlink 1.1s ease-in-out infinite' }} /><span style={{ fontSize: Math.round(nameF * 0.7), fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Waiting…</span></>}
                </span>
              )}

              {variant === 'reveal' && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <div className="rounded-lg overflow-hidden flex" style={{ flex: 1, height: Math.round(rowH * 0.42), background: 'rgba(255,255,255,0.06)' }}>
                    {submitted && segs.map((s, i) => (
                      <div key={i} style={{ width: `${s.pct}%`, backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {s.pct >= 5 && <span style={{ fontSize: Math.max(11, Math.round(rowH * 0.17)), fontWeight: 700, color: assetTextColor(s.color), lineHeight: 1, whiteSpace: 'nowrap' }}>{s.pct}%</span>}
                      </div>
                    ))}
                  </div>
                  {submitted && concentrated && <span style={{ flexShrink: 0, fontSize: 14, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: '#fbbf24', background: 'rgba(245,158,11,0.16)' }}>🎯 Concentrated</span>}
                  {submitted && diversified && <span style={{ flexShrink: 0, fontSize: 14, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: '#4ade80', background: 'rgba(34,197,94,0.14)' }}>🧺 Diversified</span>}
                  {!submitted && <span style={{ flexShrink: 0, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>not submitted</span>}
                </div>
              )}

              {variant === 'chance' && (
                <span style={{ marginLeft: 'auto', fontSize: Math.round(nameF * 0.9), fontWeight: 700, color: 'var(--mw-violet)' }}>
                  {submitted ? '✓' : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes lnbBlink { 0%,100%{opacity:.25} 50%{opacity:1} }`}</style>

      {/* asset legend (reveal) */}
      {showLegend && (
        <div className="flex-shrink-0 flex flex-wrap items-center justify-center" style={{ gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {getAvailableAssets(round).map((c) => (
            <div key={c.id} className="flex items-center" style={{ gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: c.color, display: 'inline-block' }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
