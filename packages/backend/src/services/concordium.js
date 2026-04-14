import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

const CONCORDIUM_MAINNET_GENESIS = '9dd9ca4d19e9393877d2c44b70f89acbfc0883c2243e5eeaecc0d1cd0503f478';

class ConcordiumService {
  isValidAccountAddress(address) {
    return typeof address === 'string' && /^[1-9A-HJ-NP-Za-km-z]{50}$/.test(address);
  }

  async verifyAccount(concordiumAccount) {
    if (!this.isValidAccountAddress(concordiumAccount)) {
      throw new Error('INVALID_CONCORDIUM_ACCOUNT');
    }

    logger.info('Concordium account verification', {
      account: concordiumAccount.slice(0, 10) + '...'
    });

    return {
      verified: true,
      account: concordiumAccount,
      accountHash: ethers.keccak256(ethers.toUtf8Bytes(concordiumAccount)),
    };
  }
}

export const concordiumService = new ConcordiumService();
