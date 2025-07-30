import { User } from '../../../entities/user.entity';

export class UserBuilder {
  private user: User = {
    id: 'user-id',
    email: 'user@email.com',
    name: 'Usuário Teste',
    password_hash: 'hash',
    created_at: new Date(),
    updated_at: new Date(),
    urls: []
  };

  public static aUser(): UserBuilder {
    return new UserBuilder();
  }

  withId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  withPasswordHash(hash: string): UserBuilder {
    this.user.password_hash = hash;
    return this;
  }

  withUrls(urls: any[]): UserBuilder {
    this.user.urls = urls;
    return this;
  }

  build(): User {
    return this.user;
  }
}
