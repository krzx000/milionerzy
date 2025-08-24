import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password, role } = await request.json();

    if (!password || !role) {
      return NextResponse.json(
        { error: "Brak hasła lub roli" },
        { status: 400 }
      );
    }

    // Sprawdź hasło w zależności od roli
    let correctPassword: string | undefined;

    if (role === "admin") {
      correctPassword = process.env.ADMIN_PASSWORD;
    } else if (role === "player") {
      correctPassword = process.env.PLAYER_PASSWORD;
    } else {
      return NextResponse.json(
        { error: "Nieprawidłowa rola" },
        { status: 400 }
      );
    }

    if (!correctPassword) {
      console.error(`Brak hasła w .env dla roli: ${role}`);
      return NextResponse.json(
        { error: "Błąd konfiguracji serwera" },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Nieprawidłowe hasło" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Błąd autoryzacji:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
