"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { SoundAPI, type SoundEventData } from "@/lib/sound/api";

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

// Stałe czasu trwania dźwięków (w sekundach)
export const DURATION = {
  win: [3, 3, 3, 7, 7, 7, 7, 7, 7, 8, 7, 23],
  start: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  lose: [5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6],
  answer: 5, // czas trwania dźwięku odpowiedzi
};

// Tablice dźwięków
export const SOUND = {
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

export type SoundType = "start" | "answer" | "win" | "lose";

export interface SoundManager {
  // Podstawowe funkcje odtwarzania
  playAnswerSound: () => void;
  playWinSound: (questionLevel: number) => void;
  playLoseSound: (questionLevel: number) => void;
  playStartSound: (questionLevel: number) => void;

  // Funkcje z fade
  playWithFade: (
    soundPath: string,
    type: SoundType,
    fadeDuration?: number
  ) => void;
  playWinSoundWithFade: (questionLevel: number) => void;
  playLoseSoundWithFade: (questionLevel: number) => void;
  playStartSoundWithFade: (questionLevel: number) => void;
  playAnswerSoundWithFade: () => void;

  // Kontrola odtwarzania
  stopAll: () => void;
  stopCurrentAudio: () => void;
  fadeOut: (duration?: number) => void;
  isPlaying: () => boolean;
  forcePlay: (
    soundPath: string,
    type: SoundType,
    fadeDuration?: number
  ) => void;
}
export function useSound(): SoundManager {
  const { load, stop } = useAudioPlayer();

  // Oddzielne referencje dla różnych typów dźwięków
  const audioRefs = useRef<{
    start: HTMLAudioElement | null;
    answer: HTMLAudioElement | null;
    win: HTMLAudioElement | null;
    lose: HTMLAudioElement | null;
  }>({
    start: null,
    answer: null,
    win: null,
    lose: null,
  });

  // Oddzielne timeouty/intervaly dla każdego typu dźwięku
  const fadeTimeouts = useRef<{
    start: NodeJS.Timeout | null;
    answer: NodeJS.Timeout | null;
    win: NodeJS.Timeout | null;
    lose: NodeJS.Timeout | null;
  }>({
    start: null,
    answer: null,
    win: null,
    lose: null,
  });

  const fadeIntervals = useRef<{
    start: NodeJS.Timeout | null;
    answer: NodeJS.Timeout | null;
    win: NodeJS.Timeout | null;
    lose: NodeJS.Timeout | null;
  }>({
    start: null,
    answer: null,
    win: null,
    lose: null,
  });

  const isPlayingRef = useRef<boolean>(false);

  // Funkcja do zatrzymania konkretnego typu dźwięku
  const stopSpecificAudio = useCallback(
    (type: keyof typeof audioRefs.current) => {
      if (audioRefs.current[type]) {
        audioRefs.current[type]!.pause();
        audioRefs.current[type]!.currentTime = 0;
        audioRefs.current[type] = null;
      }

      // Wyczyść timeouty dla tego typu
      if (fadeTimeouts.current[type]) {
        clearTimeout(fadeTimeouts.current[type]!);
        fadeTimeouts.current[type] = null;
      }

      if (fadeIntervals.current[type]) {
        clearInterval(fadeIntervals.current[type]!);
        fadeIntervals.current[type] = null;
      }
    },
    []
  );

  // Funkcja do zatrzymania wszystkich aktualnie odtwarzanych dźwięków
  const stopCurrentAudio = useCallback(() => {
    // Zatrzymaj react-use-audio-player
    stop();

    // Zatrzymaj wszystkie custom audio
    Object.keys(audioRefs.current).forEach((type) => {
      stopSpecificAudio(type as keyof typeof audioRefs.current);
    });

    isPlayingRef.current = false;
  }, [stop, stopSpecificAudio]);

  const playSound = useCallback(
    (src: string) => {
      try {
        stopCurrentAudio(); // Zatrzymaj poprzednie dźwięki
        isPlayingRef.current = true;
        load(src, { autoplay: true });
      } catch (error) {
        console.error("Błąd odtwarzania dźwięku:", error);
        isPlayingRef.current = false;
      }
    },
    [load, stopCurrentAudio]
  );

  const createAudioWithFade = useCallback(
    (
      src: string,
      fadeDuration: number,
      type: keyof typeof audioRefs.current
    ) => {
      return new Promise<void>((resolve) => {
        // Zatrzymaj tylko ten sam typ dźwięku
        stopSpecificAudio(type);

        const audio = new Audio(src);
        audio.volume = 1;
        isPlayingRef.current = true;

        audio.addEventListener("loadeddata", () => {
          audio
            .play()
            .then(() => {
              audioRefs.current[type] = audio;

              // Scheduj fade out na końcu czasu trwania
              const fadeOutDuration = 2000; // 2 sekundy fade-out
              const playDuration = fadeDuration - fadeOutDuration; // Graj pełny czas minus fade

              fadeTimeouts.current[type] = setTimeout(() => {
                const fadeSteps = 50;
                const fadeInterval = fadeOutDuration / fadeSteps;
                const volumeStep = audio.volume / fadeSteps;

                fadeIntervals.current[type] = setInterval(() => {
                  if (audio.volume > volumeStep) {
                    audio.volume -= volumeStep;
                  } else {
                    audio.volume = 0;
                    clearInterval(fadeIntervals.current[type]!);
                    fadeIntervals.current[type] = null;
                    audioRefs.current[type] = null;
                    resolve();
                  }
                }, fadeInterval);
              }, Math.max(0, playDuration)); // Zacznij fade po playDuration
            })
            .catch((error) => {
              console.error("Błąd odtwarzania:", error);
              isPlayingRef.current = false;
              resolve();
            });
        });

        audio.addEventListener("error", (error) => {
          console.error("Błąd ładowania audio:", error);
          isPlayingRef.current = false;
          resolve();
        });
      });
    },
    [stopSpecificAudio]
  );

  const playWithFade = useCallback(
    (soundPath: string, type: SoundType, fadeDuration: number = 1000) => {
      // Sprawdź czy już gra jakiś dźwięk tego samego typu
      if (audioRefs.current[type]) {
        console.log(
          `Dźwięk typu ${type} już jest odtwarzany, zatrzymuję go i odtwarzam nowy:`,
          soundPath
        );
      }

      try {
        createAudioWithFade(soundPath, fadeDuration, type);
      } catch (error) {
        console.error("Błąd odtwarzania dźwięku z fade:", error);
        isPlayingRef.current = false;
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

  // Funkcje z automatycznym fade out
  const playAnswerSoundWithFade = useCallback(() => {
    playWithFade(SOUND.answer, "answer", DURATION.answer * 1000);
  }, [playWithFade]);

  const playWinSoundWithFade = useCallback(
    (questionLevel: number) => {
      const soundIndex = Math.max(
        0,
        Math.min(questionLevel - 1, SOUND.win.length - 1)
      );
      const duration = DURATION.win[soundIndex];
      playWithFade(SOUND.win[soundIndex], "win", duration * 1000);
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
      playWithFade(SOUND.lose[soundIndex], "lose", duration * 1000);
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
      playWithFade(SOUND.start[soundIndex], "start", duration * 1000);
    },
    [playWithFade]
  );

  const fadeOut = useCallback((duration: number = 1000) => {
    // Fade out wszystkich aktywnych dźwięków
    Object.entries(audioRefs.current).forEach(([type, audio]) => {
      if (audio) {
        const fadeSteps = 50;
        const fadeInterval = duration / fadeSteps;
        const volumeStep = audio.volume / fadeSteps;

        const fadeIntervalId = setInterval(() => {
          if (audio.volume > volumeStep) {
            audio.volume -= volumeStep;
          } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeIntervalId);
            audioRefs.current[type as keyof typeof audioRefs.current] = null;
            isPlayingRef.current = false;
          }
        }, fadeInterval);
      }
    });
  }, []);

  const stopAll = useCallback(() => {
    stopCurrentAudio();
  }, [stopCurrentAudio]);

  // Funkcja do sprawdzania czy coś gra
  const isPlaying = useCallback(() => {
    return isPlayingRef.current;
  }, []);

  // Funkcja do wymuszenia odtworzenia nowego dźwięku
  const forcePlay = useCallback(
    (soundPath: string, type: SoundType, fadeDuration?: number) => {
      stopCurrentAudio(); // Zawsze zatrzymaj przed nowym
      if (fadeDuration) {
        createAudioWithFade(soundPath, fadeDuration, type);
      } else {
        playSound(soundPath);
      }
    },
    [stopCurrentAudio, createAudioWithFade, playSound]
  );

  // Obsługa eventów dźwiękowych
  useEffect(() => {
    const handlePlaySound = (data: SoundEventData) => {
      console.log("🔊 SOUND EVENT: play-sound", data);

      const { type, questionLevel, fadeDuration } = data;

      switch (type) {
        case "win":
          if (questionLevel && fadeDuration) {
            playWinSoundWithFade(questionLevel);
          } else if (questionLevel) {
            playWinSound(questionLevel);
          }
          break;
        case "lose":
          if (questionLevel && fadeDuration) {
            playLoseSoundWithFade(questionLevel);
          } else if (questionLevel) {
            playLoseSound(questionLevel);
          }
          break;
        case "start":
          if (questionLevel && fadeDuration) {
            playStartSoundWithFade(questionLevel);
          } else if (questionLevel) {
            playStartSound(questionLevel);
          }
          break;
        case "answer":
          if (fadeDuration) {
            playAnswerSoundWithFade();
          } else {
            playAnswerSound();
          }
          break;

        default:
          console.warn("Unknown sound type:", type);
      }
    };

    const handleStopAllSounds = () => {
      console.log("🔇 SOUND EVENT: stop-all-sounds");
      stopCurrentAudio();
    };

    // Nasłuchuj na eventy
    const unsubscribePlay = SoundAPI.addEventListener(
      "play-sound",
      handlePlaySound
    );
    const unsubscribeStopAll = SoundAPI.addEventListener(
      "stop-all-sounds",
      handleStopAllSounds
    );

    return () => {
      unsubscribePlay();
      unsubscribeStopAll();
    };
  }, [
    playWinSound,
    playLoseSound,
    playStartSound,
    playAnswerSound,
    playWinSoundWithFade,
    playLoseSoundWithFade,
    playStartSoundWithFade,
    playAnswerSoundWithFade,
    stopCurrentAudio,
  ]);

  return {
    playAnswerSound,
    playWinSound,
    playLoseSound,
    playStartSound,
    playWithFade,
    playWinSoundWithFade,
    playLoseSoundWithFade,
    playStartSoundWithFade,
    playAnswerSoundWithFade,
    stopAll,
    stopCurrentAudio,
    fadeOut,
    isPlaying,
    forcePlay,
  };
}
