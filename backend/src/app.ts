import express, { Request, Response } from 'express';
import { userRoute } from './user/router';
import router from './tradeHistory/router';
import bodyParser from 'body-parser';
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose'); 

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRoute());
app.use('/api', router);

mongoose.connect('mongodb://127.0.0.1:27017/forex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');

  const apiKey = 'chnpfihr01qrto3v795gchnpfihr01qrto3v7960';
  const externalWs = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

  externalWs.on('open', () => {
    externalWs.send(JSON.stringify({ type: 'subscribe', symbol: 'OANDA:GBP_USD' }));
  });

  externalWs.on('message', (event) => {
    const message = event.toString();
    ws.send(message);
  });

  externalWs.on('close', () => {
    console.log('External WebSocket connection closed.');
  });

  ws.on('message', (message) => {
    console.log('Message received from frontend:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
    externalWs.close();
  });
});

