// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract GitcoinAdapter is OracleAdapter {
    uint256 public constant MIN_SCORE = 20;

    error ScoreTooLow();

    event GitcoinVerified(address indexed user, uint256 score, bytes32 userId);

    constructor(address _mainAggregator, address _backendOracle)
        OracleAdapter(_mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        (bytes32 userId, uint256 score, uint256 timestamp, bytes memory signature) =
            abi.decode(proof, (bytes32, uint256, uint256, bytes));

        if (score < MIN_SCORE) revert ScoreTooLow();
        _useProofWithScore(userId, score, timestamp, user, signature);

        mainAggregator.registerVerification(user, 1, userId, proof);
        emit GitcoinVerified(user, score, userId);
    }

    function getSourceId() external pure returns (uint8) { return 1; }
}
