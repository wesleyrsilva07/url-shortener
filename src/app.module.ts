import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { URLShortener } from './shortener/controllers/shortener.controller';

@Module({
  imports: [],
  controllers: [URLShortener],
  providers: [AppService]
})
export class AppModule {}
