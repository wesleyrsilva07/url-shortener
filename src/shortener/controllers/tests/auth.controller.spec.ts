import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthUseCase } from '../../usecases/auth.usecase';
import { AuthInput } from '../../dtos/auth.input';

describe('AuthController', () => {
  let controller: AuthController;
  let authUseCase: AuthUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthUseCase,
          useValue: {
            validateUser: jest.fn()
          }
        }
      ]
    }).compile();
    controller = moduleRef.get<AuthController>(AuthController);
    authUseCase = moduleRef.get<AuthUseCase>(AuthUseCase);
  });

  it('should call AuthUseCase.validateUser and return result', async () => {
    const input: AuthInput = { email: 'a@a.com', password: '123' };
    const expected = { userEmail: 'a@a.com', token: 'token' };
    jest.spyOn(authUseCase, 'validateUser').mockResolvedValue(expected);
    const result = await controller.login(input);
    expect(result).toStrictEqual(expected);
    expect(authUseCase.validateUser).toHaveBeenCalledWith(input);
  });
});
