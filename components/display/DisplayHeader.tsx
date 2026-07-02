// FILE: components/display/DisplayHeader.tsx — Display top bar (phase progress + challenge)
// VERSION: YG-V1 — NextGen Royal re-theme (brand tokens) + EN "Challenge N / M" label
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme + EN label
'use client';

import { TOTAL_ROUNDS } from '@/lib/constants';
import { getStepGroupProgress } from '@/lib/game-engine';

type StepProgress = ReturnType<typeof getStepGroupProgress>;

export default function DisplayHeader({ steps, round }: { steps: StepProgress; round: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '2px solid rgba(var(--mw-violet-rgb),0.18)' }}>
      <span className="text-xl font-black tracking-wider" style={{ fontFamily: 'monospace', color: 'var(--mw-violet)' }}>MARKET WARS</span>
      <div className="flex items-center gap-0.5">
        {steps.map((step, i) => {
          const isCurrent = step.status === 'current';
          const isDone = step.status === 'done';
          return (
            <div key={step.id} className="flex items-center">
              <span className="px-3 py-1 rounded-full whitespace-nowrap font-semibold" style={{
                fontSize: isCurrent ? '15px' : '13px',
                color: isCurrent ? 'var(--mw-violet)' : isDone ? 'rgba(255,255,255,0.45)' : '#ffffff',
                background: isCurrent ? 'rgba(var(--mw-violet-rgb),0.15)' : 'transparent',
                border: isCurrent ? '1px solid rgba(var(--mw-violet-rgb),0.4)' : '1px solid transparent',
                textDecoration: isDone ? 'line-through' : 'none',
              }}>
                {step.icon} {step.label}
              </span>
              {i < steps.length - 1 && (
                <span className="mx-0.5 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-base font-bold px-4 py-1.5 rounded-full whitespace-nowrap" style={{ color: 'var(--mw-rose)', background: 'rgba(var(--mw-rose-rgb),0.12)' }}>
        Challenge {round} / {TOTAL_ROUNDS}
      </span>
    </div>
  );
}
