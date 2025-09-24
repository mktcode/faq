import { useLocalStorage } from "@vueuse/core"

export default function useUserAgreements() {
  const hasAgreedToTranscriptions = useLocalStorage('hasAgreedToTranscriptions', () => false)

  return {
    hasAgreedToTranscriptions
  }
}
