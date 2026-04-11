"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-[11px] font-bold tracking-[0.15em] text-white">
            NB
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-950">
              NotABot
            </span>
            <span className="text-[11px] leading-tight text-zinc-400">
              Identity Oracle
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/docs"
            className="rounded-lg px-3.5 py-2 font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/ArturInspector/notabot"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3.5 py-2 font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            GitHub
          </Link>
          <Link
            href="https://t.me/notabot_oracle"
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};
