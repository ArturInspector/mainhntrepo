# Identity Layer: Radical Critiques & Non-Obvious Integrations

## 5 Radical Things About This Project

### 1. This Is a Proof-of-Action Log, Not an Identity Layer

The contracts record that a verification happened at a point in time. There is no persistent claim, no schema, no selective disclosure. When a dApp calls `isVerified(user)` it gets a boolean and a timestamp — not a credential. The user cannot prove *what* was verified, to *whom*, or for *what purpose* without re-running the entire flow. This is a log system with an identity skin on top.

**What it should be**: a credential system where users hold signed claims they can present selectively without going back to the oracle.

---

### 2. The Bayesian Math Is Miscalibrated

`MainAggregator` stores `sourceConfidences` as fractions and multiplies them together. Worldcoin is `9500/9501 ≈ 0.9999`. One Worldcoin verification pushes the final score to ~99.99%. Every other source contributes noise.

If Worldcoin is compromised or unavailable, the remaining sources give scores in the 60-70% range — which are then meaningless because every integration has set their threshold near 95%.

The calibration values were chosen intuitively, not empirically. There is no dataset backing them, no way to recalibrate, and no mechanism to adjust weights per-use-case. A lending protocol and a social app have completely different risk tolerances.

---

### 3. The Oracle Is a Single Point of Failure

Four adapters — Gitcoin, WorldID, Proof of Humanity, Concordium — all verify the same `backendOracle` ECDSA key. One leaked private key breaks the entire trust chain silently. There is no revocation, no key rotation, no multi-sig, no threshold signature scheme.

The oracle also has no rate limiting at the contract level. Nothing prevents the oracle from signing 10,000 proofs for the same address with different timestamps once the 1-hour expiry passes.

---

### 4. Token Economics Are Backwards

Users earn `NOTABOT_TOKEN` for completing verifications. This directly incentivizes Sybil attacks: create wallets, complete cheapest verifications, extract tokens, repeat. The protocol pays people to game it.

The correct model is the opposite: users *stake* tokens to participate in verification. Stake is slashed for detected Sybil behavior. Legitimate users earn yield on their stake; attackers lose capital. This inverts the incentive.

---

### 5. On-Chain Verification History Is a Privacy Disaster

Every `registerVerification` call is public. An observer can see: this address verified via Gitcoin at block X, via Worldcoin at block Y, via Concordium at block Z. Cross-referencing these events with KYC-linked sources (Concordium is real-name KYC) de-anonymizes the wallet.

The protocol explicitly stores `concordiumAccountHash` on-chain and emits it in an event. The hash is deterministic from the account address. Anyone with a list of Concordium accounts can correlate every verified EVM wallet.

---

## 5 Non-Obvious / Forgotten Things in the Identity Layer

### 1. EAS — Ethereum Attestation Service

EAS is already deployed on Base, Arbitrum, Optimism, and Ethereum mainnet. Coinbase uses it for `coinbase.com/onchain` verifications. Gitcoin Passport v2 is migrating to it.

Instead of a custom `registerVerification` mapping, this protocol could issue EAS attestations. The benefit: every dApp that already queries EAS gets compatibility for free. The attestation schema is portable, revocable, and queryable off-chain via The Graph.

Integration cost: ~50 lines. The ROI is instant ecosystem compatibility.

Reference: `https://attest.org`

---

### 2. Semaphore Protocol

Semaphore solves the exact privacy problem described above. Users join a group (e.g., "verified humans") and can later prove membership without revealing which member they are. One ZK proof, no linkability, no on-chain history of which source was used.

The protocol already has audited contracts, a JavaScript SDK, and is used in production by Bandada and PSE projects.

The current architecture stores verification source IDs on-chain. Semaphore would let users prove "I am in the verified-human group" without revealing they used Concordium specifically — which is the only source in this stack that is KYC-linked to a real name.

Reference: `https://semaphore.pse.dev`

---

### 3. Reclaim Protocol

Every oracle-based adapter in this codebase has the same attack surface: compromise the oracle key, forge unlimited proofs. Reclaim Protocol eliminates the oracle entirely by generating ZK proofs of HTTPS responses using TLS attestations.

A user visits `gitcoin.co/passport`, the Reclaim SDK intercepts the TLS session, produces a ZK proof that the response contained `score: 42`, and submits it directly to the contract. No backend, no signing key, no oracle.

This would replace the oracle pattern in GitcoinAdapter and PoHAdapter entirely. Concordium would still need an oracle because it requires KYC identity binding, but the web2 sources do not.

Reference: `https://reclaimprotocol.org`

---

### 4. W3C Verifiable Credentials + did:ethr

The W3C VC spec is the ISO standard for portable digital credentials. `did:ethr` maps Ethereum addresses to DID documents. Together they give users a credential wallet: a Gitcoin score becomes a signed JSON-LD document the user holds locally and presents selectively.

No protocol lock-in. No custom token. No on-chain history. The verifier checks the credential signature without calling any contract.

The existing backend already signs proofs with ECDSA. The delta to produce a W3C VC instead of a raw bytes proof is approximately 20 lines of JSON-LD framing. The payoff is interoperability with every platform that speaks VCs: Microsoft Entra Verified ID, Polygon ID, Spruce DID Kit.

Reference: `https://w3c.github.io/vc-data-model`, `https://github.com/decentralized-identity/ethr-did`

---

### 5. ENS as a Free Identity Signal

A wallet that has held an ENS name for 4+ years, paid renewal fees, and has primary record set is statistically unlikely to be a Sybil. The cost is real (ETH gas + annual fee), the history is immutable, and the data is on-chain with no oracle required.

ENS integration: call `ens.resolver(node).addr(node)` and check registration block vs current block. Add a source confidence of ~60% for wallets with 2+ year ENS names. This costs nothing to implement and adds a non-trivial signal orthogonal to all four current sources.

ENS also exposes `text` records. Wallets that have set `com.twitter` or `com.github` records have voluntarily linked off-chain identities — another free signal.

Zero infrastructure cost. The data is already on-chain.
