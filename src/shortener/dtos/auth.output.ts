import { IsString } from 'class-validator';

export class AuthType {
  userEmail: string;

  @IsString()
  token: string;
}
