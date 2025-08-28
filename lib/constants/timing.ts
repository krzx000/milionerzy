export const TIMING_CONSTANTS = {
  // Timeouty dla logiki gracza
  PLAYER_LOGIC: {
    WIN_GAME_TIMEOUT: 10000, // czas na pokazanie ekranu wygranej przed zakończeniem gry
    CORRECT_ANSWER_DELAY: 5000, // opóźnienie po pokazaniu poprawnej odpowiedzi
    WRONG_ANSWER_DELAY: 3000, // opóźnienie po pokazaniu błędnej odpowiedzi
    SESSION_CLOSED_TRANSITION: 1000, // czas przejścia po zamknięciu sesji
  },

  // Timeouty dla stanu gracza
  PLAYER_STATE: {
    ANIMATION_TIMEOUT: 3000, // timeout dla animacji
    TIMER_UPDATE_INTERVAL: 1000, // interwał aktualizacji timera
    STATE_TRANSITION_DELAY: 3200, // opóźnienie przejścia między stanami
    SYNC_DELAY: 1000, // opóźnienie synchronizacji stanu
    AUTO_PROGRESS_DELAY: 5000, // automatyczne przejście dalej
    STATE_PERSISTENCE_DELAY: 100, // opóźnienie zapisu stanu
    FINAL_ANSWER_DELAY: 2000, // opóźnienie po finalnej odpowiedzi
  },

  // Timeouty dla głosowania
  VOTING: {
    LOAD_DELAY: 100, // opóźnienie ładowania statystyk głosowania
    STATE_REFRESH_DELAY: 100, // opóźnienie odświeżenia stanu
    STATS_REFRESH_DELAY: 1000, // opóźnienie odświeżenia statystyk
    AUTO_REFRESH_INTERVAL: 5000, // interwał automatycznego odświeżania
  },

  // Timeouty dla SSE połączeń
  SSE: {
    CONNECTION_DELAY: 100, // opóźnienie nawiązania połączenia
    RECONNECT_DELAY: 3000, // opóźnienie ponownego połączenia (admin)
    RETRY_DELAY: 1000, // opóźnienie powtórzenia próby
    HEARTBEAT_INTERVAL: 30000, // interwał heartbeat
  },

  // Timeouty dla interfejsu admin
  ADMIN: {
    LOADING_DELAY: 100, // opóźnienie pokazania loadingu
    SUCCESS_MESSAGE_DELAY: 3000, // czas wyświetlania komunikatu sukcesu
    AUTO_PROGRESS_MULTIPLIER: 1000, // mnożnik dla auto progress (sekundy -> ms)
  },

  // Timeouty dla API
  API: {
    REQUEST_DELAY: 50, // opóźnienie między requestami
    RESPONSE_TIMEOUT: 10000, // timeout odpowiedzi API
    RETRY_DELAY: 1000, // opóźnienie między próbami
  },

  // Timeouty dla animacji UI
  UI_ANIMATIONS: {
    OVERLAY_FADE: 1000, // czas fade overlay
    COMPONENT_TRANSITION: 500, // przejścia między komponentami
    LOGO_ANIMATION: 800, // animacja logo
    CONTENT_FADE: 300, // fade treści
    BACKDROP_BLUR: 200, // animacja blur
  },

  // Timeouty dla voting session
  VOTING_SESSION: {
    CLEANUP_DELAY: 100, // opóźnienie czyszczenia sesji
    BROADCAST_DELAY: 50, // opóźnienie broadcastu
  },

  // Timeouty dla integracji gracza
  PLAYER_INTEGRATION: {
    LOG_DELAY: 100, // opóźnienie logowania akcji
    STATE_SYNC_DELAY: 200, // synchronizacja stanu gracza
  },

  // Timeouty dla logiki gry (admin)
  GAME_LOGIC: {
    LIFELINE_PROCESS_DELAY: 3000, // czas na przetworzenie koła ratunkowego
    ANSWER_PROCESS_DELAY: 3000, // czas na przetworzenie odpowiedzi
    QUESTION_TRANSITION_DELAY: 3000, // opóźnienie przejścia do następnego pytania
  },

  // Intervale dla wyświetlania głosowania publiczności
  AUDIENCE_VOTING: {
    STATS_UPDATE_INTERVAL: 1000, // interwał aktualizacji statystyk
    AUTO_CLOSE_TIMEOUT: 30000, // automatyczne zamknięcie po czasie
  },
} as const;

// Typy dla stałych
export type PlayerLogicTiming =
  (typeof TIMING_CONSTANTS.PLAYER_LOGIC)[keyof typeof TIMING_CONSTANTS.PLAYER_LOGIC];
export type PlayerStateTiming =
  (typeof TIMING_CONSTANTS.PLAYER_STATE)[keyof typeof TIMING_CONSTANTS.PLAYER_STATE];
export type VotingTiming =
  (typeof TIMING_CONSTANTS.VOTING)[keyof typeof TIMING_CONSTANTS.VOTING];
export type SSETiming =
  (typeof TIMING_CONSTANTS.SSE)[keyof typeof TIMING_CONSTANTS.SSE];
export type AdminTiming =
  (typeof TIMING_CONSTANTS.ADMIN)[keyof typeof TIMING_CONSTANTS.ADMIN];
export type APITiming =
  (typeof TIMING_CONSTANTS.API)[keyof typeof TIMING_CONSTANTS.API];
