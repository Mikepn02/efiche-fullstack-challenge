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



app.enableCors({
  origin: getConfig().app.cors, 
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
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
  await app.listen(process.env.PORT || 3000,'0.0.0.0');
}
bootstrap();