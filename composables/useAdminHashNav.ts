// Initialize hash-based navigation for Admin panels when called.
import { nextTick } from 'vue'

type RootKey = 'settings' | 'website' | 'assistant' | 'support'

export function useAdminHashNav() {
  if (import.meta.server) return

  const router = useRouter()
  const route = useRoute()
  const admin = useAdmin()

  let updatingFromHash = false

  const closeAll = () => {
    admin.showMainSettings.value = false
    admin.showCompanySettings.value = false
    admin.showDomainSettings.value = false
    admin.showEmailSettings.value = false
    admin.showSubscriptionSettings.value = false
    admin.showSubscriptionVerification.value = false

    admin.showWebsiteSettings.value = false
    admin.showDesignSettings.value = false
    admin.showOfferingSettings.value = false
    admin.showContactFormSettings.value = false
    admin.showGallerySettings.value = false
    admin.showFaqSettings.value = false
    admin.showDownloadsSettings.value = false

    admin.showAssistant.value = false
    admin.showAssistantTips.value = false
    admin.showAssistantContextSettings.value = false

    admin.showSupport.value = false
    admin.showSupportPhoneMail.value = false
    admin.showSupportLiveChat.value = false
    admin.showSupportLiveChatConversation.value = false
    admin.showSupportRemote.value = false
  }

  const openRoot = (root: RootKey) => {
    admin.showMainSettings.value = false
    admin.showWebsiteSettings.value = false
    admin.showAssistant.value = false
    admin.showSupport.value = false

    if (root === 'settings') admin.showMainSettings.value = true
    if (root === 'website') admin.showWebsiteSettings.value = true
    if (root === 'assistant') admin.showAssistant.value = true
    if (root === 'support') admin.showSupport.value = true
  }

  const clearSubFor = (root: RootKey) => {
    if (root === 'settings') {
      admin.showCompanySettings.value = false
      admin.showDomainSettings.value = false
      admin.showEmailSettings.value = false
      admin.showSubscriptionSettings.value = false
      admin.showSubscriptionVerification.value = false
    }
    if (root === 'website') {
      admin.showDesignSettings.value = false
      admin.showOfferingSettings.value = false
      admin.showContactFormSettings.value = false
      admin.showGallerySettings.value = false
      admin.showFaqSettings.value = false
      admin.showDownloadsSettings.value = false
    }
    if (root === 'assistant') {
      admin.showAssistantTips.value = false
      admin.showAssistantContextSettings.value = false
    }
    if (root === 'support') {
      admin.showSupportPhoneMail.value = false
      admin.showSupportLiveChat.value = false
      admin.showSupportLiveChatConversation.value = false
      admin.showSupportRemote.value = false
    }
  }

  const applyPath = (pathOrHash: string) => {
    const segments = (pathOrHash || '').replace(/^#+/, '').split('/').filter(Boolean)
    if (!segments.length) {
      closeAll()
      return
    }

    const root = segments[0] as RootKey
    if (!['settings', 'website', 'assistant', 'support'].includes(root)) {
      closeAll()
      return
    }

    openRoot(root)
    clearSubFor(root)

    const sub = segments[1]
    const sub2 = segments[2]

    if (root === 'settings') {
      if (sub === 'company') admin.showCompanySettings.value = true
      else if (sub === 'domain') admin.showDomainSettings.value = true
      else if (sub === 'email') admin.showEmailSettings.value = true
      else if (sub === 'subscription') {
        admin.showSubscriptionSettings.value = true
        if (sub2 === 'verification') admin.showSubscriptionVerification.value = true
      }
    } else if (root === 'website') {
      if (sub === 'design') admin.showDesignSettings.value = true
      else if (sub === 'offering') admin.showOfferingSettings.value = true
      else if (sub === 'contact') admin.showContactFormSettings.value = true
      else if (sub === 'gallery') admin.showGallerySettings.value = true
      else if (sub === 'faq') admin.showFaqSettings.value = true
      else if (sub === 'downloads') admin.showDownloadsSettings.value = true
    } else if (root === 'assistant') {
      if (sub === 'tips') admin.showAssistantTips.value = true
      else if (sub === 'context') admin.showAssistantContextSettings.value = true
    } else if (root === 'support') {
      if (sub === 'phone-mail') admin.showSupportPhoneMail.value = true
      else if (sub === 'livechat') {
        admin.showSupportLiveChat.value = true
        if (sub2 === 'conversation') admin.showSupportLiveChatConversation.value = true
      } else if (sub === 'remote') admin.showSupportRemote.value = true
    }
  }

  // Watch route hash -> update state (one-way source of truth)
  const stopRouteWatch = watch(
    () => route.hash,
    (hash) => {
      updatingFromHash = true
      applyPath(hash ?? '')
      nextTick(() => { updatingFromHash = false })
    },
    { immediate: true, flush: 'sync' },
  )

  // When all root panels are closed, ensure the URL hash is cleared without adding history
  const stopRootsWatch = watch(
    [admin.showMainSettings, admin.showWebsiteSettings, admin.showAssistant, admin.showSupport],
    () => {
      const anyRootOpen = admin.showMainSettings.value || admin.showWebsiteSettings.value || admin.showAssistant.value || admin.showSupport.value
      if (!anyRootOpen && route.hash) {
        router.replace({ hash: '' })
      }
    },
    { flush: 'post' },
  )

  onUnmounted(() => {
    stopRouteWatch()
    stopRootsWatch()
  })
}
