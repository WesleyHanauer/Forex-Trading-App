import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { userRoute } from '../user/router';
import router from '../tradeHistory/router';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRoute());
app.use('/api', router);

const mockedMongooseConnect = jest.spyOn(mongoose, 'connect');

describe('Server Setup and Routes', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(() => {
      console.log('Server started');
      done();
    });
  });
  
  afterAll((done) => {
    server.close(() => {
      console.log('Server closed');
      done();
    });
  });

  describe('Middleware', () => {
    it('should use body-parser middleware', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password'
        })
        .expect(400);
  
      expect(response.body.message).toEqual('Invalid request body');
    });
  });
  it('should use the correct middleware and route handlers', async () => {
    jest.setTimeout(30000);
  
    const token = jwt.sign({ userId: '64788d00963ce46e9fbcc5b7' }, 'peido', { expiresIn: '1h' });
  
    const response1 = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    const response2 = await request(app)
      .get('/api/trades')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response1.body).toBeDefined();
    expect(response2.body).toBeDefined();
  });
});

describe('Database Connection', () => {
  it('should establish a connection to the MongoDB database', () => {
    expect(mockedMongooseConnect).toHaveBeenCalledWith(
      'mongodb://127.0.0.1:27017/forex',
      expect.objectContaining({
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    );
  });
});