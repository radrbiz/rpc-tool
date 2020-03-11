import infs from '@/views/basicInfo'

export default {
  path: '/server-info',
  name: 'server-info',
  meta: {
    title: `Server Info`,
    icon: 'dvr',
    requireAuth: false,
    scrollToTop: true
  },
  component: infs
}
