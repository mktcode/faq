export default function useAdmin() {
  const showMainSettings = useState('showMainSettings', () => false)
  const showCompanySettings = useState('showCompanySettings', () => false)
  const showDomainSettings = useState('showDomainSettings', () => false)
  const showEmailSettings = useState('showEmailSettings', () => false)
  const showSubscriptionSettings = useState('showSubscriptionSettings', () => false)

  const showWebsiteSettings = useState('showWebsiteSettings', () => false)
  const showDesignSettings = useState('showDesignSettings', () => false)
  const showOfferingSettings = useState('showOfferingSettings', () => false)
  const showContactFormSettings = useState('showContactFormSettings', () => false)
  const showGallerySettings = useState('showGallerySettings', () => false)
  const showFaqSettings = useState('showFaqSettings', () => false)
  const showDownloadsSettings = useState('showDownloadsSettings', () => false)

  const showAssistant = useState('showAssistant', () => false)
  const showAssistantTips = useState('showAssistantTips', () => false)
  const showAssistantContextSettings = useState('showAssistantContextSettings', () => false)

  const showFeedback = useState('showFeedback', () => false)

  return {
    showMainSettings,
    showCompanySettings,
    showDomainSettings,
    showEmailSettings,
    showSubscriptionSettings,
    showWebsiteSettings,
    showDesignSettings,
    showOfferingSettings,
    showContactFormSettings,
    showGallerySettings,
    showFaqSettings,
    showDownloadsSettings,
    showAssistant,
    showAssistantTips,
    showAssistantContextSettings,
    showFeedback
  }
}