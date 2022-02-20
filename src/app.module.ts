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
import { Urls, IParams } from './types';

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
    private readonly explorerService: ExplorerService,
  ) {}

  private __fetchGrid2Data() {
    for (const item of ['nodes', 'farms', 'gateways']) {
      // Devnet
      this.cacheManager.set(`grid2_devnet_${item}`, {
        grid: 'grid2',
        network: 'devnet',
        url: `https://explorer.devnet.grid.tf/explorer/${item}`,
        status: 'down',
        data: [],
      });

      // Testnet
      const testNodesUrl = IParams.getUrls({ grid: 'grid2', network: 'testnet' }, `/explorer/${item}`); // prettier-ignore
      this.explorerService.fetchAll(testNodesUrl).subscribe(([data]) => {
        this.cacheManager.set(`grid2_testnet_${item}`, data);
      });

      // mainnet
      const mainNodesUrl = IParams.getUrls({ grid: 'grid2', network: 'mainnet' }, `/explorer/${item}`); // prettier-ignore
      this.explorerService.fetchAll(mainNodesUrl).subscribe(([data]) => {
        this.cacheManager.set(`grid2_mainnet_${item}`, data);
      });
    }
  }

  onModuleInit() {
    this.__fetchGrid2Data();
  }
}
