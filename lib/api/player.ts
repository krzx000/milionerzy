import type { ApiResponse } from "@/lib/api/game";

export interface PlayerActionRequest {
  action: string;
  data?: Record<string, unknown>;
}

export interface PlayerStateRequest {
  action: "request-current-state";
}

export interface PlayerPingRequest {
  action: "ping";
}

export interface PlayerLogRequest {
  action: "log-player-action";
  data: {
    type: string;
    details: Record<string, unknown>;
    timestamp: Date;
  };
}

export class PlayerAPI {
  private static baseUrl = "/api/player";

  /**
   * Sprawdza połączenie z serwerem player API
   */
  static async ping(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "ping",
        } as PlayerPingRequest),
      });

      return await response.json();
    } catch (error) {
      console.error("Player API ping error:", error);
      return {
        success: false,
        error: "Błąd komunikacji z serwerem",
      };
    }
  }

  /**
   * Żąda aktualnego stanu gry od serwera
   */
  static async requestCurrentState(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "request-current-state",
        } as PlayerStateRequest),
      });

      return await response.json();
    } catch (error) {
      console.error("Player API request state error:", error);
      return {
        success: false,
        error: "Błąd żądania stanu gry",
      };
    }
  }

  /**
   * Loguje akcję gracza po stronie serwera (dla celów debugowania/analizy)
   */
  static async logPlayerAction(
    type: string,
    details: Record<string, unknown>
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "log-player-action",
          data: {
            type,
            details,
            timestamp: new Date(),
          },
        } as PlayerLogRequest),
      });

      return await response.json();
    } catch (error) {
      console.error("Player API log action error:", error);
      return {
        success: false,
        error: "Błąd logowania akcji",
      };
    }
  }

  /**
   * Generyczna metoda do wysyłania akcji gracza
   */
  static async sendAction(
    actionData: PlayerActionRequest
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actionData),
      });

      return await response.json();
    } catch (error) {
      console.error("Player API send action error:", error);
      return {
        success: false,
        error: "Błąd wysyłania akcji",
      };
    }
  }
}
