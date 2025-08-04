import { ShortUrlSummaryDto } from '../../../dtos/shortener/short-url-summary.dto';

export class ShortUrlSummaryBuilder {
  private summary: ShortUrlSummaryDto = {
    short_url: 'http://localhost:3010/abc123',
    clicks: 0
  };

  public static aShortUrlSummary(): ShortUrlSummaryBuilder {
    return new ShortUrlSummaryBuilder();
  }

  withShortUrl(shortUrl: string): ShortUrlSummaryBuilder {
    this.summary.short_url = shortUrl;
    return this;
  }

  withClicks(clicks: number): ShortUrlSummaryBuilder {
    this.summary.clicks = clicks;
    return this;
  }

  build(): ShortUrlSummaryDto {
    return this.summary;
  }
}
