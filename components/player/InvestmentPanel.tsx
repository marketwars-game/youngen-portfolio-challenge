// FILE: components/player/InvestmentPanel.tsx — Team allocation UI (asset classes)
// VERSION: YG-V3 — crypto 20% cap removed (cap machinery retained, generic; none capped) + submit is FINAL (Edit button removed)
//   • Renders the asset classes available THIS challenge (getAvailableAssets(round)) — progressive unlock
//   • Per-asset cap clamp (generic via getAssetCap; renders + clamps only when an asset defines a cap — none as of YG-V3)
//   • Weights must total EXACTLY 100% before submit (no leftover-cash; Cash is its own asset)
//   • YG-V3: once submitted, allocation is locked — no re-edit (submitted state resets next round on remount)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V3 cap removed

'use client';

import { useState } from 'react';
import { getAvailableAssets, getAssetCap, ALLOCATION_STEP } from '@/lib/constants';

// ========== Types ==========

interface InvestmentPanelProps {
  playerId: string;
  roomId: string;
  round: number;
  money: number;
  currentPortfolio: Record<string, number>;
  isRebalance?: boolean;
  onSubmitted?: () => void;
}

type Asset = ReturnType<typeof getAvailableAssets>[number];

// ========== Sub-components ==========

function RiskBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    'Very Low': '#22C55E',
    Low: '#4ADE80',
    Medium: '#F59E0B',
    'Medium-High': '#F97316',
    High: '#EF4444',
    'Very High': '#DC2626',
  };
  const c = colors[risk] || '#666';
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ color: c, backgroundColor: `${c}20`, border: `1px solid ${c}40` }}
    >
      {risk}
    </span>
  );
}

function PortfolioBar({ allocations, assets }: { allocations: Record<string, number>; assets: readonly Asset[] }) {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remaining = 100 - total;

  return (
    <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: '#ffffff10' }}>
      {assets.map((c) =>
        allocations[c.id] > 0 ? (
          <div
            key={c.id}
            className="h-full transition-all duration-300"
            style={{ width: `${allocations[c.id]}%`, backgroundColor: c.color }}
          />
        ) : null
      )}
      {remaining > 0 && (
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${remaining}%`, backgroundColor: '#ffffff15' }}
        />
      )}
    </div>
  );
}

// ========== Main Component ==========

export default function InvestmentPanel({
  playerId,
  roomId,
  round,
  money,
  currentPortfolio,
  isRebalance = false,
  onSubmitted,
}: InvestmentPanelProps) {
  // Assets selectable in THIS challenge (progressive unlock)
  const assets = getAvailableAssets(round);

  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    assets.forEach((c) => {
      initial[c.id] = currentPortfolio[c.id] || 0;
    });
    return initial;
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const total = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remaining = 100 - total;
  const isComplete = total === 100;

  // Adjust allocation for an asset — respects per-asset cap and the 100% ceiling
  const adjust = (id: string, delta: number) => {
    if (submitted) return;
    const current = allocations[id] || 0;
    const cap = getAssetCap(id) ?? 100;
    let newVal = Math.max(0, Math.min(cap, current + delta));
    const newTotal = total - current + newVal;
    if (newTotal > 100) {
      newVal = Math.max(0, Math.min(cap, current + (100 - total)));
    }
    setAllocations({ ...allocations, [id]: newVal });
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/players/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: playerId,
          room_id: roomId,
          portfolio: allocations,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit');
        return;
      }

      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError('Network error — try again');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== Submitted state ==========
  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-center mb-4 pt-2">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
            style={{ background: 'var(--mw-violet)20', border: '1px solid var(--mw-violet)40' }}
          >
            <span className="text-lg">✓</span>
            <span className="text-sm font-mono font-bold" style={{ color: 'var(--mw-violet)' }}>
              SUBMITTED
            </span>
          </div>
          <p className="text-sm" style={{ color: '#ffffff60' }}>
            Waiting for the facilitator to continue...
          </p>
        </div>

        <div className="rounded-xl p-3 mb-4" style={{ background: '#ffffff05', border: '1px solid #ffffff10' }}>
          <PortfolioBar allocations={allocations} assets={assets} />
          <div className="mt-3 space-y-1.5">
            {assets.map((c) =>
              allocations[c.id] > 0 ? (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-xs text-white">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: c.color }}>
                      {allocations[c.id]}%
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>
                      ฿{Math.round((allocations[c.id] / 100) * money).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div
          className="w-full py-3 rounded-lg font-mono text-xs tracking-wider text-center"
          style={{ background: '#ffffff08', color: '#ffffff45', border: '1px solid #ffffff10' }}
        >
          🔒 Allocation locked
        </div>
      </div>
    );
  }

  // ========== Editing state ==========
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-3 pt-2">
        <span
          className="text-xs font-mono tracking-wider px-3 py-1 rounded-full"
          style={{ background: 'var(--mw-rose)15', border: '1px solid var(--mw-rose)30', color: 'var(--mw-rose)' }}
        >
          {isRebalance ? 'REBALANCE' : 'ALLOCATION'}
        </span>
        <h2 className="text-lg font-bold text-white mt-2">Allocate Your Portfolio</h2>
        <p className="text-xs mt-1" style={{ color: '#ffffff50' }}>
          Weights must total exactly 100%
        </p>
      </div>

      {/* Portfolio summary bar */}
      <div className="rounded-xl p-3 mb-3" style={{ background: 'var(--mw-rose)08', border: '1px solid var(--mw-rose)20' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono" style={{ color: '#ffffff60' }}>
            PORTFOLIO
          </span>
          <span className="text-xs font-mono" style={{ color: isComplete ? 'var(--mw-violet)' : '#F59E0B' }}>
            {isComplete ? '✓ 100% allocated' : `${remaining}% left`}
          </span>
        </div>
        <PortfolioBar allocations={allocations} assets={assets} />
        <div className="flex justify-between mt-2">
          <span className="text-xs font-mono" style={{ color: '#ffffff40' }}>
            ฿{money.toLocaleString()}
          </span>
          <span className="text-sm font-bold font-mono text-white">
            {total}%
            <span className="text-xs ml-1" style={{ color: '#ffffff40' }}>
              allocated
            </span>
          </span>
        </div>
      </div>

      {/* Asset cards */}
      <div className="space-y-2 flex-1 overflow-y-auto pb-2" style={{ maxHeight: 'calc(100vh - 340px)' }}>
        {assets.map((c) => {
          const cap = getAssetCap(c.id);
          const atCap = cap !== undefined && allocations[c.id] >= cap;
          return (
            <div
              key={c.id}
              className="rounded-xl p-3 transition-all duration-300"
              style={{
                background: allocations[c.id] > 0 ? `${c.color}08` : '#ffffff05',
                border: `1px solid ${allocations[c.id] > 0 ? `${c.color}30` : '#ffffff10'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-white block truncate">{c.name}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <RiskBadge risk={c.risk} />
                    {cap !== undefined && (
                      <span className="text-xs" style={{ color: '#ffffff40' }}>
                        · max {cap}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjust(c.id, -ALLOCATION_STEP)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all active:scale-90"
                    style={{ background: '#ffffff10', color: allocations[c.id] > 0 ? '#ffffff' : '#ffffff20' }}
                  >
                    −
                  </button>
                  <div
                    className="w-14 h-9 rounded-lg flex items-center justify-center font-bold font-mono text-sm"
                    style={{
                      background: allocations[c.id] > 0 ? `${c.color}20` : '#ffffff08',
                      color: allocations[c.id] > 0 ? c.color : '#ffffff30',
                      border: `1px solid ${allocations[c.id] > 0 ? `${c.color}40` : '#ffffff10'}`,
                    }}
                  >
                    {allocations[c.id]}%
                  </div>
                  <button
                    onClick={() => adjust(c.id, ALLOCATION_STEP)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all active:scale-90"
                    style={{ background: '#ffffff10', color: remaining > 0 && !atCap ? '#ffffff' : '#ffffff20' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {allocations[c.id] > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: '#ffffff10' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${allocations[c.id]}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <span className="text-xs font-mono" style={{ color: c.color }}>
                    ฿{Math.round((allocations[c.id] / 100) * money).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div
          className="rounded-lg p-2 mb-2 text-center text-xs"
          style={{ background: '#EF444420', color: '#EF4444', border: '1px solid #EF444440' }}
        >
          {error}
        </div>
      )}

      {/* Confirm button — enabled only at exactly 100% */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !isComplete}
        className="w-full py-4 rounded-lg font-bold text-base tracking-wider font-mono mt-2 transition-all duration-300"
        style={{
          background: isComplete ? 'linear-gradient(135deg, var(--mw-violet), var(--mw-rose))' : '#ffffff10',
          color: isComplete ? 'var(--mw-base)' : '#ffffff30',
          boxShadow: isComplete ? '0 0 30px var(--mw-violet)30' : 'none',
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting
          ? '⏳ SUBMITTING...'
          : isComplete
            ? 'CONFIRM PORTFOLIO →'
            : `Allocate ${remaining}% more`}
      </button>
    </div>
  );
}
