import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { setupCache } from 'axios-cache-adapter';
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
  ],
  controllers: [AppController],
  providers: [ExplorerService],
})
export class AppModule {}
