import { ExternalRegisterDto } from '../dto';

export interface IValidateStrategy {
  validate(
    token: string,
  ): Promise<ExternalRegisterDto | 'INVALID_TOKEN_SIGNATURE' | 'GENERIC_ERROR'>;
}
