// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract PoHAdapter is OracleAdapter {
    event PoHVerified(address indexed user, bytes32 pohId);

    constructor(address _eas, bytes32 _schemaUID, address _mainAggregator, address _backendOracle)
        OracleAdapter(_eas, _schemaUID, _mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        bytes32 uid = abi.decode(proof, (bytes32));
        (bytes32 pohId,) = _consumeAttestation(uid, user);

        mainAggregator.registerVerification(user, 2, pohId, proof);
        emit PoHVerified(user, pohId);
    }

    function getSourceId() external pure returns (uint8) { return 2; }
}
