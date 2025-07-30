import { ShortUrl } from '../../../entities/short-url.entity';
import { User } from '../../../entities/user.entity';

export class ShortUrlBuilder {
  private shortUrl: ShortUrl = {
    id: 'short-id',
    original_url: 'https://original.com',
    short_code: 'abc123',
    clicks: 0,
    created_at: new Date(),
    updated_at: new Date(),
    user: undefined
  };

  public static aShortUrl(): ShortUrlBuilder {
    return new ShortUrlBuilder();
  }

  withId(id: string): ShortUrlBuilder {
    this.shortUrl.id = id;
    return this;
  }

  withOriginalUrl(url: string): ShortUrlBuilder {
    this.shortUrl.original_url = url;
    return this;
  }

  withShortCode(code: string): ShortUrlBuilder {
    this.shortUrl.short_code = code;
    return this;
  }

  withClicks(clicks: number): ShortUrlBuilder {
    this.shortUrl.clicks = clicks;
    return this;
  }

  withUser(user: User): ShortUrlBuilder {
    this.shortUrl.user = user;
    return this;
  }

  build(): ShortUrl {
    return this.shortUrl;
  }
}
