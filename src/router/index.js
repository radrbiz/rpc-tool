import Vue from 'vue'
import VueRouter from 'vue-router'

import rootdir from './rootdir'
import rpc from './rpc'
import ledgers from './ledgers'
import ledger from './ledger'
import serverInfo from './server-info'
import settings from './settings'
import Utils from '@/lib/utils'

const Routes = {rootdir, rpc, ledgers, ledger, serverInfo, settings}

Vue.use(VueRouter)

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0
      position.y = 0
    }
    return position
  }
}

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'almost',
  linkExactActiveClass: 'active',
  scrollBehavior,
  routes: Object.values(Routes)
})

const def = {
  title: process.env.VUE_APP_TITLE
}

const changTitle = view => {
  if (document) {
    if (view.meta.title) {
      document.title = view.meta.title === def.title ? def.title : view.meta.title + ' - ' + def.title
    } else {
      document.title = def.title
    }
    document.documentElement.setAttribute('view', view.name)
    if (view.meta.requireAuth && !document.documentElement.getAttribute('loaded')) {
      document.documentElement.setAttribute('auth', '')
    } else {
      document.documentElement.removeAttribute('auth')
    }
  }
}
router.beforeEach((to, _from, next) => {
  const view = Utils.view(to)
  const needAuth = !!view.meta.requireAuth
  if (!needAuth) {
    changTitle(view)
    next()
  }
})

export {router as default, Routes}
