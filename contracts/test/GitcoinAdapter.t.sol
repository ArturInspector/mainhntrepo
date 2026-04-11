// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";
import "../src/adapters/OracleAdapter.sol";

contract GitcoinAdapterTest is Fixtures {

    function test_verifyAndRegister_success() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationCount(user), 1);
    }

    function test_verifyAndRegister_storesQualityScore() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 60);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData memory v = aggregator.getVerificationByIndex(user, 0);
        assertEq(v.qualityScore, 60);
        assertEq(v.source, 1);
    }

    function test_verifyAndRegister_revertScoreTooLow() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 19);
        vm.expectRevert(GitcoinAdapter.ScoreTooLow.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertProofExpired() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(OracleAdapter.ProofExpired.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertProofAlreadyUsed() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        vm.expectRevert(OracleAdapter.ProofAlreadyUsed.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidSignature() public {
        uint256 wrongPk = 0xBAD;
        (bytes memory proof,) = ProofFactory.gitcoin(vm, wrongPk, user, 75);
        vm.expectRevert(OracleAdapter.InvalidSignature.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_minScoreBoundary() public {
        (bytes memory proof,) = ProofFactory.gitcoin(vm, oraclePk, user, 20);
        gitcoinAdapter.verifyAndRegister(user, proof);
        assertTrue(aggregator.isVerifiedHuman(user));
    }

    function test_getSourceId_returnsOne() public view {
        assertEq(gitcoinAdapter.getSourceId(), 1);
    }
}
