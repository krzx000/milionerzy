import { NextRequest, NextResponse } from "next/server";
import { getCurrentVoteSession, addVote } from "@/lib/voting/session-manager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 10, distribution } = body as {
      count?: number;
      distribution?: Partial<Record<"A" | "B" | "C" | "D", number>>;
    };

    const voteSession = getCurrentVoteSession();
    if (!voteSession || !voteSession.isActive) {
      return NextResponse.json(
        { success: false, error: "No active voting session" },
        { status: 400 }
      );
    }

    // Przygotuj rozkład głosów
    const weights: Record<"A" | "B" | "C" | "D", number> = {
      A: distribution?.A ?? 25,
      B: distribution?.B ?? 25,
      C: distribution?.C ?? 25,
      D: distribution?.D ?? 25,
    };
    const total = weights.A + weights.B + weights.C + weights.D;

    function pick(): "A" | "B" | "C" | "D" {
      const r = Math.random() * total;
      if (r < weights.A) return "A";
      if (r < weights.A + weights.B) return "B";
      if (r < weights.A + weights.B + weights.C) return "C";
      return "D";
    }

    for (let i = 0; i < count; i++) {
      const option = pick();
      const userId = `debug_${Date.now()}_${i}_${Math.random()
        .toString(36)
        .slice(2)}`;
      addVote(userId, option);
    }

    return NextResponse.json({ success: true, data: { added: count } });
  } catch (error) {
    console.error("DEBUG simulate-votes error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
