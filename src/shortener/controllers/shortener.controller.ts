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

    const shortUrlEntity: ShortUrl = await this.createShortenerUseCase.execute({
      originalUrl: body.url,
      userId
    });

    return { shortenUrl: shortUrlEntity.short_code };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna uma lista URLs encurtadas do usuário autenticado'
  })
  @UseGuards(OptionalJwtAuthGuard)
  async listShortenedUrls(@Req() req): Promise<Omit<ShortUrl, 'user'>[]> {
    if (!req.user) {
      throw new UnauthorizedException(
        'Apenas usuários autenticados podem listar suas URLs encurtadas.'
      );
    }
    return await this.createShortenerUseCase.findByUserId(req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta uma URL encurtada' })
  @UseGuards(OptionalJwtAuthGuard)
  async deleteUrl(@Req() req, @Param('id') id: string): Promise<boolean> {
    if (!req.user) {
      throw new UnauthorizedException(
        'Apenas usuários autenticados podem deletar URLs.'
      );
    }
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
    if (!req.user) {
      throw new UnauthorizedException(
        'Apenas usuários autenticados podem atualizar URLs.'
      );
    }

    const result = await this.createShortenerUseCase.updateSourceUrl(
      id,
      req.user.id,
      newUrlSource
    );
    if (!result) {
      throw new UnauthorizedException(
        'Não foi possível atualizar a URL. Verifique se a URL existe e se você tem permissão para atualizá-la.'
      );
    }
    return result;
  }
}
