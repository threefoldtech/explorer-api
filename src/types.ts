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

  // 'grid2.mainnet.prices' = 'https://explorer.grid.tf/api/v1/prices',
  // 'grid2.testnet.prices' = 'https://explorer.testnet.grid.tf/api/v1/prices',
  // 'grid2.devnet.prices' = 'https://explorer.devnet.grid.tf/api/v1/prices',

  'grid3.mainnet' = 'https://gridproxy.grid.tf',
  'grid3.testnet' = 'https://gridproxy.ayoub.gridtesting.xyz',
  'grid3.devnet' = 'https://gridproxy.ayoub.gridtesting.xyz',
}

export interface IUrlDetails {
  grid: GridTypes;
  network: NetworkTypes;
  url: string;
}

export class IParams {
  // @IsIn(['nodes', 'gateways', 'farms', 'stats', 'prices'])
  // type: TypeTypes;

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

export class MapToV2 {
  private static checkFreeToUse(node) {
    const { total_resources: tr, used_resources: us } = node;

    return (
      tr?.cru - us?.cru > 0 &&
      tr?.mru - us?.mru > 0 &&
      tr?.hru - us?.hru > 0 &&
      tr?.sru - us?.sru > 0
    );
  }

  private static map(node) {
    return {
      id: node.id,
      node_id: node.nodeId,
      os_version: node.version ? node.version : 'None',
      farm_id: node.farmId,
      farm_name: 'node.farm_name',
      location: {
        country: node.country,
      },
      status: { status: node.status },
      total_resources: node.total_resources,
      used_resources: node.used_resources,
      reserved_resources: node.used_resources,
      updated: new Date(node.updatedAt).getTime() / 1000,
      uptime: node.uptime,
      certificationType: node.certificationType,
      workloads: {},
      reserved: node.status === 'up',
      managed_domains: node.publicConfig ? [node.publicConfig.domain] : [],
      free_to_use: node.status === 'up' && MapToV2.checkFreeToUse(node),
      url: node.url,
      ...node,
    };
  }

  public static toV2({ grid, network }: IParams, node) {
    return {
      grid,
      network,
      ...(grid === 'grid2' ? node : MapToV2.map(node)),
    };
  }
}
