// FILE: components/display/SoundGate.tsx — full-screen "tap to enable sound" gate
// VERSION: YG-V1 — NextGen Royal re-theme (brand tokens; kids-camp neon retired)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme
'use client';

export default function SoundGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div
      onClick={onUnlock}
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.82)', zIndex: 100 }}
    >
      <div style={{ fontSize: '64px' }}>🔊</div>
      <div className="text-3xl font-bold text-white text-center px-6">
        เปิดเสียงเพื่อเริ่ม <span style={{ color: 'rgba(255,255,255,0.55)' }}>·</span> Enable sound
      </div>
      <button
        onClick={onUnlock}
        className="animate-pulse text-xl font-semibold px-8 py-4 rounded-full"
        style={{ background: 'rgba(var(--mw-violet-rgb),0.12)', border: '1.5px solid var(--mw-violet)', color: 'var(--mw-violet)' }}
      >
        👆 แตะเพื่อเปิดเสียง · Tap for sound
      </button>
      <div className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Enable this before teams join
      </div>
    </div>
  );
}
