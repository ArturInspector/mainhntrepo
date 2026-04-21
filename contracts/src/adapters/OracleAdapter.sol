// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IVerificationAdapter.sol";
import "../interfaces/IEAS.sol";
import "../core/MainAggregator.sol";

/// Schema: abi.encode(bytes32 uniqueId, uint256 qualityScore)
abstract contract OracleAdapter is IVerificationAdapter {
    IEAS public immutable eas;
    MainAggregator public immutable mainAggregator;
    address public immutable backendOracle;
    bytes32 public immutable schemaUID;

    mapping(bytes32 => bool) public usedAttestations;

    error AttestationNotFound();
    error AttestationAlreadyUsed();
    error AttestationExpired();
    error AttestationRevoked();
    error InvalidAttester();
    error InvalidRecipient();
    error InvalidSchema();

    constructor(address _eas, bytes32 _schemaUID, address _mainAggregator, address _backendOracle) {
        eas = IEAS(_eas);
        schemaUID = _schemaUID;
        mainAggregator = MainAggregator(_mainAggregator);
        backendOracle = _backendOracle;
    }

    function _consumeAttestation(bytes32 uid, address expectedRecipient)
        internal
        returns (bytes32 uniqueId, uint256 qualityScore)
    {
        if (usedAttestations[uid]) revert AttestationAlreadyUsed();

        IEAS.Attestation memory att = eas.getAttestation(uid);

        if (att.uid == bytes32(0)) revert AttestationNotFound();
        if (att.schema != schemaUID) revert InvalidSchema();
        if (att.attester != backendOracle) revert InvalidAttester();
        if (att.recipient != expectedRecipient) revert InvalidRecipient();
        if (att.revocationTime != 0) revert AttestationRevoked();
        if (att.expirationTime != 0 && block.timestamp > att.expirationTime) revert AttestationExpired();

        usedAttestations[uid] = true;
        (uniqueId, qualityScore) = abi.decode(att.data, (bytes32, uint256));
    }
}
