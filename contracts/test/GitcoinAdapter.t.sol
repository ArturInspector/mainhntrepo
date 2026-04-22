// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";
import "../src/adapters/OracleAdapter.sol";

contract GitcoinAdapterTest is Fixtures {

    function test_verifyAndRegister_success() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationCount(user), 1);
    }

    function test_verifyAndRegister_storesQualityScore() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 60);
        gitcoinAdapter.verifyAndRegister(user, proof);

        MainAggregator.VerificationData memory v = aggregator.getVerificationByIndex(user, 0);
        assertEq(v.qualityScore, 60);
        assertEq(v.source, 1);
    }

    function test_verifyAndRegister_revertScoreTooLow() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 19);
        vm.expectRevert(GitcoinAdapter.ScoreTooLow.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertExpired() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 75);
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(OracleAdapter.AttestationExpired.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 75);
        gitcoinAdapter.verifyAndRegister(user, proof);
        vm.expectRevert(OracleAdapter.AttestationAlreadyUsed.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidAttester() public {
        address wrongOracle = makeAddr("wrongOracle");
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, wrongOracle, schemaUID, user, 75);
        vm.expectRevert(OracleAdapter.InvalidAttester.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertRevoked() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 75);
        bytes32 uid = abi.decode(proof, (bytes32));
        mockEAS.revoke(uid);
        vm.expectRevert(OracleAdapter.AttestationRevoked.selector);
        gitcoinAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_minScoreBoundary() public {
        (bytes memory proof,) = ProofFactory.gitcoin(mockEAS, oracle, schemaUID, user, 20);
        gitcoinAdapter.verifyAndRegister(user, proof);
        assertTrue(aggregator.isVerifiedHuman(user));
    }

    function test_getSourceId_returnsOne() public view {
        assertEq(gitcoinAdapter.getSourceId(), 1);
    }
}
