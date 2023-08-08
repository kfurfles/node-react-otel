import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  IAccount,
  ICredentials,
  IGoogleCredential,
  IFacebookCredential,
} from '../interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_NAME, AccountCreateEvent } from '../Events/accountCreate.event';
import { toDto } from '../mappers/account.mapper';

export interface IAccountRepository {
  createAccount: (params: Omit<IAccount, 'id'>) => Promise<IAccount>;
  findByEmail: (param: Pick<ICredentials, 'email'>) => Promise<IAccount>;
  findByExternalId: (param: {
    email: string;
    google_id?: string;
    facebook_id?: string;
  }) => Promise<IAccount>;
}

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}
  async createAccount(data: Omit<IAccount, 'id'>) {
    try {
      const createdAccount = await this.prisma.account.create({
        data,
      });
      const account = toDto(createdAccount);
      const accountType = !!account.google_id
        ? 'google'
        : !!account.facebook_id
        ? 'facebook'
        : 'local';

      this.eventEmitter.emit(
        EVENT_NAME,
        new AccountCreateEvent({
          ...account,
          type: accountType,
        }),
      );

      return account;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Prisma.PrismaClientKnownRequestError(err.message, err);
      }
      throw new Error(err);
    }
  }

  async findByEmail({ email }: ICredentials) {
    try {
      const findedUser = await this.prisma.account.findFirst({
        where: {
          email,
        },
      });

      return !!findedUser?.id ? toDto(findedUser) : null;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Prisma.PrismaClientKnownRequestError(err.message, err);
      }
      throw new Error(err);
    }
  }

  async findByExternalId(param: {
    email: string;
    google_id?: string;
    facebook_id?: string;
  }) {
    try {
      const { email, facebook_id, google_id } = param;
      const findedUser = await this.prisma.account.findFirst({
        where: {
          email: email,
          AND: {
            OR: [{ google_id, facebook_id }],
          },
        },
      });

      return !!findedUser?.id ? toDto(findedUser) : null;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Prisma.PrismaClientKnownRequestError(err.message, err);
      }
      throw new Error(err);
    }
  }
}
