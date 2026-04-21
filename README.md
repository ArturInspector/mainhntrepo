# NotABot

**On-chain proof-of-humanity oracle for EVM chains.**

Aggregates multiple identity sources into a single interface. One call to determine whether an address belongs to a verified human.

```solidity
bool isHuman = IHumanityOracle(AGGREGATOR).isVerifiedHuman(msg.sender);
uint256 score  = IHumanityOracle(AGGREGATOR).getTrustScore(msg.sender); // 0–100
```

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org)
[![Base L2](https://img.shields.io/badge/Network-Base%20Sepolia-0052FF)](https://base.org)
[![Status Network](https://img.shields.io/badge/Network-Status%20Testnet-5B6CD9)](https://status.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENCE)
[![Tests](https://img.shields.io/badge/Tests-26%2F26%20passing-brightgreen)](./contracts/test)

---

## Architecture

```
User → Adapter (verify proof) → MainAggregator (register + score) → HMT reward
```

**Verification sources**

| Source | ID | Confidence | Notes |
|---|---|---|---|
| Worldcoin | 0 | 99.5% | ZK biometric proof via World ID |
| Gitcoin Passport | 1 | ~91% | Score-weighted, adjusts dynamically |
| Proof of Humanity | 2 | 79.5% | Video-verified identity |
| BrightID | 3 | 83.3% | Social graph |
| Concordium | 4 | 97% | On-chain regulated KYC |

Trust score uses Bayesian combination — multiple sources compound, not add.

**Contracts (Base Sepolia + Status Network)**

| Contract | Address |
|---|---|
| MainAggregator | `0xFcB998E4c6A0157dEF6AC724Da1279aA6Ac2743D` |
| VerificationToken (HMT) | `0x9f12107874B1ED8B10AED87e19E4BDf5ea17a45B` |
| GitcoinAdapter | `0xCd52fb37d7Ff8d164fB49274E7fd8e2b81b5710b` |
| PoHAdapter | `0xc2fF5af5C12B7085dC49415Cb81e29B8524E06C0` |
| BrightIDAdapter | `0xAeCEbf9B937D1B36C2ed5D2C2190673eA3CC82de` |

---

## Integration

```solidity
import { IHumanityOracle } from "@notabot/contracts/interfaces/IHumanityOracle.sol";

contract MyProtocol {
    IHumanityOracle immutable oracle;

    constructor(address _oracle) { oracle = IHumanityOracle(_oracle); }

    modifier onlyHuman() {
        require(oracle.isVerifiedHuman(msg.sender), "not verified");
        _;
    }
}
```

Or use the `HumanityProtected` base contract — it ships `onlyHuman` and `minTrustScore(n)` modifiers.

---

## Local development

**Prerequisites:** Node.js ≥ 20, Yarn, Foundry

```bash
git clone https://github.com/ArturInspector/notabot
cd notabot
yarn install
```

```bash
# Terminal 1 — local chain
yarn chain

# Terminal 2 — deploy contracts
yarn deploy

# Terminal 3 — frontend
yarn start
```

**Contract tests (Foundry)**

```bash
cd contracts
forge test
```

**Backend oracle**

```bash
cd packages/backend
cp .env.example .env   # set ORACLE_PRIVATE_KEY and API keys
yarn dev
```

---

## Repository layout

```
contracts/          Foundry — canonical contracts and tests
packages/
  nextjs/           Frontend (Next.js 15, wagmi, viem, RainbowKit)
  hardhat/          Hardhat — deploy scripts, scaffold-eth integration
  backend/          Oracle backend (Node.js, Express)
solana/             ⚠️  FROZEN — Anchor program, not actively maintained
docs/               Architecture and integration docs
```

---

## Security

- Proof replay prevention via `usedUniqueIds`
- 1-hour proof expiry enforced on-chain
- ECDSA backend oracle signatures
- Source compromise windows with selective invalidation
- OpenZeppelin: ReentrancyGuard, Pausable, Ownable
- CEI pattern throughout

See [SECURITY.md](./SECURITY.md) for disclosure policy.

---

## License

MIT
