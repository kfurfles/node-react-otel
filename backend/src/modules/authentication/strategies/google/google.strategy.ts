import { config } from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

import { Injectable } from '@nestjs/common';
import { GOOGLE_CLIENT_ID } from 'src/infra/env';
import { ExternalRegisterDto } from '../../dto';
import { IValidateStrategy } from '../../interface/validate.interface';

config();

@Injectable()
export class GoogleStrategy implements IValidateStrategy {
  private client: OAuth2Client;
  constructor() {
    this.client = new OAuth2Client();
  }

  async validate(
    accessToken: string,
  ): Promise<
    ExternalRegisterDto | 'INVALID_TOKEN_SIGNATURE' | 'GENERIC_ERROR'
  > {
    try {
      const {
        given_name: name,
        family_name: lastname,
        email,
        picture,
        sub,
      } = await this.getUserToken(accessToken);
      return {
        email,
        id: sub,
        lastname,
        name,
        picture,
        iss: 'google',
      };
    } catch (error) {
      if (error.message.match('Invalid token signature')) {
        return 'INVALID_TOKEN_SIGNATURE' as const;
      }
      return 'GENERIC_ERROR' as const;
    }
  }

  private async getUserToken(accessToken: string) {
    return this.client
      .verifyIdToken({
        idToken: accessToken,
        audience: GOOGLE_CLIENT_ID,
      })
      .then((r) => r.getPayload());
  }
}
