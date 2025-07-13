export default defineNuxtConfig({
  pages: false,
  modules: ['nuxt-auth-utils', 'nuxt-authorization', '@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxt/image'],
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Ihr Gewerbeprofil',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.png', type: 'image/png' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  ui: {
    colorMode: false,
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'neutral', 'website'],
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    openaiApiKey: process.env.OPENAI_API_KEY,
    mailHost: process.env.MAIL_HOST,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    mailFrom: process.env.MAIL_FROM,
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY,
    s3BucketName: process.env.S3_BUCKET_NAME,
    stripeApiSecretKey: process.env.STRIPE_API_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePriceId: process.env.STRIPE_PRICE_ID,
    session: {
      password: process.env.SESSION_PASSWORD || '',
      cookie: {
        domain: process.env.NODE_ENV === 'production' ? 'gewerbeprofil.de' : 'gewerbeprofil.local',
        sameSite: 'strict',
      },
    },
    public: {
      s3Endpoint: process.env.S3_ENDPOINT,
      stripeApiKey: process.env.STRIPE_API_KEY,
      stripePortalUrl: process.env.STRIPE_PORTAL_URL,
      appHost: process.env.APP_HOST || 'localhost:3000',
    },
  },

  // From stripe docs:
  // connect-src, https://api.stripe.com
  // frame-src, https://*.js.stripe.com, https://js.stripe.com, https://hooks.stripe.com
  // script-src, https://*.js.stripe.com, https://js.stripe.com
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': [
          'connect-src \'self\' https://api.stripe.com',
          'frame-src \'self\' https://*.js.stripe.com https://js.stripe.com https://hooks.stripe.com',
          'script-src \'self\' \'unsafe-inline\' https://*.js.stripe.com https://js.stripe.com',
        ].join('; '),
      },
    },
  },
  devServer: {
    host: 'gewerbeprofil.local',
    https: {
      key: '.localcert/gewerbeprofil.local+1-key.pem',
      cert: '.localcert/gewerbeprofil.local+1.pem',
    },
  },
  compatibilityDate: '2024-11-01',
  vite: {
    server: {
      allowedHosts: true,
      hmr: { host: 'gewerbeprofil.local' },
    },
  },
  auth: {
    webAuthn: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
