import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
  Param
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateShortUrlUseCase } from '../usecases/create-shortener.usecase';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortenUrlInputDto } from '../dtos/shorten-url-input.dto';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { UrlErrorMessages } from '../errors/url-error-messages.enum';
@Controller()
export class URLShortener {
  constructor(private readonly createShortenerUseCase: CreateShortUrlUseCase) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devolve uma url encurtada a partir de uma URL original.'
  })
  @ApiBody({ type: ShortenUrlInputDto })
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async shortenUrl(
    @Body() body: ShortenUrlInputDto,
    @Req() req
  ): Promise<ShortenUrlResponseDto> {
    const userId = req.user?.id || null;

    // Gera short_code
    const tempShortCode = this.createShortenerUseCase.generateShortCode();
    const protocol = req.protocol;
    const host = req.get('host');
    const shortUrl = `${protocol}://${host}/${tempShortCode}`;

    const shortUrlEntity: ShortUrl = await this.createShortenerUseCase.execute({
      originalUrl: body.url,
      userId,
      shortUrl
    });

    return { shortenUrl: shortUrl };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna uma lista URLs encurtadas do usuário autenticado'
  })
  @UseGuards(OptionalJwtAuthGuard)
  async listShortenedUrls(@Req() req): Promise<Omit<ShortUrl, 'user'>[]> {
    return await this.createShortenerUseCase.findByUserId(req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta uma URL encurtada' })
  @UseGuards(OptionalJwtAuthGuard)
  async deleteUrl(@Req() req, @Param('id') id: string): Promise<boolean> {
    return this.createShortenerUseCase.softDeleteById(id, req.user.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza a URL de origem' })
  @UseGuards(OptionalJwtAuthGuard)
  async updateSourceUrl(
    @Req() req,
    @Param('id') id: string,
    @Body('newUrlSource') newUrlSource: string
  ): Promise<boolean> {
    const result = await this.createShortenerUseCase.updateSourceUrl(
      id,
      req.user.id,
      newUrlSource
    );
    if (!result) {
      throw new UnauthorizedException(UrlErrorMessages.UPDATE_FAILED);
    }
    return result;
  }
}
