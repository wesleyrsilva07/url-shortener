import { ShortUrl } from '../../entities/short-url.entity';

export interface IShortUrlRepository {
  createShortUrl(data: Partial<ShortUrl>): Promise<ShortUrl>;
  findByUserId(userId: string): Promise<ShortUrl[]>;
  softDeleteById(id: string, userId: string): Promise<boolean>;
  updateSourceUrl(
    id: string,
    userId: string,
    newUrlSource: string
  ): Promise<boolean>;
  findByShortCode(shortCode: string): Promise<ShortUrl | null>;
  updateClicks(id: string, clicks: number): Promise<void>;
}
