import express from 'express';
import { Request, Response } from 'express';
import { Trade } from './model';
import { createTrade } from './controller';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/trades', createTrade);

router.get('/trades', async (req: Request, res: Response) => {
  try {
    const trades = await Trade.find().lean();
    res.json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/trades/:userId', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  try {
    const decodedToken: any = jwt.verify(token, '2b$10$wJrCNThgqusTvJSeiv6EVuia/wbWg/');
    const userId = decodedToken.userId;
    const trades = await Trade.find({ userId });
    res.json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;