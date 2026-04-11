// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract BrightIDAdapter is OracleAdapter {
    event BrightIDVerified(address indexed user, bytes32 contextId);

    constructor(address _mainAggregator, address _backendOracle)
        OracleAdapter(_mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        (bytes32 contextId, uint256 timestamp, bytes memory signature) =
            abi.decode(proof, (bytes32, uint256, bytes));

        _useProof(contextId, timestamp, user, signature);

        mainAggregator.registerVerification(user, 3, contextId, proof);
        emit BrightIDVerified(user, contextId);
    }

    function getSourceId() external pure returns (uint8) { return 3; }
}
