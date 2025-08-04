import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
  Param
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateShortUrlUseCase } from '../usecases/create-shortener.usecase';
import { ShortenUrlInputDto } from '../dtos/shortener/shorten-url-input.dto';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { UrlErrorMessages } from '../errors/url-error-messages.enum';
import { ShortUrlSummaryDto } from '../dtos/shortener/short-url-summary.dto';
import { ShortUrlIdParamsDto } from '../dtos/shortener/shorturl-params.dto';
import { UpdateSourceUrlDto } from '../dtos/shortener/update-source-url.dto';

@ApiBearerAuth('JWT-auth')
@Controller()
export class URLShortener {
  constructor(private readonly createShortenerUseCase: CreateShortUrlUseCase) {}

  @ApiBearerAuth('JWT-auth')
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

    const tempShortCode = this.createShortenerUseCase.generateShortCode();
    const protocol = req.protocol;
    const host = req.get('host');
    const shortUrl = `${protocol}://${host}/${tempShortCode}`;

    await this.createShortenerUseCase.execute({
      originalUrl: body.url,
      userId,
      shortUrl
    });

    return { shortenUrl: shortUrl };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Retorna uma lista URLs encurtadas do usuário autenticado'
  })
  @UseGuards(OptionalJwtAuthGuard)
  async listShortenedUrls(@Req() req): Promise<ShortUrlSummaryDto[]> {
    const tempShortCode = this.createShortenerUseCase.generateShortCode();
    const protocol = req.protocol;
    const host = req.get('host');
    const shortUrl = `${protocol}://${host}/${tempShortCode}`;
    return await this.createShortenerUseCase.findByUserId(
      req.user.id,
      shortUrl
    );
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deleta uma URL encurtada' })
  @UseGuards(OptionalJwtAuthGuard)
  async deleteUrl(
    @Req() req,
    @Param() params: ShortUrlIdParamsDto
  ): Promise<boolean> {
    return this.createShortenerUseCase.softDeleteById(params.id, req.user.id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza a URL de origem' })
  @ApiBody({ type: UpdateSourceUrlDto })
  @UseGuards(OptionalJwtAuthGuard)
  async updateSourceUrl(
    @Req() req,
    @Param() params: ShortUrlIdParamsDto,
    @Body() body: UpdateSourceUrlDto
  ): Promise<boolean> {
    const result = await this.createShortenerUseCase.updateSourceUrl(
      params.id,
      req.user.id,
      body.newUrlSource
    );
    if (!result) {
      throw new UnauthorizedException(UrlErrorMessages.UPDATE_FAILED);
    }
    return result;
  }
}
