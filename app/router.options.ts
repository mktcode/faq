import type { RouterConfig, RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  routes: () => {
    const { ssrContext } = useNuxtApp()
    const { username, isSubscribed, isOwned, isPublic, design } = useProfile()

    if (ssrContext?.event.context.profile) {
      username.value = ssrContext.event.context.profile.username
      isSubscribed.value = ssrContext.event.context.profile.isSubscribed
      isOwned.value = ssrContext.event.context.profile.isOwned
      isPublic.value = ssrContext.event.context.profile.isPublic
      design.value = ssrContext.event.context.profile.design
    }

    if (username.value) {
      if (isPublic.value || isOwned.value) {
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
      else {
        return [{
          name: 'userroute',
          path: '/',
          component: () => import('~/components/404.vue'),
        }]
      }
    }
  },
} satisfies RouterConfig
