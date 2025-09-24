import { useLocalStorage } from "@vueuse/core"

export default function useUserAgreements() {
  const hasAgreedToTranscriptions = useLocalStorage('hasAgreedToTranscriptions', () => false)
  const showTranscriptionAgreementModal = useState('showTranscriptionAgreementModal', () => false)

  return {
    hasAgreedToTranscriptions,
    showTranscriptionAgreementModal
  }
}
