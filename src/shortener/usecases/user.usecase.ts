import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/interfaces/Iuser.repository';
import { UpdateUserInput } from '../dtos/user/update-user.input';
import { CreateUserInput } from '../dtos/user/create-user.input';
import { RepositoryName } from '../shared/enums/repositories-name';

@Injectable()
export class UserUseCase {
  constructor(
    @Inject(RepositoryName.User)
    private readonly userRepository: IUserRepository
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = await this.userRepository.create({
      ...data,
      password_hash: data.password
    });
    if (!user) {
      throw new InternalServerErrorException('Problema ao criar usuário.');
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
