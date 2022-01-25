import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { of, forkJoin } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { IUrlDetails } from './types';

@Injectable()
export class ExplorerService {
  public constructor(private readonly httpService: HttpService) {}

  private _data({ type, grid, network, url }: IUrlDetails, data: any) {
    return {
      type,
      grid,
      network,
      url,
      status: !!data ? 'up' : 'down',
      data,
    };
  }

  private _fetch(params: IUrlDetails) {
    return this.httpService.get(params.url).pipe(
      map(({ data }) => this._data(params, data)),
      //   retry(3),
      catchError(() => of(this._data(params, null))),
    );
  }

  public fetchAll(urls: IUrlDetails[], flat: boolean) {
    return forkJoin(urls.map((url) => this._fetch(url))).pipe(
      map((results) => {
        if (!flat) return results;
        return results.reduce<any[]>((res, { status, grid, network, data }) => {
          if (status === 'up') {
            for (const item of data) {
              res.push({
                grid,
                network,
                ...item,
              });
            }
          }
          return res;
        }, []);
      }),
    );
  }
}
