export const useProfile = async () => {
  const nuxtApp = useNuxtApp()
  const appConfig = useAppConfig()
  const profile = useState('profile', () => nuxtApp.ssrContext?.event.context.profile || null)

  if (profile.value) {
    appConfig.ui.colors.primary = 'website'
    appConfig.ui.button.defaultVariants.rounded = profile.value.settings.public.design.rounded
    appConfig.ui.input.defaultVariants.rounded = profile.value.settings.public.design.rounded
    appConfig.ui.select.defaultVariants.rounded = profile.value.settings.public.design.rounded
    appConfig.ui.textarea.defaultVariants.rounded = profile.value.settings.public.design.rounded
  }

  return profile
}
