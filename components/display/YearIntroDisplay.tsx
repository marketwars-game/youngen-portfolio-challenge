// FILE: components/display/YearIntroDisplay.tsx — Display year-intro splash
// VERSION: YG-V2 — fit-to-screen (rendered inside FitStage 1280×720); retire CSS zoom
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V2 fit-to-screen
'use client';

import { STEP_GROUPS, YEAR_INTRO_TEXT } from '@/lib/constants';
import AnimatedBackdrop from '@/components/display/AnimatedBackdrop';

export default function YearIntroDisplay({ round }: { round: number }) {
  const introText = YEAR_INTRO_TEXT[round] || { title: `ปีที่ ${round} เริ่มแล้ว!`, subtitle: 'เตรียมตัวให้พร้อม' };
  return (
    <div className="w-full h-full bg-base text-white flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatedBackdrop accent="var(--mw-violet)" accent2="var(--mw-rose)" />
      <div className="absolute font-black leading-none select-none pointer-events-none" style={{ fontSize: '320px', color: 'rgba(var(--mw-violet-rgb),0.05)', top: '50%', left: '50%', transform: 'translate(-50%,-55%)' }}>{round}</div>
      <div className="text-center z-10">
        <p className="text-xl tracking-[8px] font-semibold mb-4" style={{ color: 'var(--mw-rose)' }}>Y E A R</p>
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
