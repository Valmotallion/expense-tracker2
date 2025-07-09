import jwt from 'jsonwebtoken';

export const generateToken = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, { expiresIn: '1h' });
};
