import rpc from '@/views/settings'

export default {
  path: '/settings',
  name: 'settings',
  meta: {
    title: `Settings`,
    icon: 'settings',
    requireAuth: false,
    scrollToTop: true
  },
  component: rpc
}
