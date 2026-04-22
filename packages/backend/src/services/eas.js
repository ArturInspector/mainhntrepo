import { ethers } from 'ethers';
import { config } from '../config/env.js';

const EAS_ABI = [
  {
    name: 'attest',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{
      name: 'request',
      type: 'tuple',
      components: [
        { name: 'schema', type: 'bytes32' },
        {
          name: 'data',
          type: 'tuple',
          components: [
            { name: 'recipient', type: 'address' },
            { name: 'expirationTime', type: 'uint64' },
            { name: 'revocable', type: 'bool' },
            { name: 'refUID', type: 'bytes32' },
            { name: 'data', type: 'bytes' },
            { name: 'value', type: 'uint256' },
          ],
        },
      ],
    }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
];

class EasService {
  constructor() {
    const provider = new ethers.JsonRpcProvider(config.EVM_RPC_URL);
    this.wallet = new ethers.Wallet(config.BACKEND_PRIVATE_KEY, provider);
    this.contract = new ethers.Contract(config.EAS_ADDRESS, EAS_ABI, this.wallet);
    this.schemaUID = config.EAS_SCHEMA_UID;
  }

  async attest(recipient, uniqueId, qualityScore) {
    const expirationTime = BigInt(Math.floor(Date.now() / 1000) + config.PROOF_VALIDITY_SECONDS);
    const data = ethers.AbiCoder.defaultAbiCoder().encode(
      ['bytes32', 'uint256'],
      [uniqueId, qualityScore]
    );

    const tx = await this.contract.attest({
      schema: this.schemaUID,
      data: {
        recipient,
        expirationTime,
        revocable: true,
        refUID: ethers.ZeroHash,
        data,
        value: 0n,
      },
    });

    const receipt = await tx.wait();
    const uid = receipt.logs[0]?.topics[1];
    if (!uid) throw new Error('EAS_ATTEST_FAILED: no uid in receipt');
    return uid;
  }
}

export const easService = new EasService();
