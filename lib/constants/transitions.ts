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

  // Opóźnienia dla różnych akcji
  DELAYS: {
    OVERLAY_HIDE: 1000, // opóźnienie ukrycia overlay po animacji
    LOGO_SHOW: 200, // opóźnienie pokazania logo
    CONTENT_SHOW: 300, // opóźnienie pokazania treści
    AUTO_HIDE: 100, // automatyczne ukrycie po animacji
  },

  // CSS klasy dla animacji
  ANIMATION_CLASSES: {
    BACKDROP_BLUR: "backdrop-blur-3xl",
    FADE_IN: "opacity-100",
    FADE_OUT: "opacity-0",
    SCALE_UP: "scale-100",
    SCALE_DOWN: "scale-75",
    TRANSLATE_UP: "translate-y-0",
    TRANSLATE_DOWN: "translate-y-8",
  },

  // Z-index dla overlay
  Z_INDEX: {
    OVERLAY: 9999,
    MODAL: 1000,
    DROPDOWN: 100,
  },

  // Kolory tła overlay
  OVERLAY_BACKGROUNDS: {
    DARK: "bg-black/20",
    LIGHT: "bg-white/20",
    TRANSPARENT: "bg-transparent",
  },
} as const;

// Typy dla stałych
export type TransitionDuration =
  (typeof TRANSITION_CONSTANTS.DURATIONS)[keyof typeof TRANSITION_CONSTANTS.DURATIONS];
export type SpecificDuration =
  (typeof TRANSITION_CONSTANTS.SPECIFIC_DURATIONS)[keyof typeof TRANSITION_CONSTANTS.SPECIFIC_DURATIONS];
