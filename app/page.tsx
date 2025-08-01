import { IMAGES } from "@/lib/utils/game-assets";
import Image from "next/image";

export default function Home() {
  return (
    <div
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
      className={`w-screen h-screen relative flex flex-col items-center justify-center bg-no-repeat bg-center bg-cover`}
    >
      <Image
        src={IMAGES.LOGO}
        alt="Logo"
        width={512}
        height={512}
        draggable={false}
        className="w-1/4 animate-pulse select-none"
      />
    </div>
  );
}
