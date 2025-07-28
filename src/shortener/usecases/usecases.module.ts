import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ShortUrl } from '../entities/short-url.entity';
import { UserUseCase } from './user.usecase';
import { CreateShortUrlUseCase } from './create-shortener.usecase';
import { AuthUseCase } from './auth.usecase';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../shared/constants';
import { JwtStrategy } from '../guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ShortUrl]),
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  providers: [UserUseCase, CreateShortUrlUseCase, AuthUseCase, JwtStrategy],
  exports: [UserUseCase, CreateShortUrlUseCase, AuthUseCase]
})
export class UsecasesModule {}
