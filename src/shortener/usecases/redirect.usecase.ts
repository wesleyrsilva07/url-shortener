import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IShortUrlRepository } from '../repositories/interfaces/Ishort-url.repository';

@Injectable()
export class RedirectUseCase {
  constructor(
    @Inject('IShortUrlRepository')
    private readonly shortUrlRepo: IShortUrlRepository
  ) {}

  async handleRedirect(shortCode: string): Promise<string> {
    const shortUrl = await this.shortUrlRepo.findByShortCode(shortCode);
    if (!shortUrl || shortUrl.deleted_at) {
      throw new NotFoundException('Short URL not found');
    }
    shortUrl.clicks = (shortUrl.clicks || 0) + 1;
    await this.shortUrlRepo.updateClicks(shortUrl.id, shortUrl.clicks);
    return shortUrl.original_url;
  }
}
