import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIdParamsDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID'
  })
  @IsString({ message: 'ID deve ser uma string' })
  @IsNotEmpty({ message: 'ID é obrigatório' })
  @IsUUID('4', { message: 'ID deve ser um UUID válido' })
  id: string;
}

export class UserEmailParamsDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'User email'
  })
  @IsString({ message: 'Email deve ser uma string' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}
