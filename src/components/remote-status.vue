<template lang="pug">
.remote-stat
  .ws-stat(:title="title")
    v-btn(icon disabled)
      v-icon(:class="[stat, {stay}]" left size="16")
        | {{icon}}
      //- span {{title}}
</template>

<script>
let stat = 'connecting'

const statusMap = {
  connected: {title: `Connected`, icon: 'cloud'},
  reconnected: {title: `Connected`, icon: 'cloud'},
  disconnected: {title: `Disconnected`, icon: 'cloud_off'},
  connectionerror: {title: `Disconnected`, icon: 'cloud_off'},
  connecting: {title: `Connecting`, icon: 'cloud_queue'}
}

export default {
  components: {},
  props: {
    stay: {type: Boolean, default: true}
  },
  data () {
    return {
      stat
    }
  },
  computed: {
    title () {
      return statusMap[this.stat].title || ''
    },
    icon () {
      return statusMap[this.stat].icon
    }
  },
  methods: {
    setStat (stat) {
      if (stat === 'connecting' && ['disconnected', 'connectionerror'].includes(stat)) return
      this.stat = stat
    },
    onMsg (e) {
      this.setStat(e.detail)
    }
  },
  mounted () {
    // this.setStat(wsStat() || {})
    let that = this
    window.addEventListener('ws-state', that.onMsg)
  },
  beforeDestroy () {
    let that = this
    window.removeEventListener('ws-state', that.onMsg)
  }
}
</script>

<style lang="postcss">
.remote-stat {
  & .v-btn i.v-icon {
    transition: opacity 1s, color .3s;
    &.connected,
    &.reconnected {
      color: #009800!important;
      &:not(.stay) {opacity: 0;}
    }
    &.disconnected,
    &.connectionerror {color: #c70202!important}
    &.connecting {animation: fadeinout 1.5s linear infinite}
  }
  & .ws-stat span {display: inline-block;white-space: nowrap;margin-left: .5em;text-transform: lowercase;font-size: 14px}
}
</style>
