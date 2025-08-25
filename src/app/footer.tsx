import Image from "next/image";
import hegraLogo from "@/assets/hegra.jpg"; // adjust path if needed

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black text-gray-400">
      <div className="mx-auto max-w-7xl h-16 px-4 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-1">
          <Image
            src={hegraLogo}
            alt="Hegra Logo"
            width={32}
            height={32}
            priority
            className="rounded"
          />
          {/* <span className="text-gray-300 font-medium text-sm">Hegra Innovation</span> */}
        </div>
        {/* Copyright text centered */}
        <p className="text-[11px] sm:text-xs text-center">
          &copy; {new Date().getFullYear()} Hegra Innovation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
