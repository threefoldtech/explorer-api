import gatewayInfo from '../gatewayinfo'
import { mapGetters } from 'vuex'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

export default {
  name: 'gatewaystable',

  components: { gatewayInfo },
  data () {
    return {
      searchgateways: undefined,
      showOffline: false,
      storeName: '',
      showDialog: false,
      dilogTitle: 'title',
      dialogBody: '',
      dialogActions: [],
      dialogImage: null,
      block: null,
      showBadge: true,
      menu: false,
      loadedGateways: false,
      othersHidden: false,
      itemsPerPage: 4,
      expanded: [],

      headers: [
        { text: 'ID', value: 'node_id' },
        { text: 'Network', value: 'networkType' },
        { text: 'Uptime', value: 'uptime' },
        { text: 'Version', value: 'version' },
        { text: 'Status', value: 'status', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters(['gateways']),
    // Parse gatewayList to table format here
    parsedGateways: function () {
      const gateways = this.gateways.filter(gateway => this.showGateway(gateway)).map(gateway => {
        let networkType = ''
        if (gateway.url.includes('test')) {
          networkType = 'Testnet'
        } else if (gateway.url.includes('dev')) {
          networkType = 'Devnet'
        } else {
          networkType = 'Mainnet'
        }
        const gridVersion = Object.keys(gateway.workloads).length > 0 ? 'Grid2' : 'Grid3'

        return {
          uptime: moment.duration(gateway.uptime, 'seconds').format(),
          version: gateway.os_version,
          id: gateway.id,
          farm_name: gateway.farm_id,
          farm_id: gateway.farm_id,
          node_id: gateway.node_id,
          workloads: gateway.workloads,
          updated: new Date(gateway.updated * 1000),
          status: this.getStatus(gateway),
          location: gateway.location,
          managedDomains: gateway.managed_domains,
          tcpRouterPort: gateway.tcp_router_port,
          dnsNameServer: gateway.dns_nameserver,
          publicKeyHex: gateway.public_key_hex,
          networkType,
          gridVersion
        }
      })
      return gateways
    }
  },
  methods: {
    getStatus (gateway) {
      const { updated, reserved } = gateway
      if (reserved) return { color: 'green', status: 'up' }
      const startTime = moment()
      const end = moment.unix(updated)
      const minutes = startTime.diff(end, 'minutes')

      // if updated difference in minutes with now is less then 10 minutes, gateway is up
      if (minutes < 15) return { color: 'green', status: 'up' }
      else if (minutes > 16 && minutes < 20) { return { color: 'orange', status: 'likely down' } } else return { color: 'red', status: 'down' }
    },
    truncateString (str) {
      // do not truncate in full screen mode
      if (this.othersHidden === true) {
        return str
      }
      str = str.toString()
      if (str.length < 10) return str
      return str.substr(0, 10) + '...'
    },
    showGateway (gateway) {
      if (!this.showOffline && this.getStatus(gateway)['status'] === 'down') {
        return false
      }

      return true
    },
    openGatewayDetails (gateway) {
      const index = this.expanded.indexOf(gateway)
      if (index > -1) this.expanded.splice(index, 1)
      else this.expanded.push(gateway)
    },
    hideOthers () {
      var all = document.getElementsByClassName('others')
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = 'none'
        all[i].classList.remove('flex')
      }
      this.othersHidden = true
    },
    showOthers () {
      var all = document.getElementsByClassName('others')
      for (var i = 0; i < all.length; i++) {
        all[i].style.display = 'block'
        all[i].classList.add('flex')
      }
      this.othersHidden = false
    }
  }
}
