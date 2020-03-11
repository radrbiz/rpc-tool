<template lang="pug">
  .Entries(align-center)
    template(v-if="type == 'tab'")
      v-tabs(v-model="curRoute" :slider-color="hideSlider")
        v-tab(v-for="entry in entries" :key="entry.name" :to="{name: entry.name}")
          span {{entry.meta.title}}
    template(v-else)
      v-btn(v-for="entry in entries" :key="entry.name"
        :to="{name: entry.name}")
        span {{entry.meta.title}}
        v-icon(v-if="bottom" size="21") {{entry.meta.icon}}
</template>

<script>
import {Routes} from '@/router'

export default {
  components: {},
  props: {
    type: {type: String},
    bottom: {type: Boolean, default: false}
  },
  data: function () {
    const entries =[
      Routes.rpc,
      Routes.ledgers,
      Routes.serverInfo
    ]
    return {
      entries,
      curRoute: ''
    }
  },
  computed: {
    hideSlider () {
      return this.$route.path.includes(this.curRoute) ? '' : 'transparent'
    }
  },
  methods: {

  },
  mounted () {},
  created () {},
  beforeDestroy () {}

}
</script>

<style lang="postcss">
:root {
  --naviColor: #333;
  --naviActiveColor: #5584ff;
  --nav1BgHover: rgba(82, 111, 238,.05);
  &.theme-dark {
    --naviColor: #ccc;
    --nav1BgHover: #282828;
  }
}

.Entries {
  display: flex; margin-left: 2em; margin-right: 2em;
  & .v-menu {align-self: center;display:inline-flex!important;height:100%;}
  & .v-badge {
    display: flex;flex-direction: column;
    & > span {order: 2;}
  }
  & .v-tabs {
    & .v-tabs-bar,
    & .v-slide-group__wrapper,
    & .v-tabs-bar__content {
      height: 100%;background: none;
    }
    & .v-tabs-slider-wrapper .v-tabs-slider {color: var(--naviActiveColor)!important}
    & .v-tab {
      color:var(--naviColor)!important;text-decoration: none;background:none;opacity: 1!important;min-width: auto !important;
      &:hover,
      &.v-tab--active,
      &.almost {color: var(--naviActiveColor)!important;opacity: 1;}
      &:hover {background-color: var(--nav1BgHover)!important}
    }
  }
}

.pg {
  & .v-bottom-navigation .v-btn{
    &.v-btn--active {color: var(--primaryColor)!important}
    &:not(.v-btn--active) {color: var(--txt2)}
  }
}
</style>
