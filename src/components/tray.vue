<template lang="pug">
v-app-bar.Tray(app fixed :height="isDesk ? 54 : 48")
  //- pc
  template(v-if="isDesk")
    logo
      router-link.sublogo(:to="{path: '/'}" title="Info") Info
    .nav-top-left
      navi(type="tab")
    .nav-top-right
      ws-stats
      div(v-if="isDesk")
        v-btn(icon @click.prevent="go2Settings")
          v-icon(size="16") settings
  //- mobi
  template(v-else)
    v-app-bar-nav-icon(@click="toggle")
    v-toolbar-title(v-text="title" style="text-align: left")
    v-spacer
    ws-stats
</template>

<script>

import Utils from '@/lib/utils'
import logo from '@/components/logo'
import navi from '@/components/navi'
import wsStats from '@/components/remote-status'

export default {
  components: {logo, navi, wsStats},
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isDesk () {
      return this.$vuetify.breakpoint.mdAndUp
    },
    view () {
      return Utils.view(this)
    },
    title () {
      return this.view.meta.title
    }
  },
  methods: {
    toggle () {
      this.$emit('update:drawer', !this.drawer)
    },
    go2Settings () {
      this.$router.push({name: 'settings'})
    }
  }
}
</script>

<style lang="postcss">
:root {
  --appbarBg: #fff;
  &.theme-dark {
    --appbarBg: #1e2126;
  }
}

.Tray {
  color: #666;
  &.v-app-bar {
    background-color: var(--appbarBg)!important;
  }

  & .nav-top-left {
    display: flex;height: 100%;justify-content: flex-end;align-items: center;flex: 1 1 auto;
    & .Entries {
      height: 100%;
    }
    & ~ div {
      /* margin-left: 8px; */
      &.nav-my {
        /* margin-left: 2em; */
      }
    }
  }
  & .nav-top-right {
    flex: 0 1 auto;display: flex;
  }
  & .Logo {
    flex: 0 1 auto;
  }
  & .v-toolbar__content {padding: 0 1em;}
  & .v-toolbar__title {
    flex: 1 1 auto;padding-left: 0!important;
  }
}

</style>
