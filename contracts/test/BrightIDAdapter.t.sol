// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";
import "../src/adapters/OracleAdapter.sol";

contract BrightIDAdapterTest is Fixtures {

    function test_verifyAndRegister_success() public {
        (bytes memory proof,) = ProofFactory.brightid(mockEAS, oracle, schemaUID, user);
        brightidAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationByIndex(user, 0).source, 3);
    }

    function test_verifyAndRegister_revertExpired() public {
        (bytes memory proof,) = ProofFactory.brightid(mockEAS, oracle, schemaUID, user);
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(OracleAdapter.AttestationExpired.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        (bytes memory proof,) = ProofFactory.brightid(mockEAS, oracle, schemaUID, user);
        brightidAdapter.verifyAndRegister(user, proof);
        vm.expectRevert(OracleAdapter.AttestationAlreadyUsed.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidAttester() public {
        address badOracle = makeAddr("badOracle");
        (bytes memory proof,) = ProofFactory.brightid(mockEAS, badOracle, schemaUID, user);
        vm.expectRevert(OracleAdapter.InvalidAttester.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertRevoked() public {
        (bytes memory proof,) = ProofFactory.brightid(mockEAS, oracle, schemaUID, user);
        bytes32 uid = abi.decode(proof, (bytes32));
        mockEAS.revoke(uid);
        vm.expectRevert(OracleAdapter.AttestationRevoked.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_getSourceId_returnsThree() public view {
        assertEq(brightidAdapter.getSourceId(), 3);
    }
}
