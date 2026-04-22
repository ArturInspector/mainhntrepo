// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockEAS.sol";

library ProofFactory {
    function gitcoin(MockEAS mockEAS, address oracle, bytes32 schemaUID, address user, uint256 score)
        internal
        returns (bytes memory proof, bytes32 userId)
    {
        userId = keccak256(abi.encodePacked(user, block.timestamp, score));
        bytes32 uid = mockEAS.attest(
            schemaUID, user, oracle,
            uint64(block.timestamp + 1 hours),
            abi.encode(userId, score)
        );
        proof = abi.encode(uid);
    }

    function gitcoinWithId(MockEAS mockEAS, address oracle, bytes32 schemaUID, address user, bytes32 userId)
        internal
        returns (bytes memory proof)
    {
        bytes32 uid = mockEAS.attest(
            schemaUID, user, oracle,
            uint64(block.timestamp + 1 hours),
            abi.encode(userId, uint256(75))
        );
        proof = abi.encode(uid);
    }

    function poh(MockEAS mockEAS, address oracle, bytes32 schemaUID, address user)
        internal
        returns (bytes memory proof, bytes32 pohId)
    {
        pohId = keccak256(abi.encodePacked("poh", user, block.timestamp));
        bytes32 uid = mockEAS.attest(
            schemaUID, user, oracle,
            uint64(block.timestamp + 1 hours),
            abi.encode(pohId, uint256(100))
        );
        proof = abi.encode(uid);
    }

    function brightid(MockEAS mockEAS, address oracle, bytes32 schemaUID, address user)
        internal
        returns (bytes memory proof, bytes32 contextId)
    {
        contextId = keccak256(abi.encodePacked("brightid", user, block.timestamp));
        bytes32 uid = mockEAS.attest(
            schemaUID, user, oracle,
            uint64(block.timestamp + 1 hours),
            abi.encode(contextId, uint256(100))
        );
        proof = abi.encode(uid);
    }

    function concordium(MockEAS mockEAS, address oracle, bytes32 schemaUID, address user, bytes32 accountHash)
        internal
        returns (bytes memory proof)
    {
        bytes32 uid = mockEAS.attest(
            schemaUID, user, oracle,
            uint64(block.timestamp + 1 hours),
            abi.encode(accountHash, uint256(100))
        );
        proof = abi.encode(uid);
    }
}
