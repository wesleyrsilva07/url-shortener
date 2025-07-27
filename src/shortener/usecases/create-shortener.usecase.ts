import { CreateUrlDto } from '../dtos/create-url.dto';

export class CreateShortUrlUseCase {
  constructor() // private readonly shortUrlRepo: IShortUrlRepository
  {}

  async execute(dto: CreateUrlDto) {
    const shortCode = this.generateShortCode(dto.originalUrl);
    return 'this.shortUrlRepo.save({ ...dto, shortCode }';
  }

  private generateShortCode(url: string): string {
    return crypto.randomUUID().slice(0, 6);
  }
}
