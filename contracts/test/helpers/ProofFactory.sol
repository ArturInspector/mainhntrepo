// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

library ProofFactory {
    function gitcoin(Vm vm, uint256 oraclePk, address user, uint256 score)
        internal
        view
        returns (bytes memory proof, bytes32 userId)
    {
        userId = keccak256(abi.encodePacked(user, block.timestamp, score));
        uint256 timestamp = block.timestamp;
        bytes32 message = keccak256(abi.encodePacked(user, userId, score, timestamp));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);
        proof = abi.encode(userId, score, timestamp, sig);
    }

    function gitcoinWithId(Vm vm, uint256 oraclePk, address user, uint256 score, bytes32 userId)
        internal
        view
        returns (bytes memory proof)
    {
        uint256 timestamp = block.timestamp;
        bytes32 message = keccak256(abi.encodePacked(user, userId, score, timestamp));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);
        proof = abi.encode(userId, score, timestamp, sig);
    }

    function poh(Vm vm, uint256 oraclePk, address user)
        internal
        view
        returns (bytes memory proof, bytes32 pohId)
    {
        pohId = keccak256(abi.encodePacked("poh", user, block.timestamp));
        uint256 timestamp = block.timestamp;
        bytes32 message = keccak256(abi.encodePacked(user, pohId, timestamp));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);
        proof = abi.encode(pohId, timestamp, sig);
    }

    function brightid(Vm vm, uint256 oraclePk, address user)
        internal
        view
        returns (bytes memory proof, bytes32 contextId)
    {
        contextId = keccak256(abi.encodePacked("brightid", user, block.timestamp));
        uint256 timestamp = block.timestamp;
        bytes32 message = keccak256(abi.encodePacked(user, contextId, timestamp));
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);
        proof = abi.encode(contextId, timestamp, sig);
    }
}
