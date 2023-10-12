import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  ks_users,
  ks_authentication_local,
  Prisma,
  ks_authentication_user_strategies,
} from '@prisma/client';
import { IUser } from '../interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreateEvent, EVENT_NAME } from '../Events/userCreate.event';

type ICreateUser = Pick<ks_users, 'email' | 'confirmed'> & {
  auth_Local?: Pick<ks_authentication_local, 'password'>;
  auth_stra?: Pick<ks_authentication_user_strategies, 'external_id' | 'name'>[];
};

export interface IUserRepository {
  createUser: (data: ICreateUser) => Promise<IUser>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(data: ICreateUser) {
    try {
      const { email, confirmed, auth_Local = null, auth_stra = [] } = data;
      const user = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.ks_users.create({
          data: {
            email,
            confirmed,
          },
        });

        if (!auth_Local) {
          const { password } = auth_Local;
          await tx.ks_authentication_local.create({
            data: {
              password,
              user_Id: createdUser.id,
            },
          });
        }

        if (auth_stra.length > 0) {
          await tx.ks_authentication_user_strategies.createMany({
            data: auth_stra.map((s) => {
              return {
                external_id: s.external_id,
                name: s.name,
                user_Id: createdUser.id,
              };
            }),
          });
        }

        return createdUser;
      });
      // this.eventEmitter.emit(
      //   EVENT_NAME,
      //   new UserCreateEvent({ id, lastname, name, picture }),
      // );
      return { id: user.id, email: user.email, confirmed: user.confirmed };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Prisma.PrismaClientKnownRequestError(err.message, err);
      }
      throw new Error(err);
    }
  }
}
