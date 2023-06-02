import express from 'express';
import { createTrade, getTrades, getTrade } from './controller';

const router = express.Router();

router.post('/trades', createTrade);

router.get('/trades', getTrades);

router.get('/trades/:userId', getTrade);

export default router;