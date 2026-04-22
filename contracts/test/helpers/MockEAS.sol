// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../src/interfaces/IEAS.sol";

contract MockEAS {
    mapping(bytes32 => IEAS.Attestation) private _attestations;
    uint256 private _nonce;

    function attest(
        bytes32 schema,
        address recipient,
        address attester,
        uint64 expirationTime,
        bytes calldata data
    ) external returns (bytes32 uid) {
        uid = keccak256(abi.encode(schema, recipient, attester, data, _nonce++));
        _attestations[uid] = IEAS.Attestation({
            uid: uid,
            schema: schema,
            time: uint64(block.timestamp),
            expirationTime: expirationTime,
            revocationTime: 0,
            refUID: bytes32(0),
            recipient: recipient,
            attester: attester,
            revocable: true,
            data: data
        });
    }

    function getAttestation(bytes32 uid) external view returns (IEAS.Attestation memory) {
        return _attestations[uid];
    }

    function revoke(bytes32 uid) external {
        _attestations[uid].revocationTime = uint64(block.timestamp);
    }
}
