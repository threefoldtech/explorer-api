import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { of, forkJoin, from, catchError } from 'rxjs';
import { map, mergeMap, toArray, tap, filter } from 'rxjs/operators';
import { IUrlDetails } from './types';

@Injectable()
export class ExplorerService {
  public constructor(private readonly httpService: HttpService) {}

  private _data({ grid, network, url }: IUrlDetails, data: any) {
    return {
      grid,
      network,
      url,
      status: !!data ? 'up' : 'down',
      data,
    };
  }

  private _getUrl(url: string, page: string) {
    return `${url}?page=${page}`;
  }

  private _fetchPages(params: IUrlDetails) {
    // Fetch data in case of pagination ex. nodes, farms, gateways
    const url = params.url;
    // console.log('URL', url);
    return this.httpService.get(this._getUrl(url, '1')).pipe(
      map(({ headers }) => +headers.pages),
      map((length) => Array.from({ length }, (_, i) => i + 1)),
      mergeMap((pages) => of(...pages)),
      map((page) => this._getUrl(url, page.toString())),
      // tap(console.log),
      map((url) => this.httpService.get(url).pipe(map(({ data }) => data))),
      toArray(),
      mergeMap((x) => forkJoin(x)),
      map((data) => data.flat(Infinity)),
      mergeMap((data) => from(data)),
      filter((x) => !!x),
      toArray(),
      map((d) => this._data({ url: '', ...params }, d)),
      catchError(() => of(this._data(params, null))),
    );
  }
  private _fetch(params: IUrlDetails) {
    // Fetch data in case there is no pagination ex. prices
    return this.httpService.get(params.url).pipe(
      map(({ data }) => this._data(params, data)),
      catchError(() => of(this._data(params, null))),
    );
  }

  public fetchAll(urls: IUrlDetails[]) {
    return forkJoin(
      urls.map((url) => {
        if (url.url.includes('prices') || url.grid == 'grid3')
          return this._fetch(url);
        return this._fetchPages(url);
      }),
    ).pipe(
      mergeMap(from),
      map((_data) => {
        const { grid, network, data } = _data;
        return data.map((obj) => {
          return {
            ...obj,
            grid,
            network,
          };
        });
      }),
      toArray(),
    );
  }
}
