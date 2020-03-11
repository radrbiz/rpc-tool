<template lang="pug">
span.loading-guard(v-if="show" :class="{center, nodata: empty, hold, cover}")
  //- Progress Icon
  i.progress-radar(:class="{pending}")
    i.radar
  //- Empty
  span.stat-empty(v-if="pending || empty")
    slot(v-if="empty")
      span(v-if="empty") {{msg}}
</template>

<script>
export default {
  props: {
    keep: {type: Boolean, default: false},
    center: {type: Boolean, default: false},
    pending: {type: Boolean, default: false},
    empty: {type: Boolean, default: false},
    msg: {type: String, default: `No data yet`},
    // You must use `hold` or `cover` attribute if your component possible be resized.
    hold: {type: Boolean, default: false},
    cover: {type: Boolean, default: false}
  },
  data () {
    return {
    }
  },
  computed: {
    show () {
      return this.pending || this.empty || this.keep
    }
  },
  methods: {
  }
}
</script>

<style lang="postcss">
.loading-guard {
  display: flex;justify-content:center;align-items: center;align-content:center;text-align: center;flex-direction: column;
  width: 100%!important;min-height: 190px;
  & i.progress-radar {
    display:block;width: 64px;height: 64px;max-width:100%;max-height:100%;
  }
  & .stat-empty {
    overflow: hidden;min-height: 0;height: 0;opacity: 0;
    transition: height .3s, min-height .3s, opacity .2s;
  }
  &.center {
    top: calc(50% - calc(190px / 2));left:0;position: absolute;
  }
  &.nodata {
    & .stat-empty {
      min-height: 32px;height: auto;opacity: 1;
    }
    & i.progress-radar {filter:grayscale(1);}
  }
  & ~ * {
    display: none;
  }
  &.hold ~ * {
    display: inherit;
    visibility: hidden;pointer-events: none;
  }
  &.cover ~ * {
    display: inherit;
    opacity: .8;pointer-events: none;
  }
}
</style>
