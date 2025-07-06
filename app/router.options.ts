import type { RouterConfig, RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  routes: () => {
    const { ssrContext } = useNuxtApp()
    const username = useUsername()
    if (ssrContext?.event.context.username) {
      username.value = ssrContext.event.context.username
    }

    if (username.value) {
      const design = ssrContext?.event.context.design || 'default'
      return [{
        name: 'userroute',
        path: '/',
        component: () => import(`~/components/profile/${design}/Main.vue`),
        props: {
          username: username.value,
        },
      }, {
        name: 'userroute-imprint',
        path: '/impressum',
        component: () => import(`~/components/profile/${design}/Imprint.vue`),
        props: {
          username: username.value,
        },
      }, {
        name: 'userroute-privacy',
        path: '/datenschutz',
        component: () => import(`~/components/profile/${design}/Privacy.vue`),
        props: {
          username: username.value,
        },
      }]
    }
  },
} satisfies RouterConfig
