import { Test } from '@nestjs/testing';
import { TypeOrmUserRepository } from '../user.respository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserBuilder } from '../../usecases/test/builders/user.builder';

describe('TypeOrmUserRepository', () => {
  let repo: TypeOrmUserRepository;
  let ormRepo: any;

  beforeEach(async () => {
    ormRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn()
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmUserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: ormRepo
        }
      ]
    }).compile();
    repo = moduleRef.get<TypeOrmUserRepository>(TypeOrmUserRepository);
  });

  it('should find all users', async () => {
    const user = UserBuilder.aUser().withId('1').build();
    ormRepo.find.mockResolvedValue([user]);
    const result = await repo.findAll();
    expect(result).toEqual([user]);
    expect(ormRepo.find).toHaveBeenCalled();
  });

  it('should find user by email', async () => {
    const user = UserBuilder.aUser().withEmail('a@a.com').build();
    ormRepo.findOne.mockResolvedValue(user);
    const result = await repo.findByEmail('a@a.com');
    expect(result).toBe(user);
    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'a@a.com' }
    });
  });

  it('should find user by id', async () => {
    const user = UserBuilder.aUser().withId('1').build();
    ormRepo.findOne.mockResolvedValue(user);
    const result = await repo.findById('1');
    expect(result).toBe(user);
    expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find user by name', async () => {
    const user = UserBuilder.aUser().withName('name').build();
    ormRepo.findOne.mockResolvedValue(user);
    const result = await repo.findByName('name');
    expect(result).toBe(user);
    expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { name: 'name' } });
  });

  it('should create user', async () => {
    const user = UserBuilder.aUser().withEmail('a@a.com').build();
    ormRepo.create.mockReturnValue(user);
    ormRepo.save.mockResolvedValue(user);
    const result = await repo.create({ email: 'a@a.com' });
    expect(result).toBe(user);
    expect(ormRepo.create).toHaveBeenCalledWith({ email: 'a@a.com' });
    expect(ormRepo.save).toHaveBeenCalledWith(user);
  });

  it('should update user', async () => {
    ormRepo.update.mockResolvedValue(true);
    const user = UserBuilder.aUser().withId('1').withName('new').build();
    jest.spyOn(repo, 'findById').mockResolvedValue(user);
    const result = await repo.update('1', { name: 'new' });
    expect(result).toBe(user);
    expect(ormRepo.update).toHaveBeenCalledWith('1', { name: 'new' });
    expect(repo.findById).toHaveBeenCalledWith('1');
  });

  it('should return null if update fails', async () => {
    ormRepo.update.mockResolvedValue(false);
    const result = await repo.update('1', { name: 'new' });
    expect(result).toBeNull();
  });

  it('should delete user', async () => {
    ormRepo.softDelete.mockResolvedValue({ affected: 1 });
    const result = await repo.delete('1');
    expect(result).toBe(true);
    expect(ormRepo.softDelete).toHaveBeenCalledWith('1');
  });
});
