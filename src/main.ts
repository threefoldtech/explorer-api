import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors()).use(compression()).use(helmet());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
