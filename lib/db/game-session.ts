import { prisma } from "./prisma";
import type { GameSession as PrismaGameSession } from "@prisma/client";
import { Question } from "@/types/question";

export type GameStatus = "inactive" | "active" | "finished";

export interface GameSession {
  id: string;
  status: GameStatus;
  currentQuestionIndex: number;
  startTime?: Date;
  endTime?: Date;
  gameTime: number;
  usedLifelines: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askAudience: boolean;
  };
  // Informacje o ukrytych odpowiedziach dla 50:50 (dla każdego pytania)
  hiddenAnswers: Record<number, string[]>; // numer pytania -> array ukrytych odpowiedzi (np. ["A", "C"])
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

// Rozszerzony typ GameSession z pytaniami dla API responses
export interface GameSessionWithQuestions extends GameSession {
  questions?: Question[];
  currentQuestion?: Question | null;
  currentPrize?: string;
}

// Helper do konwersji modelu Prisma na interfejs GameSession
function mapPrismaToGameSession(prismaSession: PrismaGameSession): GameSession {
  let hiddenAnswers: Record<number, string[]> = {};
  try {
    hiddenAnswers = JSON.parse(prismaSession.hiddenAnswers || "{}");
  } catch (error) {
    console.error("Error parsing hiddenAnswers:", error);
    hiddenAnswers = {};
  }

  return {
    id: prismaSession.id,
    status: prismaSession.status as GameStatus,
    currentQuestionIndex: prismaSession.currentQuestionIndex,
    startTime: prismaSession.startTime ?? undefined,
    endTime: prismaSession.endTime ?? undefined,
    gameTime: prismaSession.gameTime,
    usedLifelines: {
      fiftyFifty: prismaSession.usedFiftyFifty,
      phoneAFriend: prismaSession.usedPhoneAFriend,
      askAudience: prismaSession.usedAskAudience,
    },
    hiddenAnswers,
    totalQuestions: prismaSession.totalQuestions,
    createdAt: prismaSession.createdAt,
    updatedAt: prismaSession.updatedAt,
  };
}

// Helper do zarządzania sesją gry
export const gameSessionDb = {
  // Pobierz aktualną sesję (tylko aktywną)
  getCurrent: async (): Promise<GameSession | null> => {
    try {
      console.log("Getting current game session...");

      // Szukamy tylko aktywnej sesji
      const session = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      if (session) {
        console.log(`Found active session: ${session.id}`);
        return mapPrismaToGameSession(session);
      }

      console.log("No active session found");
      return null;
    } catch (error) {
      console.error("Error getting current game session:", error);
      return null;
    }
  },

  // Pobierz ostatnią zakończoną sesję (do wyświetlenia po zakończeniu gry)
  getLastFinished: async (): Promise<GameSession | null> => {
    try {
      console.log("Getting last finished game session...");

      // Szukamy tylko sesji zakończonych, ale nie zamkniętych przez admina
      const session = await prisma.gameSession.findFirst({
        where: {
          status: "finished",
          gameTime: { not: -1 }, // Wykluczamy sesje zamknięte przez admina
        },
        orderBy: { updatedAt: "desc" },
      });

      if (session) {
        console.log(`Found finished session: ${session.id}`);
        return mapPrismaToGameSession(session);
      }

      console.log("No finished session found");
      return null;
    } catch (error) {
      console.error("Error getting last finished game session:", error);
      return null;
    }
  },

  // Pobierz historię wszystkich sesji
  getHistory: async (limit: number = 20): Promise<GameSession[]> => {
    try {
      const sessions = await prisma.gameSession.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return sessions.map(mapPrismaToGameSession);
    } catch (error) {
      console.error("Error getting game session history:", error);
      return [];
    }
  },

  // Rozpocznij nową grę
  start: async (totalQuestions: number): Promise<GameSession> => {
    try {
      // Zakończ wszystkie aktywne sesje
      await prisma.gameSession.updateMany({
        where: { status: "active" },
        data: { status: "finished", endTime: new Date() },
      });

      // Utwórz nową sesję
      const session = await prisma.gameSession.create({
        data: {
          status: "active",
          currentQuestionIndex: 0,
          startTime: new Date(),
          gameTime: 0,
          totalQuestions,
          usedFiftyFifty: false,
          usedPhoneAFriend: false,
          usedAskAudience: false,
          hiddenAnswers: "{}",
        },
      });

      return mapPrismaToGameSession(session);
    } catch (error) {
      console.error("Error starting game session:", error);
      throw new Error("Failed to start game session");
    }
  },

  // Rozpocznij nową grę z wybranymi pytaniami (relacja GameSessionQuestion)
  startWithQuestions: async (questionIds: string[]): Promise<GameSession> => {
    try {
      await prisma.gameSession.updateMany({
        where: { status: "active" },
        data: { status: "finished", endTime: new Date() },
      });

      const session = await prisma.gameSession.create({
        data: {
          status: "active",
          currentQuestionIndex: 0,
          startTime: new Date(),
          gameTime: 0,
          totalQuestions: questionIds.length,
          usedFiftyFifty: false,
          usedPhoneAFriend: false,
          usedAskAudience: false,
          hiddenAnswers: "{}",
        },
      });

      // Zapisz powiązania pytań z sesją (z zachowaniem kolejności)
      await prisma.$transaction(
        questionIds.map((questionId, idx) =>
          prisma.gameSessionQuestion.create({
            data: {
              gameSessionId: session.id,
              questionId,
              order: idx,
            },
          })
        )
      );

      return mapPrismaToGameSession(session);
    } catch (error) {
      console.error("Error starting game session:", error);
      throw new Error("Failed to start game session");
    }
  },

  // Zakończ grę (zmień status na "finished")
  finishGame: async (isWon: boolean = false): Promise<GameSession | null> => {
    try {
      console.log("Attempting to finish game session...");

      // Szukaj aktywnej sesji
      const session = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      if (session) {
        console.log(`Found active session to finish: ${session.id}`);

        // Zakończ aktywną sesję (zmień status na "finished")
        const updatedSession = await prisma.gameSession.update({
          where: { id: session.id },
          data: {
            status: "finished",
            endTime: new Date(),
            updatedAt: new Date(),
            // Jeśli gracz wygrał, ustaw currentQuestionIndex na totalQuestions
            currentQuestionIndex: isWon
              ? session.totalQuestions
              : session.currentQuestionIndex,
          },
        });

        console.log(
          `Gra zakończona: sesja ${session.id} zmieniona na status 'finished'${
            isWon ? " (WYGRANA)" : ""
          }`
        );
        return mapPrismaToGameSession(updatedSession);
      }

      console.log("Nie znaleziono aktywnej sesji do zakończenia");
      return null;
    } catch (error) {
      console.error("Error finishing game session:", error);
      return null;
    }
  },

  // Usuń sesję gry (zamknij sesję) - STARA WERSJA - już nie używana
  deleteSession: async (): Promise<boolean> => {
    try {
      console.log("Attempting to delete game session...");

      // Znajdź ostatnią zakończoną sesję
      const session = await prisma.gameSession.findFirst({
        where: { status: "finished" },
        orderBy: { updatedAt: "desc" },
      });

      if (session) {
        console.log(`Found finished session to delete: ${session.id}`);

        // Usuń powiązania z pytaniami
        await prisma.gameSessionQuestion.deleteMany({
          where: { gameSessionId: session.id },
        });

        // Usuń sesję
        await prisma.gameSession.delete({
          where: { id: session.id },
        });

        console.log(`Sesja ${session.id} została usunięta`);
        return true;
      }

      console.log("No finished session found to delete");
      return false;
    } catch (error) {
      console.error("Error deleting game session:", error);
      return false;
    }
  },

  // Zamknij sesję (pozostaw w historii) - NOWA WERSJA
  closeSession: async (): Promise<boolean> => {
    try {
      console.log("Attempting to close game session...");

      // Znajdź ostatnią zakończoną sesję
      const session = await prisma.gameSession.findFirst({
        where: { status: "finished" },
        orderBy: { updatedAt: "desc" },
      });

      if (session) {
        console.log(`Found finished session to close: ${session.id}`);

        // Oznacz sesję jako zamkniętą przez admina - używamy specjalnej wartości gameTime
        // (np. -1 oznacza zamknięte przez admina)
        await prisma.gameSession.update({
          where: { id: session.id },
          data: {
            gameTime: -1, // Specjalna wartość oznaczająca zamknięte przez admina
            updatedAt: new Date(),
          },
        });

        console.log(
          `Sesja ${session.id} została zamknięta (pozostaje w historii)`
        );
        return true;
      }

      console.log("No finished session found to close");
      return false;
    } catch (error) {
      console.error("Error closing game session:", error);
      return false;
    }
  },

  // Usuń wszystkie sesje z bazy danych (masowe czyszczenie)
  clearAllSessions: async (): Promise<{
    success: boolean;
    deletedCount: number;
  }> => {
    try {
      console.log("Attempting to clear all game sessions...");

      // Policz wszystkie sesje przed usunięciem
      const totalSessions = await prisma.gameSession.count();

      if (totalSessions === 0) {
        console.log("No sessions to delete");
        return { success: true, deletedCount: 0 };
      }

      // Usuń wszystkie powiązania z pytaniami
      await prisma.gameSessionQuestion.deleteMany({});

      // Usuń wszystkie sesje
      const result = await prisma.gameSession.deleteMany({});

      console.log(`Successfully deleted ${result.count} sessions`);
      return { success: true, deletedCount: result.count };
    } catch (error) {
      console.error("Error clearing all game sessions:", error);
      return { success: false, deletedCount: 0 };
    }
  },

  // Przejdź do następnego pytania
  nextQuestion: async (): Promise<GameSession | null> => {
    try {
      const activeSession = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      if (!activeSession) return null;

      // Sprawdź czy nie osiągnęliśmy już końca gry (12 pytań = indeksy 0-11)
      if (activeSession.currentQuestionIndex >= 11) {
        console.log("Już osiągnięto ostatnie pytanie, nie można przejść dalej");
        return null;
      }

      const newIndex = activeSession.currentQuestionIndex + 1;

      const updatedSession = await prisma.gameSession.update({
        where: { id: activeSession.id },
        data: {
          currentQuestionIndex: newIndex,
        },
      });

      return mapPrismaToGameSession(updatedSession);
    } catch (error) {
      console.error("Error moving to next question:", error);
      return null;
    }
  },

  // Przejdź do poprzedniego pytania
  previousQuestion: async (): Promise<GameSession | null> => {
    try {
      const activeSession = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      if (!activeSession) return null;

      const newIndex = Math.max(activeSession.currentQuestionIndex - 1, 0);

      const updatedSession = await prisma.gameSession.update({
        where: { id: activeSession.id },
        data: {
          currentQuestionIndex: newIndex,
        },
      });

      return mapPrismaToGameSession(updatedSession);
    } catch (error) {
      console.error("Error moving to previous question:", error);
      return null;
    }
  },

  // Użyj koła ratunkowego
  useLifeline: async (
    lifeline: keyof GameSession["usedLifelines"]
  ): Promise<GameSession | null> => {
    try {
      const activeSession = await prisma.gameSession.findFirst({
        where: { status: "active" }, // Koła ratunkowe są dostępne tylko dla aktywnej sesji
        orderBy: { updatedAt: "desc" },
      });

      if (!activeSession) return null;

      // Mapowanie nazw kół ratunkowych na pola w bazie
      const lifelineFields = {
        fiftyFifty: "usedFiftyFifty",
        phoneAFriend: "usedPhoneAFriend",
        askAudience: "usedAskAudience",
      };

      const fieldToUpdate = lifelineFields[lifeline];
      if (!fieldToUpdate) return null;

      const updateData: Record<string, boolean | string> = {
        [fieldToUpdate]: true,
      };

      // Specjalna logika dla 50:50 - losuj ukryte odpowiedzi
      if (lifeline === "fiftyFifty") {
        // Pobierz aktualne pytanie
        const sessionQuestions = await prisma.gameSessionQuestion.findMany({
          where: { gameSessionId: activeSession.id },
          orderBy: { order: "asc" },
          include: { question: true },
        });

        const currentQuestion =
          sessionQuestions[activeSession.currentQuestionIndex]?.question;

        if (currentQuestion) {
          // Znajdź poprawną odpowiedź
          const correctAnswer = currentQuestion.correctAnswer;

          // Lista wszystkich odpowiedzi
          const allAnswers = ["A", "B", "C", "D"];

          // Odpowiedzi do ukrycia (wszystkie oprócz poprawnej)
          const incorrectAnswers = allAnswers.filter(
            (answer) => answer !== correctAnswer
          );

          // Losowo wybierz 2 niepoprawne odpowiedzi do ukrycia
          const shuffled = incorrectAnswers.sort(() => 0.5 - Math.random());
          const hiddenAnswersForQuestion = shuffled.slice(0, 2);

          console.log(
            `50:50 dla pytania ${
              activeSession.currentQuestionIndex
            }: ukrywam odpowiedzi ${hiddenAnswersForQuestion.join(
              ", "
            )}, poprawna: ${correctAnswer}`
          );

          // Pobierz obecne ukryte odpowiedzi i dodaj nowe
          let hiddenAnswers: Record<number, string[]> = {};
          try {
            hiddenAnswers = JSON.parse(activeSession.hiddenAnswers || "{}");
          } catch (error) {
            console.error("Error parsing existing hiddenAnswers:", error);
            hiddenAnswers = {};
          }

          // Dodaj ukryte odpowiedzi dla obecnego pytania
          hiddenAnswers[activeSession.currentQuestionIndex] =
            hiddenAnswersForQuestion;

          // Zaktualizuj dane do zapisu
          updateData.hiddenAnswers = JSON.stringify(hiddenAnswers);
        }
      }

      const updatedSession = await prisma.gameSession.update({
        where: { id: activeSession.id },
        data: updateData,
      });

      return mapPrismaToGameSession(updatedSession);
    } catch (error) {
      console.error("Error using lifeline:", error);
      return null;
    }
  },

  // Aktualizuj czas gry
  updateGameTime: async (gameTime: number): Promise<GameSession | null> => {
    try {
      const activeSession = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      if (!activeSession) return null;

      const updatedSession = await prisma.gameSession.update({
        where: { id: activeSession.id },
        data: {
          gameTime,
        },
      });

      return mapPrismaToGameSession(updatedSession);
    } catch (error) {
      console.error("Error updating game time:", error);
      return null;
    }
  },
};
