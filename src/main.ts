import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { UserConsumer } from './messaging/user.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const consumer = new UserConsumer();
  await consumer.start();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
