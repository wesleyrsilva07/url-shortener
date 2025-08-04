import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedirectParamsDto {
  @ApiProperty({
    example: 'https://url',
    description: 'Shortened URL'
  })
  @IsString({ message: 'Shorten url deve ser uma string' })
  @IsNotEmpty({ message: 'Shorten url é obrigatório' })
  shortenUrl: string;
}
