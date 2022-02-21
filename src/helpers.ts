import { uniqBy } from 'lodash';
import { IParams } from './types';
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

  static map(node) {
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

  private static _toV2({ grid, network }: IParams, node) {
    return {
      grid,
      network,
      ...(grid === 'grid2' ? node : MapToV2.map(node)),
    };
  }

  public static toV2(results: any[]) {
    return results.reduce((response, { grid, network, status, data }) => {
      if (status === 'down' || !data) return response;
      data.forEach((n) => response.push(MapToV2._toV2({ grid, network }, n)));
      return response;
    }, [] as any[]);
  }
}

export function computeNodeStats(nodes: any[]) {
  const onlineNodes = nodes.filter(online);
  let cru = 0;
  let sru = 0;
  let mru = 0;
  let hru = 0;
  nodes.forEach((node) => {
    if (!node.total_resources) return;
    if (node.grid == 'grid3') {
      cru += node.total_resources.cru;
      sru += node.total_resources.sru / Math.pow(1024, 3);
      mru += node.total_resources.mru / Math.pow(1024, 3);
      hru += node.total_resources.hru / Math.pow(1024, 3);
    } else {
      cru += node.total_resources.cru;
      sru += node.total_resources.sru;
      mru += node.total_resources.mru;
      hru += node.total_resources.hru;
    }
  });

  return {
    amountregisteredNodes: nodes.length,
    onlineNodes: onlineNodes.length,
    countries: uniqBy(nodes, (node) => node.location.country).length,
    cru,
    sru: Math.round(sru),
    mru: Math.round(mru),
    hru: Math.round(hru),
  };
}
function online(node) {
  // Grid2 check
  const { reserved } = node;
  if (reserved) return true;

  // Grid3 check
  const { status } = node;
  if (status === 'up') return true;

  const timestamp = new Date().getTime() / 1000;
  const minutes = (timestamp - node.updated) / 60;
  return minutes < 20;
}
