import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import type { ConnectionState, GameState } from "@/lib/constants/player";

/**
 * Formatuje czas w sekundach na format MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Zwraca klasę CSS dla timera na podstawie pozostałego czasu
 */
export function getTimerClass(timeRemaining: number): string {
  const baseClass = "timer";

  if (timeRemaining <= PLAYER_CONSTANTS.CRITICAL_TIME_THRESHOLD) {
    return `${baseClass} ${PLAYER_CONSTANTS.ANIMATION_CLASSES.TIMER_CRITICAL}`;
  }

  if (timeRemaining <= PLAYER_CONSTANTS.WARNING_TIME_THRESHOLD) {
    return `${baseClass} ${PLAYER_CONSTANTS.ANIMATION_CLASSES.TIMER_WARNING}`;
  }

  return baseClass;
}

/**
 * Zwraca kolor dla paska postępu na podstawie procentu ukończenia
 */
export function getProgressColor(progressPercent: number): string {
  if (progressPercent <= PLAYER_CONSTANTS.PROGRESS_THRESHOLDS.LOW) {
    return PLAYER_CONSTANTS.PROGRESS_COLORS.LOW;
  }

  if (progressPercent <= PLAYER_CONSTANTS.PROGRESS_THRESHOLDS.MEDIUM) {
    return PLAYER_CONSTANTS.PROGRESS_COLORS.MEDIUM;
  }

  return PLAYER_CONSTANTS.PROGRESS_COLORS.HIGH;
}

/**
 * Zwraca tekstową reprezentację stanu połączenia
 */
export function getConnectionStatusText(
  connectionState: ConnectionState
): string {
  switch (connectionState) {
    case PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTING:
      return PLAYER_CONSTANTS.UI_TEXTS.CONNECTING;
    case PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTED:
      return "Połączono";
    case PLAYER_CONSTANTS.CONNECTION_STATES.DISCONNECTED:
      return "Rozłączono";
    case PLAYER_CONSTANTS.CONNECTION_STATES.ERROR:
      return "Błąd połączenia";
    case PLAYER_CONSTANTS.CONNECTION_STATES.RECONNECTING:
      return PLAYER_CONSTANTS.UI_TEXTS.RECONNECTING;
    default:
      return "Nieznany stan";
  }
}

/**
 * Zwraca emoji dla stanu połączenia
 */
export function getConnectionStatusEmoji(
  connectionState: ConnectionState
): string {
  switch (connectionState) {
    case PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTED:
      return "🟢";
    case PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTING:
    case PLAYER_CONSTANTS.CONNECTION_STATES.RECONNECTING:
      return "🟡";
    case PLAYER_CONSTANTS.CONNECTION_STATES.DISCONNECTED:
    case PLAYER_CONSTANTS.CONNECTION_STATES.ERROR:
      return "🔴";
    default:
      return "⚪";
  }
}

/**
 * Zwraca tekstową reprezentację stanu gry dla gracza
 */
export function getGameStatusText(gameState: GameState): string {
  switch (gameState) {
    case PLAYER_CONSTANTS.GAME_STATES.WAITING:
      return PLAYER_CONSTANTS.UI_TEXTS.WAITING_FOR_GAME;
    case PLAYER_CONSTANTS.GAME_STATES.ACTIVE:
      return "Gra w toku";
    case PLAYER_CONSTANTS.GAME_STATES.PAUSED:
      return PLAYER_CONSTANTS.UI_TEXTS.GAME_PAUSED;
    case PLAYER_CONSTANTS.GAME_STATES.ENDED:
      return "Gra zakończona";
    default:
      return "Nieznany stan";
  }
}

/**
 * Sprawdza czy odpowiedź powinna być ukryta (dla koła ratunkowego 50:50)
 */
export function isAnswerHidden(
  answerLetter: string,
  hiddenAnswers: string[]
): boolean {
  return hiddenAnswers.includes(answerLetter);
}

/**
 * Zwraca klasę CSS dla opcji odpowiedzi na podstawie jej stanu
 */
export function getAnswerOptionClass(
  answerLetter: string,
  selectedAnswer: string | null,
  correctAnswer: string | null,
  isRevealed: boolean,
  hiddenAnswers: string[]
): string {
  const baseClass = "answer-option";
  const classes = [baseClass];

  if (isAnswerHidden(answerLetter, hiddenAnswers)) {
    classes.push(PLAYER_CONSTANTS.ANSWER_CLASSES.HIDDEN);
  }

  if (selectedAnswer === answerLetter) {
    classes.push(PLAYER_CONSTANTS.ANSWER_CLASSES.SELECTED);
  }

  if (isRevealed && correctAnswer === answerLetter) {
    classes.push(PLAYER_CONSTANTS.ANSWER_CLASSES.CORRECT);
  }

  if (
    isRevealed &&
    selectedAnswer === answerLetter &&
    correctAnswer !== answerLetter
  ) {
    classes.push(PLAYER_CONSTANTS.ANSWER_CLASSES.INCORRECT);
  }

  return classes.join(" ");
}

/**
 * Generuje ID dla eventów debugowania
 */
export function generateEventId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sprawdza czy dana odpowiedź jest poprawna
 */
export function isCorrectAnswer(
  selectedAnswer: string | null,
  correctAnswer: string | null
): boolean {
  return selectedAnswer !== null && selectedAnswer === correctAnswer;
}

/**
 * Oblicza procent postępu gry
 */
export function calculateGameProgress(
  currentQuestionIndex: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((currentQuestionIndex / totalQuestions) * 100);
}

/**
 * Zwraca szerokość paska timera w procentach
 */
export function getTimerBarWidth(
  timeRemaining: number,
  totalTime: number = PLAYER_CONSTANTS.DEFAULT_QUESTION_TIME
): number {
  if (totalTime === 0) return 0;
  return Math.max(0, (timeRemaining / totalTime) * 100);
}

/**
 * Formatuje dane do logowania
 */
export function formatLogData(
  action: string,
  details: Record<string, unknown>
): {
  action: string;
  data: {
    type: string;
    details: Record<string, unknown>;
    timestamp: Date;
  };
} {
  return {
    action: "log-player-action",
    data: {
      type: action,
      details,
      timestamp: new Date(),
    },
  };
}
