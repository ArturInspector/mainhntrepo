import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';

const ACCOUNT_REGEX = /^[1-9A-HJ-NP-Za-km-z]{50}$/;

class ConcordiumService {
  isValidAccountAddress(address) {
    return typeof address === 'string' && ACCOUNT_REGEX.test(address);
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
