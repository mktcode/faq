import { useLocalStorage } from "@vueuse/core"

export default function useAdmin() {
  const ownedUserNames = useLocalStorage<string[]>('ownedUserNames', [])

  function removeOwnedUserName(userName: string) {
    ownedUserNames.value = ownedUserNames.value.filter(name => name !== userName)
  }

  return {
    ownedUserNames,
    removeOwnedUserName
  }
}