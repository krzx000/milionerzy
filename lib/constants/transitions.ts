export const TRANSITION_CONSTANTS = {
  // Domyślne czasy trwania przejść w milisekundach
  DURATIONS: {
    DEFAULT: 3200, // domyślny czas dla większości przejść
    SHORT: 1500, // krótkie przejścia (pauza/wznowienie)
    MEDIUM: 2000, // średnie przejścia
    LONG: 4000, // długie przejścia
    EXTRA_LONG: 5000, // bardzo długie przejścia
  },

  // Czasy dla konkretnych typów przejść
  SPECIFIC_DURATIONS: {
    QUESTION_TRANSITION: 3200,
    GAME_START_TRANSITION: 3200,
    GAME_END_TRANSITION: 3200,
    WIN_TRANSITION: 3200,
    ANSWER_TRANSITION: 3200,
    PAUSE_TRANSITION: 1500,
    RESUME_TRANSITION: 1500,
    OVERLAY_FADE_OUT: 1000,
    LOGO_ANIMATION: 800,
  },
} as const;

// Typy dla stałych
export type TransitionDuration =
  (typeof TRANSITION_CONSTANTS.DURATIONS)[keyof typeof TRANSITION_CONSTANTS.DURATIONS];
export type SpecificDuration =
  (typeof TRANSITION_CONSTANTS.SPECIFIC_DURATIONS)[keyof typeof TRANSITION_CONSTANTS.SPECIFIC_DURATIONS];
