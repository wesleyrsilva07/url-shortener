import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class AuthType {
  userEmail: string;

  @IsString()
  token: string;
}
