import BN from '@/lib/bn'

const precisionMax = 15
const invalid = (attr) => [undefined, null, '', true, false].includes(attr)
const isTrue = (attr) => ![undefined, null, false, 'false'].includes(attr)

const pretty = ({amount, round = 'ROUND_HALF_EVEN', precision = 2, def = '', lite, fixed = null, noformat = false} = {}, el) => {
  // no value
  if (invalid(amount)) return def
  precision = +precision
  if (invalid(amount)) amount = +amount
  if (amount === 0) return amount
  // native must division ratio
  let amnt = new BN(amount)
  const roundNo = BN[round]
  if (isTrue(fixed)) fixed = 'fixed'
  const getStr = (_amnt, _precision) => _amnt[isTrue(noformat) ? 'toString' : 'toFormat'](_precision, roundNo, fixed)
  let str = getStr(amnt, precision)
  const roundedEqualTo0 = new BN(str).cmp(0) === 0
  // ignore rounded failed
  if (roundedEqualTo0) {
    // Try more decimal place until to max
    let [expanedPrecision, expanedEqualTo0] = [precision, roundedEqualTo0]
    while (expanedEqualTo0 && expanedPrecision <= precisionMax) {
      str = getStr(amnt, ++expanedPrecision)
      expanedEqualTo0 = new BN(str).cmp(0) === 0
    }
    if (expanedEqualTo0) str = amnt.toString()
  }
  // return string if in calls
  if (!el && !isTrue(lite)) return str
  // pretty with unit
  let unit = ''
  if (!roundedEqualTo0 && isTrue(lite)) {
    const tmp = amnt.toNumber(0, roundNo)
    const len = tmp.toString().length
    let litePrecision = 2
    if (len < 2) { // 1.1234 > 1.123
      litePrecision = 3
    } else if (len < 3) { // 12.1234 > 12.12
      litePrecision = 2
    } else if (len < 4) { // 123.1234 > 123.1
      litePrecision = 1
    } else if (len < 5) { // 1234.1234 > 1234
      litePrecision = 0
    } else if (len < 7) { // 12345.1234 > 12.3K
      litePrecision = 1
      if (len === 6) litePrecision = 0
      amnt = amnt.div(1000)
      unit = 'K'
    } else {
      amnt = amnt.div(1000000)
      unit = 'M'
    }
    str = amnt.toFormat(litePrecision, roundNo, fixed)
    if (lite === 'lower') unit = unit.toLowerCase()
  }
  // empty pretty
  if (el) {
    let [int, dec] = str.split('.')
    if (int >= 0) int = `<span class="int">${int}</span>`
    dec =  (!dec || precision === 0) ? '' : `<span class="dec">.${dec.replace(/(0+)$/, '<span class="zero">$1</span>')}</span>`
    str = int + dec + (unit ? `<span class="unit">${unit}</span>` : '')
  } else if (unit) {
    str += unit
  }
  return str || def
}

// convert for currency's rate
const convRate = (src, dest) => {
  if (!src || !dest) return
  const rate = dest.rate || dest || 1
  let amnt = src.amount || src.amnt
  return new BN(amnt).div(rate).toString()
}

export {pretty as default, invalid, convRate}
