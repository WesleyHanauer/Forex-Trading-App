import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export interface Trade {
  userId: ObjectId;
  currencyPair: string;
  volume: number;
  type: string;
  price: number;
  value: number;
  timestamp: string;
}

const tradeSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  currencyPair: String,
  volume: Number,
  type: String,
  price: Number,
  value: Number,
  timestamp: String,
}, { collection: 'tradeHistory' });

export const Trade = mongoose.model<Trade>('Trade', tradeSchema);
