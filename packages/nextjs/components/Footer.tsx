import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#09090b]">
      <div className="mx-auto max-w-5xl px-6 pb-12 pt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6 text-[13px] text-white/20">
            <span className="font-medium text-white/40">NotABot</span>
            <Link href="https://github.com/ArturInspector/notabot" target="_blank" rel="noreferrer" className="transition hover:text-white/40">
              GitHub
            </Link>
            <Link href="https://t.me/notabot_oracle" target="_blank" rel="noreferrer" className="transition hover:text-white/40">
              Telegram
            </Link>
            <Link href="/docs" className="transition hover:text-white/40">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Image
              src="/eth-bishkek-logo.png"
              alt="ETH Bishkek 2025"
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-full object-cover opacity-60"
            />
            <span className="text-[12px] text-white/20">
              ETH Bishkek 2025 Winner
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
