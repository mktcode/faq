export const useProfile = async () => {
  const { ssrContext } = useNuxtApp()
  const path = useRoute().path

  const username = useState<string | null>('username', () => null)
  const isSubscribed = useState<boolean>('isSubscribed', () => false)
  const isOwned = useState<boolean>('isOwned', () => false)
  const isPublic = useState<boolean>('isPublic', () => false)
  const design = useState<string>('design', () => 'default')

  if (ssrContext?.event.context.profile) {
    username.value = ssrContext.event.context.profile.username
    isSubscribed.value = ssrContext.event.context.profile.isSubscribed
    isOwned.value = ssrContext.event.context.profile.isOwned
    isPublic.value = ssrContext.event.context.profile.isPublic
    design.value = ssrContext.event.context.profile.design
  }

  const { data: settings, refresh: refreshSettings } = await useFetch(`/api/settings`, {
    query: {
      username,
    },
  })

  const showLegalDataWarning = computed(() => isOwned && (!settings.value?.company?.name || !settings.value?.company?.city || !settings.value?.company?.street || !settings.value?.company?.zip || !settings.value?.company?.email))

  return {
    username,
    isSubscribed,
    isOwned,
    isPublic,
    design,
    path,
    settings,
    refreshSettings,
    showLegalDataWarning,
  }
}
