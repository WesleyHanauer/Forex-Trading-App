import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  checkUserPassword,
  updateUserBalance,
} from './controller';

const userRoute = (): Router => {
  const router = Router();

  router.post('/users', createUser);

  router.get('/users', getAllUsers);

  router.get('/users/:id', getUser);

  router.put('/users/:id', updateUser);

  router.delete('/users/:id', deleteUser);

  router.post('/users/check-password', checkUserPassword);

  router.put('/users/:id/balance', updateUserBalance);

  return router;
};

export { userRoute };
