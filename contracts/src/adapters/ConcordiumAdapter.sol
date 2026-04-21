// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract ConcordiumAdapter is OracleAdapter {
    error InvalidConcordiumAccount();

    event ConcordiumVerified(address indexed evmUser, bytes32 concordiumAccountHash);

    constructor(address _eas, bytes32 _schemaUID, address _mainAggregator, address _backendOracle)
        OracleAdapter(_eas, _schemaUID, _mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        bytes32 uid = abi.decode(proof, (bytes32));
        (bytes32 concordiumAccountHash,) = _consumeAttestation(uid, user);

        if (concordiumAccountHash == bytes32(0)) revert InvalidConcordiumAccount();

        mainAggregator.registerVerification(user, 4, concordiumAccountHash, proof);
        emit ConcordiumVerified(user, concordiumAccountHash);
    }

    function getSourceId() external pure returns (uint8) { return 4; }
}
