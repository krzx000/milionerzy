import { VoteSession, VoteStats, UserVote, VoteOption } from "@/types/voting";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GameViewerState {
  gameSession: {
    id: string;
    status: string;
    currentQuestionIndex: number;
    totalQuestions: number;
    usedLifelines: {
      fiftyFifty: boolean;
      phoneAFriend: boolean;
      askAudience: boolean;
    };
    hiddenAnswers?: string[]; // Ukryte odpowiedzi dla 50:50
  } | null;
  currentQuestion: {
    id: string;
    content: string;
    answers: Record<VoteOption, string>;
  } | null;
  voteSession: VoteSession | null;
}

export class VotingAPI {
  private static baseUrl = "/api/voting";

  // Pobierz aktualny stan gry/głosowania
  static async getCurrentVoteSession(): Promise<
    ApiResponse<VoteSession | GameViewerState | null>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/current`);
      const result = await response.json();
      return result;
    } catch {
      return { success: false, error: "Błąd pobierania stanu gry" };
    }
  }

  // Rozpocznij sesję głosowania (dla admina)
  static async startVoteSession(
    sessionId: string
  ): Promise<ApiResponse<VoteSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const result = await response.json();
      return result;
    } catch {
      return { success: false, error: "Błąd rozpoczynania głosowania" };
    }
  }

  // Zakończ sesję głosowania (dla admina)
  static async endVoteSession(): Promise<ApiResponse<{ endTime: Date }>> {
    try {
      const response = await fetch(`${this.baseUrl}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      return result;
    } catch {
      return { success: false, error: "Błąd kończenia głosowania" };
    }
  }

  // Oddaj głos (dla widza)
  static async submitVote(
    option: VoteOption,
    userId: string
  ): Promise<ApiResponse<UserVote>> {
    try {
      const response = await fetch(`${this.baseUrl}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option, userId }),
      });
      const result = await response.json();
      return result;
    } catch {
      return { success: false, error: "Błąd oddawania głosu" };
    }
  }

  // Pobierz statystyki głosowania
  static async getVoteStats(): Promise<ApiResponse<VoteStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      const result = await response.json();
      return { success: true, data: result };
    } catch {
      return { success: false, error: "Błąd pobierania statystyk" };
    }
  }

  // Wyczyść sesję głosowania (dla admina)
  static async clearVoteSession(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      return result;
    } catch {
      return { success: false, error: "Błąd czyszczenia sesji głosowania" };
    }
  }
}
