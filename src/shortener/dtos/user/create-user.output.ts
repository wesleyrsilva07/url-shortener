import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserOutput {
  @ApiProperty({ example: 'João Silva', maxLength: 150 })
  @IsString()
  @IsNotEmpty({ message: 'O campo Nome é obrigatório.' })
  @MaxLength(150, { message: 'O nome deve ter no máximo 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'O campo E-mail deve ser um email válido.' })
  @IsNotEmpty({ message: 'O campo E-mail é obrigatório.' })
  email: string;
}
