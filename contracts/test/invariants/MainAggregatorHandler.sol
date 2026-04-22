// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/core/MainAggregator.sol";
import "../../src/core/VerificationToken.sol";
import "../../src/adapters/GitcoinAdapter.sol";
import "../../src/adapters/PoHAdapter.sol";
import "../helpers/ProofFactory.sol";
import "../helpers/MockEAS.sol";

contract MainAggregatorHandler is Test {
    MainAggregator public aggregator;
    GitcoinAdapter public gitcoinAdapter;
    PoHAdapter public pohAdapter;
    VerificationToken public token;
    MockEAS public mockEAS;

    uint256 public constant ORACLE_PK = 0xA11CE;
    address public oracle;
    bytes32 public schemaUID;

    address[] public actors;
    uint256 public verificationCount;

    constructor() {
        oracle = vm.addr(ORACLE_PK);
        schemaUID = keccak256("bytes32 uniqueId,uint256 qualityScore");
        token = new VerificationToken();
        aggregator = new MainAggregator(address(token));
        token.transfer(address(aggregator), 500_000 * 1e18);

        mockEAS = new MockEAS();
        gitcoinAdapter = new GitcoinAdapter(address(mockEAS), schemaUID, address(aggregator), oracle);
        pohAdapter = new PoHAdapter(address(mockEAS), schemaUID, address(aggregator), oracle);

        aggregator.addAdapter(address(gitcoinAdapter), 1);
        aggregator.addAdapter(address(pohAdapter), 2);

        for (uint256 i = 0; i < 5; i++) {
            actors.push(makeAddr(string(abi.encode(i))));
        }
    }

    function registerGitcoin(uint256 actorSeed, uint256 score) external {
        address actor = actors[actorSeed % actors.length];
        score = bound(score, 20, 100);
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, actor, score);
        try gitcoinAdapter.verifyAndRegister(actor, proof) {
            verificationCount++;
        } catch {}
    }

    function registerPoH(uint256 actorSeed) external {
        address actor = actors[actorSeed % actors.length];
        vm.warp(block.timestamp + 1);
        (bytes memory proof,) = ProofFactory.poh(mockEAS, oracle, schemaUID, actor);
        try pohAdapter.verifyAndRegister(actor, proof) {
            verificationCount++;
        } catch {}
    }

    function warpTime(uint256 secs) external {
        vm.warp(block.timestamp + bound(secs, 1, 2 hours));
    }
}
