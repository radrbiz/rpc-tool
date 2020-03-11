import wsSeq from '@/lib/ws-seq'

const wsUriKey = 'wsUrl'
const wsUri = {
  val: sessionStorage.getItem(wsUriKey) || process.env.VUE_APP_WS,
  update: (v) => {
    sessionStorage.setItem(wsUriKey, v)
    location.reload()
  },
  reset: () => {
    sessionStorage.removeItem(wsUriKey)
    location.reload()
  }
}
let serv = {firstOpen: false}
const ws = new wsSeq({uri: wsUri.val})
const Subscribed = new Map()
// ws.state = 'connecting'

ws.on('open', () => {
  const firstOpened = serv.firstOpened
  if (!firstOpened) {
    serv.firstOpened = true
    // Always send ping when first open for testing
    // setTimeout(() => serv.ws.send(ping), 10000)
  } else {
    Subscribed.forEach(v => ws.send(v.msg))
  }
  window.dispatchEvent(new CustomEvent('ws-state', {detail: 'connected'}))

  if (firstOpened) window.dispatchEvent(new CustomEvent('ws-state', {detail: 'reconnected'}))
})
ws.on('close', () => {
  window.dispatchEvent(new CustomEvent('ws-state', {detail: 'disconnected'}))
})
ws.on('error', () => {
  window.dispatchEvent(new CustomEvent('ws-state', {detail: 'connectionerror'}))
})
ws.on('message', msg => {
  if (msg && msg.id) return
  let {message_type} = msg
  if (message_type === 'ledger_expand') {
    // subscribe ledger
    // store.dispatch('LEDGER_MSGS', msg.data)
    window.dispatchEvent(new CustomEvent('ws-ledger', {detail: msg.data}))
  }
})

const wsStat = () => {
}

const wsSubscribe = (req) => {
  const {type} = req
  const msg = {command: 'subscribe'}
  const key = [type].filter(s => s).join('-')
  switch (type) {
    case 'ledger':
      Object.assign(msg, {
        types: ['ledger_expand']
      })
      break
  }
  const cache = Subscribed.get(key)
  if (cache) {
    // subscribed by more than once
    if (cache.times > 0) {
      cache.times++
      return
    }
    Subscribed.delete(key)
  }
  // Record cmd, msg, and Subscribed times
  Subscribed.set(key, {times: 1, req, msg})
  ws.send(msg)
}

export {ws as default, wsStat, wsSubscribe, wsUri}

