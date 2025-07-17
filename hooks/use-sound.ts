"use client";

import { useCallback, useRef } from "react";

export interface SoundManager {
  playAnswerSound: () => void;
  playWinSound: () => void;
  playLoseSound: () => void;
  playStartSound: (questionLevel: number) => void;
  playLightsDown: () => void;
  stopAll: () => void;
}

export function useSound(): SoundManager {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const createAudio = useCallback((src: string): HTMLAudioElement => {
    if (typeof window === "undefined") return new Audio();

    if (audioRefs.current.has(src)) {
      return audioRefs.current.get(src)!;
    }

    const audio = new Audio(src);
    audio.preload = "auto";
    audioRefs.current.set(src, audio);
    return audio;
  }, []);

  const playSound = useCallback(
    (src: string, volume: number = 0.7) => {
      try {
        const audio = createAudio(src);
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.warn("Nie można odtworzyć dźwięku:", src, error);
        });
      } catch (error) {
        console.error("Błąd odtwarzania dźwięku:", error);
      }
    },
    [createAudio]
  );

  const playAnswerSound = useCallback(() => {
    playSound("/assets/sounds/answer/answer.wav");
  }, [playSound]);

  const playWinSound = useCallback(() => {
    // Losowo wybierz jeden z dźwięków wygranej
    const winSounds = [
      "/assets/sounds/win/win1.wav",
      "/assets/sounds/win/win2.wav",
      "/assets/sounds/win/win3.wav",
    ];
    const randomSound = winSounds[Math.floor(Math.random() * winSounds.length)];
    playSound(randomSound);
  }, [playSound]);

  const playLoseSound = useCallback(() => {
    playSound("/assets/sounds/lose/lose.wav");
  }, [playSound]);

  const playStartSound = useCallback(
    (questionLevel: number) => {
      let soundFile = "";

      if (questionLevel >= 1 && questionLevel <= 4) {
        soundFile = "/assets/sounds/start/1_to_4-start.mp3";
      } else if (questionLevel >= 5 && questionLevel <= 12) {
        soundFile = `/assets/sounds/start/${questionLevel} start.wav`;
      }

      if (soundFile) {
        playSound(soundFile);
      }
    },
    [playSound]
  );

  const playLightsDown = useCallback(() => {
    playSound("/assets/sounds/lightsdown/lightsdown.wav");
  }, [playSound]);

  const stopAll = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    playAnswerSound,
    playWinSound,
    playLoseSound,
    playStartSound,
    playLightsDown,
    stopAll,
  };
}
