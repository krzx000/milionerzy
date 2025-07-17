// Ścieżki do obrazków
export const IMAGES = {
  LOGO: "/assets/images/logo.webp",
  PRIZE_BACKGROUND: "/assets/images/prize-background.png",
  QUESTION_BACKGROUND: "/assets/images/question-background.png",
  WIN_BACKGROUND: "/assets/images/win-background.png",
  CROSS_MARK: "/assets/images/cross-mark.png", // Możesz dodać ten obrazek

  // Koła ratunkowe
  HINTS: {
    F_F: "/assets/images/lifelines/50-50.png", // Możesz dodać te obrazki
    VOTING: "/assets/images/lifelines/audience.png",
    PHONE: "/assets/images/lifelines/phone.png",
  },

  // Tła odpowiedzi
  ANSWER_BACKGROUNDS: {
    A: {
      NORMAL: "/assets/images/answer-background/a/normal.png",
      SELECTED: "/assets/images/answer-background/a/selected.png",
      CORRECT: "/assets/images/answer-background/a/correct.png",
    },
    B: {
      NORMAL: "/assets/images/answer-background/b/normal.png",
      SELECTED: "/assets/images/answer-background/b/selected.png",
      CORRECT: "/assets/images/answer-background/b/correct.png",
    },
    C: {
      NORMAL: "/assets/images/answer-background/c/normal.png",
      SELECTED: "/assets/images/answer-background/c/selected.png",
      CORRECT: "/assets/images/answer-background/c/correct.png",
    },
    D: {
      NORMAL: "/assets/images/answer-background/d/normal.png",
      SELECTED: "/assets/images/answer-background/d/selected.png",
      CORRECT: "/assets/images/answer-background/d/correct.png",
    },
  },
} as const;

export type AnswerKey = "A" | "B" | "C" | "D";
export type LifelineType = "F_F" | "VOTING" | "PHONE";

// Funkcja do pobierania tła odpowiedzi
export function getAnswerBackground(
  answerKey: AnswerKey,
  state: "normal" | "selected" | "correct" = "normal"
): string {
  const stateKey =
    state.toUpperCase() as keyof typeof IMAGES.ANSWER_BACKGROUNDS.A;
  return IMAGES.ANSWER_BACKGROUNDS[answerKey][stateKey];
}

// Mapowanie nazw kół ratunkowych z systemu na UI
export function mapLifelineToUI(systemName: string): LifelineType {
  switch (systemName) {
    case "fiftyFifty":
      return "F_F";
    case "askAudience":
      return "VOTING";
    case "phoneAFriend":
      return "PHONE";
    default:
      return "F_F";
  }
}

// Mapowanie nazw kół ratunkowych z UI na system
export function mapLifelineToSystem(uiName: LifelineType): string {
  switch (uiName) {
    case "F_F":
      return "fiftyFifty";
    case "VOTING":
      return "askAudience";
    case "PHONE":
      return "phoneAFriend";
    default:
      return "fiftyFifty";
  }
}
