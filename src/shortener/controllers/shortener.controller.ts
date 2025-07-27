import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from '../../app.service';

@Controller()
export class URLShortener {
  constructor(private readonly appService: AppService) {}

  @Post()
  shortenUrl(): string {
    return 'this.appService.getHello()';
  }

  @Get()
  listShortenedUrls(): [string] {
    return ['this.appService.getHello()'];
  }

  @Post(':id')
  deleteUrl(): string {
    return 'this.appService.getHello()';
  }

  @Put(':id')
  updateSourceUrl(): string {
    return 'this.appService.getHello()';
  }
}
