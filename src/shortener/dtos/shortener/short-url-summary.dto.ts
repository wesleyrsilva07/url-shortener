import { ApiProperty } from '@nestjs/swagger';

export class ShortUrlSummaryDto {
  @ApiProperty({ example: 'http://localhost:3010/abc123' })
  short_url: string;

  @ApiProperty({ example: 42 })
  clicks: number;
}
