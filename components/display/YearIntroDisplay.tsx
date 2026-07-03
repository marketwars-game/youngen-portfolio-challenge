// FILE: components/display/YearIntroDisplay.tsx — Display challenge-intro splash (+ rejoin QR)
// VERSION: YG-V6 — "Y E A R" → "CHALLENGE"; EN fallback; rejoin QR corner card (multi-day: teams re-scan at each challenge brief)
// LAST MODIFIED: 03 Jul 2026
// HISTORY: B1..B20 (kids-camp lineage) | YG-V0 fork | YG-V1 re-theme | YG-V2 fit-to-screen | YG-V6 challenge wording + corner rejoin QR
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { STEP_GROUPS, YEAR_INTRO_TEXT } from '@/lib/constants';
import AnimatedBackdrop from '@/components/display/AnimatedBackdrop';

export default function YearIntroDisplay({ round, roomId, joinUrl }: { round: number; roomId?: string; joinUrl?: string }) {
  const introText = YEAR_INTRO_TEXT[round] || { title: `Challenge ${round}`, subtitle: 'Get ready — rebalance your portfolio.' };
  return (
    <div className="w-full h-full bg-base text-white flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatedBackdrop accent="var(--mw-violet)" accent2="var(--mw-rose)" />
      <div className="absolute font-black leading-none select-none pointer-events-none" style={{ fontSize: '320px', color: 'rgba(var(--mw-violet-rgb),0.05)', top: '50%', left: '50%', transform: 'translate(-50%,-55%)' }}>{round}</div>

      {/* Rejoin QR — corner card (shows at every challenge brief = start of each day for multi-day play) */}
      {roomId && joinUrl && (
        <div className="absolute z-20 flex flex-col items-center gap-[10px]" style={{ top: 34, right: 34, width: 238, padding: '18px 20px', borderRadius: 18, background: 'rgba(var(--mw-surface-rgb),0.72)', backdropFilter: 'blur(8px)', border: '1px solid var(--mw-border)', boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}>
          <span style={{ fontSize: 13, letterSpacing: 2.5, fontWeight: 700, color: 'var(--mw-rose)' }}>REJOIN YOUR TEAM</span>
          <div className="bg-white" style={{ borderRadius: 12, padding: 11 }}><QRCodeSVG value={joinUrl} size={150} /></div>
          <span className="font-mono" style={{ fontSize: 30, fontWeight: 700, letterSpacing: 8, color: 'var(--mw-rose)' }}>{roomId}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--mw-violet)' }}>bit.ly/portchallenge</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Scan · pick your team name</span>
        </div>
      )}

      <div className="text-center z-10">
        <p className="text-xl tracking-[8px] font-semibold mb-4" style={{ color: 'var(--mw-rose)' }}>C H A L L E N G E</p>
        <p className="font-black leading-none mb-6" style={{ color: 'var(--mw-violet)', fontSize: '160px' }}>{round}</p>
        <p className="text-4xl text-white font-bold mb-4">{introText.title}</p>
        <p className="text-2xl mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>{introText.subtitle}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {STEP_GROUPS.map((g) => (
            <span key={g.id} className="text-base px-4 py-2 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
              {g.icon} {g.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
