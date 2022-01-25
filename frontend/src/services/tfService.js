import axios from 'axios'
import config from '../../public/config'

const api = axios.create({
  baseURL: config.apiURL
})

export default {
  getNodes (gridVersion, network) {
    return api.get(`/${gridVersion}/${network}/nodes`)
  },
  getFarms (gridVersion, network) {
    return api.get(`/${gridVersion}/${network}/farms`)
  },
  getGateways (gridVersion, network) {
    return api.get(`/${gridVersion}/${network}/gateways`)
  },
  getStats (gridVersion, network) {
    return api.get(`/${gridVersion}/${network}/stats`)
  },
  getPrices (gridVersion, network) {
    return api.get(`/${gridVersion}/${network}/prices`)
  }
}
