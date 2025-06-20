export default async function useMe() {
  const route = useRoute()

  const { data: me, refresh } = await useFetch('/api/me', {
    transform: data => data.data,
  })

  const isMe = computed(() => {
    if (!me.value) return false
    const username = Array.isArray(route.params.username) ? route.params.username[0] : route.params.username
    return me.value.userName === username
  })

  return {
    me,
    refreshMe: refresh,
    isMe,
  }
}
