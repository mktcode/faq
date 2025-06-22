import type { RouterConfig, RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  routes: () => {
    const { ssrContext } = useNuxtApp()
    const subdomain = useSubdomain()
    if (ssrContext?.event.context.subdomain) {
      subdomain.value = ssrContext.event.context.subdomain
    }

    if (subdomain.value) {
      return [{
        name: 'userroute',
        path: '/',
        component: () => import('~/components/Ask/Main.vue'),
        props: {
          username: subdomain.value,
        },
      }, {
        name: 'userroute-imprint',
        path: '/impressum',
        component: () => import('~/components/Ask/Imprint.vue'),
        props: {
          username: subdomain.value,
        },
      }, {
        name: 'userroute-privacy',
        path: '/datenschutz',
        component: () => import('~/components/Ask/Privacy.vue'),
        props: {
          username: subdomain.value,
        },
      }]
    }
  },
} satisfies RouterConfig
