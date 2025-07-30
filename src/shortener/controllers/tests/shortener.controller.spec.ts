import { Test } from '@nestjs/testing';
import { URLShortener } from '../shortener.controller';
import { CreateShortUrlUseCase } from '../../usecases/create-shortener.usecase';
import { ShortUrlBuilder } from '../../usecases/test/builders/short-url.builder';
import { ShortUrlSummaryBuilder } from '../../usecases/test/builders/short-url-summary.builder';

describe('URLShortener', () => {
  let controller: URLShortener;
  let usecase: CreateShortUrlUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [URLShortener],
      providers: [
        {
          provide: CreateShortUrlUseCase,
          useValue: {
            execute: jest.fn(),
            findByUserId: jest.fn(),
            softDeleteById: jest.fn(),
            updateSourceUrl: jest.fn(),
            generateShortCode: jest.fn()
          }
        }
      ]
    }).compile();
    controller = moduleRef.get<URLShortener>(URLShortener);
    usecase = moduleRef.get<CreateShortUrlUseCase>(CreateShortUrlUseCase);
  });

  it('should shorten url', async () => {
    const req: any = {
      protocol: 'https',
      get: () => 'host.com',
      user: { id: 'user-id' }
    };
    const body = { url: 'https://original.com' };
    const shortUrl = ShortUrlBuilder.aShortUrl().build();
    jest.spyOn(usecase, 'generateShortCode').mockReturnValue('abc123');
    jest.spyOn(usecase, 'execute').mockResolvedValue(shortUrl);
    const result = await controller.shortenUrl(body, req);
    expect(result).toEqual({ shortenUrl: 'https://host.com/abc123' });
    expect(usecase.execute).toHaveBeenCalledWith({
      originalUrl: body.url,
      userId: 'user-id',
      shortUrl: 'https://host.com/abc123'
    });
  });

  it('should list shortened urls', async () => {
    const req: any = { user: { id: 'user-id' } };
    const urls = [ShortUrlSummaryBuilder.aShortUrlSummary().build()];
    jest.spyOn(usecase, 'findByUserId').mockResolvedValue(urls);
    // Simula o shortUrl gerado pelo controller
    jest.spyOn(usecase, 'generateShortCode').mockReturnValue('abc123');
    const protocol = 'http';
    const host = 'localhost:3010';
    req.protocol = protocol;
    req.get = () => host;
    const expectedShortUrl = `${protocol}://${host}/abc123`;
    const result = await controller.listShortenedUrls(req);
    expect(result).toBe(urls);
    expect(usecase.findByUserId).toHaveBeenCalledWith(
      'user-id',
      expectedShortUrl
    );
  });
});
