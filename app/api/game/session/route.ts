import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { prisma } from "@/lib/db/prisma";

// GET /api/game/session - pobierz aktualną sesję gry
export async function GET() {
  try {
    // Najpierw szukamy aktywnej sesji
    let session = await gameSessionDb.getCurrent();

    // Jeśli nie ma aktywnej sesji, pobierz ostatnią zakończoną (do wyświetlenia po zakończeniu gry)
    if (!session) {
      session = await gameSessionDb.getLastFinished();
    }

    if (!session) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Brak sesji gry",
      });
    }

    // Pobierz pytania powiązane z sesją
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: session.id },
      orderBy: { order: "asc" },
      include: { question: true },
    });
    const questions = sessionQuestions.map((q) => ({
      id: q.question.id,
      content: q.question.content,
      answers: {
        A: q.question.answerA,
        B: q.question.answerB,
        C: q.question.answerC,
        D: q.question.answerD,
      },
      correctAnswer: q.question.correctAnswer as "A" | "B" | "C" | "D",
    }));
    const currentQuestion = questions[session.currentQuestionIndex] || null;

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
    const currentPrize =
      prizes[Math.min(session.currentQuestionIndex, prizes.length - 1)] ||
      "0 zł";

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        currentQuestion,
        questions, // cała lista pytań tej sesji
        currentPrize,
        totalQuestions: questions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching game session:", error);
    return NextResponse.json(
      { success: false, error: "Błąd pobierania sesji gry" },
      { status: 500 }
    );
  }
}
