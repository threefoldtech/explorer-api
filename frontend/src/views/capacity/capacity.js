import miniGraph from '../../components/minigraph'
import nodesTable from '../../components/nodestable'
import gatewaysTable from '../../components/gatewaystable'
import capacityMap from '../../components/capacitymap'

import scrollablecard from '../../components/scrollablecard'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'capacity',
  components: { miniGraph, capacityMap, nodesTable, scrollablecard, gatewaysTable },
  props: ['grid'],
  data () {
    return {
      showDialog: false,
      dilogTitle: 'title',
      dialogBody: '',
      dialogActions: [],
      dialogImage: null,
      block: null,
      showBadge: true,
      menu: false,
      selectedNode: '',
      selectedGateway: ''
    }
  },
  computed: {
    ...mapGetters([
      'nodeSpecs',
      'gatewaySpecs',
      'farmSpecs',
      'prices'
    ])
  },
  mounted () {
    const network = this.$router.history.current.path.substring(1) || 'All'
    this.refresh(network)
  },
  methods: {
    ...mapActions({
      refresh: 'refreshData'
    }),
    changeSelectedNode (data) {
      this.selectedNode = data
    },
    changeSelectedGateway (data) {
      this.selectedGateway = data
    }
  }
}
