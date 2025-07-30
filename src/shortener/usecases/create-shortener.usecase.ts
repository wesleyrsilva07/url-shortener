import { CreateUrlDto } from '../dtos/create-url.dto';
import { ShortUrl } from '../entities/short-url.entity';
import { UserUseCase } from './user.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { IShortUrlRepository } from '../repositories/interfaces/Ishort-url.repository';

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject('IShortUrlRepository')
    private shortenerRepository: IShortUrlRepository,
    private userUseCase: UserUseCase
  ) {}

  async execute(dto: CreateUrlDto & { shortUrl?: string }): Promise<ShortUrl> {
    // Usa shortUrl e shortCode já gerados se vierem do controller
    const shortCode = dto.shortUrl
      ? dto.shortUrl.split('/').pop()!
      : this.generateShortCode();

    const user = dto.userId
      ? await this.userUseCase.findUserById(dto.userId)
      : null;

    return this.shortenerRepository.createShortUrl({
      original_url: dto.originalUrl,
      short_code: shortCode,
      short_url: dto.shortUrl,
      user: user ?? undefined
    });
  }

  generateShortCode(): string {
    return crypto.randomUUID().slice(0, 6);
  }

  async findByUserId(userId: string): Promise<ShortUrl[]> {
    return this.shortenerRepository.findByUserId(userId);
  }
  async softDeleteById(id: string, userId: string): Promise<boolean> {
    return this.shortenerRepository.softDeleteById(id, userId);
  }
  async updateSourceUrl(
    id: string,
    userId: string,
    newUrlSource: string
  ): Promise<boolean> {
    return this.shortenerRepository.updateSourceUrl(id, userId, newUrlSource);
  }
}
