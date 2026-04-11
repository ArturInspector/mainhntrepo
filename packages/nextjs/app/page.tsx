import Link from "next/link";

const oracleAddress = "0x8Cec9277d761f947e29EBeACc4035DDCDB10c2BD";

const integrationSnippet =
  "bool isHuman = IHumanityOracle(ORACLE).isVerifiedHuman(msg.sender);";

const deployments = [
  {
    chain: "Base Sepolia",
    address: oracleAddress,
    explorerLabel: "BaseScan",
    explorerUrl: `https://sepolia.basescan.org/address/${oracleAddress}`,
  },
  {
    chain: "Status Sepolia",
    address: oracleAddress,
    explorerLabel: "Status Scan",
    explorerUrl: `https://sepoliascan.status.network/address/${oracleAddress}`,
  },
] as const;

const aggregationReasons = [
  "One provider can be gamed. Combining biometric, reputation, and social-graph signals makes the attack surface materially harder to fake.",
  "Bayesian aggregation matters. Three independent sources at 90% confidence compound toward 99.9%, which is meaningfully stronger than a single pass/fail check.",
  "Integrators should not redeploy every time a new source appears. The oracle contract stays stable while new providers are added behind the same interface.",
] as const;

const dexUseCases = [
  {
    title: "Leveraged trading",
    description: "verify before opening a position",
  },
  {
    title: "Airdrops",
    description: "filter bots before token distribution",
  },
  {
    title: "Governance",
    description: "one person, one vote",
  },
] as const;

const productFacts = [
  "One contract call for human verification.",
  "Aggregates Worldcoin, Gitcoin Passport, PoH, and BrightID.",
  "Built for DEXes, L1/L2 chains, and dApp teams.",
] as const;

export default function HomePage() {
  return (
    <main className="bg-white text-zinc-950">
      <section className="border-b border-zinc-200">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-18 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:items-end lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#2558ff]">
              For DEXes, L1/L2 chains, and dApp developers
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-6xl lg:text-7xl">
              Identity Oracle for Web3
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              One contract call to verify if a wallet is human. Aggregates
              Worldcoin, Gitcoin Passport, PoH, BrightID.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full bg-[#2558ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1742d1]"
              >
                View Docs
              </Link>
              <Link
                href="https://t.me/notabot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
              >
                Talk to Us
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Product in one read
            </p>
            <ul className="mt-6 space-y-5">
              {productFacts.map(fact => (
                <li
                  key={fact}
                  className="border-l-2 border-[#2558ff] pl-4 text-base leading-7 text-zinc-700"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2558ff]">
              Integration
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
              Show the check. Skip the pitch deck.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
              This is the call an integrator needs to see. No widget. No
              wallet-first flow. No provider-specific contract changes.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 text-sm text-zinc-500">
              <span className="font-medium text-zinc-700">Solidity</span>
              <span>View-only oracle check</span>
            </div>
            <pre className="overflow-x-auto px-5 py-6 text-sm leading-7 text-zinc-900 sm:px-6 sm:py-8 sm:text-[15px]">
              <code className="font-mono">{integrationSnippet}</code>
            </pre>
            <div className="border-t border-zinc-200 px-5 py-4 text-sm text-zinc-600 sm:px-6">
              2,300 gas. ~$0.0001 per check. View-only call.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/70">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2558ff]">
              Deployed On
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
              Verified contracts, live explorer links.
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-[28px] border border-zinc-200 bg-white">
            <div className="hidden grid-cols-[1.1fr_1.7fr_0.8fr] gap-4 border-b border-zinc-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 md:grid">
              <span>Chain</span>
              <span>Address</span>
              <span>Explorer</span>
            </div>

            <div>
              {deployments.map(deployment => (
                <div
                  key={deployment.chain}
                  className="grid gap-3 border-b border-zinc-200 px-6 py-5 last:border-b-0 md:grid-cols-[1.1fr_1.7fr_0.8fr] md:items-center md:gap-4"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 md:hidden">
                      Chain
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-950 md:mt-0">
                      {deployment.chain}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 md:hidden">
                      Address
                    </div>
                    <div className="mt-1 break-all font-mono text-sm text-zinc-700 md:mt-0">
                      {deployment.address}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 md:hidden">
                      Explorer
                    </div>
                    <Link
                      href={deployment.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-sm font-medium text-[#2558ff] transition hover:text-[#1742d1] md:mt-0"
                    >
                      {deployment.explorerLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2558ff]">
              Why Aggregate
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
              The contract stays simple. The signal gets stronger.
            </h2>
            <div className="mt-8 space-y-7">
              {aggregationReasons.map((reason, index) => (
                <div key={reason} className="max-w-2xl">
                  <div className="text-sm font-semibold text-[#2558ff]">
                    0{index + 1}
                  </div>
                  <p className="mt-2 text-base leading-7 text-zinc-700 sm:text-lg">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2558ff]">
              Built for DEXes
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
              Clear checks for the flows that get attacked first.
            </h2>
            <div className="mt-8 divide-y divide-zinc-200 rounded-[28px] border border-zinc-200 bg-zinc-50">
              {dexUseCases.map(useCase => (
                <div
                  key={useCase.title}
                  className="px-6 py-5 text-base leading-7 text-zinc-700"
                >
                  <span className="font-semibold text-zinc-950">
                    {useCase.title}:
                  </span>{" "}
                  {useCase.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
