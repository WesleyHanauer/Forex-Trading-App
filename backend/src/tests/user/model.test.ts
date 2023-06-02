import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {
  User,
  UserDocument,
  UserInput,
  createUser,
  findUserByEmail,
} from '../../user/model';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a new user', async () => {
    const mockUserInput: UserInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock bcrypt.hash to return the original password
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockUserInput.password);

    const savedUser: UserDocument = new User({
      ...mockUserInput,
      balances: [
        { currency: 'USD', amount: 1000 },
        { currency: 'GBP', amount: 1000 },
      ],
    });

    // Mock User.save to return the saved user
    const saveSpy = jest.spyOn(User.prototype, 'save').mockResolvedValue(savedUser);

    const result = await createUser(mockUserInput);

    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual(savedUser);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
  });

  it('should find a user by email', async () => {
    const mockEmail = 'john@example.com';
    const mockUser: UserDocument = new User({
      name: 'John Doe',
      email: mockEmail,
      password: 'password123',
      balances: [
        { currency: 'USD', amount: 1000 },
        { currency: 'GBP', amount: 1000 },
      ],
    });

    // Mock User.findOne to return the mock user
    const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

    const result = await findUserByEmail(mockEmail);

    expect(findOneSpy).toHaveBeenCalledWith({ email: mockEmail });
    expect(result).toEqual(mockUser);
  });
});
