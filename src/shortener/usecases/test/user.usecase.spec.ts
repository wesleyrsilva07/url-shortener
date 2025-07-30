import { UserUseCase } from '../user.usecase';
import {
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmUserRepository } from '../../repositories/user.respository';
import { UserBuilder } from './builders/user.builder';

describe('UserUseCase', () => {
  let userUseCase: UserUseCase;
  let userRepository: TypeOrmUserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserUseCase,
        {
          provide: 'IUserRepository',
          useValue: {
            findAll: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();
    userUseCase = moduleRef.get<UserUseCase>(UserUseCase);
    userRepository = moduleRef.get<TypeOrmUserRepository>('IUserRepository');
  });

  it('should return all users', async () => {
    const users = [UserBuilder.aUser().withId('1').build()];
    jest.spyOn(userRepository, 'findAll').mockResolvedValue(users);
    const result = await userUseCase.findAllUsers();
    expect(result).toBe(users);
    expect(userRepository.findAll).toHaveBeenCalled();
  });

  it('should return user by email', async () => {
    const user = UserBuilder.aUser().withId('1').withEmail('a@a.com').build();
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
    const result = await userUseCase.findUserByEmail('a@a.com');
    expect(result).toBe(user);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('a@a.com');
  });

  it('should throw NotFoundException if user not found by email', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    await expect(userUseCase.findUserByEmail('x@x.com')).rejects.toThrow(
      NotFoundException
    );
  });

  it('should return user by id', async () => {
    const user = UserBuilder.aUser().withId('1').build();
    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    const result = await userUseCase.findUserById('1');
    expect(result).toBe(user);
    expect(userRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if user not found by id', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
    await expect(userUseCase.findUserById('2')).rejects.toThrow(
      NotFoundException
    );
  });

  it('should create user', async () => {
    const input = { email: 'a@a.com', password: '123' };
    const user = UserBuilder.aUser().withId('1').withEmail('a@a.com').build();
    jest.spyOn(userRepository, 'create').mockResolvedValue(user);
    const result = await userUseCase.createUser(input as any);
    expect(result).toBe(user);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...input,
      password_hash: input.password
    });
  });

  it('should throw InternalServerErrorException if user not created', async () => {
    jest.spyOn(userRepository, 'create').mockResolvedValue(null as any);
    await expect(
      userUseCase.createUser({ email: 'a@a.com', password: '123' } as any)
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should update user', async () => {
    const user = UserBuilder.aUser().withId('1').withName('Updated').build();
    jest.spyOn(userRepository, 'update').mockResolvedValue(user);
    const result = await userUseCase.updateUser('1', {
      name: 'Updated'
    } as any);
    expect(result).toBe(user);
    expect(userRepository.update).toHaveBeenCalledWith('1', {
      name: 'Updated'
    });
  });

  it('should throw NotFoundException if user not updated', async () => {
    jest.spyOn(userRepository, 'update').mockResolvedValue(null);
    await expect(
      userUseCase.updateUser('1', { name: 'Updated' } as any)
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete user', async () => {
    jest.spyOn(userRepository, 'delete').mockResolvedValue(true);
    const result = await userUseCase.deleteUser('1');
    expect(result).toBe(true);
    expect(userRepository.delete).toHaveBeenCalledWith('1');
  });
});
