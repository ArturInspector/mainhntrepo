// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/core/MainAggregator.sol";
import "../../src/core/VerificationToken.sol";
import "../../src/adapters/GitcoinAdapter.sol";
import "../../src/adapters/PoHAdapter.sol";
import "../../src/adapters/BrightIDAdapter.sol";
import "./MockEAS.sol";

contract Fixtures is Test {
    MainAggregator internal aggregator;
    VerificationToken internal token;
    GitcoinAdapter internal gitcoinAdapter;
    PoHAdapter internal pohAdapter;
    BrightIDAdapter internal brightidAdapter;
    MockEAS internal mockEAS;

    address internal owner;
    address internal user;
    address internal user2;
    address internal oracle;
    uint256 internal oraclePk;
    bytes32 internal schemaUID;

    uint256 internal constant AGGREGATOR_FUND = 500_000 * 1e18;

    function setUp() public virtual {
        vm.warp(1_700_000_000);
        oraclePk = 0xA11CE;
        oracle = vm.addr(oraclePk);
        owner = address(this);
        user = makeAddr("user");
        user2 = makeAddr("user2");

        mockEAS = new MockEAS();
        schemaUID = keccak256("bytes32 uniqueId,uint256 qualityScore");

        token = new VerificationToken();
        aggregator = new MainAggregator(address(token));
        token.transfer(address(aggregator), AGGREGATOR_FUND);

        gitcoinAdapter = new GitcoinAdapter(address(mockEAS), schemaUID, address(aggregator), oracle);
        pohAdapter = new PoHAdapter(address(mockEAS), schemaUID, address(aggregator), oracle);
        brightidAdapter = new BrightIDAdapter(address(mockEAS), schemaUID, address(aggregator), oracle);

        aggregator.addAdapter(address(gitcoinAdapter), 1);
        aggregator.addAdapter(address(pohAdapter), 2);
        aggregator.addAdapter(address(brightidAdapter), 3);
    }
}
