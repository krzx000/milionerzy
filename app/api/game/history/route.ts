import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";

// GET /api/game/history - pobierz historię sesji gry
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const sessions = await gameSessionDb.getHistory(limit);

    // Oblicz dodatkowe informacje dla każdej sesji
    const prizes = [
      "500 zł",
      "1 000 zł",
      "2 000 zł",
      "5 000 zł",
      "10 000 zł",
      "20 000 zł",
      "40 000 zł",
      "75 000 zł",
      "125 000 zł",
      "250 000 zł",
      "500 000 zł",
      "1 000 000 zł",
    ];

    const sessionsWithDetails = sessions.map((session) => {
      // Oblicz czas trwania
      let duration = 0;
      if (session.startTime && session.endTime) {
        duration = Math.floor(
          (session.endTime.getTime() - session.startTime.getTime()) / 1000
        );
      }

      // Oblicz wygraną kwotę
      let winnings = "0 zł";
      if (session.status === "finished" && session.currentQuestionIndex > 0) {
        const winningIndex = session.currentQuestionIndex - 1;
        winnings = prizes[winningIndex] || "0 zł";
      } else if (session.currentQuestionIndex >= session.totalQuestions) {
        // Gracz ukończył wszystkie pytania
        winnings = prizes[prizes.length - 1] || "1 000 000 zł";
      }

      // Sprawdź czy gracz wygrał całą grę
      const gameWon = session.currentQuestionIndex >= session.totalQuestions;

      // Oblicz wynik
      let result = "Przerwana";
      if (session.status === "finished") {
        if (gameWon) {
          result = "Wygrana - pełna gra";
        } else if (session.currentQuestionIndex >= 0) {
          result = `Przegrana na pytaniu ${session.currentQuestionIndex + 1}`;
        }
      } else if (session.status === "active") {
        result = "W toku";
      }

      // Zlicz użyte koła ratunkowe
      const usedLifelinesCount = Object.values(session.usedLifelines).filter(
        Boolean
      ).length;

      return {
        id: session.id,
        status: session.status,
        startTime: session.startTime,
        endTime: session.endTime,
        duration,
        currentQuestionIndex: session.currentQuestionIndex,
        totalQuestions: session.totalQuestions,
        result,
        winnings,
        gameWon,
        usedLifelines: session.usedLifelines,
        usedLifelinesCount,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: sessionsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching game session history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd pobierania historii sesji gry",
      },
      { status: 500 }
    );
  }
}
