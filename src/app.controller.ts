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
  public constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private __fetchAndFlat(promises: Array<Promise<any[]>>) {
    return Promise.all(promises).then((x) => x.filter((a) => !!a));
    // .then((x) => x.flat(Infinity));
  }

  @Get('/nodes')
  public getNodes(@Param() params: IParams) {
    const urls = IParams.getUrls(params);
    return this.__fetchAndFlat(
      urls.map((url) =>
        this.cacheManager.get(`${url.grid}_${url.network}_nodes`),
      ),
    ).then(MapToV2.toV2);
  }

  @Get('/gateways')
  public getGateways(@Param() params: IParams) {
    const urls = IParams.getUrls(params);
    return this.__fetchAndFlat(
      urls.map((url) =>
        this.cacheManager.get(`${url.grid}_${url.network}_gateways`),
      ),
    ).then(MapToV2.toV2);
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

  @Get('/stats')
  public getstats(@Param() params: IParams) {
    return this.getNodes(params).then(computeNodeStats);
  }

  @Get('/farms')
  public getFarms(@Param() params: IParams) {
    const urls = IParams.getUrls(params);
    return this.__fetchAndFlat(
      urls.map((url) =>
        this.cacheManager.get(`${url.grid}_${url.network}_farms`),
      ),
    ).then((results: any) => {
      return results.reduce((response, { data, status, grid, network }) => {
        if (status === 'up') {
          for (const farm of data) {
            response.push({
              ...farm,
              grid,
              network,
            });
          }
        }
        return response;
      }, [] as any[]);
    });
  }
}
