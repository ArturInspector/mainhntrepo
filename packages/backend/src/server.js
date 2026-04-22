import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { gitcoinService } from './services/gitcoin.js';
import { pohService } from './services/poh.js';
import { brightidService } from './services/brightid.js';
import { concordiumService } from './services/concordium.js';
import { signerService } from './services/signer.js';
import { easService } from './services/eas.js';
import { solanaService } from './services/solana.js';
import { validateAddress, sanitizeError } from './middleware/validators.js';
import { logger } from './utils/logger.js';

const app = express();

app.set('trust proxy', 1);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (config.ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: config.MAX_PAYLOAD_SIZE }));

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

logger.info('NotABot Backend starting', {
  oracleAddress: signerService.getAddress(),
  environment: config.NODE_ENV,
  port: config.PORT
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NotABot Backend',
    version: '1.0.0',
    oracleAddress: signerService.getAddress(),
    timestamp: Math.floor(Date.now() / 1000)
  });
});

app.post('/api/gitcoin/verify', validateAddress, async (req, res) => {
  const { userAddress } = req.body;

  try {
    logger.info('Gitcoin verification request', { userAddress });

    const { score, rawScore } = await gitcoinService.getPassportScore(userAddress);

    if (!gitcoinService.isScoreValid(score)) {
      logger.warn('Score too low', { userAddress, score, minRequired: config.GITCOIN_MIN_SCORE });
      return res.status(400).json({
        error: 'Score below minimum threshold',
        code: 'SCORE_TOO_LOW',
        score,
        minRequired: config.GITCOIN_MIN_SCORE
      });
    }

    const userId = signerService.createUserId('gitcoin', userAddress, rawScore);
    const scoreInt = Math.floor(score);
    const uid = await easService.attest(userAddress, userId, scoreInt);

    logger.info('Gitcoin verification success', {
      userAddress,
      score: scoreInt,
      uid: uid.slice(0, 10) + '...'
    });

    res.json({
      success: true,
      data: { uid, userId, score: scoreInt }
    });

  } catch (error) {
    logger.error('Gitcoin verification failed', { userAddress, error: error.message });
    const statusCode = error.message.includes('NO_PASSPORT_FOUND') ? 404 : 500;
    res.status(statusCode).json(sanitizeError(error));
  }
});

app.post('/api/poh/verify', validateAddress, async (req, res) => {
  const { userAddress } = req.body;

  try {
    logger.info('PoH verification request', { userAddress });

    const { registered, pohId } = await pohService.isRegistered(userAddress);

    if (!registered) {
      return res.status(400).json({
        error: 'Not registered in Proof of Humanity',
        code: 'NOT_REGISTERED_IN_POH'
      });
    }

    const uid = await easService.attest(userAddress, pohId, 100);

    logger.info('PoH verification success', { userAddress, pohId: pohId.slice(0, 10) + '...' });

    res.json({
      success: true,
      data: { uid, pohId }
    });

  } catch (error) {
    logger.error('PoH verification failed', { userAddress, error: error.message });
    const statusCode = error.message.includes('NOT_REGISTERED') ? 404 : 500;
    res.status(statusCode).json(sanitizeError(error));
  }
});

app.post('/api/brightid/verify', validateAddress, async (req, res) => {
  const { userAddress } = req.body;

  try {
    logger.info('BrightID verification request', { userAddress });

    const { unique, contextId } = await brightidService.isVerified(userAddress);

    if (!unique) {
      return res.status(400).json({
        error: 'Not verified in BrightID',
        code: 'NOT_VERIFIED_IN_BRIGHTID'
      });
    }

    const uid = await easService.attest(userAddress, contextId, 100);

    logger.info('BrightID verification success', { userAddress, contextId: contextId.slice(0, 10) + '...' });

    res.json({
      success: true,
      data: { uid, contextId }
    });

  } catch (error) {
    logger.error('BrightID verification failed', { userAddress, error: error.message });
    const statusCode = error.message.includes('NOT_VERIFIED') ? 404 : 500;
    res.status(statusCode).json(sanitizeError(error));
  }
});

app.post('/api/concordium/verify', validateAddress, async (req, res) => {
  const { userAddress, concordiumAccount } = req.body;

  try {
    logger.info('Concordium verification request', { userAddress });

    if (!concordiumAccount) {
      return res.status(400).json({ error: 'concordiumAccount required', code: 'MISSING_ACCOUNT' });
    }

    const { accountHash } = await concordiumService.verifyAccount(concordiumAccount);
    const uid = await easService.attest(userAddress, accountHash, 100);

    logger.info('Concordium verification success', {
      userAddress,
      account: concordiumAccount.slice(0, 10) + '...'
    });

    res.json({
      success: true,
      data: { uid, concordiumAccountHash: accountHash }
    });

  } catch (error) {
    logger.error('Concordium verification failed', { userAddress, error: error.message });
    const statusCode = error.message.includes('INVALID') ? 400 : 500;
    res.status(statusCode).json(sanitizeError(error));
  }
});

app.post('/api/solana/verify', async (req, res) => {
  const { userPublicKey, source, uniqueId } = req.body;

  try {
    if (!userPublicKey || !source || !uniqueId) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'INVALID_REQUEST',
        required: ['userPublicKey', 'source', 'uniqueId']
      });
    }

    logger.info('Solana verification request', { userPublicKey, source });

    const existingData = await solanaService.getVerificationData(userPublicKey);
    if (existingData && existingData.isVerified) {
      return res.json({ success: true, alreadyVerified: true, data: existingData });
    }

    const result = await solanaService.verifyUser(userPublicKey, source, uniqueId);
    logger.info('Solana verification success', { userPublicKey, signature: result.signature });
    res.json({ success: true, data: result });

  } catch (error) {
    logger.error('Solana verification failed', { userPublicKey: req.body.userPublicKey, error: error.message });
    res.status(500).json(sanitizeError(error));
  }
});

app.get('/api/solana/check/:userPublicKey', async (req, res) => {
  const { userPublicKey } = req.params;

  try {
    const data = await solanaService.getVerificationData(userPublicKey);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Verification not found', code: 'NOT_FOUND' });
    }
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Solana check failed', { userPublicKey, error: error.message });
    res.status(500).json(sanitizeError(error));
  }
});

app.post('/api/binance/verify', validateAddress, async (req, res) => {
  const { userAddress } = req.body;
  logger.info('Binance verify request (stub)', { userAddress });
  res.status(503).json({
    success: false,
    error: 'Coming Soon',
    code: 'NOT_IMPLEMENTED',
    message: 'Binance KYC integration is under development'
  });
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info(`EVM Oracle Address: ${signerService.getAddress()}`);
  logger.info(`Solana Oracle Address: ${solanaService.getOraclePublicKey()}`);
  logger.info('Endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/gitcoin/verify');
  console.log('  POST /api/poh/verify');
  console.log('  POST /api/brightid/verify');
  console.log('  POST /api/concordium/verify');
  console.log('  POST /api/solana/verify');
  console.log('  GET  /api/solana/check/:userPublicKey');
  console.log('  POST /api/binance/verify (stub)');
});

export default app;
