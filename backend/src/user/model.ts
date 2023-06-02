import bcrypt from 'bcrypt';
import mongoose, { Document, Schema, Model } from 'mongoose';

interface Balance {
  currency: string;
  amount: number;
}

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  balances: Balance[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface UserInput {
  name: UserDocument['name'];
  email: UserDocument['email'];
  password: UserDocument['password'];
}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balances: [
    {
      currency: { type: String, required: true, enum: ['USD', 'GBP'] },
      amount: { type: Number, required: true },
    },
  ],
});

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  if (!this.isNew) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  this.balances = [
   { currency: 'USD', amount: 1000 },
   { currency: 'GBP', amount: 1000 },
  ];
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

const createUser = async (input: UserInput) => {
  const user = new User(input);
  await user.save();
  return user;
};

const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export { User, UserInput, UserDocument, createUser, findUserByEmail };