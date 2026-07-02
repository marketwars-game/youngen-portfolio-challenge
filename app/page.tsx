// FILE: app/page.tsx — Join screen (first screen a team sees)
// VERSION: YG-V1 — NextGen Royal re-theme + EN wording + MARKET WARS lockup (Portfolio Challenge / KKP YoungGen Edition)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 re-theme + EN + word-mark lockup
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// ============================================================
// Join Screen — the first screen a team sees.
// Two entry paths:
//   1. Type the URL directly → enter Room Code + team name
//   2. Scan the QR → URL has ?room=XXXX → auto-fills Room Code
// ============================================================

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');

  // If ?room=XXXX is in the URL → auto-fill
  useEffect(() => {
    const roomFromUrl = searchParams.get('room');
    if (roomFromUrl) {
      setRoomCode(roomFromUrl.toUpperCase());
    }
  }, [searchParams]);

  // Core function — calls the join API
  const callJoinAPI = async (forceReconnect: boolean) => {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        room_id: roomCode.trim().toUpperCase(),
        force_reconnect: forceReconnect,
      }),
    });

    const data = await res.json();
    return { res, data };
  };

  // Joined successfully → save to localStorage + redirect
  const onJoinSuccess = (data: { player: { id: string; name: string }; room: { id: string } }) => {
    localStorage.setItem(
      `mw_player_${data.room.id}`,
      JSON.stringify({
        id: data.player.id,
        name: data.player.name,
        room_id: data.room.id,
      })
    );
    router.push(`/play/${data.room.id}`);
  };

  const handleJoin = async () => {
    setError('');
    setShowDuplicatePopup(false);

    // Basic validation
    if (!name.trim()) {
      setError('Enter your team name first!');
      return;
    }
    if (!roomCode.trim()) {
      setError('Enter the Room Code too!');
      return;
    }
    if (name.trim().length > 20) {
      setError('Name too long (max 20 characters)');
      return;
    }

    setIsJoining(true);

    try {
      const { res, data } = await callJoinAPI(false);

      if (!res.ok) {
        setError(data.error || 'Couldn\'t join. Please try again.');
        setIsJoining(false);
        return;
      }

      // Duplicate name → show popup
      if (data.duplicate) {
        setDuplicateName(data.existing_name);
        setShowDuplicatePopup(true);
        setIsJoining(false);
        return;
      }

      // Success → enter game
      onJoinSuccess(data);

    } catch (err) {
      console.error('Join error:', err);
      setError('Connection failed. Please try again.');
      setIsJoining(false);
    }
  };

  // Team confirms it's the same team → reconnect
  const handleReconnect = async () => {
    setIsJoining(true);
    setShowDuplicatePopup(false);

    try {
      const { res, data } = await callJoinAPI(true);

      if (!res.ok) {
        setError(data.error || 'Couldn\'t join. Please try again.');
        setIsJoining(false);
        return;
      }

      onJoinSuccess(data);

    } catch (err) {
      console.error('Reconnect error:', err);
      setError('Connection failed. Please try again.');
      setIsJoining(false);
    }
  };

  // Team taps "change name" → close popup, clear name
  const handleChangeName = () => {
    setShowDuplicatePopup(false);
    setName('');
  };

  // Enter key = submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showDuplicatePopup) handleJoin();
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      {/* Word-mark lockup */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wider">
          <span style={{ color: 'var(--mw-violet)' }}>MARKET</span>{' '}
          <span style={{ color: 'var(--mw-rose)' }}>WARS</span>
        </h1>
        <p className="text-xs sm:text-sm font-extrabold tracking-[0.25em] mt-3" style={{ color: 'rgba(255,255,255,0.82)' }}>
          PORTFOLIO CHALLENGE
        </p>
        <p className="text-[11px] sm:text-xs tracking-wide mt-1 text-gray-400">
          KKP YoungGen Edition
        </p>
      </div>

      {/* Join Card */}
      <div className="w-full max-w-sm bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-white text-lg font-bold text-center mb-6">
          Join the Challenge
        </h2>

        {/* Room Code Input */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
            Room Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
            onKeyDown={handleKeyDown}
            placeholder="e.g. KKPW"
            maxLength={4}
            className="w-full bg-base border border-border rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-[0.3em] placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-colors"
            disabled={isJoining}
          />
        </div>

        {/* Team Name Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">
            Team Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your team name..."
            maxLength={20}
            className="w-full bg-base border border-border rounded-xl px-4 py-3 text-white text-lg placeholder:text-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
            disabled={isJoining}
            autoFocus={!!searchParams.get('room')} // if room code prefilled, focus the name
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Duplicate Name Popup */}
        {showDuplicatePopup && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-300 text-sm font-semibold text-center mb-1">
              ⚠️ The name &quot;{duplicateName}&quot; is already taken
            </p>
            <p className="text-gray-400 text-xs text-center mb-3">
              Are you the same {duplicateName} that joined earlier?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReconnect}
                className="flex-1 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: 'var(--mw-violet)', color: 'var(--mw-base)' }}
              >
                ✅ Yes, rejoin
              </button>
              <button
                onClick={handleChangeName}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                ❌ No, change name
              </button>
            </div>
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={handleJoin}
          disabled={isJoining || !name.trim() || !roomCode.trim()}
          className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(90deg, var(--mw-violet-deep), var(--mw-rose))', color: 'var(--mw-base)' }}
        >
          {isJoining ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Joining...
            </span>
          ) : (
            'Enter Game →'
          )}
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-xs mt-6">
        Scan the QR on the main screen, or enter the Room Code above
      </p>
    </div>
  );
}

// Wrap in Suspense because useSearchParams needs it in Next.js 14+
export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <JoinForm />
    </Suspense>
  );
}
