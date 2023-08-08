import { EventBase } from '@/Core/domain/Event';
import { IAccount, ICredentials } from '../interface';

export const EVENT_NAME = 'ACCOUNT.CREATED' as const;
type EventPayload = IAccount & Pick<ICredentials, 'type'>;

export class AccountCreateEvent implements EventBase<EventPayload> {
  readonly date: Date;
  readonly type = EVENT_NAME;
  payload: EventPayload;

  constructor(params: EventPayload) {
    this.date = new Date();
    this.payload = params;
  }
}
