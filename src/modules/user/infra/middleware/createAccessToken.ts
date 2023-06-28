import { sign } from 'jsonwebtoken';
import { User } from '../schema/User';
import { logger } from '@/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'default';

export const createAccessToken = async (user: User) => {
  const payload = {
    id: user._id,
    company: user.company_id,
  };
  logger.info(payload);
  const accessToken = sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });
  return accessToken;
};
