import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlInputDto {
  @ApiProperty({ example: 'https://www.exemplo.com' })
  url: string;
}
