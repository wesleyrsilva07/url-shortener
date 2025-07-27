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

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  account_type?: string;
}
