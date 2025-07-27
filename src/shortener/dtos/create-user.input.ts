import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  MaxLength
} from 'class-validator';

export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'O campo Nome é obrigatório.' })
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres.' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'O campo E-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não foi preenchida.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  account_type: string;
}
