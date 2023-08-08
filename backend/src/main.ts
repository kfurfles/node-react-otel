import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './infra/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://example.com',
      'http://www.example.com',
      'http://app.example.com',
      'https://example.com',
      'https://www.example.com',
      'https://app.example.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('OKR')
    .setDescription('The okr API description')
    .setVersion('1.0')
    .addTag('okrs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`Swagger url: http://localhost:${PORT}/api`);
  });
}
bootstrap();
