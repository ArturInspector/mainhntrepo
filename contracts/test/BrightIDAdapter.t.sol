// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./helpers/Fixtures.sol";
import "./helpers/ProofFactory.sol";

contract BrightIDAdapterTest is Fixtures {

    function test_verifyAndRegister_success() public {
        (bytes memory proof,) = ProofFactory.brightid(vm, oraclePk, user);
        brightidAdapter.verifyAndRegister(user, proof);

        assertTrue(aggregator.isVerifiedHuman(user));
        assertEq(aggregator.getVerificationByIndex(user, 0).source, 3);
    }

    function test_verifyAndRegister_revertExpired() public {
        (bytes memory proof,) = ProofFactory.brightid(vm, oraclePk, user);
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert(BrightIDAdapter.ProofExpired.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertAlreadyUsed() public {
        (bytes memory proof,) = ProofFactory.brightid(vm, oraclePk, user);
        brightidAdapter.verifyAndRegister(user, proof);
        vm.expectRevert(BrightIDAdapter.ProofAlreadyUsed.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_verifyAndRegister_revertInvalidSignature() public {
        (bytes memory proof,) = ProofFactory.brightid(vm, 0xBAD, user);
        vm.expectRevert(BrightIDAdapter.InvalidSignature.selector);
        brightidAdapter.verifyAndRegister(user, proof);
    }

    function test_getSourceId_returnsThree() public view {
        assertEq(brightidAdapter.getSourceId(), 3);
    }
}
