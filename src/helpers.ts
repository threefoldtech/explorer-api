import { sumBy, uniqBy } from 'lodash';
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

export function computeNodeStats(nodes) {
  const onlineNodes = nodes.filter(online);

  return {
    amountregisteredNodes: nodes.length,
    onlineNodes: onlineNodes.length,
    countries: uniqBy(nodes, (node) => node.location.country).length,
    cru: sumBy(onlineNodes, (node) => +node.total_resources?.cru ?? 0),
    mru: sumBy(onlineNodes, (node) => +node.total_resources?.mru ?? 0),
    sru: sumBy(onlineNodes, (node) => +node.total_resources?.sru ?? 0),
    hru: sumBy(onlineNodes, (node) => +node.total_resources?.hru ?? 0),
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
