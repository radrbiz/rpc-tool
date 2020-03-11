import ws, {wsSubscribe} from '@/lib/ws'

const lsKey = 'ledgers'
const showLen = 20
const cacheLen = 30
const def = () => {
  const state = {
    pendingIdDebounce: new Set(),
    latestLedgerId: 0,
    showLen,
    /*
      [
        0: ledger_index,
        1: ledger_hash,
        2:  totalCoinsVBC,
        3: totalCoins,
        4: tx_count: ref.transactions.length,
        5: close_time: close_time_human
      ]
      */
    ledgers: JSON.parse(localStorage.getItem(lsKey) || '[]')
  }
  return state
}

const Inited = {listen: false, promise: null}

export default {
  state: def(),
  mutations: {
    LEDGER_LATESTID (state, latestLedgerIdx) {
      if (state.latestLedgerId < latestLedgerIdx) state.latestLedgerId = latestLedgerIdx
    },
    LEDGER_ADD2 (state, ledger) {
      const newId = +ledger[0]
      if (!state.ledgers.length) {
        state.ledgers.unshift(ledger)
      } else {
        // clear expired data
        const oldestId = newId - showLen
        if (oldestId > +state.ledgers[0][0]) state.ledgers.length = 0
        state.ledgers.some((ref, i) => {
          const ledgerId = +ref[0]
          const nextId = (state.ledgers[i + 1] || [])[0]
          if ( newId > ledgerId) {
            if (i > 0) {
              state.ledgers.splice(i - 1, ledger)
            } else {
              state.ledgers.unshift(ledger)
            }
            return true
          } else if (newId < ledgerId && (!nextId || newId > nextId)) {
            state.ledgers.splice(i + 1, 0, ledger)
            return true
          } else if (newId === ledgerId) {
            return true
          }
        })
      }
      if (state.ledgers.length > cacheLen) state.ledgers.length = cacheLen
      localStorage.setItem(lsKey, JSON.stringify(state.ledgers))
    }
  },
  actions: {
    /* change commit actions */
    LEDGER_ADD ({commit}, ledger) {
      const {ledger_index, ledger_hash, totalCoinsVBC, totalCoins, transactions, close_time_human} = ledger

      commit('LEDGER_ADD2', [ledger_index, transactions.length, totalCoinsVBC, totalCoins, close_time_human, ledger_hash, true])
    },
    LEDGER_LATEST_UPDATE ({commit}, ledger) {
      const {ledger_index} = ledger
      commit('LEDGER_LATESTID', ledger_index)
    },
    /* fetch actions */
    // get ledger by Id
    LEDGER_GET ({state, dispatch}, {ledgerId, add = false}) {
      return new Promise(resolve => {
        let retryNotValidated = 5
        const req = (force) => {
          if (!force && state.pendingIdDebounce.has(ledgerId)) return resolve()
          state.pendingIdDebounce.add(ledgerId)
          ws.send({ledger_index: ledgerId, command: 'ledger', transactions: true}, res => {
            if (!res.validated && retryNotValidated) {
              retryNotValidated--
              return setTimeout(() => req(true), 1000)
            }
            state.pendingIdDebounce.delete(ledgerId)
            if (add) dispatch('LEDGER_ADD', res.ledger)
            resolve(res)
          })
        }
        req()
      })
    },
    // get latest ledger's Id
    LEDGER_GET_LATESTID ({state, commit, dispatch}, getInfo = false) {
      return new Promise(resolve => {
        ws.send({command: 'ledger_closed'}, res => {
          const ledgerId = +(res.ledger_current_index || res.ledger_index)
          if (state.latestLedgerId == ledgerId) {
            return resolve(ledgerId)
          }
          commit('LEDGER_LATESTID', ledgerId)
          if (getInfo) {
           dispatch('LEDGER_GET', {ledgerId}).then(info => {
             resolve(info)
           })
          }
          resolve(ledgerId)
        })
      })
    },
    // get all ledgers
    LEDGER_GETALL({dispatch, state, getters}) {
      // Step.1: get latest LedgerId
      dispatch('LEDGER_GET_LATESTID').then(latestId => {
        // Step2: getAll cacheLens ledger

        const todoList = []
        for (let ledgerId = latestId, oldestId = latestId - 20; ledgerId >= oldestId; ledgerId--) {
          if (state.pendingIdDebounce.has(ledgerId) || getters.LEDGER_HAS(ledgerId)) continue
          todoList.push(ledgerId)
          dispatch('LEDGER_GET', {ledgerId, add: true})
        }
      })
    },
    // listener on getting ws msg 'ws-ledger', 'ws-reconnect'
    LEDGER_LISTEN ({dispatch, state}) {
      if (!Inited.promise) {
        Inited.promise = new Promise((resolve) => {
          wsSubscribe({type: 'ledger'})
          // add listener
          window.addEventListener('ws-ledger', e => {
            dispatch('LEDGER_ADD', e.detail)
            dispatch('LEDGER_LATEST_UPDATE', e.detail)
          })
          // add reconnect listner
          window.addEventListener('ws-state', e => {
            if (e.detail === 'reconnected') dispatch('LEDGER_GETALL')
          })
          resolve(state)
        })
      }
      return Inited.promise
    }
  },
  getters: {
    LEDGER_HAS (state) {
      return ledgerId => {
        return state.ledgers.some(ref => +ref[0] === +ledgerId)
      }
    },
    LEDGER_SHOW (state) {
      return state.ledgers.filter((ref, i) => i < state.showLen)
    }
  }
}
