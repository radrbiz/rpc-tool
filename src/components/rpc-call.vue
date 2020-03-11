<template lang="pug">
.code-ctx(:class="{mode}")
  v-card(outline)
    v-card-title.headline(v-show="addr")
      | {{title}}
      v-spacer
      v-btn(icon v-show="addr" @click="expand = !expand")
        v-icon {{expand ? 'mdi-chevron-up' : 'mdi-chevron-down'}}
      //- v-expand-transition
      loading-guard(:pending="pending")
      div(v-show="addr && expand" style="width: 100%;min-height:200px")
        v-divider
        v-card-text(style="padding-top: 0")
        vue-json-pretty.hl-code.dark(v-show="code"
          :deep="deep"
          :data="code"
          :show-length="true"
          :show-line="true"
          :show-double-quotes="false"
          :highlight-mouseover-node="true"
          @click="handleClick")
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import ws from '@/lib/ws'
import loadingGuard from '@/components/loading-guard'

const LIMIT_NUM = 20
const modeMap = {
  'account_info': {title: `Account Info`,},
  'account_lines': {title: `Account Lines`, params: {ledger: 'current'}},
  'account_offers': {title: `Account Offers`, params: {ledger: 'current', limit: LIMIT_NUM}},
  'account_tx': {title: `Account Transactions`, params: {ledger: 'current', limit: LIMIT_NUM, ledger_index_min: '-1'}},
  'ledger': {title: `Ledger Info`, params: {transactions: true, active_account: false, dividend: false, full: false}},
  'tx': {title: `Transaction Info`}
}

export default {
  components: {VueJsonPretty, loadingGuard},
  props: {
    deep: {type: Number, default: 3},
    mode: {type: String, required: true},
    addr: {
      type: String,
      default: ''
    },
    opts: {
      type: Object,
      default: function () {return {}}
    }
  },
  data () {
    return {
      result: null,
      pending: false,
      expand: true
    }
  },
  computed: {
    code () {
      return this.result || {}
    },
    title () {
      return (this.mode && modeMap[this.mode].title) || `Info`
    }
  },
  watch: {
    addr: function (val, old) {
      if (!val && val == old ) return
      this.fetchLedger()
    },
    'opts.expand': function () {
      this.fetchLedger()
    }
  },
  methods: {
    getParams () {
      let params = {command: this.mode}, {addr, opts} = this
      if (this.mode.startsWith('account_')) {
        Object.assign(params, {account: addr})
      } else if (this.mode == 'tx') {
        Object.assign(params, {transaction: addr})
      } else if (this.mode == 'ledger') {
        Object.assign(params, {ledger_index: parseInt(addr), ...opts})
      }

      return Object.assign({}, modeMap[this.mode].params || {}, params)
    },
    fetchLedger () {
      if (!this.addr || this.pending) return
      this.pending = true
      let params = this.getParams()
      ws.send(params, res => {
        this.pending = false
        this.result = res
      })
    },
    handleClick () {}
  },
  mounted () {
    this.fetchLedger()
  },
}
</script>

<style lang="postcss">
.hl-code {
  /*max-height: 480px;overflow-y: auto;*/text-align: left;line-height: 1.6rem;
  &.dark {
    color: #839496;background-color: #002b36;
    &.vjs-tree{
      &.is-mouseover {background-color: #012e48;}
    }
    & .vjs-tree {
      & .vjs-tree__content.has-line {border-color: #658aa5;}
      &.is-mouseover {background-color: #012e48;}
      & .vjs-key {color: #bd4147}
      & .vjs-value__number{color: #6896ba}
      & .vjs-value__string {color: #6a8759}
      & .vjs-tree__brackets {color: #f8c555}
    }
  }
}
.hl-code .vjs-tree .vjs-value__string {
  word-break: break-all;white-space: normal;
}
</style>
