import { Request, Response } from 'express';
import { Trade } from './model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const createTrade = async (req: Request, res: Response) => {
  try {
    const { currencyPair, volume, type, price, value, timestamp } = req.body;
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    const decodedToken: any = jwt.verify(token, '2b$10$wJrCNThgqusTvJSeiv6EVuia/wbWg/');
    const userId = mongoose.Types.ObjectId.createFromHexString(decodedToken.userId);

    const trade = new Trade({
      userId,
      currencyPair,
      volume,
      type,
      price,
      value,
      timestamp,
    });

    await trade.save();
    res.json(trade);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const getTrades = async (req: Request, res: Response) => {
  try {
    const trades = await Trade.find().lean();
    res.json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const getTrade = async (req: Request, res: Response) => {
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
};

export {
  createTrade,
  getTrades,
  getTrade,
};