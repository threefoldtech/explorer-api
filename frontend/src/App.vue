<template>
  <v-app dark>
    <v-toolbar class='toolbar' dark>
      <v-app-bar-nav-icon>
        <v-img class='logo' src='./assets/3fold_icon.png' />
      </v-app-bar-nav-icon>
      <v-toolbar-title>ThreeFold Capacity Explorer</v-toolbar-title>
    </v-toolbar>

    <v-content class='content'>
      <v-col>
        <v-row class='actions pa-4'>
          <div class='dropdown'>
            <v-select
              v-model='grid'
              :items='gridVersions'
              item-text='text'
              label='Grid Version'
              persistent-hint
              return-object
              outlined
              dense
              @change='onUpdateGrid'
            ></v-select>
          </div>
          <div class='dropdown'>
            <v-select
              v-model='select'
              :items='items'
              class='ml-4'
              item-text='text'
              label='Network'
              persistent-hint
              return-object
              outlined
              dense
              @change='refreshWithNetwork'
            ></v-select>
          </div>
          <v-spacer />
          <v-progress-circular
            class='refresh'
            v-if='nodesLoading || farmsLoading || gatewaysLoading'
            indeterminate
            color='primary'
          ></v-progress-circular>
          <v-btn class='refresh' icon v-else @click='refreshWithNetwork'>
            <v-icon big color='primary' left> fas fa-sync-alt </v-icon>
          </v-btn>
        </v-row>
        <router-view :grid="grid.text"></router-view>
      </v-col>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {},
  data: () => ({
    showDialog: false,
    dilogTitle: 'title',
    dialogBody: '',
    dialogActions: [],
    dialogImage: null,
    block: null,
    showBadge: true,
    menu: false,
    start: undefined,
    refreshInterval: undefined,
    select: { text: 'testnet' },
    grid: { text: 'grid2' },
    gridVersions: [{ text: 'grid3' }, { text: 'grid2' }],
    items: [{ text: 'all' }, { text: 'testnet' }, { text: 'devnet' }]
  }),
  computed: {
    routes () {
      return this.$router.options.routes
    },
    ...mapGetters(['nodesLoading', 'farmsLoading', 'gatewaysLoading'])
  },
  mounted () {
    // this.select = this.$router.history.current.path.substring(1) || 'All'
    this.refreshWithNetwork()
  },
  methods: {
    ...mapActions({
      refresh: 'refreshData'
    }),
    onUpdateGrid () {
      const gridType = this.grid.text
      if (gridType === 'grid3') {
        this.items = [{ text: 'all' }, { text: 'testnet' }, { text: 'devnet' }]
      } else if (gridType === 'grid2') {
        this.items = [
          { text: 'all' },
          { text: 'mainnet' },
          { text: 'testnet' }
        ]
      } else {
        this.items = [
          { text: 'all' },
          { text: 'mainnet' },
          { text: 'testnet' },
          { text: 'devnet' }
        ]
      }
      this.select = this.items[0]
      this.refreshWithNetwork()
    },
    refreshWithNetwork () {
      this.$router.history.push({ path: this.select.text, params: { network: this.select.text } })
      this.refresh({ grid: this.grid.text, network: this.select.text })
    }
  }
}
</script>

<style lang='scss'>
.actions {
  height: 60px;
}
.logo {
  width: 40px;
  height: 40px;
  margin-left: 10px;
  margin-bottom: 3px;
}
.toolbar {
  background-color: #2d4052 !important;
  max-height: 60px;
}
.dropdown {
  width: 300px !important;
}
.refresh {
  position: absolute !important;
  right: 25px !important;
  top: 30px !important;
  font-size: 30px !important;
}
.grid3label {
  align-self: center;
  padding-left: 10px;
  margin-top: -10px;
  margin-right: 60px;
}
</style>
