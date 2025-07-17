// Typy specyficzne dla widoku gracza

import type { Question } from "@/types/question";
import type {
  ConnectionState,
  GameState,
  LogAction,
} from "@/lib/constants/player";

export interface PlayerDisplayState {
  // Podstawowe informacje
  sessionId: string | null;
  isInitialized: boolean;
  connectionState: ConnectionState;

  // Stan gry
  gameState: GameState;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;

  // Odpowiedzi i rezultaty
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isAnswerRevealed: boolean;
  answerLocked: boolean;

  // Timer
  timeRemaining: number;
  questionStartTime: Date | null;

  // Koła ratunkowe
  lifelinesUsed: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askAudience: boolean;
  };
  hiddenAnswers: string[];

  // Publiczność
  audienceVotingActive: boolean;
  audienceResults?: Record<string, number>;

  // Wyniki
  currentPrize: string;
  winnings: string;
  finalResult: "win" | "lose" | null;
}

export interface PlayerActionLog {
  id: string;
  action: LogAction;
  timestamp: Date;
  questionIndex: number;
  details: Record<string, unknown>;
}

export interface PlayerQuestionHistory {
  questionIndex: number;
  question: Question;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeUsed: number;
  timestamp: Date;
}

export interface PlayerSessionStats {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  totalTimeUsed: number;
  averageTimePerQuestion: number;
  lifelinesUsed: number;
  finalPrize: string;
  sessionDuration: number;
}

export interface PlayerUIConfig {
  // Opcje wyświetlania
  showTimer: boolean;
  showProgress: boolean;
  showLifelines: boolean;
  showConnectionStatus: boolean;

  // Animacje
  enableAnimations: boolean;
  animationSpeed: "slow" | "normal" | "fast";

  // Automatyczne akcje
  autoProgress: boolean;
  autoProgressDelay: number;

  // Debug
  showDebugInfo: boolean;
  logPlayerActions: boolean;
}

export interface PlayerEvent {
  type: string;
  timestamp: Date;
  data: Record<string, unknown>;
  source: "sse" | "local" | "api";
}

export interface PlayerNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  autoHide?: boolean;
}

export interface PlayerEffects {
  // Efekty dźwiękowe (dla przyszłej implementacji)
  soundEnabled: boolean;
  volume: number;

  // Efekty wizualne
  particleEffects: boolean;
  screenShake: boolean;
  colorFlash: boolean;

  // Timing
  revealDelay: number;
  transitionDuration: number;
}

// Callback types
export type PlayerEventHandler = (event: PlayerEvent) => void;
export type PlayerStateChangeHandler = (
  newState: Partial<PlayerDisplayState>
) => void;
export type PlayerNotificationHandler = (
  notification: PlayerNotification
) => void;

// Utility types
export type PlayerAnswerOption = {
  letter: string;
  text: string;
  isHidden: boolean;
  isSelected: boolean;
  isCorrect: boolean | null;
  isRevealed: boolean;
};

export type PlayerTimerState = {
  current: number;
  total: number;
  isWarning: boolean;
  isCritical: boolean;
  isExpired: boolean;
  percentage: number;
};

export type PlayerConnectionInfo = {
  state: ConnectionState;
  emoji: string;
  text: string;
  color: string;
  lastConnected: Date | null;
  reconnectAttempts: number;
};

export type PlayerProgressInfo = {
  current: number;
  total: number;
  percentage: number;
  color: string;
  isComplete: boolean;
};

// Konfiguracja widoku gracza
export const PLAYER_VIEW_CONFIG = {
  DEFAULT_UI_CONFIG: {
    showTimer: true,
    showProgress: true,
    showLifelines: true,
    showConnectionStatus: true,
    enableAnimations: true,
    animationSpeed: "normal" as const,
    autoProgress: false,
    autoProgressDelay: 3000,
    showDebugInfo: false,
    logPlayerActions: true,
  },

  DEFAULT_EFFECTS: {
    soundEnabled: false,
    volume: 0.5,
    particleEffects: true,
    screenShake: false,
    colorFlash: true,
    revealDelay: 1000,
    transitionDuration: 500,
  },
} as const;
