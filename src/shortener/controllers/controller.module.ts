import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../shared/constants';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { URLShortener } from './shortener.controller';
import { UsecasesModule } from '../usecases/usecases.module';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret
    }),
    UsecasesModule
  ],
  controllers: [
    AuthController,
    UserController,
    URLShortener,
    RedirectController
  ]
})
export class ControllerModule {}
