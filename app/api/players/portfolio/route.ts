// FILE: app/api/players/portfolio/route.ts — Save team allocation (PATCH)
// VERSION: YG-V3 — allocation step validation now derives from ALLOCATION_STEP (was hardcoded % 10 → rejected 5% steps)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V3 step-validation fix
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ALLOCATION_STEP } from '@/lib/constants';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// PATCH — Update player portfolio
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { player_id, room_id, portfolio } = body;

    // --- Validation ---
    if (!player_id || !room_id || !portfolio) {
      return NextResponse.json(
        { error: 'Missing required fields: player_id, room_id, portfolio' },
        { status: 400 }
      );
    }

    // Validate portfolio is an object with number values
    if (typeof portfolio !== 'object' || Array.isArray(portfolio)) {
      return NextResponse.json(
        { error: 'Portfolio must be an object' },
        { status: 400 }
      );
    }

    // Validate all values are multiples of ALLOCATION_STEP, between 0-100
    const values = Object.values(portfolio) as number[];
    for (const val of values) {
      if (typeof val !== 'number' || val < 0 || val > 100 || val % ALLOCATION_STEP !== 0) {
        return NextResponse.json(
          { error: `Each allocation must be a multiple of ${ALLOCATION_STEP}% between 0 and 100` },
          { status: 400 }
        );
      }
    }

    // Validate total does not exceed 100%
    const total = values.reduce((sum, v) => sum + v, 0);
    if (total > 100) {
      return NextResponse.json(
        { error: `Total allocation is ${total}%, cannot exceed 100%` },
        { status: 400 }
      );
    }

    // --- Check room is in a valid phase for portfolio submission ---
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('status, current_phase, current_round')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    if (room.status !== 'playing') {
      return NextResponse.json(
        { error: 'Game is not in progress' },
        { status: 400 }
      );
    }

    // Only allow portfolio updates during invest or rebalance phases
    if (room.current_phase !== 'invest' && room.current_phase !== 'rebalance') {
      return NextResponse.json(
        { error: `Cannot update portfolio during ${room.current_phase} phase` },
        { status: 400 }
      );
    }

    // --- Update portfolio + mark which round it was submitted ---
    const { data: player, error: updateError } = await supabase
      .from('players')
      .update({ portfolio, portfolio_submitted_round: room.current_round })
      .eq('id', player_id)
      .eq('room_id', room_id)
      .select()
      .single();

    if (updateError || !player) {
      return NextResponse.json(
        { error: 'Failed to update portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolio: player.portfolio,
    });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
