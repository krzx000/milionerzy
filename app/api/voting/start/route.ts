import { NextRequest, NextResponse } from "next/server";
import { VoteSession } from "@/types/voting";
import { gameSessionDb } from "@/lib/db/game-session";
import { prisma } from "@/lib/db/prisma";
import { GAME_CONSTANTS } from "@/lib/constants/game";

// Tymczasowy store w pamięci - w produkcji użyć bazy danych
export let currentVoteSession: VoteSession | null = null;
export let votes: Record<string, { option: string; timestamp: Date }> = {};

// Funkcja do czyszczenia sesji głosowania
export function clearVotingSession() {
  currentVoteSession = null;
  votes = {};
  console.log("Wyczyszczono sesję głosowania");
}

// Funkcja pomocnicza do uruchamiania głosowania (można wywołać z innych endpointów)
export async function startVotingSession(sessionId: string): Promise<{
  success: boolean;
  data?: VoteSession;
  error?: string;
}> {
  try {
    // Pobierz sesję gry
    const gameSession = await gameSessionDb.getById(sessionId);

    if (!gameSession) {
      return { success: false, error: "Nie znaleziono sesji gry" };
    }

    if (gameSession.status !== "active") {
      return { success: false, error: "Sesja gry nie jest aktywna" };
    }

    // Sprawdź czy już nie ma aktywnej sesji głosowania
    if (currentVoteSession && currentVoteSession.isActive) {
      return { success: false, error: "Głosowanie już trwa" };
    }

    // Pobierz pytania powiązane z sesją
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: sessionId },
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

    const currentQuestion = questions[gameSession.currentQuestionIndex];

    if (!currentQuestion) {
      return { success: false, error: "Nie znaleziono aktualnego pytania" };
    }

    // Utwórz nową sesję głosowania
    const now = new Date();
    const endTime = new Date(
      now.getTime() + GAME_CONSTANTS.VOTING_TIME_LIMIT * 1000
    );

    // Sprawdź ukryte odpowiedzi dla 50:50
    const hiddenAnswers =
      gameSession.hiddenAnswers[gameSession.currentQuestionIndex] || [];

    currentVoteSession = {
      id: `vote_${sessionId}_${gameSession.currentQuestionIndex}`,
      gameSessionId: sessionId,
      questionId: currentQuestion.id,
      question: {
        id: currentQuestion.id,
        content: currentQuestion.content,
        answers: currentQuestion.answers,
      },
      hiddenAnswers: hiddenAnswers,
      startTime: now,
      endTime,
      timeLimit: GAME_CONSTANTS.VOTING_TIME_LIMIT,
      isActive: true,
    };

    // Wyczyść poprzednie głosy
    votes = {};

    // Zapisz informację o głosowaniu dla tego pytania w bazie danych
    await gameSessionDb.addAudienceVoteQuestion(
      gameSession.currentQuestionIndex
    );

    // Automatycznie zakończ głosowanie po upływie czasu
    setTimeout(async () => {
      if (
        currentVoteSession &&
        currentVoteSession.id ===
          `vote_${sessionId}_${gameSession.currentQuestionIndex}`
      ) {
        currentVoteSession.isActive = false;
        currentVoteSession.endTime = new Date();
        console.log(
          `Automatycznie zakończono głosowanie: ${currentVoteSession.id}`
        );
      }
    }, GAME_CONSTANTS.VOTING_TIME_LIMIT * 1000);

    console.log(`Rozpoczęto głosowanie: ${currentVoteSession.id}`);
    return { success: true, data: currentVoteSession };
  } catch (error) {
    console.error("Błąd rozpoczynania głosowania:", error);
    return { success: false, error: "Błąd serwera" };
  }
}

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
