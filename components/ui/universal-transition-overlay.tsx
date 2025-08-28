"use client";

import * as React from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";
import { TransitionAPI, type TransitionEventData } from "@/lib/transition/api";

export function TransitionOverlay() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Nasłuchuj na eventy transition
  React.useEffect(() => {
    const showCleanup = TransitionAPI.addEventListener(
      "show-transition",
      (data: TransitionEventData) => {
        console.log("🎬 Transition: Showing overlay", data);
        setIsVisible(true);

        // Rozpocznij animację po krótkim delay
        setTimeout(() => {
          setIsAnimating(true);
          // Emit event że transition się pokazał
          TransitionAPI.emit("transition-shown", data);
        }, 50);
      }
    );

    const hideCleanup = TransitionAPI.addEventListener(
      "hide-transition",
      (data: TransitionEventData) => {
        console.log("🎬 Transition: Hiding overlay", data);
        setIsAnimating(false);

        // Po animacji fade-out ukryj element
        setTimeout(() => {
          setIsVisible(false);
          // Emit event że transition się ukrył
          TransitionAPI.emit("transition-hidden", data);
        }, 1500); // animacja fade-out trwa 1.5s
      }
    );

    return () => {
      showCleanup();
      hideCleanup();
    };
  }, []);

  // Jeśli element nie jest widoczny, nie renderuj go
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/20 transition-all duration-[1500ms] ease-in-out ${
        isAnimating
          ? "opacity-100 backdrop-blur-2xl"
          : "opacity-0 backdrop-blur-none"
      }`}
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo z animacją */}
          <div
            className={`transition-all duration-800 ease-in-out ${
              isAnimating
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 -translate-y-16"
            }`}
          >
            <Image
              src={IMAGES.LOGO}
              alt="Logo Milionerzy"
              width={600}
              height={300}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
