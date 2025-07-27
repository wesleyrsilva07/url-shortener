import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsNotEmpty()
  userId: string; // ID do usuário que está criando o short URL
}
