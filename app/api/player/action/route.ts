import { NextRequest, NextResponse } from "next/server";
import { broadcastEvent } from "@/lib/sse/manager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Brak akcji" },
        { status: 400 }
      );
    }

    // Sprawdzenie połączenia - w player view używamy read-only
    // więc nie potrzebujemy żadnego managera

    switch (action) {
      case "ping":
        // Ping endpoint do sprawdzania połączenia
        return NextResponse.json({
          success: true,
          message: "Player connection active",
        });

      case "request-current-state":
        // Żądanie aktualnego stanu gry
        broadcastEvent(
          "connection-established",
          { clientType: "player" },
          "player"
        );
        return NextResponse.json({
          success: true,
          message: "State request sent",
        });

      case "log-player-action":
        // Logowanie akcji gracza dla celów debugowania/analizy
        console.log("🎮 Player action logged:", data);
        return NextResponse.json({
          success: true,
          message: "Action logged",
        });

      default:
        return NextResponse.json(
          { success: false, error: "Nieznana akcja" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Błąd w player action API:", error);
    return NextResponse.json(
      { success: false, error: "Błąd serwera" },
      { status: 500 }
    );
  }
}
