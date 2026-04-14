import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="text-7xl font-semibold tracking-tight text-white/[0.06]">404</div>
      <h1 className="mt-4 text-lg font-semibold text-white/80">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-white/30">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2558ff] px-6 py-2.5 text-sm font-semibold text-white transition hover:shadow-[0_0_20px_rgba(37,88,255,0.3)]"
      >
        Back to home
      </Link>
    </div>
  );
}
