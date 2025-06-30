export type AnswerOption = "A" | "B" | "C" | "D";

export type Question = {
  id: string; // UUID lub inny unikalny identyfikator
  content: string; // Treść pytania
  answers: Record<AnswerOption, string>; // Odpowiedzi A, B, C, D
  correctAnswer: AnswerOption; // Poprawna odpowiedź
  reward: number; // Kwota za to pytanie
  isGuaranteed?: boolean; // Czy to pytanie gwarantowane (opcjonalne)
  level: number; // Numer rundy (1–12)
};

export type AnswerStatus = "correct" | "wrong" | "unanswered" | "pending";

export const AnswerStyle = {
  TOP_LEFT: {
    NORMAL: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    CORRECT: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    SELECTED: {
      TEXT_COLOR: "text-black",
      IMAGE: "",
    },
  },
  TOP_RIGHT: {
    NORMAL: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    CORRECT: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    SELECTED: {
      TEXT_COLOR: "text-black",
      IMAGE: "",
    },
  },
  BOTTOM_LEFT: {
    NORMAL: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    CORRECT: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    SELECTED: {
      TEXT_COLOR: "text-black",
      IMAGE: "",
    },
  },
  BOTTOM_RIGHT: {
    NORMAL: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    CORRECT: {
      TEXT_COLOR: "text-white",
      IMAGE: "",
    },
    SELECTED: {
      TEXT_COLOR: "text-black",
      IMAGE: "",
    },
  },
};
