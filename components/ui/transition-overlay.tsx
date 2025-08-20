"use client";

import * as React from "react";
import Image from "next/image";

export interface TransitionOverlayProps {
  show: boolean;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  // Jeśli podano logoSrc, pokaże logo zamiast children
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  // Callback'i
  onEnterStart?: () => void;
  onEnterComplete?: () => void;
  onExitStart?: () => void;
  onExitComplete?: () => void;
}

export function TransitionOverlay({
  show,
  duration = 300,
  className = "",
  children,
  logoSrc,
  logoAlt = "Logo",
  logoWidth = 200,
  logoHeight = 200,
  onEnterStart,
  onEnterComplete,
  onExitStart,
  onExitComplete,
}: TransitionOverlayProps) {
  // Stan do kontroli animacji
  const [isVisible, setIsVisible] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);

  // Reaguj na zmianę prop show
  React.useEffect(() => {
    if (show && !isVisible) {
      // Rozpocznij pokazywanie
      setIsVisible(true);
      onEnterStart?.();

      // Ustaw opacity po krótkim delay
      const timer = setTimeout(() => {
        setOpacity(1);
        // Callback po zakończeniu animacji wejścia
        const completeTimer = setTimeout(() => {
          onEnterComplete?.();
        }, duration);
        return () => clearTimeout(completeTimer);
      }, 10);

      return () => clearTimeout(timer);
    } else if (!show && isVisible) {
      // Rozpocznij ukrywanie
      onExitStart?.();
      setOpacity(0);

      // Po zakończeniu animacji ukryj element
      const timer = setTimeout(() => {
        setIsVisible(false);
        onExitComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [
    show,
    isVisible,
    duration,
    onEnterStart,
    onEnterComplete,
    onExitStart,
    onExitComplete,
  ]);

  // Jeśli element nie jest widoczny, nie renderuj go
  if (!isVisible) {
    return null;
  }

  const combinedClassName = `fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black ${className}`;

  const content = logoSrc ? (
    <div className="flex flex-col items-center space-y-8">
      <div className="animate-pulse">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  ) : (
    children
  );

  return (
    <div
      className={combinedClassName}
      style={{
        opacity,
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    >
      {content}
    </div>
  );
}
