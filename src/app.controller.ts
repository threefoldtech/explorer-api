import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, toArray, tap } from 'rxjs/operators';
import { ExplorerService } from './explorer.service';
import { of, forkJoin } from 'rxjs';
import { IParams } from './types';
import { MapToV2, computeNodeStats } from './helpers';

@Controller('/api/:grid/:network')
@UsePipes(ValidationPipe)
export class AppController {
  public constructor(
    private readonly explorer: ExplorerService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/nodes')
  public getNodes(@Param() params: IParams) {
    const getUrl = (p: number) =>
      `https://explorer.testnet.grid.tf/explorer/nodes?page=${p}`;
    return this.httpService.get(getUrl(1)).pipe(
      map(({ headers }) => +headers.pages),
      map((length) => Array.from({ length }, (_, i) => i + 1)),
      tap(console.log),
      mergeMap((pages) => of(...pages)),
      map(getUrl),
      map((url) => this.httpService.get(url).pipe(map(({ data }) => data))),
      toArray(),
      tap(console.log),
      mergeMap((x) => forkJoin(x)),
      map((data) => data.flat(Infinity)),
      mergeMap((data) => of(...data)),
      map((d) => this.explorer._data({ url: '', ...params }, d)),
      toArray(),
    );
    // const urls = IParams.getUrls(params, '/explorer/nodes', '/nodes');
    // return this.explorer.fetchAll(urls).pipe(map(MapToV2.toV2));
  }

  @Get('/gateways')
  public getGateways(@Param() params: IParams) {
    const urls = IParams.getUrls(params, '/explorer/gateways', '/gateways');
    return this.explorer.fetchAll(urls).pipe(map(MapToV2.toV2));
  }

  @Get('/prices')
  public getPrices(@Param() params: IParams) {
    const urls = IParams.getUrls(params, '/api/v1/prices');
    return this.explorer.fetchAll(urls).pipe(
      map((results) => {
        return results.reduce((response, { grid, network, data }) => {
          response.push({ grid, network, ...data });
          return response;
        }, [] as any[]);
      }),
    );
  }

  @Get('/stats')
  public getstats(@Param() params: IParams) {
    return this.getNodes(params).pipe(map(computeNodeStats));
  }

  @Get('/farms')
  public getFarms(@Param() params: IParams) {
    const urls = IParams.getUrls(params, '/explorer/farms', '/farms');
    return this.explorer.fetchAll(urls).pipe(
      map((results) => {
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
      }),
    );
  }
}
