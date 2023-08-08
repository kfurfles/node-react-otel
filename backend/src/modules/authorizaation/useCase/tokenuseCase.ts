import { IAccount } from '@/modules/account/interface';
import * as jwt from 'jsonwebtoken';
const SecretKey = 'private-key';

export const createAccountToken = (user: IAccount) => {
  const { email, id: accountId, userId } = user;
  const token = jwt.sign({ email, accountId, userId }, SecretKey, {
    expiresIn: 36000,
  });

  return token;
};

export const validateAccountToken = (token: string) => {
  return jwt.verify(token, SecretKey);
};
