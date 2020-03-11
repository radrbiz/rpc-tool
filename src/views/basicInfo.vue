<template lang="pug">
v-container.container-server-info
  v-row(justify="center")
    v-col(cols="12")
      v-card(outlined)
        v-card-title.headline Server Info
        v-divider
        loading-guard(:pending="pending" center)
        v-container(v-if="!pending")
          v-row.inf(v-for="info in serverInfo" :key="info.key")
            v-col.key(cols="5" xs="12" sm="5" md="3" lg="2") {{info.title}}
            v-col.val(cols="7" xs="12" sm="7" md="9" lg="10")
              //- address
              span(v-if="info.key == 'server_address'") {{wsUrl}}
              //- complete ledger
              span(v-else-if="info.key === 'complete_ledgers'") {{`${info.val} - ${lastLedger}`}}
              //- validate ledger
              span(v-else-if="info.key === 'validated_ledger'") {{lastLedger}}
              //- state accounting
              span.inf.inline(v-else-if="info.key === 'state_accounting'" v-for="(inf, key) in info.val")
                span.key {{`${key}:`}}
                span.val {{`${inf.rate}%`}}
              //- others
              span(v-else) {{info.val}}
</template>

<script>
import loadingGuard from '@/components/loading-guard'
import ws, {wsUri} from '@/lib/ws'

const keyMap = [
  {key: 'server_address', title: `Server Address`, val: ''},
  {key: 'build_version', title: `Build Version`, val: ''},
  {key: 'complete_ledgers', title: `Complete Ledgers`, val: ''},
  {key: 'io_latency_ms', title: `IO Latency(ms)`, val: ''},
  {key: 'peers', title: `Peers`, val: ''},
  {key: 'server_state', title: `Server State`, val: ''},
  {key: 'uptime', title: `Uptime`, val: ''},
  {key: 'validated_ledger', title: `Validated Ledger`, val: ''},
  {key: 'validation_quorum', title: `Validation Quorum`, val: ''},
  {key: 'pubkey_node', title: `Pubkey Node`, val: ''},
  {key: 'state_accounting', title: `State Accounting`, val: ''}
]

export default {
  components: {loadingGuard},
  data: function () {
    return {
      serverInfo: [],
      serverInfoLedgerNo: 0,
      pending: false
    }
  },
  computed: {
    lastLedger () {
      return Math.max(this.$store.state.ledger.latestLedgerId, this.serverInfoLedgerNo)
    },
    wsUrl () {
      return wsUri.val
    }
  },
  methods: {
    fetchServerInf () {
      this.pending = true
      ws.send({command: 'server_info'}, res => {
        this.pending = false
        res = res.info || {}
        this.serverInfo = keyMap.map(ref => {
          let val = res[ref.key]
          switch (ref.key) {
            case 'complete_ledgers':
              val = val.split('-')[0]
              break
            case 'server_address':
              val = ref.val
              break
            case 'validated_ledger':
              this.serverInfoLedgerNo = val = val.seq
              break
            case 'state_accounting': {
              let sum = 0
              for (let key in val) sum += +val[key].duration_us
              for (let key in val) {
                val[key].rate = (100 * val[key].duration_us / sum).toFixed(2)
              }
              break
            }
            default:
              if (typeof val === 'object') val = JSON.stringify(val)
              break
          }
          return {...ref, val}
        })
      })
    }
  },
  mounted () {
    this.fetchServerInf()
    this.$store.dispatch('LEDGER_LISTEN')
  }
}
</script>

<style lang="postcss">
html[view="server-info"] {
  & .container-server-info {
    padding-top: 2.5rem ;padding-bottom: 2rem
  }
}
.container-server-info {
  & .v-card {
    min-height: 600px;
    & .inf {
      flex-direction: row;align-content:flex-start;min-height:0 !important;
      &:not(:last-child) {border-bottom: 1px dashed rgba(73, 136, 255, .15)}
      & .inf {border-color: transparent}
      &.inline {
        display: inline-block;
        & > span {margin-right: .15rem;}
        &+.inf {margin-left: .25rem}
      }
      & .key , & .val {text-align: left}
      & .key {color: rgba(0, 0, 0, .58)}
      & .val {word-break: break-all;color: #333;
        & a {color: #1d8ce0}
      }
    }
  }
}
.viewDesktop {
  & .server-info {
    & .inf {
      display: flex; flex-direction: row; justify-content: flex-start;
      & > .key {min-width: 150px;}
    }
  }
}
</style>
