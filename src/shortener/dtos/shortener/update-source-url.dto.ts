import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSourceUrlDto {
  @ApiProperty({
    example: 'https://example.com/new-url',
    description: 'Nova URL de origem'
  })
  @IsString({ message: 'URL deve ser uma string' })
  @IsNotEmpty({ message: 'URL é obrigatória' })
  @IsUrl({}, { message: 'URL deve ter formato válido' })
  newUrlSource: string;
}
