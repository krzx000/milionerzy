import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { gameSessionDb } from "@/lib/db/game-session";
import { sseManager } from "@/lib/sse/manager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { index } = body as { index: number };

    if (typeof index !== "number" || index < 0 || index > 11) {
      return NextResponse.json(
        { success: false, error: "Index must be between 0 and 11 (1-12)." },
        { status: 400 }
      );
    }

    const session = await gameSessionDb.getCurrent();
    if (!session || session.status !== "active") {
      return NextResponse.json(
        { success: false, error: "No active session" },
        { status: 404 }
      );
    }

    // Ustaw wskazany indeks pytania
    const updated = await prisma.gameSession.update({
      where: { id: session.id },
      data: { currentQuestionIndex: index },
    });

    // Odczytaj pytanie by znać ID i ukryte odpowiedzi
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: session.id },
      orderBy: { order: "asc" },
      include: { question: true },
    });
    const question = sessionQuestions[index]?.question;
    const hiddenAnswers = session.hiddenAnswers[index] || [];

    // Broadcast zmiany pytania
    sseManager.broadcast(
      "question-changed",
      {
        questionIndex: index,
        questionId: question?.id || "",
        hiddenAnswers,
      },
      "all"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("DEBUG jump-question error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
