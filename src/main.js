// css
import '@/assets/c/main.css'
// fonts
import 'opensans-webkit/src/css/open-sans.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'material-icons/iconfont/material-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import 'cryptocoins-icons/webfont/cryptocoins.css'
import 'cryptocoins-icons/webfont/cryptocoins-colors.css'

import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import store from './store'
import App from './App.vue'
import Vuelidate from 'vuelidate'

Vue.config.productionTip = false

Vue.use(Vuelidate)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
