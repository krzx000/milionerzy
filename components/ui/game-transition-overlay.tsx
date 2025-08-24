"use client";

import * as React from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";

export interface GameTransitionOverlayProps {
  isVisible: boolean;
  logoAlt?: string;
}

export function GameTransitionOverlay({
  isVisible,
  logoAlt = "Logo Milionerzy",
}: GameTransitionOverlayProps) {
  const [shouldMount, setShouldMount] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      // Rozpocznij pokazywanie - najpierw zamontuj element
      setShouldMount(true);
      setIsExiting(false);
      // Następnie po krótkim delay rozpocznij animację
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else if (shouldMount && !isExiting) {
      // Rozpocznij ukrywanie - ustaw flagę wyjścia
      setIsExiting(true);
      setIsAnimating(false);
      // Po zakończeniu animacji wyjścia (0.8s) odmontuj element
      const timer = setTimeout(() => {
        setShouldMount(false);
        setIsExiting(false);
      }, 800); // animacja fade-out trwa 0.8s
      return () => clearTimeout(timer);
    }
  }, [isVisible, shouldMount, isExiting]);

  if (!shouldMount) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/20 ${
        isExiting
          ? "transition-screen-overlay fade-out"
          : isAnimating
          ? "transition-screen-overlay"
          : "opacity-0"
      }`}
    >
      <div className="min-h-screen flex items-center justify-center">
        <div
          className={
            isExiting
              ? "transition-screen-logo fade-out"
              : isAnimating
              ? "transition-screen-logo"
              : "opacity-0"
          }
          style={{
            transform:
              !isAnimating && !isExiting
                ? "translateY(-35vh) scale(0.5)"
                : undefined,
            transition: "all 0.1s ease-out",
          }}
        >
          <Image
            src={IMAGES.LOGO}
            alt={logoAlt}
            width={600}
            height={300}
            className="drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
