export default function useAdmin() {
  const router = useRouter()
  const { path } = usePath()
  const { $profile } = useProfile()

  const showMainSettings = computed(() => router.currentRoute.value.hash.startsWith('#settings'))
  const showCompanySettings = computed(() => router.currentRoute.value.hash === '#settings/company')
  const showDomainSettings = computed(() => router.currentRoute.value.hash === '#settings/domain')
  const showEmailSettings = computed(() => router.currentRoute.value.hash === '#settings/email')
  const showSubscriptionSettings = computed(() => router.currentRoute.value.hash.startsWith('#settings/subscription'))
  const showSubscriptionVerification = computed(() => router.currentRoute.value.hash === '#settings/subscription/verification')
  const showConnectDevice = computed(() => router.currentRoute.value.hash === '#settings/connect-device')

  const showWebsiteSettings = computed(() => router.currentRoute.value.hash === '#website')
  const showWebsiteDesignSettings = computed(() => router.currentRoute.value.hash === '#website/design')

  const websiteSelectedPage = computed(() => {
    const match = router.currentRoute.value.hash.match(/^#website\/page\/(\d+)(?:\/component\/(\d+))?$/)

    const pageId = match ? Number(match[1]) : null
    const componentId = match && match[2] ? Number(match[2]) : null

    const page = $profile.settings.public.pages.find(p => p.id === pageId)
    if (page) {
      path.value = page.path
    }

    return { pageId, componentId }
  })

  const page = computed(() => {
    return $profile.settings.public.pages.find(page => page.id === websiteSelectedPage.value?.pageId)
  })
  
  const component = computed(() => {
    if (!websiteSelectedPage.value || websiteSelectedPage.value.componentId === null) {
      return null
    }
  
    return $profile.settings.public.pages.find(page => page.id === websiteSelectedPage.value?.pageId)?.components.find(c => c.id === websiteSelectedPage.value?.componentId) || null
  })

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
    websiteSelectedPage,
    page,
    component,
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
    showConnectDevice,
    go,
  }
}
