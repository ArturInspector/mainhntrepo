// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OracleAdapter.sol";

contract ConcordiumAdapter is OracleAdapter {
    error InvalidConcordiumAccount();

    event ConcordiumVerified(address indexed evmUser, bytes32 concordiumAccountHash);

    constructor(address _mainAggregator, address _backendOracle)
        OracleAdapter(_mainAggregator, _backendOracle) {}

    function verifyAndRegister(address user, bytes calldata proof) external {
        (bytes32 concordiumAccountHash, uint256 timestamp, bytes memory signature) =
            abi.decode(proof, (bytes32, uint256, bytes));

        if (concordiumAccountHash == bytes32(0)) revert InvalidConcordiumAccount();
        _useProof(concordiumAccountHash, timestamp, user, signature);

        mainAggregator.registerVerification(user, 4, concordiumAccountHash, proof);
        emit ConcordiumVerified(user, concordiumAccountHash);
    }

    function getSourceId() external pure returns (uint8) { return 4; }
}
