import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  shortUrl?: string;
}
