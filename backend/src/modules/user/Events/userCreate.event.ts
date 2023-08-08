import { EventBase } from '@/Core/domain/Event';
import { IUser } from '../interface';
export const EVENT_NAME = 'USER.CREATED' as const;

export class UserCreateEvent implements EventBase<IUser> {
  readonly date: Date;
  readonly type = EVENT_NAME;
  payload: IUser;

  constructor(params: IUser) {
    this.date = new Date();
    this.payload = params;
  }
}
