<template lang="pug">
v-app(:class="{viewDesktop}")
  //- v-navigation-drawer()
  nav-top(:drawer.sync="drawer")
  nav-left(:drawer.sync="drawer" :viewDesktop="viewDesktop")
  v-main
    router-view
  nav-footer(v-if="viewDesktop")
  //- v-bottom-navigation.navi(fixed :value="true" v-if="!viewDesktop" v-model="def" height="60")
  //-   navi(bottom)

</template>

<script>
import Utils from './lib/utils'
import navTop from '@/components/tray'
import navLeft from '@/components/nav-left'
import navFooter from '@/components/nav-footer'
import navi from '@/components/navi'

export default {
  components: {navTop, navLeft, navFooter, navi},
  data () {
    return {
      drawer: false,
      rightDrawer: false,
      def: Utils.view(this).name
    }
  },
  computed: {
    view () {
      return Utils.view(this)
    },
    title () {
      return this.view.meta.title
    },
    viewDesktop () {
      return this.$vuetify.breakpoint.mdAndUp
    }
  },
  methods: {

  },
  created () {

  },
  mounted () {
    document.documentElement.setAttribute('mounted', '')
    this.$store.dispatch('LEDGER_LISTEN')
  }
}
</script>
<style lang="postcss">
#app {
  text-align: center;
  & #nav a {padding: 0 1.2em}
  & .v-bottom-navigation .v-btn {height: 100%!important}
}
</style>
