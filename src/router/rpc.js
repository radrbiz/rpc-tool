import rpc from '@/views/rpc'

export default {
  path: '/rpc',
  name: 'rpc-tool',
  meta: {
    title: `RPC Tool`,
    icon: 'polymer',
    requireAuth: false,
    scrollToTop: true
  },
  component: rpc
}
