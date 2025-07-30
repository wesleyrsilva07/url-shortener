import { Test } from '@nestjs/testing';
import { CreateShortUrlUseCase } from '../create-shortener.usecase';
import { IShortUrlRepository } from '../../repositories/interfaces/Ishort-url.repository';
import { UserUseCase } from '../user.usecase';
import { ShortUrlBuilder } from './builders/short-url.builder';
import { RepositoryName } from '../../shared/enums/repositories-name';
import { ShortUrlSummaryBuilder } from './builders/short-url-summary.builder';

describe('CreateShortUrlUseCase', () => {
  let usecase: CreateShortUrlUseCase;
  let repo: IShortUrlRepository;
  let userUseCase: UserUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateShortUrlUseCase,
        {
          provide: RepositoryName.ShortUrl,
          useValue: {
            createShortUrl: jest.fn(),
            findByUserId: jest.fn(),
            softDeleteById: jest.fn(),
            updateSourceUrl: jest.fn(),
            findByShortCode: jest.fn()
          }
        },
        {
          provide: UserUseCase,
          useValue: {
            findUserById: jest.fn()
          }
        }
      ]
    }).compile();
    usecase = moduleRef.get<CreateShortUrlUseCase>(CreateShortUrlUseCase);
    repo = moduleRef.get<IShortUrlRepository>(RepositoryName.ShortUrl);
    userUseCase = moduleRef.get<UserUseCase>(UserUseCase);
  });

  it('should create a short url with user', async () => {
    const user = { id: 'user-id' } as any;
    jest.spyOn(userUseCase, 'findUserById').mockResolvedValue(user);
    const shortUrl = ShortUrlBuilder.aShortUrl().withUser(user).build();
    jest.spyOn(repo, 'createShortUrl').mockResolvedValue(shortUrl);
    const dto = {
      originalUrl: 'https://original.com',
      userId: 'user-id',
      shortUrl: 'https://short.com/abc123'
    };
    const result = await usecase.execute(dto);
    expect(result).toBe(shortUrl);
    expect(repo.createShortUrl).toHaveBeenCalledWith({
      original_url: dto.originalUrl,
      short_code: 'abc123',
      user
    });
  });

  it('should create a short url without user', async () => {
    jest.spyOn(userUseCase, 'findUserById').mockResolvedValue(null as any);
    const shortUrl = ShortUrlBuilder.aShortUrl().build();
    jest.spyOn(repo, 'createShortUrl').mockResolvedValue(shortUrl);
    const dto = {
      originalUrl: 'https://original.com',
      userId: '',
      shortUrl: 'https://short.com/abc123'
    };
    const result = await usecase.execute(dto);
    expect(result).toBe(shortUrl);
    expect(repo.createShortUrl).toHaveBeenCalledWith({
      original_url: dto.originalUrl,
      short_code: 'abc123',
      user: undefined
    });
  });

  it('should generate short code if shortUrl not provided', async () => {
    jest.spyOn(userUseCase, 'findUserById').mockResolvedValue(null as any);
    const shortUrl = ShortUrlBuilder.aShortUrl().build();
    jest.spyOn(repo, 'createShortUrl').mockResolvedValue(shortUrl);
    const dto = { originalUrl: 'https://original.com', userId: '' };
    const result = await usecase.execute(dto);
    expect(result.short_code.length).toBe(6);
    expect(repo.createShortUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        original_url: dto.originalUrl,
        short_code: expect.any(String)
      })
    );
  });

  it('should find by user id', async () => {
    const urls = [ShortUrlSummaryBuilder.aShortUrlSummary().build()];
    jest.spyOn(repo, 'findByUserId').mockResolvedValue(urls);
    const result = await usecase.findByUserId(
      'user-id',
      'http://localhost:3010'
    );
    expect(result).toBe(urls);
    expect(repo.findByUserId).toHaveBeenCalledWith(
      'user-id',
      'http://localhost:3010'
    );
  });

  it('should soft delete by id', async () => {
    jest.spyOn(repo, 'softDeleteById').mockResolvedValue(true);
    const result = await usecase.softDeleteById('id', 'user-id');
    expect(result).toBe(true);
    expect(repo.softDeleteById).toHaveBeenCalledWith('id', 'user-id');
  });

  it('should update source url', async () => {
    jest.spyOn(repo, 'updateSourceUrl').mockResolvedValue(true);
    const result = await usecase.updateSourceUrl('id', 'user-id', 'new-url');
    expect(result).toBe(true);
    expect(repo.updateSourceUrl).toHaveBeenCalledWith(
      'id',
      'user-id',
      'new-url'
    );
  });
});
