import { Module } from '@nestjs/common';
import { AuthService } from '../../usecases/auth.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthResolver } from '../auth.controller';
import { User } from 'src/shortener/entities/user.entity';
import { UserUseCase } from 'src/shortener/usecases/user.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  providers: [AuthService, AuthResolver, UserUseCase]
})
export class AuthModule {}
