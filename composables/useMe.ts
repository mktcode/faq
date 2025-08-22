export default async function useMe() {
  const { data: me, refresh } = await useFetch('/api/me', {
    transform: data => data.data,
  })

  return {
    me,
    refreshMe: refresh,
  }
}
