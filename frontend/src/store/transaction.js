import tfService from '../services/tfService'

const getDefaultState = () => {
  return {
    user: {},
    nodePage: 1,
    nodesLoading: true,
    nodes: [],
    gateways: [],
    registeredFarms: [],
    gatewaySpecs: {
      amountRegisteredGateways: 0,
      onlineGateways: 0
    },
    farmSpecs: {
      amountregisteredFarms: 0
    },
    nodeSpecs: {},
    // Some sane defaults
    prices: {
      CuPriceDollarMonth: 10,
      SuPriceDollarMonth: 8,
      TftPriceMill: 5000,
      IP4uPriceDollarMonth: 6
    }
  }
}

export default ({
  state: getDefaultState(),
  actions: {
    getName: async context => {
      var response = await tfService.getName()
      return response.data.name
    },
    getUser: async context => {
      var name = await context.dispatch('getName')
      var response = await tfService.getUser(name)
      context.commit('setUser', response.data)
    },
    getNodes (context, { grid, network }) {
      tfService.getNodes(grid, network)
        .then(res => {
          context.commit('setNodes', res.data)
          context.commit('setNodesLoading', false)
        })
    },
    getFarms (context, { grid, network }) {
      tfService.getFarms(grid, network)
        .then(res => {
          context.commit('setRegisteredFarms', res.data)
          context.commit('setFarmsLoading', false)
          context.commit('setAmountOfFarms', res.data.length)
        })
    },
    getGateways (context, { grid, network }) {
      tfService.getGateways(grid, network)
        .then(res => {
          context.commit('setRegisteredGateways', res.data)
          context.commit('setGatewaysLoading', false)
          context.commit('setGatewaySpecs', res.data)
        })
    },
    getStats (context, { grid, network }) {
      tfService.getStats(grid, network)
        .then(res => {
          context.commit('setNodeSpecs', res.data)
        })
    },
    getPrices: (context, { grid, network }) => {
      tfService.getPrices(grid, network).then(response => {
        const data = response.data.filter(p => Object.keys(p).length > 2)
        let CuPriceDollarMonth = 0
        let SuPriceDollarMonth = 0
        let TftPrice = 0
        let IP4uPriceDollarMonth = 0

        data.forEach(p => {
          CuPriceDollarMonth += p.CuPriceDollarMonth
          SuPriceDollarMonth += p.SuPriceDollarMonth
          TftPrice += p.TftPrice
          IP4uPriceDollarMonth += p.IP4uPriceDollarMonth
        })

        context.commit('setPrices', {
          CuPriceDollarMonth: CuPriceDollarMonth / data.length,
          SuPriceDollarMonth: SuPriceDollarMonth / data.length,
          TftPrice: TftPrice / data.length,
          IP4uPriceDollarMonth: IP4uPriceDollarMonth / data.length
        })
      })
    },
    resetState: context => {
      context.commit('resetState')
    },
    refreshData: ({ dispatch }, args) => {
      if (!args.grid || !args.network) return
      // reset the vuex store
      dispatch('resetState')

      dispatch('getStats', args)
      dispatch('getNodes', args)
      dispatch('getFarms', args)
      dispatch('getGateways', args)
      dispatch('getPrices', args)
    }
  },
  mutations: {
    setNodes (state, nodes) {
      state.nodes = nodes
    },
    setNodesLoading (state, loading) {
      state.nodesLoading = loading
    },
    setRegisteredFarms (state, farms) {
      state.registeredFarms = farms
    },
    setFarmsLoading (state, loading) {
      state.farmsLoading = loading
    },
    setRegisteredGateways (state, gateways) {
      state.gateways = gateways
    },
    setGatewaysLoading (state, loading) {
      state.gatewaysLoading = loading
    },
    setFarms (state, value) {
      state.farms = value
    },
    setUser: (state, user) => {
      state.user = user
    },
    setPrices: (state, prices) => {
      state.prices.CuPriceDollarMonth = `$ ${prices.CuPriceDollarMonth}`
      state.prices.SuPriceDollarMonth = `$ ${prices.SuPriceDollarMonth}`
      state.prices.TftPrice = `$ ${prices.TftPriceMill / 1000}`
      state.prices.IP4uPriceDollarMonth = `$ ${prices.IP4uPriceDollarMonth}`
    },
    setAmountOfFarms (state, value) {
      state.farmSpecs.amountregisteredFarms = value
    },
    setNodeSpecs (state, value) {
      state.nodeSpecs = value
    },
    setGatewaySpecs (state, gateways) {
      if (gateways.length === 0) {
        return
      }
      var onlineGateways = gateways.filter(online)
      state.gatewaySpecs.amountRegisteredGateways = gateways.length
      state.gatewaySpecs.onlineGateways = onlineGateways.length
    },
    resetState (state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, getDefaultState())
    }
  },
  getters: {
    user: state => state.user,
    nodes: state => state.nodes,
    registeredFarms: state => state.registeredFarms,
    gateways: state => state.gateways,
    nodeSpecs: state => state.nodeSpecs,
    gatewaySpecs: state => state.gatewaySpecs,
    farmSpecs: state => state.farmSpecs,
    nodesLoading: state => state.nodesLoading,
    farmsLoading: state => state.farmsLoading,
    gatewaysLoading: state => state.gatewaysLoading,
    prices: state => state.prices
  }
})

function online (node) {
  const { reserved } = node
  if (reserved) return true

  const { status } = node
  if (status === 'up') return true

  const timestamp = new Date().getTime() / 1000
  const minutes = (timestamp - node.updated) / 60
  return minutes < 20
}
