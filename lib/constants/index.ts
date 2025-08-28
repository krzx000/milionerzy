// Główny plik eksportujący wszystkie konstante aplikacji
export { GAME_CONSTANTS } from "./game";
export { PLAYER_CONSTANTS } from "./player";
export { TRANSITION_CONSTANTS } from "./transitions";
export { TIMING_CONSTANTS } from "./timing";

// Importy dla użycia wewnętrznego
import { GAME_CONSTANTS } from "./game";
import { PLAYER_CONSTANTS } from "./player";
import { TRANSITION_CONSTANTS } from "./transitions";
import { TIMING_CONSTANTS } from "./timing";

// Re-eksport typów
export type { ConnectionState, GameState, LogAction } from "./player";

export type { TransitionDuration, SpecificDuration } from "./transitions";

export type {
  PlayerLogicTiming,
  PlayerStateTiming,
  VotingTiming,
  SSETiming,
  AdminTiming,
  APITiming,
} from "./timing";

// Kombinowane typy dla częstych użyć
export type AllConstants = {
  game: typeof GAME_CONSTANTS;
  player: typeof PLAYER_CONSTANTS;
  transitions: typeof TRANSITION_CONSTANTS;
  timing: typeof TIMING_CONSTANTS;
};

// Helper do pobierania wszystkich konstant naraz
export const getAllConstants = (): AllConstants => ({
  game: GAME_CONSTANTS,
  player: PLAYER_CONSTANTS,
  transitions: TRANSITION_CONSTANTS,
  timing: TIMING_CONSTANTS,
});

// Najczęściej używane wartości w jednym miejscu (convenience exports)
export const COMMON_VALUES = {
  // Najczęściej używane timeouty
  DEFAULT_TIMEOUT: TIMING_CONSTANTS.PLAYER_LOGIC.CORRECT_ANSWER_DELAY,
  TRANSITION_DURATION: TRANSITION_CONSTANTS.DURATIONS.DEFAULT,
  ANIMATION_DURATION: TIMING_CONSTANTS.UI_ANIMATIONS.COMPONENT_TRANSITION,
} as const;
