import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import ledger from './ledger'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    ledger
  }
})
