import { hash } from 'bcrypt';

const saltRound = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, saltRound);
};
