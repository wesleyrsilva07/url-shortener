import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ControllerModule } from './shortener/controllers/controller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configDatabase from './shortener/database-config';

@Module({
  imports: [TypeOrmModule.forRoot(configDatabase), ControllerModule],
  providers: [AppService]
})
export class AppModule {}
