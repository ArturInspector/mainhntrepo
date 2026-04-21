// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract GitcoinAdapter is OracleAdapter {
    uint256 public constant MIN_SCORE = 20;

    error ScoreTooLow();

    event GitcoinVerified(address indexed user, uint256 score, bytes32 userId);

    constructor(address _eas, bytes32 _schemaUID, address _mainAggregator, address _backendOracle)
        OracleAdapter(_eas, _schemaUID, _mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        bytes32 uid = abi.decode(proof, (bytes32));
        (bytes32 userId, uint256 score) = _consumeAttestation(uid, user);

        if (score < MIN_SCORE) revert ScoreTooLow();

        // MainAggregator extracts score from source==1 proof as (bytes32, uint256, uint256, bytes)
        mainAggregator.registerVerification(user, 1, userId,
            abi.encode(userId, score, uint256(0), bytes("")));

        emit GitcoinVerified(user, score, userId);
    }

    function getSourceId() external pure returns (uint8) { return 1; }
}
