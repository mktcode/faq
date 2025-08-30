import { useLocalStorage } from "@vueuse/core"

export default function useOwnedUserNames() {
  const ownedUserNames = useLocalStorage<string[]>('ownedUserNames', [])

  function addOwnedUserName(userName: string) {
    if (!ownedUserNames.value.includes(userName)) {
      ownedUserNames.value.push(userName)
    }
  }

  function removeOwnedUserName(userName: string) {
    ownedUserNames.value = ownedUserNames.value.filter(name => name !== userName)
  }

  return {
    ownedUserNames,
    addOwnedUserName,
    removeOwnedUserName
  }
}