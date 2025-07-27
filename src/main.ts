import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('Documentação da API de encurtação de URLs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.NEST_PORT ?? 3000;
  await app.listen(PORT, () =>
    console.log(`🔥 Server Running At Port ${PORT} 🔥`)
  );
}
bootstrap();
