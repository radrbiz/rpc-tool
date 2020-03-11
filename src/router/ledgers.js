import ledgers from '@/views/ledgers'

export default {
  path: '/ledgers',
  name: 'ledgers',
  meta: {
    title: `Ledgers`,
    icon: 'list_alt',
    requireAuth: false,
    scrollToTop: true
  },
  component: ledgers
}
