// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract PoHAdapter is OracleAdapter {
    event PoHVerified(address indexed user, bytes32 pohId);

    constructor(address _mainAggregator, address _backendOracle)
        OracleAdapter(_mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        (bytes32 pohId, uint256 timestamp, bytes memory signature) =
            abi.decode(proof, (bytes32, uint256, bytes));

        _useProof(pohId, timestamp, user, signature);

        mainAggregator.registerVerification(user, 2, pohId, proof);
        emit PoHVerified(user, pohId);
    }

    function getSourceId() external pure returns (uint8) { return 2; }
}
