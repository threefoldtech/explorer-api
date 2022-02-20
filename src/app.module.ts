import {
  Module,
  CacheModule,
  OnModuleInit,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { HttpModule, HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { join } from 'path';

import { AppController } from './app.controller';
import { ExplorerService } from './explorer.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 15 * 60,
    }),
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [AppController],
  providers: [ExplorerService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    // this.httpService
    //   .get('https://explorer.testnet.grid.tf/explorer/nodes')
    //   .subscribe(({ data }) => console.log(data));
  }
}
