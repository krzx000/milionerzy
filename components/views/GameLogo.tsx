"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";

interface GameLogoProps {
  isTransitioning: boolean;
}

export function GameLogo({ isTransitioning }: GameLogoProps) {
  return (
    <div className="flex justify-center">
      <Image
        src={IMAGES.LOGO}
        alt="Logo"
        width={512}
        height={512}
        draggable={false}
        className={`w-1/4 select-none transition-all duration-500 ${
          isTransitioning ? "opacity-50" : "opacity-100"
        }`}
        id="main-logo"
      />
    </div>
  );
}
