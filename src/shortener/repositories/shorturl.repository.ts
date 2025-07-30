import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortUrl } from '../entities/short-url.entity';
import { ShortUrlSummaryDto } from '../dtos/short-url-summary.dto';
import { IShortUrlRepository } from './interfaces/Ishort-url.repository';

@Injectable()
export class TypeOrmShortUrlRepository implements IShortUrlRepository {
  constructor(
    @InjectRepository(ShortUrl)
    private readonly repo: Repository<ShortUrl>
  ) {}

  async createShortUrl(data: Partial<ShortUrl>): Promise<ShortUrl> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findByUserId(userId: string): Promise<ShortUrlSummaryDto[]> {
    const urls = await this.repo.find({
      where: { user: { id: userId } },
      select: ['short_code', 'clicks']
    });

    const domain = process.env.DOMAIN_URL;

    return urls.map(u => ({
      short_url: `${domain}/${u.short_code}`,
      clicks: u.clicks
    }));
  }

  async softDeleteById(id: string, userId: string): Promise<boolean> {
    const url = await this.repo.findOne({
      where: { id, user: { id: userId } }
    });
    if (!url) return false;
    await this.repo.softDelete(id);
    return true;
  }

  async updateSourceUrl(
    id: string,
    userId: string,
    newUrlSource: string
  ): Promise<boolean> {
    const url = await this.repo.findOne({
      where: { id, user: { id: userId } }
    });
    if (!url) return false;
    url.original_url = newUrlSource;
    await this.repo.save(url);
    return true;
  }

  findByShortCode(shortCode: string): Promise<ShortUrl | null> {
    return this.repo.findOne({ where: { short_code: shortCode } });
  }

  async updateClicks(id: string, clicks: number): Promise<void> {
    await this.repo.update(id, { clicks });
  }
}
