import { User } from '../schema/User';
import { sign } from 'jsonwebtoken';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default';

export const createRefreshToken = async (user: User) => {
  const payload = {
    id: user._id,
  };
  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return refreshToken;
};
