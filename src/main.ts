import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthModule } from './auth/jwt-auth.module';
import { CartModule } from './cart/cart.module';
import { UserModule } from './user/user.module';

function setupSwagger(app: INestApplication) {
  const title = 'Shopping Cart Documentation';
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription('Shopping Cart Challenge API.')
    .addBearerAuth()
    .build();

  const docs = SwaggerModule.createDocument(app, options, {
    include: [AuthModule, UserModule, CartModule],
    deepScanRoutes: true,
  });

  SwaggerModule.setup(`docs`, app, docs, {
    customSiteTitle: title,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });

  // Adding security headers.
  app.use(helmet());

  // Adding global Pipelines.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
  );

  // Setup Swagger API documentation.
  setupSwagger(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shopping Cart has sucessfully started on port: ${PORT}!`);
  });
}

bootstrap();
