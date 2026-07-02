// FILE: components/debug/DebugPanel.tsx — fixed-corner debug overlay (perf test)
// VERSION: YG-V1 — NextGen Royal re-theme (brand tokens; kids-camp neon retired)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme
'use client';

import { useDebug } from '@/lib/debug';

type Corner = 'br' | 'bl' | 'tr' | 'tl';

const CORNERS: Record<Corner, React.CSSProperties> = {
  br: { bottom: 8, right: 8 },
  bl: { bottom: 8, left: 8 },
  tr: { top: 8, right: 8 },
  tl: { top: 8, left: 8 },
};

export default function DebugPanel({
  title,
  stats,
  pos = 'br',
}: {
  title: string;
  stats: Record<string, string | number>;
  pos?: Corner;
}) {
  const debug = useDebug();
  if (!debug) return null;
  return (
    <div
      style={{
        position: 'fixed',
        ...CORNERS[pos],
        zIndex: 9999,
        background: 'rgba(0,0,0,0.82)',
        color: '#7CFFC4',
        font: '11px/1.5 ui-monospace, monospace',
        padding: '8px 10px',
        borderRadius: 8,
        border: '1px solid rgba(var(--mw-violet-rgb),0.4)',
        minWidth: 180,
        maxWidth: 280,
        pointerEvents: 'none',
      }}
    >
      <div style={{ color: 'var(--mw-violet)', fontWeight: 700, marginBottom: 4 }}>🐞 {title}</div>
      {Object.entries(stats).map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>{k}</span>
          <span>{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
