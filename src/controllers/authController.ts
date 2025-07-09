import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashed, role });
    await user.save();
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken({ userId: user._id, role: user.role });
  res.json({ token });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ userId: user._id, role: user.role });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
