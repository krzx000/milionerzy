export const GAME_CONSTANTS = {
  AUTO_PROGRESS_TIME: 4, // sekundy
  ANSWER_CHECK_DELAY: 5000, // milisekundy
  VOTING_TIME_LIMIT: 120, // sekundy na głosowanie
  PRIZE_AMOUNTS: [
    "500 zł",
    "1 000 zł",
    "2 000 zł",
    "5 000 zł",
    "10 000 zł",
    "20 000 zł",
    "40 000 zł",
    "75 000 zł",
    "125 000 zł",
    "250 000 zł",
    "500 000 zł",
    "1 000 000 zł",
  ],
  LIFELINE_NAMES: {
    fiftyFifty: "50:50",
    phoneAFriend: "Telefon do przyjaciela",
    askAudience: "Pytanie do publiczności",
  },
  LIFELINE_ICONS: {
    fiftyFifty: "⚖️",
    phoneAFriend: "📞",
    askAudience: "👥",
  },
  GAME_STATUS_STYLES: {
    active:
      "bg-green-600/20 border border-green-600/40 dark:text-green-200 text-green-700",
    finished:
      "bg-red-600/20 border border-red-600/40 text-red-700 dark:text-red-300",
    inactive:
      "bg-gray-400/15 border dark:border-gray-600/60 border-gray-600/20 dark:text-gray-300 text-gray-600",
  },
} as const;
