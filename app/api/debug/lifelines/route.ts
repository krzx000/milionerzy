import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { gameSessionDb } from "@/lib/db/game-session";
import { sseManager } from "@/lib/sse/manager";

// POST: { mode: "reset" | "allow-infinite" }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode } = body as { mode: "reset" | "allow-infinite" };

    const session = await gameSessionDb.getCurrent();
    if (!session || session.status !== "active") {
      return NextResponse.json(
        { success: false, error: "No active session" },
        { status: 404 }
      );
    }

    if (mode === "reset") {
      const updated = await prisma.gameSession.update({
        where: { id: session.id },
        data: {
          usedFiftyFifty: false,
          usedPhoneAFriend: false,
          usedAskAudience: false,
        },
      });

      sseManager.broadcast(
        "lifeline-used",
        {
          lifeline: "debug-reset",
          lifelineName: "Reset lifelines",
          questionIndex: updated.currentQuestionIndex,
          usedLifelines: {
            fiftyFifty: false,
            phoneAFriend: false,
            askAudience: false,
          },
        },
        "all"
      );

      return NextResponse.json({ success: true });
    }

    if (mode === "allow-infinite") {
      // Tryb developerski: nie zmieniamy bazy; po stronie API use-lifeline nie ma globalnej blokady,
      // ale UI zwykle blokuje przyciski. Debug UI będzie używać własnych przycisków wołających /api/game/use-lifeline wielokrotnie.
      // Informacyjny event dla klientów
      sseManager.broadcast(
        "admin-message",
        {
          message: "Infinite lifelines enabled (debug mode: client-side)",
        },
        "all"
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Unknown mode" },
      { status: 400 }
    );
  } catch (error) {
    console.error("DEBUG lifelines error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
