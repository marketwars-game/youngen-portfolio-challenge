// FILE: components/display/FinalRanking.tsx — Final step ② Full ranking (real teams only)
// VERSION: YG-V5 — remove benchmark ghosts + Smart Diversifier badge; keep 🎯/🧺 strategy tags
// LAST MODIFIED: 03 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V5 real-teams-only
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
const medalGlow = ['rgba(255,215,0,0.55)', 'rgba(192,192,192,0.5)', 'rgba(205,127,50,0.5)'];
const medals = ['🥇', '🥈', '🥉'];

export default function FinalRanking({ players, animate }: FinalRankingProps) {
  const [doAnim] = useState(animate);
  const boxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const view = useMemo(() => {
    const sortedPlayers = [...players].sort(compareForRank);
    const n = sortedPlayers.length;

    const greenCount = sortedPlayers.filter((p) => (parseFloat(p.money) || 0) >= STARTING_MONEY).length;
    const redCount = n - greenCount;
    const rets = sortedPlayers.map(retOf);
    const avg = n ? rets.reduce((a, b) => a + b, 0) / n : 0;
    const maxRet = n ? Math.max(...rets) : 0;
    const minRet = n ? Math.min(...rets) : 0;

    const stratOf: Record<string, Strat> = {};
    sortedPlayers.forEach((p) => { stratOf[p.id] = classifyStrategy(p); });

    const cols = Math.min(n <= 10 ? 3 : n <= 24 ? 4 : n <= 48 ? 6 : n <= 80 ? 8 : 10, Math.max(1, n));

    return { sortedPlayers, n, greenCount, redCount, avg, maxRet, minRet, stratOf, cols };
  }, [players]);

  const { sortedPlayers, n, greenCount, redCount, avg, maxRet, minRet, stratOf, cols } = view;

  // scale-to-fit height — ให้ทุกคนอยู่ครบเสมอ (ทำงานทับ CSS zoom ของ display page ได้ เพราะวัดเป็น px จริง)
  useEffect(() => {
    const fit = () => {
      const box = boxRef.current, g = gridRef.current;
      if (!box || !g) return;
      const avail = box.clientHeight;
      const natural = g.scrollHeight; // ไม่ได้รับผลจาก transform → เป็นความสูงเต็มเสมอ
      const s = natural > avail && natural > 0 ? Math.max(0.5, avail / natural) : 1;
      setScale(s);
    };
    const raf = requestAnimationFrame(fit);
    const t = setTimeout(fit, 150); // เผื่อ emoji/ฟอนต์โหลดเสร็จ
    window.addEventListener('resize', fit);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener('resize', fit); };
  }, [sortedPlayers, cols]);

  const waveTotal = 1100;
  const stEmoji = (s: Strat) => (s === 'allin' ? '🎯' : s === 'div' ? '🧺' : '');
  const cellBg = (i: number, profit: boolean) =>
    i === 0 ? 'linear-gradient(180deg,rgba(255,215,0,0.16),var(--mw-surface))' :
    i === 1 ? 'linear-gradient(180deg,rgba(192,192,192,0.11),var(--mw-surface))' :
    i === 2 ? 'linear-gradient(180deg,rgba(205,127,50,0.13),var(--mw-surface))' :
    profit ? 'rgba(34,197,94,0.09)' : 'rgba(239,68,68,0.09)';
  const cellBorder = (profit: boolean) => (profit ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.26)');

  return (
    <div className="relative h-screen flex flex-col px-6 pt-12 pb-6 overflow-hidden">
      <style>{`@keyframes mwCellIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* header: title + teaching stats บรรทัดเดียว */}
      <div className="flex items-baseline gap-5 mb-3 flex-wrap">
        <h1 className="text-4xl font-black whitespace-nowrap" style={{ color: '#FCD34D' }}>🏆 อันดับสุดท้าย · FINAL STANDINGS</h1>
        <div className="flex items-baseline gap-5 text-lg font-bold ml-auto whitespace-nowrap">
          <span style={{ color: '#22c55e' }}>🟢 กำไร {greenCount}</span>
          <span style={{ color: '#ef4444' }}>🔴 ขาดทุน {redCount}</span>
          <span style={{ color: 'rgba(255,255,255,0.82)' }}>📊 เฉลี่ย {fmtPct(avg)}</span>
          <span style={{ color: 'rgba(255,255,255,0.82)' }}>↑ {fmtPct(maxRet)}</span>
          <span style={{ color: 'rgba(255,255,255,0.82)' }}>↓ {fmtPct(minRet)}</span>
        </div>
      </div>

      {/* grid (measured) — scale เพื่อ fit ความสูง ให้ทุกคนอยู่ครบ */}
      <div ref={boxRef} className="flex-1 overflow-hidden">
        <div ref={gridRef} className="grid gap-2 content-start"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          {sortedPlayers.map((p, i) => {
            const money = parseFloat(p.money) || 0;
            const profit = money >= STARTING_MONEY;
            const s = stratOf[p.id];

            const border = i < 3 ? `1.5px solid ${rankColors[i]}` : `1px solid ${cellBorder(profit)}`;
            const boxShadow = i < 3 ? `0 0 15px ${medalGlow[i]}` : 'none';

            return (
              <div key={p.id} className="rounded-lg px-3 py-2 flex flex-col justify-center gap-0.5"
                style={{
                  background: cellBg(i, profit),
                  border,
                  boxShadow,
                  animation: doAnim ? 'mwCellIn 0.4s ease-out both' : 'none',
                  animationDelay: doAnim ? `${(i * (waveTotal / Math.max(1, n))).toFixed(0)}ms` : '0ms',
                }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold flex-shrink-0" style={{ fontSize: i < 3 ? '1.15rem' : '0.95rem', color: i < 3 ? rankColors[i] : 'rgba(255,255,255,0.5)' }}>
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span className="flex-1 min-w-0 font-bold text-lg truncate" style={{ color: i < 3 ? rankColors[i] : '#fff' }}>{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s && <span style={{ fontSize: '0.95rem' }}>{stEmoji(s)}</span>}
                  <span className="font-semibold" style={{ fontSize: '0.95rem', color: profit ? '#22c55e' : '#ef4444', letterSpacing: '0.3px' }}>
                    {profit ? '▲' : '▼'} {fmtPct(retOf(p))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* legend */}
      <div className="mt-2 text-center" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
        🎯 ทุ่มกระจุก · 🧺 กระจาย
      </div>
    </div>
  );
}
