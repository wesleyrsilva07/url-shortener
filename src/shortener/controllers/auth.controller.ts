import { AuthType } from '../dtos/auth.output';
import { AuthUseCase } from '../usecases/auth.usecase';
import { AuthInput } from '../dtos/auth.input';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  @ApiOperation({
    summary:
      'Devolve um bearer token quando o usuário passa as credenciais corretas.'
  })
  @ApiBody({ type: AuthInput })
  @Post()
  async login(@Body() data: AuthInput): Promise<AuthType> {
    const response = await this.authUseCase.validateUser(data);
    return {
      userEmail: response.userEmail,
      token: response.token
    };
  }
}
