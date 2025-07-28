import { Repository } from 'typeorm';
import { CreateUrlDto } from '../dtos/create-url.dto';
import { ShortUrl } from '../entities/short-url.entity';
import { UserUseCase } from './user.usecase';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @InjectRepository(ShortUrl)
    private shortenerRepository: Repository<ShortUrl>,
    private userUseCase: UserUseCase
  ) {}

  async execute(dto: CreateUrlDto): Promise<ShortUrl> {
    const shortCode = this.generateShortCode(dto.originalUrl);
    const user = dto.userId
      ? await this.userUseCase.findUserById(dto.userId)
      : null;
    const shortUrl = this.shortenerRepository.create({
      original_url: dto.originalUrl,
      short_code: shortCode,
      user: user ?? undefined
    });

    return await this.shortenerRepository.save(shortUrl);
  }

  private generateShortCode(url: string): string {
    return crypto.randomUUID().slice(0, 6);
  }

  async findByUserId(userId: string): Promise<ShortUrl[]> {
    return this.shortenerRepository.find({
      where: { user: { id: userId } }
    });
  }
  async softDeleteById(id: string, userId: string): Promise<boolean> {
    const url = await this.shortenerRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!url) return false;

    await this.shortenerRepository.softDelete(id);

    return true;
  }
  async updateSourceUrl(
    id: string,
    userId: string,
    newUrlSource: string
  ): Promise<boolean> {
    const url = await this.shortenerRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!url) return false;

    url.original_url = newUrlSource;

    await this.shortenerRepository.save(url);

    return true;
  }
}
