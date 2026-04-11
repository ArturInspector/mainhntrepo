// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";

contract PoHAdapterTest is Fixtures {

    function test_verifyAndRegister_success() public {
        (bytes memory proof,) = ProofFactory.poh(vm, oraclePk, user);
        pohAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationByIndex(user, 0).source, 2);
    }

    function test_verifyAndRegister_revertExpired() public {
        (bytes memory proof,) = ProofFactory.poh(vm, oraclePk, user);
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(PoHAdapter.ProofExpired.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        (bytes memory proof,) = ProofFactory.poh(vm, oraclePk, user);
        pohAdapter.verifyAndRegister(user, proof);
        vm.expectRevert(PoHAdapter.ProofAlreadyUsed.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidSignature() public {
        (bytes memory proof,) = ProofFactory.poh(vm, 0xBAD, user);
        vm.expectRevert(PoHAdapter.InvalidSignature.selector);
        pohAdapter.verifyAndRegister(user, proof);
    }

    function test_getSourceId_returnsTwo() public view {
        assertEq(pohAdapter.getSourceId(), 2);
    }
}
