import type { RouterConfig, RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  routes: () => {
    const { ssrContext } = useNuxtApp()
    const subdomain = useSubdomain()
    if (ssrContext?.event.context.subdomain) {
      subdomain.value = ssrContext.event.context.subdomain
    }

    console.log('Subdomain:', subdomain.value)
    if (subdomain.value) {
      return [{
        name: 'userroute',
        path: '/',
        component: () => import('~/components/Ask/Main.vue'),
        props: {
          username: subdomain.value,
        },
      }]
    }
  },
} satisfies RouterConfig
