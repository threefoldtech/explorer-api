import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ExplorerService } from './explorer.service';
import { IParams, MapToV2 } from './types';

@Controller('/api/:grid/:network')
@UsePipes(ValidationPipe)
export class AppController {
  public constructor(private readonly explorer: ExplorerService) {}

  @Get('/nodes')
  public getNodes(@Param() params: IParams) {
    const urls = IParams.getUrls(params, '/explorer/nodes', '/nodes');

    return this.explorer.fetchAll(urls).pipe(
      map((results) => {
        return results.reduce((response, { grid, network, status, data }) => {
          if (status === 'down') return response;
          data.forEach((n) =>
            response.push(MapToV2.toV2({ grid, network }, n)),
          );
          return response;
        }, [] as any[]);
      }),
    );
  }

  // @Get('/:grid/:network/:type')
  // public resolver(
  //   @Param() params: IParams,
  //   @Query('flat') flatten: 'false',
  // ): any {
  //   const urls = IParams.getUrls(params);
  //   const flat = flatten !== 'false' && params.type !== 'prices';
  //   return this.explorerService.fetchAll(urls, flat);
  // }
}
