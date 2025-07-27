import { AuthType } from '../dtos/auth.type';
import { AuthUseCase } from '../usecases/auth.usecase';
import { AuthInput } from '../dtos/auth.input';
import { Controller } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private authService: AuthUseCase) {}

  public async login(data: AuthInput): Promise<AuthType> {
    const response = await this.authService.validateUser(data);
    return {
      user: response.user,
      token: response.token
    };
  }
}
