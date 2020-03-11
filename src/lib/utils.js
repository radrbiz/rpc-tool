const sendParaMap = {
  ledger: {transactions: true, active_account: false, dividend: false, full: false}
}

const Utils = {}

Utils.view = routerORcomponent => {
  const current = routerORcomponent.$route || (routerORcomponent.history ? routerORcomponent.history.current : routerORcomponent)
  // use self
  let {name, meta} = current
  // or use parent root
  const parent = current.matched[0]
  if (parent) {
    if (!name) name = parent.name
    if (meta) {
      // if (meta.inherit) {}
      meta = meta.inherit ? Object.assign({}, meta, parent.meta) : Object.assign({}, parent.meta, meta)
      if (!meta.title) meta.title = name
    }
    // Force specific parent's name & title
    let parentCmp = parent.components.default
    if (parentCmp) {
      if (parentCmp.name) name = parentCmp.name
    }
  }
  return {name, meta}
}
Utils.getSendParam = (command, opts, exParams) => {
  if (!command) return
  let para = {command}, addr = opts.addr || opts.address || opts.id || ''
  if (command.startsWith('account_')) {
    Object.assign(para, {account: addr})
  } else if (command === 'tx') {
    Object.assign(para, {transaction: addr})
  } else if (command === 'ledger') {
    Object.assign(para, {ledger_index: parseInt(addr), ...opts})
  }
  return Object.assign({}, exParams === true && sendParaMap[command] || {}, para)
}

export {Utils as default}
