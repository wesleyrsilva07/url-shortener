import { Module } from '@nestjs/common';
import { AuthUseCase } from '../usecases/auth.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../shared/constants';
import { AuthController } from './auth.controller';
import { User } from 'src/shortener/entities/user.entity';
import { UserUseCase } from 'src/shortener/usecases/user.usecase';
import { CreateShortUrlUseCase } from '../usecases/create-shortener.usecase';
import { UserController } from './user.controller';
import { ShortUrl } from '../entities/short-url.entity';
import { URLShortener } from './shortener.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ShortUrl]),
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  controllers: [AuthController, UserController, URLShortener],
  providers: [UserUseCase, CreateShortUrlUseCase, AuthUseCase],
  exports: [UserUseCase, CreateShortUrlUseCase, AuthUseCase]
})
export class ControllerModule {}
