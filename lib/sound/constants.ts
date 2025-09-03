// Shared sound constants for durations and file paths

export const SOUND_PATHS = {
  win: [
    "/assets/sounds/win/1_to_3 win.mp3",
    "/assets/sounds/win/1_to_3 win.mp3",
    "/assets/sounds/win/1_to_3 win.mp3",
    "/assets/sounds/win/4 win.wav",
    "/assets/sounds/win/5 win.wav",
    "/assets/sounds/win/6 win.wav",
    "/assets/sounds/win/7 win.wav",
    "/assets/sounds/win/8 win.wav",
    "/assets/sounds/win/9 win.wav",
    "/assets/sounds/win/10 win.wav",
    "/assets/sounds/win/11 win.wav",
    "/assets/sounds/win/12 win.wav",
  ],
  start: [
    "/assets/sounds/start/1_to_4-start.mp3",
    "/assets/sounds/start/1_to_4-start.mp3",
    "/assets/sounds/start/1_to_4-start.mp3",
    "/assets/sounds/start/1_to_4-start.mp3",
    "/assets/sounds/start/5 start.wav",
    "/assets/sounds/start/6 start.wav",
    "/assets/sounds/start/7 start.wav",
    "/assets/sounds/start/8 start.wav",
    "/assets/sounds/start/9 start.wav",
    "/assets/sounds/start/10 start.wav",
    "/assets/sounds/start/11 start.wav",
    "/assets/sounds/start/12 start.wav",
  ],
  lose: [
    "/assets/sounds/lose/1_to_4 lose.mp3",
    "/assets/sounds/lose/1_to_4 lose.mp3",
    "/assets/sounds/lose/1_to_4 lose.mp3",
    "/assets/sounds/lose/1_to_4 lose.mp3",
    "/assets/sounds/lose/5 lose.mp3",
    "/assets/sounds/lose/6 lose.mp3",
    "/assets/sounds/lose/7 lose.mp3",
    "/assets/sounds/lose/8 lose.mp3",
    "/assets/sounds/lose/9 lose.mp3",
    "/assets/sounds/lose/10 lose.mp3",
    "/assets/sounds/lose/11 lose.mp3",
    "/assets/sounds/lose/12 lose.mp3",
  ],
  answer: "/assets/sounds/answer/answer.wav",
} as const;

export const SOUND_DURATION_SECONDS = {
  win: [3, 3, 3, 7, 7, 7, 7, 7, 7, 8, 7, 23],
  start: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  lose: [5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6],
  answer: 5,
} as const;

export type SoundType = "start" | "answer" | "win" | "lose";
