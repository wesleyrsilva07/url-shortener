import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  MaxLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
  @ApiProperty({ example: 'João Silva', maxLength: 150 })
  @IsString()
  @IsNotEmpty({ message: 'O campo Nome é obrigatório.' })
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'O campo E-mail é obrigatório.' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty({ message: 'A senha não foi preenchida.' })
  password: string;

  // Descomente se quiser usar account_type
  // @ApiProperty({ example: 'admin' })
  // @IsString()
  // @IsNotEmpty()
  // account_type: string;
}
