import type { RouterConfig, RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  routes: () => {
    const { ssrContext } = useNuxtApp()
    const { username, isSubscribed, design } = useProfile()

    if (ssrContext?.event.context.profile) {
      username.value = ssrContext.event.context.profile.username
      isSubscribed.value = ssrContext.event.context.profile.isSubscribed // consider refactoring this to a middleware, this file should maybe only deal with routing
      design.value = ssrContext.event.context.profile.design
    }

    if (username.value) {
      return [{
        name: 'userroute',
        path: '/',
        component: () => import(`~/components/profile/${design.value}/Main.vue`),
        props: {
          username: username.value,
        },
      }, {
        name: 'userroute-imprint',
        path: '/impressum',
        component: () => import(`~/components/profile/${design.value}/Imprint.vue`),
        props: {
          username: username.value,
        },
      }, {
        name: 'userroute-privacy',
        path: '/datenschutz',
        component: () => import(`~/components/profile/${design.value}/Privacy.vue`),
        props: {
          username: username.value,
        },
      }]
    }
  },
} satisfies RouterConfig
