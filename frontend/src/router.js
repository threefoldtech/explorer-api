import Vue from 'vue'
import Router from 'vue-router'
import { publicPath } from '../vue.config'
import Capacity from './views/capacity'
import NotFound from './views/notFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: publicPath,
  routes: [
    {
      path: '/',
      name: 'Capacity directory',
      component: Capacity,
      props: true
    },
    {
      path: '/grid2',
      name: 'Capacity directory',
      props: true,
      component: Capacity
    },
    {
      path: '/grid3',
      name: 'Capacity directory',
      props: true,
      component: Capacity
    },
    {
      path: '/all',
      name: 'Capacity directory',
      props: true,
      component: Capacity
    },
    {
      path: '/mainnet',
      name: 'Capacity directory',
      props: true,
      component: Capacity
    },
    {
      path: '/testnet',
      name: 'Capacity directory',
      props: true,
      component: Capacity
    },
    {
      path: '/devnet',
      name: 'Capacity directory',
      props: true,
      component: Capacity
    },
    {
      path: '*',
      name: 'Not found',
      component: NotFound
    }
  ]
})
