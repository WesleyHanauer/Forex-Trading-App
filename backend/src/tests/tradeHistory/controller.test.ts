import { Request, Response } from 'express';
import { Trade } from './model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const createTrade = async (req: Request, res: Response) => {
  try {
    const { currencyPair, volume, type, price, value, timestamp } = req.body;
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    const decodedToken: any = jwt.verify(token, 'peido');
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
