import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateShortUrlUseCase } from '../usecases/create-shortener.usecase';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortenUrlInputDto } from '../dtos/shorten-url-input.dto';

@Controller()
export class URLShortener {
  constructor(private readonly createShortenerUseCase: CreateShortUrlUseCase) {}

  @ApiOperation({
    summary: 'Devolve uma url encurtada a partir de uma URL original.'
  })
  @ApiQuery({ name: 'url', required: true, type: ShortenUrlInputDto })
  @Post()
  async shortenUrl(
    @Body() body: ShortenUrlInputDto,
    @Req() req
  ): Promise<ShortenUrlResponseDto> {
    const userId = req.user?.id || 'defaultUserId';

    const shortUrlEntity: ShortUrl = await this.createShortenerUseCase.execute({
      originalUrl: body.url,
      userId
    });

    return { shortenUrl: shortUrlEntity.short_code };
  }

  @Get()
  @ApiOperation({ summary: 'Retorna uma lista URLs encurtadas' })
  listShortenedUrls(): [string] {
    return ['this.appService.getHello()'];
  }

  @Post(':id')
  @ApiOperation({ summary: 'Deleta uma URL encurtada' })
  deleteUrl(id: string): boolean {
    return true;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza a URL de origem' })
  updateSourceUrl(newUrlSource: string): string {
    return 'this.appService.getHello()';
  }
}
