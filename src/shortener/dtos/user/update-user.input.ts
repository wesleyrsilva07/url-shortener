import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsBoolean
} from 'class-validator';

export class UpdateUserInput {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'O campo E-mail deve ser um email válido.' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
