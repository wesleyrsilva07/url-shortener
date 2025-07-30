import { Test } from '@nestjs/testing';
import { TypeOrmShortUrlRepository } from '../short-url.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShortUrl } from '../../entities/short-url.entity';

describe('TypeOrmShortUrlRepository', () => {
  let repo: TypeOrmShortUrlRepository;
  let ormRepo: any;

  beforeEach(async () => {
    ormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn()
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmShortUrlRepository,
        {
          provide: getRepositoryToken(ShortUrl),
          useValue: ormRepo
        }
      ]
    }).compile();
    repo = moduleRef.get<TypeOrmShortUrlRepository>(TypeOrmShortUrlRepository);
  });

  it('should create short url', async () => {
    ormRepo.create.mockReturnValue('entity');
    ormRepo.save.mockResolvedValue('saved');
    const result = await repo.createShortUrl({ original_url: 'url' });
    expect(result).toBe('saved');
    expect(ormRepo.create).toHaveBeenCalledWith({ original_url: 'url' });
    expect(ormRepo.save).toHaveBeenCalledWith('entity');
  });

  it('should find by user id', async () => {
    // O repo agora retorna objetos com short_code e clicks
    ormRepo.find.mockResolvedValue([{ short_code: 'abc123', clicks: 5 }]);
    const result = await repo.findByUserId(
      'user-id',
      'http://localhost:3010/abc123'
    );
    expect(result).toEqual([
      { short_url: 'http://localhost:3010/abc123', clicks: 5 }
    ]);
    expect(ormRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 'user-id' } },
      select: ['short_code', 'clicks']
    });
  });

  it('should soft delete by id', async () => {
    ormRepo.findOne.mockResolvedValue({ id: 'id', user: { id: 'user-id' } });
    ormRepo.softDelete.mockResolvedValue(true);
    const result = await repo.softDeleteById('id', 'user-id');
    expect(result).toBe(true);
    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'id', user: { id: 'user-id' } }
    });
    expect(ormRepo.softDelete).toHaveBeenCalledWith('id');
  });

  it('should return false if soft delete not found', async () => {
    ormRepo.findOne.mockResolvedValue(null);
    const result = await repo.softDeleteById('id', 'user-id');
    expect(result).toBe(false);
  });

  it('should update source url', async () => {
    const url = { id: 'id', user: { id: 'user-id' }, original_url: 'old' };
    ormRepo.findOne.mockResolvedValue(url);
    ormRepo.save.mockResolvedValue({ ...url, original_url: 'new' });
    const result = await repo.updateSourceUrl('id', 'user-id', 'new');
    expect(result).toBe(true);
    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'id', user: { id: 'user-id' } }
    });
    expect(ormRepo.save).toHaveBeenCalledWith({ ...url, original_url: 'new' });
  });

  it('should return false if update source url not found', async () => {
    ormRepo.findOne.mockResolvedValue(null);
    const result = await repo.updateSourceUrl('id', 'user-id', 'new');
    expect(result).toBe(false);
  });

  it('should find by short code', async () => {
    ormRepo.findOne.mockResolvedValue('shorturl');
    const result = await repo.findByShortCode('abc123');
    expect(result).toBe('shorturl');
    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { short_code: 'abc123' }
    });
  });
});
