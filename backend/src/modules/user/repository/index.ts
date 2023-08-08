import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { IUser } from '../interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreateEvent, EVENT_NAME } from '../Events/userCreate.event';

export interface IUserRepository {
  createUser: (data: Omit<IUser, 'id'>) => Promise<IUser>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(data: User) {
    try {
      const { id, lastname, name, picture } = await this.prisma.user.create({
        data,
      });
      this.eventEmitter.emit(
        EVENT_NAME,
        new UserCreateEvent({ id, lastname, name, picture }),
      );
      return { id, lastname, name, picture };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Prisma.PrismaClientKnownRequestError(err.message, err);
      }
      throw new Error(err);
    }
  }
}
