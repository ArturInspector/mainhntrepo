"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-300 text-sm font-semibold tracking-[0.2em] text-zinc-900">
            NB
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-950">
              NotABot
            </span>
            <span className="text-xs text-zinc-500">
              Identity Oracle for Web3
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/docs"
            className="rounded-full px-4 py-2 font-medium text-zinc-700 transition hover:text-zinc-950"
          >
            Docs
          </Link>
          <Link
            href="https://t.me/notabot"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-300 px-4 py-2 font-medium text-zinc-900 transition hover:border-zinc-900"
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </header>
  );
};
