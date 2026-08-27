import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(helmet({ contentSecurityPolicy: false }));

  const port = configService.get<number>('PORT', 3010);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3002');
  const enableCors = configService.get<string>('ENABLE_CORS', 'true') === 'true';

  if (enableCors) {
    app.enableCors({
      origin: corsOrigin.split(',').map(o => o.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PRISMA BFF API')
      .setDescription('Backend for Frontend - PRISMA SaaS Platform')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port);
  logger.log(`BFF running on http://localhost:${port}`);
  logger.log(`Swagger UI available at http://localhost:${port}/docs`);
}

bootstrap();
