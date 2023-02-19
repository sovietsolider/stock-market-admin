import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({origin: "*", methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', allowedHeaders: 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept'})
  await app.listen(5000);
}
bootstrap();
