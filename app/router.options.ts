import type { RouterConfig, RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  routes: () => {
    const { ssrContext } = useNuxtApp()
    const username = useUsername()
    if (ssrContext?.event.context.username) {
      username.value = ssrContext.event.context.username
    }

    if (username.value) {
      return [{
        name: 'userroute',
        path: '/',
        component: () => import('~/components/Ask/Main.vue'),
        props: {
          username: username.value,
        },
      }, {
        name: 'userroute-imprint',
        path: '/impressum',
        component: () => import('~/components/Ask/Imprint.vue'),
        props: {
          username: username.value,
        },
      }, {
        name: 'userroute-privacy',
        path: '/datenschutz',
        component: () => import('~/components/Ask/Privacy.vue'),
        props: {
          username: username.value,
        },
      }]
    }
  },
} satisfies RouterConfig
