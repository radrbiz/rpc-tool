<template lang="pug">
v-navigation-drawer.navi-left(app fixed v-model="show" disable-resize-watcher)
  v-toolbar.transparent(flat)
    logo
  v-list(dense)
    v-divider
    v-list-item(v-for="entry in entries" :key="entry.name" :to="{path: entry.path}")
      v-list-item-action
        v-icon {{entry.meta.icon}}
      v-list-item-content
        v-list-item-title {{entry.meta.title}}
    v-list-item(:to="{path: '/settings'}")
      v-list-item-action
        v-icon settings
      v-list-item-content
        v-list-item-title Settings
    v-divider
    v-list-item.foot(v-if="!viewDesktop")
      v-list-item-content
        v-list-item-title
          .semver(title="Version") {{ver}}
          copyright(site)
</template>

<script>
import logo from '@/components/logo'
import copyright from '@/components/copyright'
import {Routes} from '@/router'

export default {
  components: {logo, copyright},
  props: {
    drawer: Boolean,
    viewDesktop: {type: [String, Boolean]}
  },
  data () {
    const entries = [
      Routes.rpc,
      Routes.ledgers,
      Routes.serverInfo
    ]
    return {
      entries,
      show: this.drawer
    }
  },
  computed: {
    ver () {
      return process.env.VUE_APP_VERSION
    }
  },
  watch: {
    drawer (v) {
      this.show = v
    },
    show (v) {
      this.$emit('update:drawer', v)
    }
  },
  mounted () {
  }
}
</script>
<style lang="postcss">
.navi-left {
  & .v-list--dense {
    & .v-list-item {
      color: var(--txt1);
      &::before {opacity: 0!important;background-color: #fff;}
      & .v-list-item__title {font-size: .8125rem;line-height: 1rem;font-weight: 400;}
      &.v-list-item--active {
        color: var(--naviActiveColor)
      }
    }
  }
  & .v-list-item__content {text-align: left}
  & .foot {
    color: var(--txt3)!important;
    & .semver {display: inline-block; padding: 0 .5rem;}
  }
}
</style>
