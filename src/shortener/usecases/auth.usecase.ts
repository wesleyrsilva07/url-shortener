import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInput } from '../dtos/auth/auth.input';
import { AuthType } from '../dtos/auth/auth.output';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../shared/constants';
import { User } from '../entities/user.entity';
import { UserUseCase } from './user.usecase';

@Injectable()
export class AuthUseCase {
  constructor(
    private userService: UserUseCase,
    private jwtService: JwtService
  ) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUserByEmail(data.email);
    const validPassword = bcrypt.compareSync(data.password, user.password_hash);

    if (!validPassword) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const token = await this.jwtToken(user);
    return {
      userEmail: user.email,
      token
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = {
      username: user.name,
      sub: user.id
    };

    return this.jwtService.signAsync(payload, { secret: jwtConstants.secret });
  }
}
