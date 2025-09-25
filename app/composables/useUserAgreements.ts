import { useLocalStorage } from "@vueuse/core"

export default function useUserAgreements() {
  const hasAgreedToTranscriptions = useLocalStorage('hasAgreedToTranscriptions', () => false)
  const showTranscriptionAgreementModal = useState('showTranscriptionAgreementModal', () => false)

  const hasAgreedToBetaTerms = useLocalStorage('hasAgreedToBetaTerms', () => false)
  const showBetaTermsModal = useState('showBetaTermsModal', () => false)

  return {
    hasAgreedToTranscriptions,
    showTranscriptionAgreementModal,
    hasAgreedToBetaTerms,
    showBetaTermsModal
  }
}
