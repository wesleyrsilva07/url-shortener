import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthInput {
  @ApiProperty({ example: 'user@email.com' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;
}
