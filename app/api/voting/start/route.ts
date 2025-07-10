import { NextRequest, NextResponse } from "next/server";
import { startVotingSession } from "@/lib/voting/session-manager";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Brak ID sesji" }, { status: 400 });
    }

    const result = await startVotingSession(sessionId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Błąd POST endpoint:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
