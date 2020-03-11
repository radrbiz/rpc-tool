import ledger from '@/views/ledger'
export default {
  path: '/ledger/:id',
  name: 'ledger',
  meta: {
    title: `Ledger`,
    icon: 'list_alt',
    requireAuth: false,
    scrollToTop: true
  },
  component: ledger
}
