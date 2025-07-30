import { Test } from '@nestjs/testing';
import { AuthUseCase } from '../auth.usecase';
import { UserUseCase } from '../user.usecase';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthInput } from '../../dtos/auth.input';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthUseCase', () => {
  let authUseCase: AuthUseCase;
  let userUseCase: UserUseCase;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthUseCase,
        {
          provide: UserUseCase,
          useValue: {
            findUserByEmail: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn()
          }
        }
      ]
    }).compile();
    authUseCase = moduleRef.get<AuthUseCase>(AuthUseCase);
    userUseCase = moduleRef.get<UserUseCase>(UserUseCase);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should validate user and return token', async () => {
    const user = {
      id: '1',
      email: 'a@a.com',
      name: 'User',
      password_hash: 'hash'
    } as User;
    const input: AuthInput = { email: 'a@a.com', password: '123' };
    jest.spyOn(userUseCase, 'findUserByEmail').mockResolvedValue(user);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    const result = await authUseCase.validateUser(input);
    expect(result).toEqual({ userEmail: user.email, token: 'token' });
    expect(userUseCase.findUserByEmail).toHaveBeenCalledWith(input.email);
    expect(jwtService.signAsync).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const user = {
      id: '1',
      email: 'a@a.com',
      name: 'User',
      password_hash: 'hash'
    } as User;
    const input: AuthInput = { email: 'a@a.com', password: 'wrong' };
    jest.spyOn(userUseCase, 'findUserByEmail').mockResolvedValue(user);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    await expect(authUseCase.validateUser(input)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
