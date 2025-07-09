import { NextRequest, NextResponse } from "next/server";
import { VoteOption } from "@/types/voting";
import { currentVoteSession, votes } from "../start/route";

export async function POST(request: NextRequest) {
  try {
    const { option, userId } = await request.json();

    if (!option || !userId) {
      return NextResponse.json(
        { error: "Brak opcji głosowania lub ID użytkownika" },
        { status: 400 }
      );
    }

    if (!currentVoteSession || !currentVoteSession.isActive) {
      return NextResponse.json(
        { error: "Brak aktywnej sesji głosowania" },
        { status: 400 }
      );
    }

    // Sprawdź czy głosowanie jeszcze trwa
    const now = new Date();
    const endTime = new Date(currentVoteSession.endTime!);

    if (now >= endTime) {
      return NextResponse.json(
        { error: "Czas głosowania minął" },
        { status: 400 }
      );
    }

    // Sprawdź czy opcja jest prawidłowa
    if (!["A", "B", "C", "D"].includes(option)) {
      return NextResponse.json(
        { error: "Nieprawidłowa opcja głosowania" },
        { status: 400 }
      );
    }

    // Zapisz głos (nadpisz jeśli użytkownik już głosował)
    votes[userId] = {
      option: option as VoteOption,
      timestamp: now,
    };

    console.log(`Głos zapisany: ${userId} -> ${option}`);

    return NextResponse.json({
      success: true,
      data: { option, timestamp: now },
    });
  } catch (error) {
    console.error("Błąd zapisywania głosu:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
