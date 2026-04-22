// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";
import "../src/adapters/OracleAdapter.sol";

contract PoHAdapterTest is Fixtures {

    function test_verifyAndRegister_success() public {
        (bytes memory proof,) = ProofFactory.poh(mockEAS, oracle, schemaUID, user);
        pohAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationByIndex(user, 0).source, 2);
    }

    function test_verifyAndRegister_revertExpired() public {
        (bytes memory proof,) = ProofFactory.poh(mockEAS, oracle, schemaUID, user);
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(OracleAdapter.AttestationExpired.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        (bytes memory proof,) = ProofFactory.poh(mockEAS, oracle, schemaUID, user);
        pohAdapter.verifyAndRegister(user, proof);
        vm.expectRevert(OracleAdapter.AttestationAlreadyUsed.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidAttester() public {
        address wrongOracle = makeAddr("wrongOracle");
        (bytes memory proof,) = ProofFactory.poh(mockEAS, wrongOracle, schemaUID, user);
        vm.expectRevert(OracleAdapter.InvalidAttester.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertRevoked() public {
        (bytes memory proof,) = ProofFactory.poh(mockEAS, oracle, schemaUID, user);
        mockEAS.revoke(abi.decode(proof, (bytes32)));
        vm.expectRevert(OracleAdapter.AttestationRevoked.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_getSourceId_returnsTwo() public view {
        assertEq(pohAdapter.getSourceId(), 2);
    }
}
