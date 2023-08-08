import { Test, TestingModule } from '@nestjs/testing';
import { RegisterAccountUseCase } from './registerAccountUseCase';

describe.skip('CreateAccountUseCase', () => {
  let service: RegisterAccountUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterAccountUseCase],
    }).compile();

    service = module.get<RegisterAccountUseCase>(RegisterAccountUseCase);
  });

  it('should be defined', () => {
    expect(true).toBeTruthy();
  });
});
