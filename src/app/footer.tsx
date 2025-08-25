import Image from "next/image";
import hegraLogo from "@/assets/hegra.jpg";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-16 bg-black text-gray-400 z-50" style={{ zIndex: 9999 }}>
      <div className="mx-auto max-w-7xl h-full px-4 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-1">
          <Image
            src={hegraLogo}
            alt="Hegra Logo"
            width={24}
            height={24}
            className="rounded"
            priority
          />
        </div>
        <p className="text-[11px] sm:text-xs text-center">
          &copy; {new Date().getFullYear()} Hegra Innovation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}