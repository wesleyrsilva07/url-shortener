import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class AuthType {
  user: User;

  @IsString()
  token: string;
}
