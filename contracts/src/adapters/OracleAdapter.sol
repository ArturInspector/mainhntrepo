// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "../interfaces/IVerificationAdapter.sol";
import "../core/MainAggregator.sol";

abstract contract OracleAdapter is IVerificationAdapter {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    MainAggregator public immutable mainAggregator;
    address public immutable backendOracle;

    uint256 public constant PROOF_VALIDITY = 1 hours;

    mapping(bytes32 => bool) public usedProofs;

    error InvalidSignature();
    error ProofExpired();
    error ProofAlreadyUsed();

    constructor(address _mainAggregator, address _backendOracle) {
        mainAggregator = MainAggregator(_mainAggregator);
        backendOracle = _backendOracle;
    }

    function _useProof(bytes32 id, uint256 timestamp, address user, bytes memory signature) internal {
        if (block.timestamp > timestamp + PROOF_VALIDITY) revert ProofExpired();
        if (usedProofs[id]) revert ProofAlreadyUsed();

        bytes32 digest = keccak256(abi.encodePacked(user, id, timestamp)).toEthSignedMessageHash();
        if (digest.recover(signature) != backendOracle) revert InvalidSignature();

        usedProofs[id] = true;
    }

    function _useProofWithScore(bytes32 id, uint256 score, uint256 timestamp, address user, bytes memory signature) internal {
        if (block.timestamp > timestamp + PROOF_VALIDITY) revert ProofExpired();
        if (usedProofs[id]) revert ProofAlreadyUsed();

        bytes32 digest = keccak256(abi.encodePacked(user, id, score, timestamp)).toEthSignedMessageHash();
        if (digest.recover(signature) != backendOracle) revert InvalidSignature();

        usedProofs[id] = true;
    }
}
