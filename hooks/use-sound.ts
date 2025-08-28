"use client";

import { useCallback, useRef } from "react";
import { useAudioPlayer } from "react-use-audio-player";

// Importy plików dźwiękowych
const n1to3win = "/assets/sounds/win/1_to_3 win.mp3";
const win4 = "/assets/sounds/win/4 win.wav";
const win5 = "/assets/sounds/win/5 win.wav";
const win6 = "/assets/sounds/win/6 win.wav";
const win7 = "/assets/sounds/win/7 win.wav";
const win8 = "/assets/sounds/win/8 win.wav";
const win9 = "/assets/sounds/win/9 win.wav";
const win10 = "/assets/sounds/win/10 win.wav";
const win11 = "/assets/sounds/win/11 win.wav";
const win12 = "/assets/sounds/win/12 win.wav";

const n1to4start = "/assets/sounds/start/1_to_4-start.mp3";
const start5 = "/assets/sounds/start/5 start.wav";
const start6 = "/assets/sounds/start/6 start.wav";
const start7 = "/assets/sounds/start/7 start.wav";
const start8 = "/assets/sounds/start/8 start.wav";
const start9 = "/assets/sounds/start/9 start.wav";
const start10 = "/assets/sounds/start/10 start.wav";
const start11 = "/assets/sounds/start/11 start.wav";
const start12 = "/assets/sounds/start/12 start.wav";

const n1to4lose = "/assets/sounds/lose/1_to_4 lose.mp3";
const lose5 = "/assets/sounds/lose/5 lose.mp3";
const lose6 = "/assets/sounds/lose/6 lose.mp3";
const lose7 = "/assets/sounds/lose/7 lose.mp3";
const lose8 = "/assets/sounds/lose/8 lose.mp3";
const lose9 = "/assets/sounds/lose/9 lose.mp3";
const lose10 = "/assets/sounds/lose/10 lose.mp3";
const lose11 = "/assets/sounds/lose/11 lose.mp3";
const lose12 = "/assets/sounds/lose/12 lose.mp3";

const answer = "/assets/sounds/answer/answer.wav";
const lightsDown = "/assets/sounds/lightsdown/start lights down.wav";

// Stałe czasu trwania dźwięków (w sekundach)
export const DURATION = {
  win: [3, 3, 3, 9, 9, 9, 9, 9, 7, 8, 9, 23],
  start: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  lose: [5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6],
  answer: 5, // czas trwania dźwięku odpowiedzi
  lightsDown: 3, // czas trwania dźwięku wygaszania świateł
};

// Tablice dźwięków
export const SOUND = {
  lightsDown,
  answer,
  win: [
    n1to3win,
    n1to3win,
    n1to3win,
    win4,
    win5,
    win6,
    win7,
    win8,
    win9,
    win10,
    win11,
    win12,
  ],
  start: [
    n1to4start,
    n1to4start,
    n1to4start,
    n1to4start,
    start5,
    start6,
    start7,
    start8,
    start9,
    start10,
    start11,
    start12,
  ],
  lose: [
    n1to4lose,
    n1to4lose,
    n1to4lose,
    n1to4lose,
    lose5,
    lose6,
    lose7,
    lose8,
    lose9,
    lose10,
    lose11,
    lose12,
  ],
};

export interface SoundManager {
  // Podstawowe funkcje odtwarzania
  playAnswerSound: () => void;
  playWinSound: (questionLevel: number) => void;
  playLoseSound: (questionLevel: number) => void;
  playStartSound: (questionLevel: number) => void;
  playLightsDown: () => void;

  // Funkcje z fade
  playWithFade: (soundPath: string, fadeDuration?: number) => void;
  playWinSoundWithFade: (questionLevel: number) => void;
  playLoseSoundWithFade: (questionLevel: number) => void;
  playStartSoundWithFade: (questionLevel: number) => void;
  playAnswerSoundWithFade: () => void;

  // Kontrola odtwarzania
  stopAll: () => void;
  fadeOut: (duration?: number) => void;
}

export function useSound(): SoundManager {
  const { load, stop } = useAudioPlayer();
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = useCallback(
    (src: string) => {
      try {
        load(src, { autoplay: true });
      } catch (error) {
        console.error("Błąd odtwarzania dźwięku:", error);
      }
    },
    [load]
  );

  const createAudioWithFade = useCallback(
    (src: string, fadeDuration: number) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio(src);
        audio.volume = 1;

        audio.addEventListener("loadeddata", () => {
          audio
            .play()
            .then(() => {
              currentAudioRef.current = audio;

              // Scheduj fade out na 95% czasu trwania
              const fadeStartTime = fadeDuration * 0.05;
              const fadeDuration95 = fadeDuration * 0.9; // 90% total duration for fade

              fadeTimeoutRef.current = setTimeout(() => {
                const fadeSteps = 50;
                const fadeInterval = fadeDuration95 / fadeSteps;
                const volumeStep = audio.volume / fadeSteps;

                const fadeInterval_id = setInterval(() => {
                  if (audio.volume > volumeStep) {
                    audio.volume -= volumeStep;
                  } else {
                    audio.volume = 0;
                    clearInterval(fadeInterval_id);
                    resolve();
                  }
                }, fadeInterval);
              }, fadeStartTime);
            })
            .catch((error) => {
              console.error("Błąd odtwarzania:", error);
              resolve();
            });
        });

        audio.addEventListener("error", (error) => {
          console.error("Błąd ładowania audio:", error);
          resolve();
        });
      });
    },
    []
  );

  const playWithFade = useCallback(
    (soundPath: string, fadeDuration: number = 1000) => {
      try {
        createAudioWithFade(soundPath, fadeDuration);
      } catch (error) {
        console.error("Błąd odtwarzania dźwięku z fade:", error);
      }
    },
    [createAudioWithFade]
  );

  const playAnswerSound = useCallback(() => {
    playSound(SOUND.answer);
  }, [playSound]);

  const playWinSound = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.win.length - 1)
      );
      playSound(SOUND.win[soundIndex]);
    },
    [playSound]
  );

  const playLoseSound = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.lose.length - 1)
      );
      playSound(SOUND.lose[soundIndex]);
    },
    [playSound]
  );

  const playStartSound = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.start.length - 1)
      );
      playSound(SOUND.start[soundIndex]);
    },
    [playSound]
  );

  const playLightsDown = useCallback(() => {
    playSound(SOUND.lightsDown);
  }, [playSound]);

  // Funkcje z automatycznym fade out
  const playAnswerSoundWithFade = useCallback(() => {
    playWithFade(SOUND.answer, DURATION.answer * 1000);
  }, [playWithFade]);

  const playWinSoundWithFade = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.win.length - 1)
      );
      const duration = DURATION.win[soundIndex];
      playWithFade(SOUND.win[soundIndex], duration * 1000);
    },
    [playWithFade]
  );

  const playLoseSoundWithFade = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.lose.length - 1)
      );
      const duration = DURATION.lose[soundIndex];
      playWithFade(SOUND.lose[soundIndex], duration * 1000);
    },
    [playWithFade]
  );

  const playStartSoundWithFade = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.start.length - 1)
      );
      const duration = DURATION.start[soundIndex];
      playWithFade(SOUND.start[soundIndex], duration * 1000);
    },
    [playWithFade]
  );

  const fadeOut = useCallback((duration: number = 1000) => {
    if (currentAudioRef.current) {
      const audio = currentAudioRef.current;
      const fadeSteps = 50;
      const fadeInterval = duration / fadeSteps;
      const volumeStep = audio.volume / fadeSteps;

      const fadeInterval_id = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval_id);
        }
      }, fadeInterval);
    }
  }, []);

  const stopAll = useCallback(() => {
    stop();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
  }, [stop]);

  return {
    playAnswerSound,
    playWinSound,
    playLoseSound,
    playStartSound,
    playLightsDown,
    playWithFade,
    playWinSoundWithFade,
    playLoseSoundWithFade,
    playStartSoundWithFade,
    playAnswerSoundWithFade,
    stopAll,
    fadeOut,
  };
}
