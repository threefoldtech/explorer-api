import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
      data,
    };
  }

  private _fetch(params: IUrlDetails) {
    return this.httpService.get(params.url).pipe(
      map(({ data }) => this._data(params, data)),
      catchError(() => of(this._data(params, null))),
    );
  }

  public fetchAll(urls: IUrlDetails[]) {
    return forkJoin(urls.map((url) => this._fetch(url)));
  }
}
