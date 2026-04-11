import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="text-sm font-semibold text-zinc-950">NotABot</div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            Identity Oracle for Web3. One contract call to verify if a wallet is
            human.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-700">
            <Link
              href="https://github.com/ArturInspector/notabot"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-zinc-950"
            >
              GitHub
            </Link>
            <Link
              href="https://t.me/notabot"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-zinc-950"
            >
              Telegram
            </Link>
          </div>
        </div>

        <div className="inline-flex items-center gap-4 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3">
          <Image
            src="/eth-bishkek-logo.png"
            alt="ETH Bishkek Winner badge"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2558ff]">
              Winner
            </div>
            <div className="text-sm font-medium text-zinc-900">
              ETH Bishkek 2025
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
