import request from 'supertest';
import express, { Router } from 'express';
import { userRoute } from '../../user/router';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  checkUserPassword,
  updateUserBalance,
} from '../../user/controller';
jest.mock('.../user/controller', () => ({
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  checkUserPassword: jest.fn(),
  updateUserBalance: jest.fn(),
}));

describe('userRoute', () => {
  let app: express.Application;
  let router: Router;

  beforeAll(() => {
    app = express();
    router = userRoute();
    app.use('/api', router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle POST /users', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    (createUser as jest.Mock).mockImplementation((req, res) => {
      res.status(200).send(userData);
    });

    await request(app).post('/api/users').send(userData).expect(200);

    expect(createUser).toHaveBeenCalledWith(userData);
  });

  it('should handle GET /users', async () => {
    const users = [{ name: 'John Doe', email: 'john@example.com' }];
    (getAllUsers as jest.Mock).mockImplementation((req, res) => {
      res.status(200).send(users);
    });

    const response = await request(app).get('/api/users').expect(200);

    expect(response.body).toEqual(users);
    expect(getAllUsers).toHaveBeenCalled();
  });

  it('should handle GET /users/:id', async () => {
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    (getUser as jest.Mock).mockImplementation((req, res) => {
      res.status(200).send(user);
    });

    const response = await request(app).get('/api/users/123').expect(200);

    expect(response.body).toEqual(user);
    expect(getUser).toHaveBeenCalledWith('123');
  });

  it('should handle PUT /users/:id', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    (updateUser as jest.Mock).mockImplementation((req, res) => {
      res.status(200).send(userData);
    });

    await request(app).put('/api/users/123').send(userData).expect(200);

    expect(updateUser).toHaveBeenCalledWith('123', userData);
  });

  it('should handle DELETE /users/:id', async () => {
    (deleteUser as jest.Mock).mockImplementation((req, res) => {
      res.sendStatus(200);
    });

    await request(app).delete('/api/users/123').expect(200);

    expect(deleteUser).toHaveBeenCalledWith('123');
  });

  it('should handle POST /users/check-password', async () => {
    const passwordData = { password: 'password123' };
    (checkUserPassword as jest.Mock).mockImplementation((req, res) => {
      res.sendStatus(200);
    });

    await request(app)
      .post('/api/users/check-password')
      .send(passwordData)
      .expect(200);

    expect(checkUserPassword).toHaveBeenCalledWith(passwordData);
  });

  it('should handle PUT /users/:id/balance', async () => {
    const balanceData = { balance: 1000 };
    (updateUserBalance as jest.Mock).mockImplementation((req, res) => {
      res.sendStatus(200);
    });

    await request(app).put('/api/users/123/balance').send(balanceData).expect(200);

    expect(updateUserBalance).toHaveBeenCalledWith('123', balanceData);
  });
});