import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="text-6xl font-semibold tracking-tight text-zinc-200">404</div>
      <h1 className="mt-4 text-lg font-semibold text-zinc-950">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Back to home
      </Link>
    </div>
  );
}
