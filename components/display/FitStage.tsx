// FILE: components/display/FitStage.tsx — Fixed 1280×720 canvas scaled to fit any viewport (letterbox)
// VERSION: YG-V2 — replaces CSS zoom (which overflowed on non-16:9 screens; content fell below the fold)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V2 fit-to-screen scale
'use client';

import type { ReactNode } from 'react';

export const STAGE_W = 1280;
export const STAGE_H = 720;

/**
 * Centers a fixed STAGE_W×STAGE_H design box in the viewport and scales it with
 * transform:scale(scale) so it always fits — no overflow, no scroll, any aspect ratio.
 * `scale` is computed once in the display page: min(innerWidth/1280, innerHeight/720).
 */
export default function FitStage({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-base overflow-hidden grid place-items-center">
      <div
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flex: '0 0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
