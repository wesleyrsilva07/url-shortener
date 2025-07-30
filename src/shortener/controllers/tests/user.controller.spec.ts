import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserUseCase } from '../../usecases/user.usecase';
import { UserBuilder } from '../../usecases/test/builders/user.builder';

describe('UserController', () => {
  let controller: UserController;
  let userUseCase: UserUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserUseCase,
          useValue: {
            findAllUsers: jest.fn(),
            findUserById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn()
          }
        }
      ]
    }).compile();
    controller = moduleRef.get<UserController>(UserController);
    userUseCase = moduleRef.get<UserUseCase>(UserUseCase);
  });

  it('should return all users', async () => {
    const users = [UserBuilder.aUser().withId('1').build()];
    jest.spyOn(userUseCase, 'findAllUsers').mockResolvedValue(users);
    const result = await controller.users();
    expect(result).toBe(users);
    expect(userUseCase.findAllUsers).toHaveBeenCalled();
  });

  it('should return user by id', async () => {
    const user = UserBuilder.aUser().withId('1').build();
    jest.spyOn(userUseCase, 'findUserById').mockResolvedValue(user);
    const result = await controller.user('1');
    expect(result).toBe(user);
    expect(userUseCase.findUserById).toHaveBeenCalledWith('1');
  });

  it('should create user', async () => {
    const input = { email: 'a@a.com', password: '123', name: 'User' };
    const user = UserBuilder.aUser()
      .withEmail('a@a.com')
      .withName('User')
      .build();
    jest.spyOn(userUseCase, 'createUser').mockResolvedValue(user);
    const result = await controller.createUser(input as any);
    expect(result).toEqual({ name: 'User', email: 'a@a.com' });
    expect(userUseCase.createUser).toHaveBeenCalledWith(input);
  });

  it('should update user', async () => {
    const user = UserBuilder.aUser().withId('1').withName('Updated').build();
    jest.spyOn(userUseCase, 'updateUser').mockResolvedValue(user);
    const result = await controller.updateUser('1', { name: 'Updated' } as any);
    expect(result).toBe(user);
    expect(userUseCase.updateUser).toHaveBeenCalledWith('1', {
      name: 'Updated'
    });
  });

  it('should delete user', async () => {
    jest.spyOn(userUseCase, 'deleteUser').mockResolvedValue(true);
    const result = await controller.deleteUser('1');
    expect(result).toBe(true);
    expect(userUseCase.deleteUser).toHaveBeenCalledWith('1');
  });
});
