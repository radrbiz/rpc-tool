<template lang="pug">
//- css attrs: (code|ori|text|lite|)
i.coin(
  :code="attrs.code"
  :ori="attrs.ori"
  :text="attrs.text"
  :lite="attrs.lite"
  :class="[stat, {sameint: req.sameint}, {padint: req.padint}]"
  v-html="amnt")
</template>

<script>
import prettyCoin, {invalid} from '@/lib/format-coin'

const nativeRatio = 1000000.0
const isNative = currency => ['VBC', 'VRP'].includes(currency)

const pretty = ({...opts}, el) => {
  if (invalid(opts.precision)) {
    const coin = {}
    opts.precision = coin.precision || 6
  }
  return prettyCoin(opts, el)
}

export default {
  props: {
    convertNative: Boolean,
    showgw: [Object, String],
    coin: [Object, Number, String],
    text: [Boolean, String],
    noratio: [Boolean, String],
    lite: [Boolean, String],
    ori: [Boolean, String],
    def: String,
    fixed: {type: [Boolean, String], default: false},
    precision: [Number, String],
    round: String,
    state: [Boolean, String],
    pair: [Boolean],
    currTitle: [Boolean],
    suffix: {type: String, default: ''},
    hideSuffix: {type: Boolean, default: false},
    prevent: {type: Boolean, default: false}
  },
  computed: {
    coinObj () {
      if (typeof this.coin === 'object') return this.coin
      return {amount: this.coin}
    },
    req () {
      const attrs = Object.assign({}, this.$options.propsData)
      delete attrs.coin
      let {amount, value, currency} = this.coinObj
      if (typeof amount === 'undefined' && typeof value !== 'undefined') amount = value
      // Native must division ratio
      if (this.convertNative && (!currency || isNative(currency))) {
        amount = amount / nativeRatio
      }
      return Object.assign({}, this.coinObj, attrs, {amount})
    },
    gateway () {
      const gw = ['', 'showgw'].includes(this.showgw) ? this.coinObj : this.showgw
      if (!gw) return
      if (typeof gw === 'string') return gw
      // Built-In gateway no need to show
      if (gw.gw || gw.gateway) return
      return gw.issuer
    },
    attrs () {
      const coin = this.coinObj || {}
      let code = (this.currTitle && coin.title) || coin.currency || coin.curr || coin.coin || 'VRP'
      if (!this.hideSuffix && (this.suffix || coin.suffix)) code += this.suffix || coin.suffix
      return {
        ...this.req,
        code
      }
    },
    stat () {
      if (![undefined, false, null].includes(this.state)) {
        if ([0, '0', ''].includes(this.req.amount)) return ''
        return this.req.amount < 0 ? 'loss' : 'gain'
      }
      return this.state
    },
    amnt () {
      let amnt = pretty(this.req, 'element')
      if (this.gateway) {
        amnt += `<span class="gw">${this.gateway}</span>`
      }
      if (this.req.padint) {
        amnt = amnt.replace(/(class="int")/, `$1 padint="${this.req.padint}"`)
      }
      return amnt
    }
  },
  methods: {
  }
}
</script>
<style lang="postcss">
.coin {
  line-height:normal;white-space: nowrap;
  &::before {content:'';display: inline-block;width: 1em;line-height: 1em;text-align: center;font-weight: normal;font-style: normal}
  & .dec {font-size: smaller; opacity: .65;font-style: normal;}

  /* use text instead of icon */
  &[text] {
    &::after {content:attr(code);position: relative;display: inline-block;font-size: 85%;font-weight: normal;margin-left: .25em;opacity:.8}
    &::before {display: none;}
    &.gain::before {content:'+';display: inline;margin: 0;color:currentColor}
  }

  /* no unit */
  &[ori]::after,
  &[ori]::before {display: none;}

  /* natives */
  &[code]::before {content:''}

  /* crypto */
  &[code='BCH']::before {font-family: cryptocoins;content: '\E01D'; color: #F7931A}
  &[code='BTC']::before {font-family: cryptocoins;content: '\E02D'; color: #F7931A}
  &[code='EOS']::before {font-family: cryptocoins;content: '\E054'; color: #19191A}
  &[code='ETH']::before {font-family: cryptocoins;content: '\E059'; color: #282828}
  &[code='LTC']::before {font-family: cryptocoins;content: '\E09A'; color: #838383}
  &[code='USDT']::before {font-family: cryptocoins;content:'\E119';color: #2CA07A}
  &[code='USDT']::after {font-size:65%;}
  &[code='XRP']::before {font-family: cryptocoins;content:'\E13A';color: #346AA9}
  /* fiat */
  &[code='USD']::before,
  &[code='HKD']::before,
  &[code='TWD']::before,
  &[code='SGD']::before {font-family: FontAwesome;content: '$';color: #1a6834}
  &[code='JPY']::before {font-family: FontAwesome;content:'\f157';}
  &[code='MYR']::before {font-family: FontAwesome;content:'RM';white-space:nowrap;font-size: smaller;color:#71649B}
  &[code='GBP']::before {font-family: FontAwesome;content: '£';color: #8A3F69;}
  &[code='EUR']::before {font-family: FontAwesome;content: '€';color: Purple;}
  &[code='RUB']::before {font-family: FontAwesome;content:'\f158';}
  /* prototype character */
  &[code='CNY']::before {font-family: FontAwesome;content:'¥';color: #b01e2e}
  &[code='PHP']::before {font-family: FontAwesome;content:'\20b1'}

  /* normal text take more padding-left */
  &:not(:empty)::before {margin-right:.1em;}
  &:empty:not([text]) {
    &::after {display: none;}
  }

  & > .zero {opacity: .6;}
  /* Natives */
.coin[code='VRP'],
.cryptocoins-VRP {
  &::before {font-family: Radr;content:'\e800';color: #00ff93}
}
.coin[code='VBC'],
.cryptocoins-VBC {
  &::before {font-family: Radr;content:'\e800';color: #296dfb}
}

b.coin {
  display:inline-flex;justify-content:center;align-items:center;align-content:center;font-weight: 600;
}
}
</style>
