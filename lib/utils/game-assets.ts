// Ścieżki do obrazków
export const IMAGES = {
  LOGO: "/assets/images/logo.png",
  QUESTION_BACKGROUND: "/assets/images/question-prize-background.png",
  BACKGROUND: "/assets/images/background.png",
  QUESTION_INDEX_BACKGROUND: "/assets/images/question-index-background.png",

  // Koła ratunkowe
  HINTS: {
    F_F: "/assets/images/lifelines/50-50.png",
    VOTING: "/assets/images/lifelines/audience.png",
    PHONE: "/assets/images/lifelines/phone.png",
  },

  // Tła odpowiedzi
  ANSWER_BACKGROUNDS: {
    DEFAULT_DEFAULT: "/assets/images/answer-background/default-default.png",
    DEFAULT_SELECTED: "/assets/images/answer-background/default-selected.png",
    DEFAULT_CORRECT: "/assets/images/answer-background/default-correct.png",

    CORRECT_DEFAULT: "/assets/images/answer-background/correct-default.png",
    CORRECT_SELECTED: "/assets/images/answer-background/correct-selected.png",

    SELECTED_DEFAULT: "/assets/images/answer-background/selected-default.png",
    SELECTED_CORRECT: "/assets/images/answer-background/selected-correct.png",
  },
  LIFELINES_BACKGROUND: {
    FIFTY_FIFTY: {
      AVAILABLE: "/assets/images/lifelines/fifty.png",
      USED: "/assets/images/lifelines/fifty-used.png",
    },
    VOTING: {
      AVAILABLE: "/assets/images/lifelines/audience.png",
      USED: "/assets/images/lifelines/audience-used.png",
    },
    PHONE: {
      AVAILABLE: "/assets/images/lifelines/phone.png",
      USED: "/assets/images/lifelines/phone-used.png",
    },
  },
} as const;

export type AnswerKey = "A" | "B" | "C" | "D";
export type LifelineType = "F_F" | "VOTING" | "PHONE";

// Funkcja do pobierania tła odpowiedzi
export function getAnswerRowBackground(
  leftAnswerState: "default" | "selected" | "correct",
  rightAnswerState: "default" | "selected" | "correct"
): string {
  const state = `${leftAnswerState}-${rightAnswerState}`;
  const backgroundMap: Record<string, string> = {
    "default-default": IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT,
    "default-selected": IMAGES.ANSWER_BACKGROUNDS.DEFAULT_SELECTED,
    "default-correct": IMAGES.ANSWER_BACKGROUNDS.DEFAULT_CORRECT,

    "correct-default": IMAGES.ANSWER_BACKGROUNDS.CORRECT_DEFAULT,
    "correct-selected": IMAGES.ANSWER_BACKGROUNDS.CORRECT_SELECTED,

    "selected-default": IMAGES.ANSWER_BACKGROUNDS.SELECTED_DEFAULT,
    "selected-correct": IMAGES.ANSWER_BACKGROUNDS.SELECTED_CORRECT,
  };
  return backgroundMap[state] || IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT;
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
