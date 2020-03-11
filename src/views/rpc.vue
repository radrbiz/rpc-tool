<template lang="pug">
v-container.container-rpc
  h2.cat_ttl.pb-0 RPC Tool
  rpc-query(:req.sync="req")
  v-row
    //- account
    template(v-if="reqType === 'account'")
      v-col(cols="12")
        rpc-call(mode="account_info" :addr="req.addr")
      v-col(cols="12")
        rpc-call(mode="account_lines" :addr="req.addr" :deep="2")
      v-col(cols="12")
        rpc-call(mode="account_offers" :addr="req.addr" :deep="2")
      v-col(cols="12")
        rpc-call(mode="account_tx" :addr="req.addr" :deep="2")
    //- ledger
    v-col(v-else-if="reqType === 'ledger'")
      rpc-call(mode="ledger" :addr="req.addr" :opts="{expand: req.expand}")
    //- hash
    v-col(v-else-if="reqType === 'hash'")
      rpc-call(mode="tx" :addr="req.addr")
</template>

<script>
import rpcQuery from '@/components/rpc-query'
import rpcCall from '@/components/rpc-call'

const addrTypeMap = { 8: 'ledger', 34: 'account', 64: 'hash'}

export default {
  components: {rpcQuery, rpcCall},
  data () {
    return {
      req: { addr: '', expand: false}
    }
  },
  computed: {
    reqType () {
      return addrTypeMap[this.req.addr && this.req.addr.length]
    }
  },
  created () {
    const {address, expand} = this.$route.query
    Object.assign(this.req, {addr: address, expand})
  }
}
</script>
<style lang="postcss">
html[view="rpc-tool"] {
  & .container-rpc {padding-bottom: 2.5rem}
}
</style>
