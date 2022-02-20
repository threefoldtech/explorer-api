import { IsIn } from 'class-validator';

export type TypeTypes = 'nodes' | 'gateways' | 'farms' | 'stats' | 'prices';
export type GridTypes = 'all' | 'grid2' | 'grid3';
export type NetworkTypes = 'all' | 'devnet' | 'testnet' | 'mainnet';

const GRIDS = ['grid2', 'grid3'];
const NETWORKS = ['devnet', 'testnet', 'mainnet'];

export enum Urls {
  'grid2.mainnet' = 'https://explorer.grid.tf',
  'grid2.testnet' = 'https://explorer.testnet.grid.tf',
  'grid2.devnet' = 'https://explorer.devnet.grid.tf',

  'grid3.mainnet' = 'https://gridproxy.grid.tf',
  'grid3.testnet' = 'https://gridproxy.test.grid.tf',
  'grid3.devnet' = 'https://gridproxy.dev.grid.tf',
}

export interface IUrlDetails {
  grid: GridTypes;
  network: NetworkTypes;
  url: string;
}

export class IParams {
  @IsIn(['all', 'grid2', 'grid3'])
  grid: GridTypes;

  @IsIn(['all', 'devnet', 'testnet', 'mainnet'])
  network: NetworkTypes;

  public static getUrls(
    { grid, network }: IParams,
    grid2Suffix: string,
    grid3Suffix: string = grid2Suffix,
  ): IUrlDetails[] {
    const grids = grid === 'all' ? GRIDS : [grid];
    const networks = network === 'all' ? NETWORKS : [network];

    return grids.reduce<IUrlDetails[]>((urls, grid: GridTypes) => {
      for (const network of networks as NetworkTypes[]) {
        urls.push({
          grid,
          network,
          url:
            Urls[`${grid}.${network}`] +
            (grid === 'grid2' ? grid2Suffix : grid3Suffix),
        });
      }
      return urls;
    }, []);
  }
}
