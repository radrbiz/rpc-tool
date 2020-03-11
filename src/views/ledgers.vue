<template lang="pug">
v-container.container-ledgers
  h2.cat_ttl Recent Ledgers
  v-card
    v-card-text
      v-simple-table(light fixed-header class="tbl1" height="1000")
        template(v-slot:default)
          thead
            tr
              th(v-for="(hd, index) in headers" :class="[hd.value, hd.align]") {{hd.text}}
          transition-group(tag="tbody" enter-class="animation")
            tr(v-for="(ledger, idx) in ledgers" :class="{newer: ledger[6], even: ledger[0] % 2 === 0}" :key="ledger[0]")
              td(v-for="(hd, idx2) in headers" :class="[hd.value, hd.align]")
                router-link(v-if="idx2 === 0" :to="{name: 'ledger', params: {id: ledger[idx2]}}") {{ledger[idx2]}}
                coin(v-else-if="[2].includes(idx2)" :coin="{currency: 'VBC', amount: ledger[idx2]}" :convert-native="true")
                coin(v-else-if="[3].includes(idx2)" :coin="{currency: 'VRP', amount: ledger[idx2]}" :convert-native="true")
                span(v-else :class="[hd.value]") {{ledger[idx2]}}
</template>

<script>
import coin from '@/components/coin'
import {mapGetters} from 'vuex'

const colsMap = [
  {value: 'idx', text: `Ledger Index`, align: 'text-left'},
  {value: 'num', text: `TX Count`, align: 'text-center'},
  {value: 'amnt', text: `Total VBC`, align: 'text-right'},
  {value: 'amnt', text: `Total VRP`, align: 'text-right'},
  {value: 'time', text: `Close Time(UTC)`, align: 'text-right'},
  {value: 'hash', text: `Ledger Hash`}
]

export default {
  components: {coin},
  computed: {
    ...mapGetters({ledgers: 'LEDGER_SHOW'}),
    headers () {
      return colsMap
    }
  },
  methods: {
    getLegers() {
      this.$store.dispatch('LEDGER_GETALL')
    }
  },
  created () {
    this.getLegers()
  }
}
</script>

<style lang="postcss">
:root {
  --tblLiteFont: calc(1.4rem / var(--dppx));
  --tblFWidth: calc(12rem / var(--dppx));
}
@media (max-width: 1024px) {
  :root {
    --tblLiteFont: calc(1.6rem / var(--dppx));
    --tblFWidth: calc(9rem / var(--dppx));
  }
}
html[view="ledgers"] {
  & .Footer > .container,
  & .container-ledgers {
    max-width: none;
  }
}

.tbl1 {
  & > .v-data-table__wrapper {overflow-y: hidden;}
  & thead {
    & th {
    font-weight: 500;white-space: nowrap!important;}
  }
  & tbody {
    /* & tr */
    & tr {
      &.even {background-color: #f7faff}
      /* &:nth-child(even) {background-color: #f7faff} */
      &:hover:not(.v-data-table__empty-wrapper) {background-color: #f7f7f7!important;}
      &.newer {
        transition: height .3s, transform .3s, opacity .3s; will-change: height, transform;transform-origin: top;opacity: 1;
        &.animation {height: 0; transform: scale3D(1, 0)}
        &.animation {opacity: 0}
      }
    }
    & th,
    & td {
      & > span, & > i {font-size: .8125rem;}
      &.hash {text-align: left;font-size: small}
    }
    & span {
      &.num {min-width: 2em}
      &.amnt {min-width: 5em}
      &.time {white-space: nowrap;flex-grow:0;flex-basis:auto;width:var(--tblFWidth)}
    }
  }
}
</style>
