import { AuthType } from '../dtos/auth.type';
import { AuthService } from '../usecases/auth.usecase';
import { AuthInput } from '../dtos/auth.input';

export class AuthResolver {
  constructor(private authService: AuthService) {}

  public async login(data: AuthInput): Promise<AuthType> {
    const response = await this.authService.validateUser(data);
    return {
      user: response.user,
      token: response.token
    };
  }
}
