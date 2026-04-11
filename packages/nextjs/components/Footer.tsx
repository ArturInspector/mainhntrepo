import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-[10px] font-bold tracking-[0.15em] text-white">
                NB
              </span>
              <span className="text-sm font-semibold text-zinc-950">NotABot</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Identity Oracle for Web3. One contract call to verify
              if a wallet is human.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
            <Link
              href="https://github.com/ArturInspector/notabot"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-zinc-950"
            >
              GitHub
            </Link>
            <Link
              href="https://t.me/notabot_oracle"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-zinc-950"
            >
              Telegram
            </Link>
            <Link href="/docs" className="transition hover:text-zinc-950">
              Docs
            </Link>

            {/* ETH Bishkek Winner */}
            <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-2">
              <Image
                src="/eth-bishkek-logo.png"
                alt="ETH Bishkek 2025 Winner"
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
              <div className="leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2558ff]">
                  Winner
                </div>
                <div className="text-xs font-medium text-zinc-700">
                  ETH Bishkek 2025
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-zinc-100 pt-6">
          <p className="text-xs text-zinc-400">
            Built for DEXes, L1/L2 chains, and dApp developers.
          </p>
        </div>
      </div>
    </footer>
  );
};
