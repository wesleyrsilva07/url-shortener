import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './interfaces/Iuser.repository';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  findAll() {
    return this.repo.find();
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  async create(user: Partial<User>) {
    const entity = this.repo.create(user);
    return this.repo.save(entity);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const result = await this.repo.update(id, user);
    if (!result) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.repo.softDelete(id);
    return !!result.affected;
  }
}
