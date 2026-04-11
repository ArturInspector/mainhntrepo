// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/core/MainAggregator.sol";
import "../../src/core/VerificationToken.sol";
import "../../src/adapters/GitcoinAdapter.sol";
import "../../src/adapters/PoHAdapter.sol";
import "../../src/adapters/BrightIDAdapter.sol";

contract Fixtures is Test {
    MainAggregator internal aggregator;
    VerificationToken internal token;
    GitcoinAdapter internal gitcoinAdapter;
    PoHAdapter internal pohAdapter;
    BrightIDAdapter internal brightidAdapter;

    address internal owner;
    address internal user;
    address internal user2;
    address internal oracle;
    uint256 internal oraclePk;

    uint256 internal constant AGGREGATOR_FUND = 500_000 * 1e18;

    function setUp() public virtual {
        vm.warp(1_700_000_000);
        oraclePk = 0xA11CE;
        oracle = vm.addr(oraclePk);
        owner = address(this);
        user = makeAddr("user");
        user2 = makeAddr("user2");

        token = new VerificationToken();
        aggregator = new MainAggregator(address(token));
        token.transfer(address(aggregator), AGGREGATOR_FUND);

        gitcoinAdapter = new GitcoinAdapter(address(aggregator), oracle);
        pohAdapter = new PoHAdapter(address(aggregator), oracle);
        brightidAdapter = new BrightIDAdapter(address(aggregator), oracle);

        aggregator.addAdapter(address(gitcoinAdapter), 1);
        aggregator.addAdapter(address(pohAdapter), 2);
        aggregator.addAdapter(address(brightidAdapter), 3);
    }
}
