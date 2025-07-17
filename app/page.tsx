import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen h-screen relative flex flex-col items-center justify-center bg-[url(/background.jpg)] bg-no-repeat bg-center bg-cover">
      <Image
        src={"/logo.webp"}
        alt="Logo"
        width={512}
        height={512}
        draggable={false}
        className="w-1/4 animate-pulse select-none"
      />
    </div>
  );
}
