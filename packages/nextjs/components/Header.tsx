"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 z-40 w-full bg-[#09090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-70">
          <span className="text-[15px] font-semibold tracking-tight text-white/90">
            NotABot
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-[14px]">
          <Link href="/docs" className="text-white/30 transition hover:text-white/70">
            Docs
          </Link>
          <Link href="https://github.com/ArturInspector/notabot" target="_blank" rel="noreferrer" className="text-white/30 transition hover:text-white/70">
            GitHub
          </Link>
          <Link
            href="https://t.me/notabot_oracle"
            target="_blank"
            rel="noreferrer"
            className="text-white/30 transition hover:text-white/70"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};
