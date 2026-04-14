// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";
import "../src/adapters/ConcordiumAdapter.sol";

contract ConcordiumAdapterTest is Fixtures {
    ConcordiumAdapter internal concordiumAdapter;

    function setUp() public override {
        super.setUp();
        concordiumAdapter = new ConcordiumAdapter(address(aggregator), oracle);
        aggregator.addAdapter(address(concordiumAdapter), 4);
    }

    function _concordiumProof(address evmUser, bytes32 accountHash)
        internal
        view
        returns (bytes memory proof)
    {
        uint256 timestamp = block.timestamp;
        bytes32 message = keccak256(abi.encodePacked(evmUser, accountHash, timestamp));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        proof = abi.encode(accountHash, timestamp, abi.encodePacked(r, s, v));
    }

    function test_verifyAndRegister_success() public {
        bytes32 accountHash = keccak256(abi.encodePacked("3ZfCSfUF9bFPMDHFXyrHkHpNLDNqV5VFNRXFmXHpNkahFXnLu"));
        bytes memory proof = _concordiumProof(user, accountHash);

        concordiumAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationByIndex(user, 0).source, 4);
        assertEq(aggregator.getVerificationByIndex(user, 0).qualityScore, 100);
    }

    function test_verifyAndRegister_transfersTokenReward() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-1"));
        bytes memory proof = _concordiumProof(user, accountHash);

        concordiumAdapter.verifyAndRegister(user, proof);

        assertEq(token.balanceOf(user), aggregator.TOKEN_REWARD());
    }

    function test_verifyAndRegister_revertExpired() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-2"));
        bytes memory proof = _concordiumProof(user, accountHash);

        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(ConcordiumAdapter.ProofExpired.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-3"));
        bytes memory proof = _concordiumProof(user, accountHash);

        concordiumAdapter.verifyAndRegister(user, proof);

        vm.expectRevert(ConcordiumAdapter.ProofAlreadyUsed.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidSignature() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-4"));
        uint256 badPk = 0xBAD;
        uint256 timestamp = block.timestamp;
        bytes32 message = keccak256(abi.encodePacked(user, accountHash, timestamp));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(badPk, digest);
        bytes memory proof = abi.encode(accountHash, timestamp, abi.encodePacked(r, s, v));

        vm.expectRevert(ConcordiumAdapter.InvalidSignature.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertZeroAccountHash() public {
        bytes memory proof = abi.encode(bytes32(0), block.timestamp, bytes(""));
        vm.expectRevert(ConcordiumAdapter.InvalidConcordiumAccount.selector);
        concordiumAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_oneConcordiumAccountPerEvm() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-5"));
        bytes memory proof1 = _concordiumProof(user, accountHash);
        concordiumAdapter.verifyAndRegister(user, proof1);

        vm.warp(block.timestamp + 1);
        vm.expectRevert(ConcordiumAdapter.ProofAlreadyUsed.selector);
        bytes memory proof2 = _concordiumProof(user2, accountHash);
        concordiumAdapter.verifyAndRegister(user2, proof2);
    }

    function test_getSourceId_returnsFour() public view {
        assertEq(concordiumAdapter.getSourceId(), 4);
    }

    function test_highConfidenceScore() public {
        bytes32 accountHash = keccak256(abi.encodePacked("concordium-account-6"));
        bytes memory proof = _concordiumProof(user, accountHash);
        concordiumAdapter.verifyAndRegister(user, proof);

        (uint256 num, uint256 den) = aggregator.sourceConfidences(4);
        assertEq(num, 9700);
        assertEq(den, 10000);

        uint256 score = aggregator.getTrustScore(user);
        assertGe(score, 97);
    }
}
