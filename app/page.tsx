import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-screen h-screen relative flex flex-col items-center justify-center bg-[url(/background.jpg)] bg-no-repeat bg-center bg-cover">
      <Image
        src={"/logo.webp"}
        alt="Logo"
        width={512}
        height={512}
        className="w-1/4 animate-pulse"
      />
      <Link className="absolute bottom-16" href={"/admin"}>
        <Button variant={"teritary"}>Widok prowadzącego</Button>
      </Link>
    </div>
  );
}
