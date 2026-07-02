// FILE: components/display/EventDisplay.tsx — Display Event + Event Result
// VERSION: YG-V3 — filter to unlocked assets (no phantom 0% oil/crypto on locked challenges) + EN-only pass
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V3 unlock filter + EN
'use client';

import { EVENTS, RETURN_TABLE, getAvailableAssets } from '@/lib/constants';
import AnimatedBackdrop from '@/components/display/AnimatedBackdrop';

interface EventDisplayProps {
  round: number;
  phase: 'event' | 'event_result' | 'golden_deal';
  players: any[];
}

export default function EventDisplay({ round, phase, players }: EventDisplayProps) {

  // === Event Reveal — full-screen dramatic + radial glow ===
  if (phase === 'event' && EVENTS[round - 1]) {
    const ev = EVENTS[round - 1];
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <AnimatedBackdrop accent="#FF6B6B" accent2="#FF6B6B" />
        <style>{`
          @keyframes evFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes evPop { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
          .ev-anim { opacity: 0; animation: evFade 0.6s ease-out forwards; }
          .ev-pop { opacity: 0; animation: evPop 0.55s ease-out forwards; }
        `}</style>

        <div className="text-center z-10 px-12 max-w-3xl w-full">
          {ev.image ? (
            <img src={ev.image} alt={ev.title} className="ev-pop w-full rounded-2xl mb-6 max-h-64 object-cover mx-auto" style={{ maxWidth: '520px', animationDelay: '0.25s' }} />
          ) : (
            <div className="ev-pop mb-6" style={{ fontSize: '10rem', lineHeight: 1, animationDelay: '0.25s' }}>{ev.emoji}</div>
          )}
          <h3 className="ev-anim text-5xl font-black mb-5" style={{ color: '#FF6B6B', animationDelay: '0.6s' }}>{ev.title}</h3>
          <p className="ev-anim text-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)', animationDelay: '0.9s' }}>{ev.description}</p>
          <div className="ev-anim mt-8 inline-block px-6 py-2 rounded-full text-base font-semibold" style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.35)', color: '#FF6B6B', animationDelay: '1.2s' }}>
            Watch the impact →
          </div>
        </div>
      </div>
    );
  }

  // === Event Result — large news bar + returns grid (unlocked assets only) ===
  if (phase === 'event_result' && EVENTS[round - 1]) {
    const ev = EVENTS[round - 1];
    return (
      <div className="w-full h-full flex flex-col">
        {/* News bar */}
        <div className="flex items-center gap-4 px-8 py-5 flex-shrink-0" style={{ background: 'var(--mw-surface)', borderBottom: '2px solid rgba(255,107,107,0.3)' }}>
          <span className="text-4xl flex-shrink-0">{ev.emoji}</span>
          <div>
            <div className="text-2xl font-bold mb-1" style={{ color: '#FF6B6B' }}>{ev.title}</div>
            <div className="text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>{ev.description}</div>
          </div>
        </div>

        {/* Grid 3x2 */}
        <div className="flex-1 flex items-center justify-center px-8">
          <style>{`@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } .return-card { opacity: 0; animation: fadeSlideUp 0.4s ease-out forwards; }`}</style>
          <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
            {/* YG-V3: show ONLY assets unlocked this challenge — locked oil/crypto no longer render as phantom 0% cards */}
            {getAvailableAssets(round).map((c, i) => {
              const returnPct = RETURN_TABLE[c.id]?.[round - 1] || 0;
              const isPositive = returnPct >= 0;
              return (
                <div key={c.id} className="return-card rounded-xl p-5 text-center" style={{ animationDelay: `${i * 0.2}s`, background: 'var(--mw-base)', borderTop: `3px solid ${c.color}`, border: `1px solid rgba(255,255,255,0.06)`, borderTopColor: c.color, borderTopWidth: '3px' }}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="text-sm font-semibold mb-2" style={{ color: c.color }}>{c.name}</div>
                  <div className="text-4xl font-bold font-mono" style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
                    {isPositive ? '+' : ''}{returnPct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // === Golden Deal ===
  if (phase === 'golden_deal') {
    return (
      <div className="w-full h-full flex items-center justify-center px-8">
        <div className="text-center">
          <div className="text-8xl mb-6">⭐</div>
          <h3 className="text-5xl font-black mb-4" style={{ color: '#FFD700' }}>Golden Deal!</h3>
          <p className="text-2xl" style={{ color: 'rgba(255,255,255,0.75)' }}>A special opportunity this challenge</p>
        </div>
      </div>
    );
  }

  return null;
}
