import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true, // Elimina las propiedades no definidas en el DTO
        forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas en el DTO
        transform: true, // Convierte los tipos primitivos automáticamente
      }
    )
  )
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:3000}`);
}
bootstrap();
