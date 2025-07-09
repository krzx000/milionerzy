import { NextResponse } from "next/server";
import { clearVotingSession } from "../start/route";

export async function POST() {
  try {
    // Wyczyść sesję głosowania
    clearVotingSession();

    return NextResponse.json({
      success: true,
      message: "Sesja głosowania została wyczyszczona",
    });
  } catch (error) {
    console.error("Błąd czyszczenia sesji głosowania:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
