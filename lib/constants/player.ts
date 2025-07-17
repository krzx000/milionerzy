export const PLAYER_CONSTANTS = {
  // Timeouty i opóźnienia
  ANIMATION_DURATION: 3000, // czas trwania animacji w ms
  CONNECTION_TIMEOUT: 10000, // timeout połączenia w ms
  RETRY_DELAY: 3000, // opóźnienie przed ponowną próbą połączenia
  HEARTBEAT_INTERVAL: 30000, // interwał heartbeat w ms

  // Timer settings
  DEFAULT_QUESTION_TIME: 30, // domyślny czas na pytanie w sekundach
  WARNING_TIME_THRESHOLD: 10, // próg ostrzeżenia o czasie w sekundach
  CRITICAL_TIME_THRESHOLD: 5, // krytyczny próg czasu w sekundach

  // Status połączenia
  CONNECTION_STATES: {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    ERROR: "error",
    RECONNECTING: "reconnecting",
  } as const,

  // Status gry
  GAME_STATES: {
    WAITING: "waiting",
    ACTIVE: "active",
    PAUSED: "paused",
    ENDED: "ended",
  } as const,

  // CSS klasy dla animacji
  ANIMATION_CLASSES: {
    QUESTION_APPEAR: "question-appear",
    ANSWER_SELECT: "answer-select",
    ANSWER_REVEAL: "answer-reveal",
    PRIZE_UPDATE: "prize-update",
    TIMER_WARNING: "timer-warning",
    TIMER_CRITICAL: "timer-critical",
  } as const,

  // CSS klasy dla stanów odpowiedzi
  ANSWER_CLASSES: {
    NORMAL: "answer-normal",
    SELECTED: "answer-selected",
    CORRECT: "answer-correct",
    INCORRECT: "answer-incorrect",
    HIDDEN: "answer-hidden",
    LOCKED: "answer-locked",
  } as const,

  // Teksty interfejsu
  UI_TEXTS: {
    WAITING_FOR_GAME: "Oczekiwanie na rozpoczęcie gry...",
    WAITING_FOR_ANSWER: "Oczekiwanie na wybór odpowiedzi...",
    ANSWER_SELECTED: "Wybrano:",
    ANSWER_LOCKED: "Odpowiedź zatwierdzona. Oczekiwanie na rezultat...",
    CORRECT_ANSWER: "POPRAWNA ODPOWIEDŹ!",
    INCORRECT_ANSWER: "NIEPOPRAWNA ODPOWIEDŹ!",
    GAME_WON: "Gratulacje! Wygrałeś!",
    GAME_LOST: "Niestety, to koniec gry.",
    GAME_PAUSED: "Gra wstrzymana",
    VOTING_ACTIVE: "Trwa głosowanie publiczności...",
    CONNECTION_ERROR: "Błąd połączenia z serwerem",
    CONNECTING: "Łączenie z grą...",
    RECONNECTING: "Ponowne łączenie...",
  } as const,

  // Opcje logowania dla player API
  LOG_ACTIONS: {
    QUESTION_VIEWED: "question-viewed",
    ANSWER_SELECTION_DISPLAYED: "answer-selection-displayed",
    ANSWER_REVEALED_DISPLAYED: "answer-revealed-displayed",
    CONNECTION_ESTABLISHED: "connection-established",
    CONNECTION_LOST: "connection-lost",
    GAME_STATE_CHANGED: "game-state-changed",
    LIFELINE_USED_DISPLAYED: "lifeline-used-displayed",
    VOTING_DISPLAYED: "voting-displayed",
  } as const,

  // Progress thresholds
  PROGRESS_COLORS: {
    LOW: "#ff4444", // czerwony dla niskiego postępu
    MEDIUM: "#ffaa00", // pomarańczowy dla średniego postępu
    HIGH: "#4caf50", // zielony dla wysokiego postępu
  } as const,

  // Progi dla kolorowania postępu
  PROGRESS_THRESHOLDS: {
    LOW: 33, // do 33% - czerwony
    MEDIUM: 66, // 33-66% - pomarańczowy
    HIGH: 100, // 66%+ - zielony
  } as const,
} as const;

// Typy dla stałych
export type ConnectionState =
  (typeof PLAYER_CONSTANTS.CONNECTION_STATES)[keyof typeof PLAYER_CONSTANTS.CONNECTION_STATES];
export type GameState =
  (typeof PLAYER_CONSTANTS.GAME_STATES)[keyof typeof PLAYER_CONSTANTS.GAME_STATES];
export type LogAction =
  (typeof PLAYER_CONSTANTS.LOG_ACTIONS)[keyof typeof PLAYER_CONSTANTS.LOG_ACTIONS];
