import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';

import { User } from '@user/infra/schema/User';
import { AuthPayload } from '@user/infra/types/AuthPayload';
import { UnauthorizedError } from '@/errors/UnauthorizedError';
import { createAccessToken } from '@user/infra/middleware/createAccessToken';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default';

export class RefreshJwtToken {
  constructor(readonly userRepository: Repository<User>) {}
  async execute(refreshToken: string) {
    const decoded = await new Promise((resolve, reject) => {
      verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });

    const payload = decoded as AuthPayload;
    const id = payload.id;

    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    return await createAccessToken(user);
  }
}
