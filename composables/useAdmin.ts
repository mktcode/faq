export default function useAdmin() {
  const router = useRouter()

  const showMainSettings = computed(() => router.currentRoute.value.hash.startsWith('#settings'))
  const showCompanySettings = computed(() => router.currentRoute.value.hash === '#settings/company')
  const showDomainSettings = computed(() => router.currentRoute.value.hash === '#settings/domain')
  const showEmailSettings = computed(() => router.currentRoute.value.hash === '#settings/email')
  const showSubscriptionSettings = computed(() => router.currentRoute.value.hash.startsWith('#settings/subscription'))
  const showSubscriptionVerification = computed(() => router.currentRoute.value.hash === '#settings/subscription/verification')

  const showWebsiteSettings = computed(() => router.currentRoute.value.hash === '#website')
  const showWebsiteDesignSettings = computed(() => router.currentRoute.value.hash === '#website/design')
  const showWebsiteOfferingSettings = computed(() => router.currentRoute.value.hash === '#website/offering')
  const showWebsiteContactFormSettings = computed(() => router.currentRoute.value.hash === '#website/contact-form')
  const showWebsiteGallerySettings = computed(() => router.currentRoute.value.hash === '#website/gallery')
  const showWebsiteFaqSettings = computed(() => router.currentRoute.value.hash === '#website/faq')
  const showWebsiteDownloadsSettings = computed(() => router.currentRoute.value.hash === '#website/downloads')

  const showAssistant = computed(() => router.currentRoute.value.hash.startsWith('#assistant'))
  const showAssistantTips = computed(() => router.currentRoute.value.hash === '#assistant/tips')
  const showAssistantContextSettings = computed(() => router.currentRoute.value.hash === '#assistant/context')

  const showSupport = computed(() => router.currentRoute.value.hash.startsWith('#support'))
  const showSupportPhoneMail = computed(() => router.currentRoute.value.hash === '#support/phone-mail')
  const showSupportLiveChat = computed(() => router.currentRoute.value.hash.startsWith('#support/livechat'))
  const showSupportLiveChatConversation = computed(() => router.currentRoute.value.hash === '#support/livechat/conversation')
  const showSupportRemote = computed(() => router.currentRoute.value.hash.startsWith('#support/remote'))
  const showSupportBook = computed(() => router.currentRoute.value.hash === '#support/book')
  const showSupportPayment = computed(() => router.currentRoute.value.hash === '#support/payment')

  function go(hash: string) {
    router.push({ hash })
  }

  return {
    showMainSettings,
    showCompanySettings,
    showDomainSettings,
    showEmailSettings,
    showSubscriptionSettings,
    showSubscriptionVerification,
    showWebsiteSettings,
    showWebsiteDesignSettings,
    showWebsiteOfferingSettings,
    showWebsiteContactFormSettings,
    showWebsiteGallerySettings,
    showWebsiteFaqSettings,
    showWebsiteDownloadsSettings,
    showAssistant,
    showAssistantTips,
    showAssistantContextSettings,
    showSupport,
    showSupportPhoneMail,
    showSupportLiveChat,
    showSupportLiveChatConversation,
    showSupportRemote,
    showSupportBook,
    showSupportPayment,
    go,
  }
}
