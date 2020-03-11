import BigNumber from 'bignumber.js'

const unexpected = [undefined, null, NaN, Infinity, 'NaN', 'Infinity', '']

const removeIdle = str => {
  return Number(str) === 0 ? '0' : str.replace(/^([+-]?)([\d,]+\.\d*?)0+$/, '$1$2').replace(/\.$/, '')
}

const unify = {
  res (res) {return unexpected.includes(res) ? '' : res},
  req (...args) {
    if (typeof args[0] === 'string') args[0] = args[0].replace(/,/g, '')
    if (unexpected.includes(args[0])) args[0] = 0
    return args
  }
}

class BN extends BigNumber {
  constructor (...args) {
    super(...unify.req(...args))
  }

  // algorithm
  plus (...args) {
    const unified = unify.req(...args)
    return !unexpected.includes(unified[0]) ? new BN(super.plus(...unified)) : new BN(super.times(1))
  }
  minus (...args) {
    const unified = unify.req(...args)
    return !unexpected.includes(unified[0]) ? new BN(super.minus(unified)) : new BN(super.times(1))
  }
  times (...args) { return new BN(super.times(...unify.req(...args))) }
  div (...args) { return new BN(super.div(...unify.req(...args))) }
  cmp (...args) { return super.comparedTo(...unify.req(...args)) }

  //format
  toString (precision, roundType) {
    return isNaN(precision) ? super.toString(10) : super.decimalPlaces(precision, BN[roundType]).toString(10)
  }
  toFormat (...args) {
    let isFixed = args.includes('fixed')
    if (isFixed) args.pop()
    const argLen = args.length
    const lastArg = args[argLen - 1]
    if (argLen > 1 && typeof lastArg === 'string') args[argLen - 1] = BN[lastArg]
    let res = super.toFormat(...args)
    if (!isFixed) res = removeIdle(res)
    return unify.res(res)
  }
}

BN.config({
  EXPONENTIAL_AT: [-1e+9, 1e+9],
  ERRORS: false
})
if (typeof window === 'object') window.BN = BN

export default BN
