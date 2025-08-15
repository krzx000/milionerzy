import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { questionsDb } from "@/lib/db/questions";
import { sseManager } from "@/lib/sse/manager";
import { prisma } from "@/lib/db/prisma";

// POST /api/game/start - rozpocznij nową grę
export async function POST() {
  try {
    const allQuestions = await questionsDb.getAll();

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nie można rozpocząć gry bez pytań" },
        { status: 400 }
      );
    }

    if (allQuestions.length < 12) {
      return NextResponse.json(
        {
          success: false,
          error: `Potrzeba minimum 12 pytań do rozpoczęcia gry. Masz tylko ${allQuestions.length} pytań.`,
        },
        { status: 400 }
      );
    }

    // Losuj 12 pytań z całej bazy używając algorytmu Fisher-Yates
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, 12);
    const questionIds = selected.map((q) => q.id);

    console.log(
      `Wylosowano 12 pytań z ${allQuestions.length} dostępnych:`,
      questionIds
    );

    // Tworzymy sesję i relacje GameSessionQuestion
    const session = await gameSessionDb.startWithQuestions(questionIds);

    // Najpierw wyślij reset aby wyczyścić stary stan na wszystkich klientach
    sseManager.broadcast(
      "game-reset",
      {
        message: "Resetowanie stanu przed nową grą",
      },
      "all"
    );

    // Pobierz aktualne dane sesji z pytaniem (podobnie jak w API session)
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

    console.log("API start: Debugging data before broadcast:", {
      sessionId: session.id,
      sessionCurrentQuestionIndex: session.currentQuestionIndex,
      questionsLength: questions.length,
      hasCurrentQuestion: !!currentQuestion,
      currentQuestionContent:
        currentQuestion?.content?.substring(0, 50) + "...",
      currentQuestionAnswers: currentQuestion
        ? Object.keys(currentQuestion.answers)
        : [],
    });

    const sessionWithQuestion = {
      ...session,
      questions,
      currentQuestion,
    };

    // Krótkie opóźnienie aby upewnić się że reset został przetworzony
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Broadcast SSE event o rozpoczęciu gry
    sseManager.broadcast(
      "game-started",
      {
        session: sessionWithQuestion,
        currentQuestion: currentQuestion,
        questionIndex: 0,
        totalQuestions: 12,
        hiddenAnswers: [], // Nowa gra = brak ukrytych odpowiedzi
      },
      "all"
    );

    return NextResponse.json({
      success: true,
      data: session,
      message: "Gra została rozpoczęta",
    });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { success: false, error: "Błąd rozpoczynania gry" },
      { status: 500 }
    );
  }
}
