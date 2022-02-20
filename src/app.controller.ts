import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, toArray, tap } from 'rxjs/operators';
import { ExplorerService } from './explorer.service';
import { of, forkJoin } from 'rxjs';
import { IParams } from './types';
import { MapToV2, computeNodeStats } from './helpers';
import { Cache } from 'cache-manager';

@Controller('/api/:grid/:network')
@UsePipes(ValidationPipe)
export class AppController {
  public constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly explorer: ExplorerService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/nodes')
  public getNodes(@Param() params: IParams) {
    const urls = IParams.getUrls(params);
    // data = [];
    // for (const url of urls) {
    //   this.cacheManager
    //     .get(`${url.grid}_${url.network}_nodes`)
    //     .then(console.log);
    // }
    return Promise.all(
      urls.map((url) =>
        this.cacheManager.get(`${url.grid}_${url.network}_nodes`),
      ),
    )
      .then((res) => res.filter((x) => !!x))
      .then(MapToV2.toV2);
    //   .then((res) => res.map((x: any) => ('data' in x ? x['data'] : x)))
    //   .then((data) => data.flat(Infinity));
    // return this.explorer.fetchAll(urls).pipe(map(MapToV2.toV2));
    // return this.cacheManager.get('grid2_testnet_nodes');
  }

  @Get('/gateways')
  public getGateways(@Param() params: IParams) {
    const urls = IParams.getUrls(params);
    return Promise.all(
      urls.map((url) =>
        this.cacheManager.get(`${url.grid}_${url.network}_gateways`),
      ),
    );
  }

  // @Get('/prices')
  // public getPrices(@Param() params: IParams) {
  //   const urls = IParams.getUrls(params, '/api/v1/prices');
  //   return this.explorer.fetchAll(urls).pipe(
  //     map((results: any) => {
  //       return results.reduce((response, { grid, network, data }) => {
  //         response.push({ grid, network, ...data });
  //         return response;
  //       }, [] as any[]);
  //     }),
  //   );
  // }

  // @Get('/stats')
  // public getstats(@Param() params: IParams) {
  //   return this.getNodes(params).pipe(map(computeNodeStats));
  // }

  @Get('/farms')
  public getFarms(@Param() params: IParams) {
    // const urls = IParams.getUrls(params, '/explorer/farms', '/farms');
    // return this.explorer.fetchAll(urls).pipe(
    //   map((results: any) => {
    //     return results.reduce((response, { data, status, grid, network }) => {
    //       if (status === 'up') {
    //         for (const farm of data) {
    //           response.push({
    //             ...farm,
    //             grid,
    //             network,
    //           });
    //         }
    //       }
    //       return response;
    //     }, [] as any[]);
    //   }),
    // );
    const urls = IParams.getUrls(params);
    return Promise.all(
      urls.map((url) =>
        this.cacheManager.get(`${url.grid}_${url.network}_farms`),
      ),
    );
  }
}
