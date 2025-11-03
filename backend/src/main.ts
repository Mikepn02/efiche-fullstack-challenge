import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/guards/role.guard';
import getConfig from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalGuards(new RolesGuard(new Reflector()));


  app.use(cookieParser());


  app.set('trust proxy', 1);
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
        console.log(`[${now}] ✅ CORS: Allowed origin → ${origin}`);
        return callback(null, true);
      }

      console.warn(
        `[${now}] 🚫 CORS BLOCKED → Origin: ${origin}\nAllowed Origins: ${allowedOrigins.join(', ')}`
      );

      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie'],
  });



  const config = new DocumentBuilder()
    .setTitle('OpenApi Specification')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Automatically strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if there are non-whitelisted properties
      forbidUnknownValues: true, // Throw an error if there are unknown values
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  document.paths = Object.fromEntries(
    Object.entries(document.paths).map(([path, methods]) => [
      path,
      Object.fromEntries(
        Object.entries(methods).map(([method, operation]) => [
          method,
          { ...operation, security: [{ 'JWT-auth': [] }] },
        ]),
      ),
    ]),
  );
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();