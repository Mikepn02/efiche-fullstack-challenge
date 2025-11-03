import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/guards/role.guard';
import getConfig from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  const allowedOrigins = getConfig().app.cors
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      const now = new Date().toISOString();
      if (!origin) {
        console.log(`[${now}] 🌐 CORS: Allowed request with no origin (Swagger or Postman)`);
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));

      if (isAllowed) {
        return callback(null, true);
      }

    
      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true, // important for cookies
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('OpenApi Specification')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', description: 'Enter JWT token', in: 'header' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.paths = Object.fromEntries(
    Object.entries(document.paths).map(([path, methods]) => [
      path,
      Object.fromEntries(Object.entries(methods).map(([method, operation]) => [method, { ...operation, security: [{ 'JWT-auth': [] }] }])),
    ]),
  );

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
