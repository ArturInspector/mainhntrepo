// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract BrightIDAdapter is OracleAdapter {
    event BrightIDVerified(address indexed user, bytes32 contextId);

    constructor(address _eas, bytes32 _schemaUID, address _mainAggregator, address _backendOracle)
        OracleAdapter(_eas, _schemaUID, _mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        bytes32 uid = abi.decode(proof, (bytes32));
        (bytes32 contextId,) = _consumeAttestation(uid, user);

        mainAggregator.registerVerification(user, 3, contextId, proof);
        emit BrightIDVerified(user, contextId);
    }

    function getSourceId() external pure returns (uint8) { return 3; }
}
