import { Test } from '@nestjs/testing';
import { RedirectUseCase } from '../redirect.usecase';
import { NotFoundException } from '@nestjs/common';
import { IShortUrlRepository } from '../../repositories/interfaces/Ishort-url.repository';
import { ShortUrlBuilder } from './builders/short-url.builder';
import { RepositoryName } from '../../shared/enums/repositories-name';

describe('RedirectUseCase', () => {
  let redirectUseCase: RedirectUseCase;
  let repo: IShortUrlRepository;
  let repoSave: jest.Mock;

  beforeEach(async () => {
    repoSave = jest.fn();
    const moduleRef = await Test.createTestingModule({
      providers: [
        RedirectUseCase,
        {
          provide: RepositoryName.ShortUrl,
          useValue: {
            findByShortCode: jest.fn(),
            updateClicks: jest.fn(),
            repo: { save: repoSave }
          }
        }
      ]
    }).compile();
    redirectUseCase = moduleRef.get<RedirectUseCase>(RedirectUseCase);
    repo = moduleRef.get<IShortUrlRepository>(RepositoryName.ShortUrl);
  });

  it('should throw NotFoundException if short url not found', async () => {
    jest.spyOn(repo, 'findByShortCode').mockResolvedValue(null);
    await expect(redirectUseCase.handleRedirect('notfound')).rejects.toThrow(
      NotFoundException
    );
  });

  it('should throw NotFoundException if short url is deleted', async () => {
    const shortUrl = ShortUrlBuilder.aShortUrl()
      .withShortCode('abc123')
      .build();
    shortUrl.deleted_at = new Date();
    jest.spyOn(repo, 'findByShortCode').mockResolvedValue(shortUrl);
    await expect(redirectUseCase.handleRedirect('abc123')).rejects.toThrow(
      NotFoundException
    );
  });
});
