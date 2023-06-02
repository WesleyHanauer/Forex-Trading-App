import { Request, Response } from 'express';
import { User, UserInput, findUserByEmail } from './model';
import jwt from 'jsonwebtoken';
import mongoose, { ObjectId } from 'mongoose';

const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res
      .status(422)
      .json({ message: 'The fields email, name, password are required' });
  }

  const userInput: UserInput = {
    name,
    email,
    password,
  };

  const userCreated = await User.create(userInput);

  return res.status(201).json({ data: userCreated });
};

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const users = await User.find().lean().exec();

  return res.status(200).json({ data: users });
};

const getUser = async (req: Request, res: Response): Promise<Response> => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';
  try {
    const decodedToken: any = jwt.verify(token, '2b$10$wJrCNThgqusTvJSeiv6EVuia/wbWg/');
    const id = decodedToken.userId;

    console.log(id)

    const user = await User.findById(id).lean().exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  if (!name) {
    return res.status(422).json({ message: 'The field name is required' });
  }

  await user.updateOne({ name });

  const userUpdated = await User.findById(id);

  return res.status(200).json({ data: userUpdated });
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: 'User deleted successfully.' });
};

const checkUserPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ message: 'The fields email and password are required' });
  }

  const user = await findUserByEmail(email);


  if (!user) {
    return res.status(404).json({ message: `User with email "${email}" not found.` });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  const token = jwt.sign({ userId: user._id }, '2b$10$wJrCNThgqusTvJSeiv6EVuia/wbWg/');

  console.log(token)

  return res.status(200).json({ message: 'Login successful.', token });
};

const updateUserBalance = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1] ?? '';

  try {
    const decodedToken: any = jwt.verify(token, '2b$10$wJrCNThgqusTvJSeiv6EVuia/wbWg/');

    console.log("decoded token : "+decodedToken)
    console.log("not decoded token : "+token)

    const userId = decodedToken.userId;

    const { balances } = req.body;

    console.log(balances)

    const user = await User.findByIdAndUpdate(
      userId,
      { balances },
      { new: true }
    ).exec();

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id "${userId}" not found.` });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(`Error updating user balance: ${error}`);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  checkUserPassword,
  updateUserBalance,
};