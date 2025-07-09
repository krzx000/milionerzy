export type VoteOption = "A" | "B" | "C" | "D";

export interface VoteSession {
  id: string;
  gameSessionId: string;
  questionId: string;
  question: {
    id: string;
    content: string;
    answers: Record<VoteOption, string>;
  };
  hiddenAnswers?: string[]; // Ukryte odpowiedzi dla 50:50 (np. ["A", "C"])
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  timeLimit: number; // w sekundach
}

export interface VoteResult {
  option: VoteOption;
  count: number;
  percentage: number;
}

export interface VoteStats {
  totalVotes: number;
  results: Record<VoteOption, VoteResult>;
}

export interface UserVote {
  userId: string;
  option: VoteOption;
  timestamp: Date;
}

export interface VoteViewerState {
  session: VoteSession | null;
  stats: VoteStats | null;
  userVote: VoteOption | null;
  timeRemaining: number;
  canVote: boolean;
  showResults: boolean;
}
