// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "./MainAggregatorHandler.sol";

contract MainAggregatorInvariantTest is Test {
    MainAggregatorHandler internal handler;

    function setUp() public {
        handler = new MainAggregatorHandler();
        targetContract(address(handler));
    }

    function invariant_probabilityBounds() public view {
        address[] memory actors = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            actors[i] = handler.actors(i);
        }
        for (uint256 i = 0; i < actors.length; i++) {
            uint256 p = handler.aggregator().getHumanProbability(actors[i]);
            assertLe(p, 1e18, "probability exceeds 1e18");
        }
    }

    function invariant_trustScoreBounds() public view {
        address[] memory actors = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            actors[i] = handler.actors(i);
        }
        for (uint256 i = 0; i < actors.length; i++) {
            uint256 score = handler.aggregator().getTrustScore(actors[i]);
            assertLe(score, 100, "trust score exceeds 100");
        }
    }

    function invariant_zeroVerificationsZeroProbability() public view {
        address nobody = address(0xdead);
        assertEq(handler.aggregator().getHumanProbability(nobody), 0);
        assertEq(handler.aggregator().getTrustScore(nobody), 0);
        assertFalse(handler.aggregator().isVerifiedHuman(nobody));
    }

    function invariant_confidenceNumeratorLeDenominator() public view {
        for (uint8 sid = 0; sid < 4; sid++) {
            (uint256 num, uint256 den) = handler.aggregator().sourceConfidences(sid);
            assertLe(num, den, "confidence numerator > denominator");
            assertGt(den, 0, "denominator is zero");
        }
    }

    function invariant_tokenRewardConsistency() public view {
        uint256 totalVerifications = handler.verificationCount();
        uint256 reward = handler.aggregator().TOKEN_REWARD();
        uint256 initialFund = 500_000 * 1e18;
        uint256 remaining = handler.token().balanceOf(address(handler.aggregator()));
        assertGe(initialFund, remaining + totalVerifications * reward, "token accounting broken");
    }
}
