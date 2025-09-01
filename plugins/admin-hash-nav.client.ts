// Sync admin side panel state with the URL hash so back/forward and deep links work.
// Source of truth is the URL hash; state changes also update the hash.
import { defineNuxtPlugin } from '#app'
import { nextTick } from 'vue'

type RootKey = 'settings' | 'website' | 'assistant' | 'support'

export default defineNuxtPlugin(() => {
  // Only run in browser
  if (process.server) return

  const router = useRouter()
  const route = useRoute()
  const admin = useAdmin()

  // Guard flag for hash-driven updates
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
    // Close all roots first
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
      // Unknown root -> close all
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

  const computePathFromState = (): string => {
    // Order defines priority if multiple roots are accidentally open
    if (admin.showMainSettings.value) {
      if (admin.showCompanySettings.value) return 'settings/company'
      if (admin.showDomainSettings.value) return 'settings/domain'
      if (admin.showEmailSettings.value) return 'settings/email'
      if (admin.showSubscriptionVerification.value) return 'settings/subscription/verification'
      if (admin.showSubscriptionSettings.value) return 'settings/subscription'
      return 'settings'
    }
    if (admin.showWebsiteSettings.value) {
      if (admin.showDesignSettings.value) return 'website/design'
      if (admin.showOfferingSettings.value) return 'website/offering'
      if (admin.showContactFormSettings.value) return 'website/contact'
      if (admin.showGallerySettings.value) return 'website/gallery'
      if (admin.showFaqSettings.value) return 'website/faq'
      if (admin.showDownloadsSettings.value) return 'website/downloads'
      return 'website'
    }
    if (admin.showAssistant.value) {
      if (admin.showAssistantTips.value) return 'assistant/tips'
      if (admin.showAssistantContextSettings.value) return 'assistant/context'
      return 'assistant'
    }
    if (admin.showSupport.value) {
      if (admin.showSupportLiveChatConversation.value) return 'support/livechat/conversation'
      if (admin.showSupportLiveChat.value) return 'support/livechat'
      if (admin.showSupportPhoneMail.value) return 'support/phone-mail'
      if (admin.showSupportRemote.value) return 'support/remote'
      return 'support'
    }
    return ''
  }

  // Watch route hash -> update state (one-way source of truth)
  watch(
    () => route.hash,
    (hash) => {
      updatingFromHash = true
      applyPath(hash ?? '')
      // Keep the guard active until nextTick so state->hash sync doesn't create extra history entries
      nextTick(() => { updatingFromHash = false })
    },
    { immediate: true, flush: 'sync' }
  )

  // When all root panels are closed, ensure the URL hash is cleared without adding history
  watch(
    [admin.showMainSettings, admin.showWebsiteSettings, admin.showAssistant, admin.showSupport],
    () => {
      const anyRootOpen = admin.showMainSettings.value || admin.showWebsiteSettings.value || admin.showAssistant.value || admin.showSupport.value
      if (!anyRootOpen && route.hash) {
        router.replace({ hash: '' }) // clears the fragment
      }
    },
    { flush: 'post' }
  )
})
