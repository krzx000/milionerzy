import { prisma } from "./prisma";
import type { GameSession as PrismaGameSession } from "@prisma/client";

export type GameStatus = "inactive" | "active" | "paused" | "finished";

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
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

// Helper do konwersji modelu Prisma na interfejs GameSession
function mapPrismaToGameSession(prismaSession: PrismaGameSession): GameSession {
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
    totalQuestions: prismaSession.totalQuestions,
    createdAt: prismaSession.createdAt,
    updatedAt: prismaSession.updatedAt,
  };
}

// Helper do zarządzania sesją gry
export const gameSessionDb = {
  // Pobierz aktualną sesję (aktywną lub najnowszą)
  getCurrent: async (): Promise<GameSession | null> => {
    try {
      // Najpierw spróbuj znaleźć aktywną sesję
      let session = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      // Jeśli brak aktywnej, weź najnowszą
      if (!session) {
        session = await prisma.gameSession.findFirst({
          orderBy: { createdAt: "desc" },
        });
      }

      return session ? mapPrismaToGameSession(session) : null;
    } catch (error) {
      console.error("Error getting current game session:", error);
      return null;
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
        },
      });

      return mapPrismaToGameSession(session);
    } catch (error) {
      console.error("Error starting game session:", error);
      throw new Error("Failed to start game session");
    }
  },

  // Zakończ grę
  end: async (): Promise<GameSession | null> => {
    try {
      const activeSession = await prisma.gameSession.findFirst({
        where: { status: "active" },
        orderBy: { updatedAt: "desc" },
      });

      if (!activeSession) return null;

      const updatedSession = await prisma.gameSession.update({
        where: { id: activeSession.id },
        data: {
          status: "finished",
          endTime: new Date(),
        },
      });

      return mapPrismaToGameSession(updatedSession);
    } catch (error) {
      console.error("Error ending game session:", error);
      return null;
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

      const newIndex = Math.min(
        activeSession.currentQuestionIndex + 1,
        activeSession.totalQuestions - 1
      );

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
        where: { status: "active" },
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

      const updatedSession = await prisma.gameSession.update({
        where: { id: activeSession.id },
        data: {
          [fieldToUpdate]: true,
        },
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
