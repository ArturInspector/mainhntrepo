// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";
import "../src/adapters/ConcordiumAdapter.sol";
import "../src/adapters/OracleAdapter.sol";

contract ConcordiumAdapterTest is Fixtures {
    ConcordiumAdapter internal concordiumAdapter;

    function setUp() public override {
        super.setUp();
        concordiumAdapter = new ConcordiumAdapter(address(mockEAS), schemaUID, address(aggregator), oracle);
        aggregator.addAdapter(address(concordiumAdapter), 4);
    }

    function test_verifyAndRegister_success() public {
        bytes32 accountHash = keccak256(abi.encodePacked("3ZfCSfUF9bFPMDHFXyrHkHpNLDNqV5VFNRXFmXHpNkahFXnLu"));
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, accountHash);

        concordiumAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationByIndex(user, 0).source, 4);
    }

    function test_verifyAndRegister_transfersTokenReward() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-1"));
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, accountHash);

        concordiumAdapter.verifyAndRegister(user, proof);

        assertEq(token.balanceOf(user), aggregator.TOKEN_REWARD());
    }

    function test_verifyAndRegister_revertExpired() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-2"));
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, accountHash);

        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(OracleAdapter.AttestationExpired.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-3"));
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, accountHash);

        concordiumAdapter.verifyAndRegister(user, proof);

        vm.expectRevert(OracleAdapter.AttestationAlreadyUsed.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidAttester() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-4"));
        address badOracle = makeAddr("badOracle");
        bytes memory proof = ProofFactory.concordium(mockEAS, badOracle, schemaUID, user, accountHash);

        vm.expectRevert(OracleAdapter.InvalidAttester.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertRevoked() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-5"));
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, accountHash);
        bytes32 uid = abi.decode(proof, (bytes32));
        mockEAS.revoke(uid);

        vm.expectRevert(OracleAdapter.AttestationRevoked.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertZeroAccountHash() public {
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, bytes32(0));

        vm.expectRevert(ConcordiumAdapter.InvalidConcordiumAccount.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_getSourceId_returnsFour() public view {
        assertEq(concordiumAdapter.getSourceId(), 4);
    }

    function test_highConfidenceScore() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-6"));
        bytes memory proof = ProofFactory.concordium(mockEAS, oracle, schemaUID, user, accountHash);
        concordiumAdapter.verifyAndRegister(user, proof);

        (uint256 num, uint256 den) = aggregator.sourceConfidences(4);
        assertEq(num, 9700);
        assertEq(den, 10000);

        uint256 score = aggregator.getTrustScore(user);
        assertGe(score, 97);
    }
}
