import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shortener/shared/logging.interceptor';
import { ControllerModule } from './shortener/controllers/controller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configDatabase from './shortener/database-config';
import { UsecasesModule } from './shortener/usecases/usecases.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(configDatabase),
    ControllerModule,
    UsecasesModule,
    JwtModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
