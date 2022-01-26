import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { setupCache } from 'axios-cache-adapter';
import { join } from 'path';
import { AppController } from './app.controller';
import { ExplorerService } from './explorer.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://jsonplaceholder.typicode.com',
      adapter: setupCache({
        maxAge: 15 * 60 * 1000, // 15 mins
      }).adapter,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [AppController],
  providers: [ExplorerService],
})
export class AppModule {}
