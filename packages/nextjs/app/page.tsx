"use client";

import { useState } from "react";
import Link from "next/link";
import { ConcordiumVerify } from "../components/ConcordiumVerify";

const ORACLE = "0x8Cec9277d761f947e29EBeACc4035DDCDB10c2BD";

const deployments = [
  { chain: "Base Sepolia", chainId: "84532", explorer: "BaseScan", url: `https://sepolia.basescan.org/address/${ORACLE}` },
  { chain: "Status Network", chainId: "1660990954", explorer: "StatusScan", url: `https://sepoliascan.status.network/address/${ORACLE}` },
] as const;

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="text-[13px] text-white/20 transition hover:text-white/50"
    >
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

export default function HomePage() {
  return (
    <main className="bg-[#09090b] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Gradient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2" style={{
          width: "1200px", height: "700px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(37,88,255,0.12) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)",
        }} />

        <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-32 lg:pb-44 lg:pt-44">
          <p className="text-sm text-white/30">
            Live on Base Sepolia &amp; Status Network
          </p>

          <h1 className="mt-6 text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em]">
            Identity Oracle
            <br />
            <span className="bg-gradient-to-r from-[#2558ff] via-[#6366f1] to-[#7c3aed] bg-clip-text text-transparent">
              for Web3
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-white/35">
            One contract call to verify if a wallet is human.
            Aggregates Worldcoin, Gitcoin Passport, Proof&nbsp;of&nbsp;Humanity, and BrightID.
          </p>

          <div className="mt-12 flex gap-4">
            <Link
              href="/docs"
              className="rounded-full bg-white px-6 py-2.5 text-[14px] font-medium text-black transition hover:bg-white/90"
            >
              View Docs
            </Link>
            <Link
              href="https://t.me/notabot_oracle"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-6 py-2.5 text-[14px] font-medium text-white/50 transition hover:text-white/80"
            >
              Talk to Us &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Integration ── */}
      <section className="mx-auto max-w-5xl px-6 pb-32 lg:pb-44">
        <p className="text-sm tracking-wide text-[#2558ff]">
          Integration
        </p>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
          One line. That&rsquo;s it.
        </h2>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/30">
          No SDK. No widget. No provider-specific contracts.
        </p>

        <div className="mt-12 rounded-xl bg-white/[0.03] px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-white/15">Solidity</span>
            <CopyBtn text="bool isHuman = IHumanityOracle(ORACLE).isVerifiedHuman(msg.sender);" />
          </div>
          <pre className="mt-4 overflow-x-auto text-[15px] leading-8">
            <code>
              <span className="text-[#7dd3fc]">bool</span>
              <span className="text-white/70"> isHuman </span>
              <span className="text-white/25">= </span>
              <span className="text-[#c4b5fd]">IHumanityOracle</span>
              <span className="text-white/25">(</span>
              <span className="text-[#fbbf24]">ORACLE</span>
              <span className="text-white/25">).</span>
              <span className="text-[#86efac]">isVerifiedHuman</span>
              <span className="text-white/25">(</span>
              <span className="text-[#fbbf24]">msg.sender</span>
              <span className="text-white/25">);</span>
            </code>
          </pre>
          <p className="mt-4 text-[13px] text-white/15">
            2,300 gas · ~$0.0001 · View-only call
          </p>
        </div>

        <details className="group mt-4">
          <summary className="cursor-pointer text-[14px] text-white/20 transition hover:text-white/40">
            Full contract example
          </summary>
          <div className="mt-4 rounded-xl bg-white/[0.03] px-6 py-5">
            <div className="flex justify-end">
              <CopyBtn text={`import "./HumanityProtected.sol";\n\naddress constant ORACLE = ${ORACLE};\n\ncontract YourDApp is HumanityProtected {\n    constructor() HumanityProtected(ORACLE) {}\n\n    function protectedAction() external onlyHuman {\n        // Only verified humans\n    }\n\n    function premiumAction() external minTrustScore(2) {\n        // 2+ verification sources\n    }\n}`} />
            </div>
            <pre className="mt-2 overflow-x-auto text-[14px] leading-7">
              <code>
                <span className="text-[#7dd3fc]">import</span>
                <span className="text-[#fde68a]"> &quot;./HumanityProtected.sol&quot;</span>
                <span className="text-white/25">;</span>
                {"\n\n"}
                <span className="text-[#7dd3fc]">address</span>
                <span className="text-white/25"> constant </span>
                <span className="text-[#fbbf24]">ORACLE</span>
                <span className="text-white/25"> = </span>
                <span className="text-white/30">{ORACLE}</span>
                <span className="text-white/25">;</span>
                {"\n\n"}
                <span className="text-[#7dd3fc]">contract</span>
                <span className="text-[#c4b5fd]"> YourDApp </span>
                <span className="text-[#7dd3fc]">is</span>
                <span className="text-[#c4b5fd]"> HumanityProtected </span>
                <span className="text-white/25">{"{"}</span>
                {"\n    "}
                <span className="text-[#7dd3fc]">constructor</span>
                <span className="text-white/25">() </span>
                <span className="text-[#c4b5fd]">HumanityProtected</span>
                <span className="text-white/25">(</span>
                <span className="text-[#fbbf24]">ORACLE</span>
                <span className="text-white/25">) {"{}"}</span>
                {"\n\n    "}
                <span className="text-[#7dd3fc]">function</span>
                <span className="text-[#86efac]"> protectedAction</span>
                <span className="text-white/25">() </span>
                <span className="text-[#7dd3fc]">external</span>
                <span className="text-[#fbbf24]"> onlyHuman </span>
                <span className="text-white/25">{"{"}</span>
                {"\n        "}
                <span className="text-white/15">{"// Only verified humans"}</span>
                {"\n    "}
                <span className="text-white/25">{"}"}</span>
                {"\n\n    "}
                <span className="text-[#7dd3fc]">function</span>
                <span className="text-[#86efac]"> premiumAction</span>
                <span className="text-white/25">() </span>
                <span className="text-[#7dd3fc]">external</span>
                <span className="text-[#fbbf24]"> minTrustScore</span>
                <span className="text-white/25">(</span>
                <span className="text-[#fde68a]">2</span>
                <span className="text-white/25">) {"{"}</span>
                {"\n        "}
                <span className="text-white/15">{"// 2+ verification sources"}</span>
                {"\n    "}
                <span className="text-white/25">{"}"}</span>
                {"\n"}
                <span className="text-white/25">{"}"}</span>
              </code>
            </pre>
          </div>
        </details>
      </section>

      {/* ── Deployed On ── */}
      <section className="mx-auto max-w-5xl px-6 pb-32 lg:pb-44">
        <p className="text-sm tracking-wide text-[#2558ff]">
          Deployed
        </p>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
          Live on-chain
        </h2>

        <div className="mt-12 space-y-6">
          {deployments.map((d) => (
            <div key={d.chain} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="w-40 shrink-0 text-[15px] font-medium text-white/60">{d.chain}</span>
              <span className="font-mono text-[14px] text-white/20">{ORACLE}</span>
              <span className="font-mono text-[13px] text-white/12">{d.chainId}</span>
              <Link href={d.url} target="_blank" rel="noreferrer" className="text-[14px] text-[#2558ff] transition hover:text-[#5b82ff]">
                {d.explorer} ↗
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Aggregate ── */}
      <section className="mx-auto max-w-5xl px-6 pb-32 lg:pb-44">
        <p className="text-sm tracking-wide text-[#2558ff]">
          Why aggregate
        </p>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
          One provider can be gamed.
          <span className="text-white/20"> A combination cannot.</span>
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-3">
          <div>
            <p className="text-[15px] leading-7 text-white/35">
              Combining biometric, reputation, and social-graph signals
              makes the attack surface exponentially harder to fake.
            </p>
          </div>
          <div>
            <p className="text-[15px] leading-7 text-white/35">
              <span className="text-white/60">Bayesian aggregation.</span>{" "}
              Three independent sources at 90% confidence compound to 99.9%.
            </p>
          </div>
          <div>
            <p className="text-[15px] leading-7 text-white/35">
              New providers are added behind the same interface.
              Integrators never redeploy.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sources ── */}
      <section className="mx-auto max-w-5xl px-6 pb-32 lg:pb-44">
        <p className="text-sm tracking-wide text-[#2558ff]">
          Sources
        </p>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
          Four signals. One answer.
        </h2>

        <div className="mt-14 grid gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Worldcoin", type: "Biometric", acc: "99.9%", color: "#22c55e" },
            { name: "Gitcoin Passport", type: "Reputation", acc: "90.9%", color: "#2558ff" },
            { name: "Proof of Humanity", type: "Social + Video", acc: "79.5%", color: "#7c3aed" },
            { name: "BrightID", type: "Social Graph", acc: "85.0%", color: "#f59e0b" },
            { name: "Concordium", type: "KYC Protocol", acc: "97.0%", color: "#0cb88e" },
          ].map((src) => (
            <div key={src.name}>
              <p className="text-[14px] font-medium text-white/50">{src.name}</p>
              <p className="mt-1 text-[13px] text-white/20">{src.type}</p>
              <p className="mt-3 font-mono text-3xl font-medium" style={{ color: src.color }}>
                {src.acc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="mx-auto max-w-5xl px-6 pb-32 lg:pb-44">
        <p className="text-sm tracking-wide text-[#2558ff]">
          Use cases
        </p>
        <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
          Built for DEXes
        </h2>

        <div className="mt-14 space-y-8">
          {[
            { title: "Leveraged trading", desc: "Verify before opening a position" },
            { title: "Airdrops", desc: "Filter bots before token distribution" },
            { title: "Governance", desc: "One person, one vote" },
          ].map((uc) => (
            <div key={uc.title} className="flex items-baseline gap-6">
              <span className="text-[17px] font-medium text-white/70">{uc.title}</span>
              <span className="text-[15px] text-white/20">{uc.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Concordium verification ── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <p className="text-sm tracking-wide text-[#0cb88e]">New</p>
        <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.2rem)] font-medium leading-tight tracking-[-0.03em]">
          Verify with Concordium
        </h2>
        <p className="mt-3 max-w-md text-[15px] text-white/30">
          The only L1 with KYC at the protocol level. Your identity stays private — only the proof goes on-chain.
        </p>
        <div className="mt-8 max-w-md">
          <ConcordiumVerify
            concordiumAdapterAddress={process.env.NEXT_PUBLIC_CONCORDIUM_ADAPTER_ADDRESS as `0x${string}` ?? "0x0000000000000000000000000000000000000000"}
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(37,88,255,0.06) 0%, transparent 50%)",
        }} />
        <div className="relative mx-auto max-w-5xl px-6 pb-36 pt-8 text-center lg:pb-48">
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight tracking-[-0.03em]">
            Ready to integrate?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/25">
            Read the docs, deploy the check, or talk to us about
            becoming a native identity layer for your chain.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="rounded-full bg-white px-6 py-2.5 text-[14px] font-medium text-black transition hover:bg-white/90"
            >
              View Docs
            </Link>
            <Link href="https://t.me/notabot_oracle" target="_blank" rel="noreferrer" className="rounded-full px-6 py-2.5 text-[14px] font-medium text-white/50 transition hover:text-white/80">
              Talk to Us &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
