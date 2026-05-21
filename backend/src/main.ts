import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kora Commerce API')
    .setDescription('Modular Commerce Infrastructure for African Business')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & authorization')
    .addTag('catalog', 'Products, categories, brands')
    .addTag('inventory', 'Stock management')
    .addTag('orders', 'Cart, checkout, order lifecycle')
    .addTag('payments', 'M-PESA, cards, BNPL')
    .addTag('sellers', 'Seller portal & management')
    .addTag('search', 'Search & discovery')
    .addTag('reviews', 'Product reviews & ratings')
    .addTag('notifications', 'WhatsApp, SMS, email, push')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🎵 Kora API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
