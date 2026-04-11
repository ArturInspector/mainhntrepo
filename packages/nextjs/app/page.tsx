"use client";

import { useState } from "react";
import Link from "next/link";

const ORACLE = "0x8Cec9277d761f947e29EBeACc4035DDCDB10c2BD";

const deployments = [
  {
    chain: "Base Sepolia",
    chainId: "84532",
    address: ORACLE,
    explorer: "BaseScan",
    url: `https://sepolia.basescan.org/address/${ORACLE}`,
  },
  {
    chain: "Status Network",
    chainId: "1660990954",
    address: ORACLE,
    explorer: "StatusScan",
    url: `https://sepoliascan.status.network/address/${ORACLE}`,
  },
] as const;

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          {label || "Copy"}
        </>
      )}
    </button>
  );
}

export default function HomePage() {
  return (
    <main className="bg-white text-zinc-950">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-zinc-200">
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.4,
          }}
        />
        {/* Subtle blue gradient glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2"
          style={{
            width: "800px",
            height: "500px",
            background: "radial-gradient(ellipse at center, rgba(37,88,255,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live on Base Sepolia &amp; Status Network
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-zinc-950">
              Identity Oracle
              <br />
              <span className="text-zinc-400">for Web3</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              One contract call to verify if a wallet is human.
              Aggregates Worldcoin, Gitcoin Passport, Proof&nbsp;of&nbsp;Humanity, and BrightID.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                View Docs
                <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
              <Link
                href="https://t.me/notabot_oracle"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-50"
              >
                Talk to Us
              </Link>
            </div>
          </div>

          {/* Quick facts */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
            {[
              { value: "1", unit: "call", label: "to check humanity" },
              { value: "4", unit: "sources", label: "aggregated" },
              { value: "~$0.0001", unit: "", label: "per verification" },
            ].map((fact) => (
              <div key={fact.label} className="bg-white px-6 py-6">
                <div className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {fact.value}
                  {fact.unit && <span className="ml-1 text-sm font-medium text-zinc-500">{fact.unit}</span>}
                </div>
                <div className="mt-1 text-sm text-zinc-500">{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integration ── */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2558ff]">
            Integration
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
            One line. That&rsquo;s the integration.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
            No SDK. No widget. No provider-specific contracts. Your dApp calls the oracle, gets a boolean.
          </p>

          {/* Dark code block */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f1117] shadow-2xl shadow-zinc-950/10">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-zinc-700" />
                  <span className="h-3 w-3 rounded-full bg-zinc-700" />
                  <span className="h-3 w-3 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs font-medium text-zinc-500">Solidity</span>
              </div>
              <CopyButton
                text={`bool isHuman = IHumanityOracle(ORACLE).isVerifiedHuman(msg.sender);`}
                label="Copy"
              />
            </div>
            <pre className="overflow-x-auto px-6 py-6 text-[15px] leading-8">
              <code>
                <span className="text-[#7dd3fc]">bool</span>
                <span className="text-zinc-300"> isHuman </span>
                <span className="text-zinc-500">= </span>
                <span className="text-[#c4b5fd]">IHumanityOracle</span>
                <span className="text-zinc-500">(</span>
                <span className="text-[#fbbf24]">ORACLE</span>
                <span className="text-zinc-500">).</span>
                <span className="text-[#86efac]">isVerifiedHuman</span>
                <span className="text-zinc-500">(</span>
                <span className="text-[#fbbf24]">msg.sender</span>
                <span className="text-zinc-500">);</span>
              </code>
            </pre>
            <div className="border-t border-zinc-800 px-6 py-3 text-sm text-zinc-500">
              <span className="text-zinc-400">2,300 gas</span>
              <span className="mx-2 text-zinc-700">&middot;</span>
              <span className="text-zinc-400">~$0.0001</span>
              <span className="mx-2 text-zinc-700">&middot;</span>
              View-only call
            </div>
          </div>

          {/* Full example */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0f1117]">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
              <span className="text-xs font-medium text-zinc-500">Full contract example</span>
              <CopyButton
                text={`import "./HumanityProtected.sol";

address constant ORACLE = ${ORACLE};

contract YourDApp is HumanityProtected {
    constructor() HumanityProtected(ORACLE) {}

    function protectedAction() external onlyHuman {
        // Only verified humans reach here
    }

    function premiumAction() external minTrustScore(2) {
        // Requires 2+ verification sources
    }
}`}
              />
            </div>
            <pre className="overflow-x-auto px-6 py-6 text-sm leading-7">
              <code>
                <span className="text-[#7dd3fc]">import</span>
                <span className="text-[#fde68a]"> &quot;./HumanityProtected.sol&quot;</span>
                <span className="text-zinc-500">;</span>
                {"\n\n"}
                <span className="text-[#7dd3fc]">address</span>
                <span className="text-zinc-500"> constant </span>
                <span className="text-[#fbbf24]">ORACLE</span>
                <span className="text-zinc-500"> = </span>
                <span className="text-zinc-400">{ORACLE}</span>
                <span className="text-zinc-500">;</span>
                {"\n\n"}
                <span className="text-[#7dd3fc]">contract</span>
                <span className="text-[#c4b5fd]"> YourDApp </span>
                <span className="text-[#7dd3fc]">is</span>
                <span className="text-[#c4b5fd]"> HumanityProtected </span>
                <span className="text-zinc-500">{"{"}</span>
                {"\n"}
                <span className="text-zinc-600">{"    "}</span>
                <span className="text-[#7dd3fc]">constructor</span>
                <span className="text-zinc-500">() </span>
                <span className="text-[#c4b5fd]">HumanityProtected</span>
                <span className="text-zinc-500">(</span>
                <span className="text-[#fbbf24]">ORACLE</span>
                <span className="text-zinc-500">) {"{}"}</span>
                {"\n\n"}
                <span className="text-zinc-600">{"    "}</span>
                <span className="text-[#7dd3fc]">function</span>
                <span className="text-[#86efac]"> protectedAction</span>
                <span className="text-zinc-500">() </span>
                <span className="text-[#7dd3fc]">external</span>
                <span className="text-[#fbbf24]"> onlyHuman </span>
                <span className="text-zinc-500">{"{"}</span>
                {"\n"}
                <span className="text-zinc-600">{"        "}</span>
                <span className="text-zinc-600">{"// Only verified humans reach here"}</span>
                {"\n"}
                <span className="text-zinc-600">{"    "}</span>
                <span className="text-zinc-500">{"}"}</span>
                {"\n\n"}
                <span className="text-zinc-600">{"    "}</span>
                <span className="text-[#7dd3fc]">function</span>
                <span className="text-[#86efac]"> premiumAction</span>
                <span className="text-zinc-500">() </span>
                <span className="text-[#7dd3fc]">external</span>
                <span className="text-[#fbbf24]"> minTrustScore</span>
                <span className="text-zinc-500">(</span>
                <span className="text-[#fde68a]">2</span>
                <span className="text-zinc-500">) {"{"}</span>
                {"\n"}
                <span className="text-zinc-600">{"        "}</span>
                <span className="text-zinc-600">{"// Requires 2+ verification sources"}</span>
                {"\n"}
                <span className="text-zinc-600">{"    "}</span>
                <span className="text-zinc-500">{"}"}</span>
                {"\n"}
                <span className="text-zinc-500">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Deployed On ── */}
      <section className="border-b border-zinc-200 bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2558ff]">
            Deployed On
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
            Verified contracts. Live explorer links.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
            Same address on every chain. Only networks with a deployed and verified contract are listed.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {/* Table header */}
            <div className="hidden border-b border-zinc-100 px-6 py-3.5 md:grid md:grid-cols-[1fr_2fr_0.6fr_0.6fr]">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Chain</span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Contract Address</span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Chain ID</span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 text-right">Explorer</span>
            </div>

            {deployments.map((d, i) => (
              <div
                key={d.chain}
                className={`grid gap-3 px-6 py-5 md:grid-cols-[1fr_2fr_0.6fr_0.6fr] md:items-center md:gap-4 ${
                  i < deployments.length - 1 ? "border-b border-zinc-100" : ""
                }`}
              >
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-400 md:hidden">Chain</div>
                  <div className="mt-1 flex items-center gap-2 md:mt-0">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-zinc-950">{d.chain}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-400 md:hidden">Address</div>
                  <div className="mt-1 flex items-center gap-2 md:mt-0">
                    <span className="break-all font-mono text-sm text-zinc-600">{d.address}</span>
                    <CopyButton text={d.address} />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-400 md:hidden">Chain ID</div>
                  <span className="mt-1 font-mono text-sm text-zinc-500 md:mt-0">{d.chainId}</span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-400 md:hidden">Explorer</div>
                  <Link
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#2558ff] transition hover:text-[#1742d1] md:mt-0"
                  >
                    {d.explorer}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Aggregate ── */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-20 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2558ff]">
                Why Aggregate
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
                One provider can be gamed.
                <br />
                <span className="text-zinc-400">A combination cannot.</span>
              </h2>

              <div className="mt-10 space-y-8">
                <div className="border-l-2 border-zinc-200 pl-5">
                  <p className="text-[15px] leading-7 text-zinc-700">
                    Combining biometric, reputation, and social-graph signals makes
                    the attack surface exponentially harder to fake. Each source covers
                    the blind spots of the others.
                  </p>
                </div>
                <div className="border-l-2 border-[#2558ff] pl-5">
                  <p className="text-[15px] leading-7 text-zinc-700">
                    <span className="font-semibold text-zinc-950">Bayesian aggregation:</span>{" "}
                    three independent sources at 90% confidence compound
                    to 99.9%. The math is straightforward, the result is meaningful.
                  </p>
                </div>
                <div className="border-l-2 border-zinc-200 pl-5">
                  <p className="text-[15px] leading-7 text-zinc-700">
                    New providers are added behind the same interface.
                    Integrators never redeploy. The oracle contract stays stable.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2558ff]">
                Built for DEXes
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
                The flows that get
                <br />
                <span className="text-zinc-400">attacked first.</span>
              </h2>

              <div className="mt-10 space-y-0 overflow-hidden rounded-2xl border border-zinc-200">
                {[
                  {
                    title: "Leveraged trading",
                    desc: "Verify before opening a position",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                    ),
                  },
                  {
                    title: "Airdrops",
                    desc: "Filter bots before token distribution",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    ),
                  },
                  {
                    title: "Governance",
                    desc: "One person, one vote",
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    ),
                  },
                ].map((uc, i) => (
                  <div
                    key={uc.title}
                    className={`flex items-start gap-4 bg-white px-6 py-5 ${
                      i > 0 ? "border-t border-zinc-100" : ""
                    }`}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                      {uc.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">{uc.title}</div>
                      <div className="mt-0.5 text-sm text-zinc-500">{uc.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Providers ── */}
      <section className="border-b border-zinc-200 bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2558ff]">
              Aggregated Sources
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
              Four independent signals. One answer.
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Worldcoin", type: "Biometric", accuracy: "99.9%" },
              { name: "Gitcoin Passport", type: "Reputation", accuracy: "90.9%" },
              { name: "Proof of Humanity", type: "Social + Video", accuracy: "79.5%" },
              { name: "BrightID", type: "Social Graph", accuracy: "85.0%" },
            ].map((src) => (
              <div key={src.name} className="flex flex-col bg-white px-5 py-6">
                <div className="text-sm font-semibold text-zinc-950">{src.name}</div>
                <div className="mt-1 text-xs text-zinc-500">{src.type}</div>
                <div className="mt-3 font-mono text-lg font-semibold text-[#2558ff]">
                  {src.accuracy}
                </div>
                <div className="text-[11px] text-zinc-400">confidence</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
            Ready to integrate?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-zinc-600">
            Read the docs, deploy the check, or talk to us about
            becoming a native identity layer for your chain.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              View Docs
            </Link>
            <Link
              href="https://t.me/notabot_oracle"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-50"
            >
              Talk to Us
            </Link>
            <Link
              href="https://github.com/ArturInspector/notabot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-7 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-50"
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
