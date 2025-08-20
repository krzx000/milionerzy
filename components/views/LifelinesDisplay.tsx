"use client";

import * as React from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";

export interface LifelinesDisplayProps {
  lifelinesUsed: {
    fiftyFifty: boolean;
    askAudience: boolean;
    phoneAFriend: boolean;
  };
  showGameContent: boolean;
  showWinScreen: boolean;
  isTransitioning: boolean;
  isGameStartTransition: boolean;
  isSessionClosedTransition: boolean;
}

export function LifelinesDisplay({
  lifelinesUsed,
  showGameContent,
  showWinScreen,
  isTransitioning,
  isGameStartTransition,
  isSessionClosedTransition,
}: LifelinesDisplayProps) {
  return (
    <div
      className={`flex justify-center gap-4 transition-all duration-500 ${
        !showGameContent ||
        showWinScreen ||
        isTransitioning ||
        isGameStartTransition ||
        isSessionClosedTransition
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      }`}
    >
      {/* 50:50 */}
      <Image
        src={
          lifelinesUsed.fiftyFifty
            ? IMAGES.LIFELINES_BACKGROUND.FIFTY_FIFTY.USED
            : IMAGES.LIFELINES_BACKGROUND.FIFTY_FIFTY.AVAILABLE
        }
        alt="Koło ratunkowe 50:50"
        width={512}
        height={512}
        draggable={false}
        className="w-[120px] h-auto select-none transition-opacity"
        priority
      />
      {/* Publiczność */}
      <Image
        src={
          lifelinesUsed.askAudience
            ? IMAGES.LIFELINES_BACKGROUND.VOTING.USED
            : IMAGES.LIFELINES_BACKGROUND.VOTING.AVAILABLE
        }
        alt="Koło ratunkowe - pytanie do publiczności"
        width={512}
        height={512}
        draggable={false}
        className="w-[120px] h-auto select-none transition-opacity"
        priority
      />
      {/* Telefon */}
      <Image
        src={
          lifelinesUsed.phoneAFriend
            ? IMAGES.LIFELINES_BACKGROUND.PHONE.USED
            : IMAGES.LIFELINES_BACKGROUND.PHONE.AVAILABLE
        }
        alt="Koło ratunkowe - telefon do przyjaciela"
        width={512}
        height={512}
        draggable={false}
        className="w-[120px] h-auto select-none transition-opacity"
        priority
      />
    </div>
  );
}
