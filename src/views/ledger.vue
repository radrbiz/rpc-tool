<template lang="pug">
mixin summary ()
  v-row
    v-col(cols="6" md="6" lg="2")
      .inf(v-for="(inf, idx) in summary" :key="inf.key" v-if="idx<4")
        span.key {{inf.title}}:
        span.val
          span(v-if="['transactions'].includes(inf.key)") {{txs.length}}
          span(v-else) {{inf.val}}
    v-col(cols="6" md="6"  lg="3")
      .inf(v-for="(inf, idx) in summary" :key="inf.key" v-if="idx>3 && idx<8")
        span.key {{inf.title}}:
        span.val
          coin(v-if="['totalCoinsVBC'].includes(inf.key)" :coin="{currency: 'VBC', amount: inf.val}" :convert-native="true")
          coin(v-else-if="['totalCoins'].includes(inf.key)" :coin="{currency: 'VRP', amount: inf.val}" :convert-native="true")
          span(v-else) {{inf.val}}
    v-col(cols="12" md="12" lg="7")
      .inf(v-for="(inf, idx) in summary" :key="inf.key" v-if="idx>7 && idx <12")
        span.key {{inf.title}}:
        span.val {{inf.val}}
mixin txs()
  v-card.txs(outlined
    v-if="!pending && txs"
    v-for="(tx, idx) in txs"
    :key="idx")
    v-card-title
      router-link(:to="{name: 'rpc-tool', query: {address: tx.hash}}") {{`${tx.hash}`}}
      v-spacer
      v-btn(icon v-show="tx" @click="tx.expand = !tx.expand")
        v-icon {{tx.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'}}
    v-divider
    v-container(v-show="tx.expand")
      v-row
        v-col(cols="6" md="6")
          .inf(v-for="(ref, index) in txKeys" :key="index"
            v-if="index < 5")
            span.key {{ref.title}}:
            span.val
              span(v-if="!tx[ref.key] || !['Fee', 'Amount', 'Account', 'Destination', 'TransactionType'].includes(ref.key)"
                :class="{na: !tx[ref.key]}") {{tx[ref.key] || 'NA'}}
              v-chip(small :color="tx.typeColor" text-color="white"
                v-else-if="'TransactionType'===ref.key") {{tx[ref.key]}}
              router-link(v-else-if="['Account', 'Destination'].includes(ref.key)" :to="{name: 'rpc-tool', query: {address: tx[ref.key]}}") {{tx[ref.key]}}
              coin(v-else :coin="tx[ref.key]" text :convert-native="true")
        v-col(cols="6" md="6")
          .inf(v-for="(ref, index) in txKeys" :key="index"
            v-if="index > 4")
              span.key {{ref.title}}:
              span.val
                span(v-if="'TransactionResult' == ref.key") {{tx['metaData'][ref.key]}}
                span(v-else-if="!['Fee', 'Amount', 'TransactionResult'].includes(ref.key) || !tx[ref.key]"
                  :class="{na: !tx[ref.key]}") {{tx[ref.key] || 'NA'}}
                coin(v-else :coin="tx[ref.key]" text :convert-native="true")
          .inf(v-if="tx.TakerGets")
            span.key Buy/Sell
            .val
              coin(:coin="tx.TakerGets" text :convert-native="true")
              | &nbsp;/&nbsp;
              coin(:coin="tx.TakerPays" text :convert-native="true")

//- template start here
v-container.container-ledger
  h2.cat_ttl
    | Ledger/
    router-link(:to="{name: 'rpc-tool', query: {address: ledgerId}}") {{ledgerId}}
  //- summary
  v-card.summary
    v-card-title.headline Summary
    v-divider
    v-container
      loading-guard(:pending="pending")
      +summary()
  //- transactions
  h2.cat_ttl Transactions
  v-container.pl-0.pr-0.pt-0
    v-card.pd-0.opa-0
      loading-guard(:pending="pending" style="background: #fff;box-shadow: var(--boxShadow1)")
      +txs()
</template>

<script>
import ws from '@/lib/ws'
import Utils from '@/lib/utils'
import coin from '@/components/coin'
import loadingGuard from '@/components/loading-guard'

const summaryKeyMap = () => {
  return [
    {key: 'ledger_index', title: `Index`},
    {key: 'transactions', title: `Tx Count`},
    {key: 'close_time_resolution', title: `Resolution`},
    {key: 'close_flags', title: `Flags`},
    {key: 'totalCoinsVBC', title: `Total VBC`},
    {key: 'totalCoins', title: `Total VRP`},
    {key: 'close_time_human', title: `Time`},
    {key: 'close_time', title: `Parent Time`},
    {key: 'hash', title: `Hash`},
    {key: 'account_hash', title: `Account Hash`},
    {key: 'parent_hash', title: `Parent Hash`},
    {key: 'transaction_hash', title: `Transaction Hash`}
  ]
}

const txKeyMap = () => {
  return [
    {key: 'TransactionType', title: `Transaction Type`},
    {key: 'Account', title: `Account`},
    {key: 'Destination', title: `Destination`},
    {key: 'Fee', title: `Fee`},
    {key: 'Amount', title: `Amount`},
    {key: 'TransactionResult', title: `Transaction Result`},
    {key: 'Sequence', title: `Sequence`},
    {key: 'Flags', title: `Flags`},
    {key: 'LastLedgerSequence', title: `LastLedger Sequence`},
  ]
}
const txTypeColors = {
  'OfferCancel': 'green',
  'OfferCreate': 'green',
  'Payment': 'primary'
}

export default {
  components: {coin, loadingGuard},
  data () {
    return {
      summary: summaryKeyMap(),
      txs: [],
      pending: false
    }
  },
  computed: {
    ledgerId () {
      return this.$route.params.id
    },
    txKeys () {
      return txKeyMap()
    },
    empty () {
      return !this.txs.length
    }
  },
  methods: {
    fetchLedger () {
      this.pending = true
      let params = Utils.getSendParam('ledger', {addr: this.ledgerId, expand: true}, true)
      ws.send(params, res => {
        this.pending = false
        this.summary.forEach(ref => {
          ref.val = ref.key === 'transactions' ? res.ledger[ref.key].length : res.ledger[ref.key]
        })
        this.txs = res.ledger.transactions.map(tx => {
          return {
            ...tx,
            expand: true,
            typeColor: txTypeColors[tx.TransactionType]
          }
        })
      })
    }
  },
  mounted () {
    this.fetchLedger()
  }
}
</script>

<style lang="postcss">
html[view="ledgers"] {
  & .container-ledger {
    padding-bottom: 2.5rem;
  }
}
.v-card {
  &.opa-0 {background-color: transparent!important;box-shadow: none!important}
  & > .container {padding: 1rem}
}
.container-ledger {
  & .summary, & .txs {
    & .inf {
      display:flex; justify-content: space-between;align-items: center;font-size: 1rem; font-weight: normal;
      & .key {font-size: .875rem;color: rgba(0, 0, 0, .38);}
      & .val {
        color: #333;font-size: small;font-weight: 500;
        & .na {color:var(--txt4)}
      }
    }
  }
  & .summary {
    & .inf {
      white-space: nowrap;overflow: hidden;
      & .key {font-size: .625rem;}
    }

  }
  & .txs {
    &.v-card + .v-card {margin-top: 1rem}
    & .v-card__title {padding: .5rem 1rem;font-size: 16px; font-weight: normal;}
    /* & .v-chip {color: rgba(255, 255, 255, .9)} */
  }
}
</style>
