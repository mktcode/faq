export const useSolohostAdmin = () => {
  const { user } = useUserSession()
  
  const isSolohostAdmin = computed(() => user.value?.id === 1)

  return {
    isSolohostAdmin,
  }
}
