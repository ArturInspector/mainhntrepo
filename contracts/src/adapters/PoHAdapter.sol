// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "../interfaces/IVerificationAdapter.sol";
import "../core/MainAggregator.sol";

contract PoHAdapter is IVerificationAdapter {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    MainAggregator public immutable mainAggregator;
    address public immutable backendOracle;

    uint256 public constant PROOF_VALIDITY = 1 hours;

    mapping(bytes32 => bool) public usedProofs;

    error InvalidSignature();
    error ProofExpired();
    error ProofAlreadyUsed();

    event PoHVerified(address indexed user, bytes32 pohId);

    constructor(address _mainAggregator, address _backendOracle) {
        mainAggregator = MainAggregator(_mainAggregator);
        backendOracle = _backendOracle;
    }

    function verifyAndRegister(address user, bytes calldata proof) external {
        (bytes32 pohId, uint256 timestamp, bytes memory signature) =
            abi.decode(proof, (bytes32, uint256, bytes));

        if (block.timestamp > timestamp + PROOF_VALIDITY) revert ProofExpired();
        if (usedProofs[pohId]) revert ProofAlreadyUsed();

        bytes32 message = keccak256(abi.encodePacked(user, pohId, timestamp));
        if (message.toEthSignedMessageHash().recover(signature) != backendOracle) revert InvalidSignature();

        usedProofs[pohId] = true;
        mainAggregator.registerVerification(user, 2, pohId, proof);

        emit PoHVerified(user, pohId);
    }

    function getSourceId() external pure returns (uint8) {
        return 2;
    }
}
