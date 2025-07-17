// Integration utilities dla łączenia player view z istniejącym systemem

import { PlayerAPI } from "@/lib/api/player";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import type { GameEvent } from "@/types/events";
import type { PlayerActionLog, PlayerNotification } from "@/types/player";

/**
 * Klasa pomocnicza do integracji widoku gracza z systemem
 */
export class PlayerIntegration {
  private static notifications: PlayerNotification[] = [];
  private static actionLog: PlayerActionLog[] = [];

  /**
   * Inicjalizuje połączenie gracza z systemem
   */
  static async initialize(): Promise<boolean> {
    try {
      const pingResult = await PlayerAPI.ping();
      if (pingResult.success) {
        await PlayerAPI.requestCurrentState();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Błąd inicjalizacji gracza:", error);
      return false;
    }
  }

  /**
   * Loguje akcję gracza z automatycznym formatowaniem
   */
  static async logAction(
    action: string,
    details: Record<string, unknown>,
    questionIndex: number = 0
  ): Promise<void> {
    const logEntry: PlayerActionLog = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action:
        action as (typeof PLAYER_CONSTANTS.LOG_ACTIONS)[keyof typeof PLAYER_CONSTANTS.LOG_ACTIONS],
      timestamp: new Date(),
      questionIndex,
      details,
    };

    this.actionLog.push(logEntry);

    // Zachowaj tylko ostatnie 100 akcji
    if (this.actionLog.length > 100) {
      this.actionLog = this.actionLog.slice(-100);
    }

    try {
      await PlayerAPI.logPlayerAction(action, details);
    } catch (error) {
      console.error("Błąd logowania akcji gracza:", error);
    }
  }

  /**
   * Dodaje powiadomienie do kolejki
   */
  static addNotification(
    type: PlayerNotification["type"],
    title: string,
    message: string,
    duration?: number
  ): string {
    const notification: PlayerNotification = {
      id: `notification_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      duration: duration || 5000,
      autoHide: true,
    };

    this.notifications.push(notification);

    // Auto-remove after duration
    if (notification.autoHide && notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  /**
   * Usuwa powiadomienie
   */
  static removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  /**
   * Pobiera wszystkie aktywne powiadomienia
   */
  static getNotifications(): PlayerNotification[] {
    return [...this.notifications];
  }

  /**
   * Pobiera historię akcji gracza
   */
  static getActionLog(): PlayerActionLog[] {
    return [...this.actionLog];
  }

  /**
   * Czyści historię akcji
   */
  static clearActionLog(): void {
    this.actionLog = [];
  }

  /**
   * Czyści wszystkie powiadomienia
   */
  static clearNotifications(): void {
    this.notifications = [];
  }

  /**
   * Obsługuje event SSE i automatycznie loguje jeśli potrzeba
   */
  static handleSSEEvent(event: GameEvent): void {
    const eventDetails = {
      eventType: event.type,
      eventData: event.data,
      timestamp: event.timestamp,
    };

    // Auto-log ważnych eventów
    switch (event.type) {
      case "game-started":
        this.logAction(PLAYER_CONSTANTS.LOG_ACTIONS.GAME_STATE_CHANGED, {
          ...eventDetails,
          newState: "started",
        });
        this.addNotification(
          "success",
          "Gra rozpoczęta",
          "Gra została rozpoczęta!"
        );
        break;

      case "question-changed":
        this.logAction(
          PLAYER_CONSTANTS.LOG_ACTIONS.QUESTION_VIEWED,
          eventDetails,
          (event.data.questionIndex as number) || 0
        );
        break;

      case "answer-selected":
        this.logAction(
          PLAYER_CONSTANTS.LOG_ACTIONS.ANSWER_SELECTION_DISPLAYED,
          eventDetails,
          (event.data.questionIndex as number) || 0
        );
        break;

      case "answer-revealed":
        this.logAction(
          PLAYER_CONSTANTS.LOG_ACTIONS.ANSWER_REVEALED_DISPLAYED,
          eventDetails,
          (event.data.questionIndex as number) || 0
        );

        const isCorrect = event.data.isCorrect as boolean;
        this.addNotification(
          isCorrect ? "success" : "error",
          isCorrect ? "Poprawna odpowiedź!" : "Niepoprawna odpowiedź",
          isCorrect
            ? "Brawo! Idziemy dalej!"
            : "Niestety, to niepoprawna odpowiedź."
        );
        break;

      case "lifeline-used":
        this.logAction(
          PLAYER_CONSTANTS.LOG_ACTIONS.LIFELINE_USED_DISPLAYED,
          eventDetails,
          (event.data.questionIndex as number) || 0
        );

        const lifelineType = event.data.lifelineType as string;
        this.addNotification(
          "info",
          "Użyto koła ratunkowego",
          `Wykorzystano: ${lifelineType}`
        );
        break;

      case "voting-started":
        this.logAction(
          PLAYER_CONSTANTS.LOG_ACTIONS.VOTING_DISPLAYED,
          eventDetails
        );
        this.addNotification(
          "info",
          "Głosowanie publiczności",
          "Trwa głosowanie publiczności..."
        );
        break;

      case "game-ended":
        this.logAction(PLAYER_CONSTANTS.LOG_ACTIONS.GAME_STATE_CHANGED, {
          ...eventDetails,
          newState: "ended",
        });

        const gameWon = event.data.gameWon as boolean;
        this.addNotification(
          gameWon ? "success" : "info",
          gameWon ? "Gratulacje!" : "Koniec gry",
          gameWon ? "Wygrałeś grę!" : "Gra została zakończona.",
          10000 // Dłużej wyświetlaj końcowe powiadomienie
        );
        break;

      case "connection-established":
        this.logAction(
          PLAYER_CONSTANTS.LOG_ACTIONS.CONNECTION_ESTABLISHED,
          eventDetails
        );
        break;
    }
  }

  /**
   * Sprawdza stan połączenia i automatycznie loguje zmiany
   */
  static monitorConnection(isConnected: boolean): void {
    const lastConnectionState = localStorage.getItem("player_last_connection");
    const currentState = isConnected ? "connected" : "disconnected";

    if (lastConnectionState !== currentState) {
      localStorage.setItem("player_last_connection", currentState);

      if (isConnected) {
        this.logAction(PLAYER_CONSTANTS.LOG_ACTIONS.CONNECTION_ESTABLISHED, {
          connectionRestored: lastConnectionState === "disconnected",
        });
        this.addNotification(
          "success",
          "Połączono",
          "Połączenie z serwerem zostało nawiązane"
        );
      } else {
        this.logAction(PLAYER_CONSTANTS.LOG_ACTIONS.CONNECTION_LOST, {
          previousState: lastConnectionState,
        });
        this.addNotification(
          "error",
          "Utracono połączenie",
          "Utracono połączenie z serwerem"
        );
      }
    }
  }

  /**
   * Eksportuje dane gracza do JSON (dla debugowania)
   */
  static exportPlayerData(): string {
    return JSON.stringify(
      {
        actionLog: this.actionLog,
        notifications: this.notifications,
        timestamp: new Date(),
        version: "1.0.0",
      },
      null,
      2
    );
  }

  /**
   * Resetuje wszystkie dane gracza
   */
  static reset(): void {
    this.clearActionLog();
    this.clearNotifications();
    localStorage.removeItem("player_last_connection");
  }
}

/**
 * Globalna instancja integration utility
 */
export const playerIntegration = PlayerIntegration;
