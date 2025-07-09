import { GameSession, GameSessionWithQuestions } from "@/lib/db/game-session";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GameSessionHistory {
  id: string;
  status: string;
  startTime?: Date;
  endTime?: Date;
  duration: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  result: string;
  winnings: string;
  gameWon: boolean;
  usedLifelines: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askAudience: boolean;
  };
  usedLifelinesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GameAPI {
  private static baseUrl = "/api/game";

  static async getCurrentSession(): Promise<
    ApiResponse<GameSessionWithQuestions | null>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/session`);
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd komunikacji z serwerem",
      };
    }
  }

  static async startGame(): Promise<ApiResponse<GameSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd rozpoczynania gry",
      };
    }
  }

  static async endGame(): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.baseUrl}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd zamykania sesji gry",
      };
    }
  }

  static async nextQuestion(): Promise<ApiResponse<GameSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/next-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd przejścia do następnego pytania",
      };
    }
  }

  static async previousQuestion(): Promise<ApiResponse<GameSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/previous-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd przejścia do poprzedniego pytania",
      };
    }
  }

  static async activateLifeline(
    lifeline: string
  ): Promise<ApiResponse<GameSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/use-lifeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lifeline }),
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd użycia koła ratunkowego",
      };
    }
  }

  static async submitAnswer(answer: string): Promise<
    ApiResponse<
      GameSession & {
        correct: boolean;
        correctAnswer?: string;
        gameWon?: boolean;
      }
    >
  > {
    try {
      const response = await fetch(`${this.baseUrl}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd wysyłania odpowiedzi",
      };
    }
  }

  static async getHistory(
    limit: number = 20
  ): Promise<ApiResponse<GameSessionHistory[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/history?limit=${limit}`);
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd pobierania historii sesji",
      };
    }
  }

  static async clearAllSessions(): Promise<
    ApiResponse<{ deletedCount: number }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/clear-all`, {
        method: "DELETE",
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd usuwania wszystkich sesji",
      };
    }
  }
}
