// FILE: components/display/LobbyDisplay.tsx — Display lobby (QR + joined players)
// VERSION: YG-V2 — fit-to-screen (rendered inside FitStage 1280×720); retire CSS zoom
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme | YG-V2 fit-to-screen
'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import AnimatedBackdrop from '@/components/display/AnimatedBackdrop';

export default function LobbyDisplay({ players, roomId, joinUrl }: { players: any[]; roomId: string; joinUrl: string }) {
  const [qrOpen, setQrOpen] = useState(false);
  return (
    <div className="w-full h-full bg-base text-white overflow-hidden relative">
      <AnimatedBackdrop accent="var(--mw-violet)" accent2="var(--mw-rose)" />

      <div className="relative z-10 h-full flex items-center">
        {/* Left: QR */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center px-12 h-full" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="bg-white rounded-2xl p-4 cursor-pointer mb-5"
            onClick={() => setQrOpen(true)}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            style={{ transition: 'opacity 0.2s' }}
          >
            {joinUrl && <QRCodeSVG value={joinUrl} size={210} />}
            <p className="text-center text-xs text-gray-400 mt-2">Tap to enlarge</p>
          </div>
          <p className="text-3xl font-bold font-mono tracking-[10px] mb-2" style={{ color: 'var(--mw-rose)' }}>{roomId}</p>
          <p className="text-base mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Scan the QR or enter the room code</p>
          <p className="text-base font-semibold" style={{ color: 'var(--mw-rose)' }}>bit.ly/marketwars</p>
        </div>

        <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Right: Title + Players */}
        <div className="flex-1 flex flex-col justify-between px-12 py-10 h-full">
          <div>
            <h1 className="font-black tracking-widest leading-tight mb-2" style={{ fontSize: '56px', fontFamily: 'monospace' }}>
              <span style={{ color: 'var(--mw-violet)' }}>MARKET</span>{' '}
              <span style={{ color: 'var(--mw-rose)' }}>WARS</span>
            </h1>
            <p className="text-xl font-extrabold tracking-[4px]" style={{ color: 'rgba(255,255,255,0.82)' }}>PORTFOLIO CHALLENGE</p>
            <p className="text-sm tracking-[2px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>KKP YoungGen Edition</p>
            <div className="mt-3 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, var(--mw-violet), var(--mw-rose))' }} />
          </div>
          <div>
            <p className="text-sm tracking-[3px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>PLAYERS JOINED</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {players.map((p) => (
                <span key={p.id} className="px-4 py-2 rounded-full text-lg font-semibold" style={{ background: 'rgba(var(--mw-violet-rgb),0.1)', border: '1px solid rgba(var(--mw-violet-rgb),0.3)', color: 'var(--mw-violet)' }}>
                  {p.name}
                </span>
              ))}
              {players.length === 0 && <p className="text-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>Waiting for teams to join...</p>}
            </div>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>{players.length} players joined</p>
          </div>
        </div>
      </div>

      {/* QR Popup */}
      {qrOpen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 cursor-pointer" style={{ background: 'rgba(0,0,0,0.88)', zIndex: 50 }} onClick={() => setQrOpen(false)}>
          <div className="bg-white rounded-2xl p-6">
            {joinUrl && <QRCodeSVG value={joinUrl} size={320} />}
          </div>
          <p className="text-4xl font-bold font-mono tracking-[12px]" style={{ color: 'var(--mw-rose)' }}>{roomId}</p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--mw-rose)' }}>bit.ly/marketwars</p>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>Tap anywhere to close</p>
        </div>
      )}
    </div>
  );
}
