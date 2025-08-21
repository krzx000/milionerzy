"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";

export function ImagePreloader() {
  return (
    <div className="hidden">
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_SELECTED}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_CORRECT}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.CORRECT_DEFAULT}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.CORRECT_SELECTED}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.SELECTED_DEFAULT}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
      <Image
        src={IMAGES.ANSWER_BACKGROUNDS.SELECTED_CORRECT}
        width={1920}
        height={150}
        alt="Preload"
        priority
      />
    </div>
  );
}
