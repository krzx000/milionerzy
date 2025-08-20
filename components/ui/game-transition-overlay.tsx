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
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
      <div className="min-h-screen flex items-center justify-center">
        <div className="transition-screen-logo">
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
