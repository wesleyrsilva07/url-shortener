import { Repository } from 'typeorm';
import { CreateUrlDto } from '../dtos/create-url.dto';
import { ShortUrl } from '../entities/short-url.entity';
import { UserUseCase } from './user.usecase';

export class CreateShortUrlUseCase {
  constructor(
    private shortenerRepository: Repository<ShortUrl>,
    private userUseCase: UserUseCase
  ) {}

  async execute(dto: CreateUrlDto): Promise<ShortUrl> {
    const shortCode = this.generateShortCode(dto.originalUrl);
    const user = await this.userUseCase.findUserById(dto.userId);
    const shortUrl = this.shortenerRepository.create({
      original_url: dto.originalUrl,
      short_code: shortCode,
      user
    });

    return await this.shortenerRepository.save(shortUrl);
  }

  private generateShortCode(url: string): string {
    return crypto.randomUUID().slice(0, 6);
  }
}
