// Typy dla Server-Sent Events

export type ClientType = "admin" | "voter" | "all";

export interface SSEClient {
  id: string;
  type: ClientType;
  controller: ReadableStreamDefaultController;
  connected: Date;
}

// Typy eventów
export type GameEventType =
  | "voting-started"
  | "voting-ended"
  | "vote-cast"
  | "question-changed"
  | "game-ended"
  | "lifeline-used"
  | "vote-stats-updated"
  | "answer-selected"
  | "answer-revealed"
  | "admin-message"
  | "connection-established";

export interface GameEvent {
  type: GameEventType;
  data: Record<string, unknown>;
  timestamp: Date;
  targetType?: ClientType;
}

// Specific event data types
export interface VotingStartedEvent {
  type: "voting-started";
  data: {
    voteSessionId: string;
    questionId: string;
    timeLimit: number;
    hiddenAnswers: string[];
  };
}

export interface VotingEndedEvent {
  type: "voting-ended";
  data: {
    voteSessionId: string;
    endTime: Date;
    totalVotes: number;
  };
}

export interface VoteCastEvent {
  type: "vote-cast";
  data: {
    totalVotes: number;
    stats: Record<string, { count: number; percentage: number }>;
  };
}

export interface QuestionChangedEvent {
  type: "question-changed";
  data: {
    questionIndex: number;
    questionId: string;
    hiddenAnswers: string[];
  };
}

export interface LifelineUsedEvent {
  type: "lifeline-used";
  data: {
    lifelineType: string;
    questionIndex: number;
    effect?: Record<string, unknown>;
  };
}

export interface AnswerSelectedEvent {
  type: "answer-selected";
  data: {
    selectedAnswer: string;
    questionIndex: number;
    questionId: string;
  };
}

export interface AnswerRevealedEvent {
  type: "answer-revealed";
  data: {
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    questionIndex: number;
    questionId: string;
    gameWon?: boolean;
  };
}
