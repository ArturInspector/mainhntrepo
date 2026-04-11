// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";

contract MainAggregatorTest is Fixtures {

    function test_deployment_tokenFunded() public view {
        assertEq(token.balanceOf(address(aggregator)), AGGREGATOR_FUND);
    }

    function test_deployment_initialConfidences() public view {
        (uint256 num, uint256 den) = aggregator.sourceConfidences(0);
        assertEq(num, 9500);
        assertEq(den, 9501);
        (num, den) = aggregator.sourceConfidences(1);
        assertEq(num, 8000);
        assertEq(den, 8800);
    }

    function test_registerVerification_transfersTokenReward() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        assertEq(token.balanceOf(user), aggregator.TOKEN_REWARD());
        assertEq(aggregator.getVerificationCount(user), 1);
    }

    function test_registerVerification_revertUnauthorizedAdapter() public {
        vm.expectRevert(MainAggregator.UnauthorizedAdapter.selector);
        aggregator.registerVerification(user, 0, keccak256("id"), "");
    }

    function test_registerVerification_revertDuplicateUniqueId() public {
        (bytes memory proof, bytes32 userId) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        bytes memory proof2 = ProofFactory.gitcoinWithId(vm, oraclePk, user2, 75, userId);
        vm.expectRevert(GitcoinAdapter.ProofAlreadyUsed.selector);
        gitcoinAdapter.verifyAndRegister(user2, proof2);
    }

    function test_registerVerification_revertSourceMismatch() public {
        MockAdapterMismatch mock = new MockAdapterMismatch(address(aggregator));
        aggregator.addAdapter(address(mock), 1);

        vm.expectRevert(
            abi.encodeWithSelector(MainAggregator.SourceMismatch.selector, uint8(1), uint8(0))
        );
        mock.callWithSource(user, 0, keccak256("id"), "");
    }

    function test_registerVerification_revertPaused() public {
        aggregator.pause();
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        vm.expectRevert();
        gitcoinAdapter.verifyAndRegister(user, proof);
        aggregator.unpause();
    }

    function test_isVerifiedHuman_trueAfterVerification() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);
        assertTrue(aggregator.isVerifiedHuman(user));
    }

    function test_isVerifiedHuman_falseWithoutVerification() public view {
        assertFalse(aggregator.isVerifiedHuman(user));
    }

    function test_getTrustScore_nonZeroAfterVerification() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);
        assertGt(aggregator.getTrustScore(user), 0);
        assertLe(aggregator.getTrustScore(user), 100);
    }

    function test_getTrustScore_zeroWithoutVerification() public view {
        assertEq(aggregator.getTrustScore(user), 0);
    }

    function test_addAdapter_success() public {
        address newAdapter = makeAddr("newAdapter");
        aggregator.addAdapter(newAdapter, 2);
        assertTrue(aggregator.isAdapter(newAdapter));
    }

    function test_addAdapter_revertNotOwner() public {
        vm.prank(user);
        vm.expectRevert();
        aggregator.addAdapter(makeAddr("x"), 2);
    }

    function test_addAdapter_revertZeroAddress() public {
        vm.expectRevert(MainAggregator.InvalidAddress.selector);
        aggregator.addAdapter(address(0), 1);
    }

    function test_removeAdapter() public {
        aggregator.removeAdapter(address(gitcoinAdapter));
        assertFalse(aggregator.isAdapter(address(gitcoinAdapter)));
    }

    function test_getVerificationByIndex_success() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData memory v = aggregator.getVerificationByIndex(user, 0);
        assertEq(v.source, 1);
        assertGt(v.timestamp, 0);
        assertNotEq(v.uniqueId, bytes32(0));
    }

    function test_getVerificationByIndex_revertOutOfBounds() public {
        vm.expectRevert("Index out of bounds");
        aggregator.getVerificationByIndex(user, 0);
    }

    function test_getAllVerifications_emptyForNewUser() public view {
        MainAggregator.VerificationData[] memory v = aggregator.getAllVerifications(user);
        assertEq(v.length, 0);
    }

    function test_invalidateVerification_invalidatesEntry() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData[] memory vs = aggregator.getAllVerifications(user);
        aggregator.invalidateVerification(vs[0].uniqueId);

        assertFalse(aggregator.isVerificationValid(user, 0));
        assertFalse(aggregator.isVerifiedHuman(user));
    }

    function test_invalidateVerification_revertNotFound() public {
        vm.expectRevert(MainAggregator.VerificationNotFound.selector);
        aggregator.invalidateVerification(keccak256("unknown"));
    }

    function test_getHumanProbability_zeroWhenAllInvalidated() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData[] memory vs = aggregator.getAllVerifications(user);
        aggregator.invalidateVerification(vs[0].uniqueId);

        assertEq(aggregator.getHumanProbability(user), 0);
    }

    function test_getHumanProbability_higherWithMoreSources() public {
        (bytes memory proof1,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof1);
        uint256 scoreOne = aggregator.getHumanProbability(user);

        vm.warp(block.timestamp + 1);
        (bytes memory proof2,) = ProofFactory.poh(vm, oraclePk, user);
        pohAdapter.verifyAndRegister(user, proof2);
        uint256 scoreTwo = aggregator.getHumanProbability(user);

        assertGt(scoreTwo, scoreOne);
    }

    function test_markSourceCompromised_invalidatesVerificationsInWindow() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData[] memory vs = aggregator.getAllVerifications(user);
        uint256 vt = vs[0].timestamp;

        aggregator.markSourceCompromised(1, vt - 10, vt + 10);

        assertFalse(aggregator.isVerificationValid(user, 0));
        assertFalse(aggregator.isVerifiedHuman(user));
    }

    function test_markSourceCompromised_outsideWindowStillValid() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData[] memory vs = aggregator.getAllVerifications(user);
        uint256 vt = vs[0].timestamp;

        aggregator.markSourceCompromised(1, vt + 100, vt + 200);

        assertTrue(aggregator.isVerificationValid(user, 0));
        assertTrue(aggregator.isVerifiedHuman(user));
    }

    function test_markSourceCompromised_revertInvalidWindow() public {
        vm.expectRevert(MainAggregator.InvalidTimeWindow.selector);
        aggregator.markSourceCompromised(1, block.timestamp + 100, block.timestamp);
    }

    function test_markSourceCompromised_revertTooFarFuture() public {
        vm.expectRevert(MainAggregator.InvalidTimeWindow.selector);
        aggregator.markSourceCompromised(1, block.timestamp, block.timestamp + 366 days);
    }

    function test_markSourceCompromised_allowsAfterWindowEnds() public {
        aggregator.markSourceCompromised(1, block.timestamp - 2000, block.timestamp - 1000);

        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);
        assertTrue(aggregator.isVerifiedHuman(user));
    }

    function test_resetSourceWindow_clearsCounters() public {
        aggregator.resetSourceWindow(1);
        (,uint256 vc, uint256 sc) = aggregator.sourceWindows(1);
        assertEq(vc, 0);
        assertEq(sc, 0);
    }

    function test_setSourceConfidence_updatesValues() public {
        aggregator.setSourceConfidence(1, 9000, 10000);
        (uint256 num, uint256 den) = aggregator.sourceConfidences(1);
        assertEq(num, 9000);
        assertEq(den, 10000);
    }

    function test_setSourceConfidence_revertNumeratorGtDenominator() public {
        vm.expectRevert(MainAggregator.InvalidConfidence.selector);
        aggregator.setSourceConfidence(1, 10001, 10000);
    }

    function test_confirmAttack_updatesStats() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        aggregator.confirmAttack(user, 1);
        (uint256 total, uint256 attacks,) = aggregator.sourceStats(1);
        assertEq(attacks, 1);
        assertGe(total, 1);
    }

    function test_withdrawTokens_ownerCanWithdraw() public {
        uint256 before = token.balanceOf(owner);
        aggregator.withdrawTokens(100 * 1e18);
        assertEq(token.balanceOf(owner), before + 100 * 1e18);
    }

    function test_withdrawTokens_revertNotOwner() public {
        vm.prank(user);
        vm.expectRevert();
        aggregator.withdrawTokens(1);
    }
}

contract MockAdapterMismatch {
    MainAggregator immutable agg;
    constructor(address _agg) { agg = MainAggregator(_agg); }
    function callWithSource(address u, uint8 source, bytes32 uid, bytes calldata proof) external {
        agg.registerVerification(u, source, uid, proof);
    }
}
