export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', 'nuxt-authorization', '@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxt/image'],
  pages: false,
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Solohost',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
        { name: 'description', content: 'Solohost - Online aus Leidenschaft' },
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
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'neutral'],
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
    stripePriceSId: process.env.STRIPE_PRICE_S_ID,
    stripePriceLId: process.env.STRIPE_PRICE_L_ID,
    hetznerApiKey: process.env.HETZNER_API_KEY,
    autodnsApiContext: process.env.AUTODNS_API_CONTEXT,
    autodnsApiUrl: process.env.AUTODNS_API_URL,
    autodnsApiUser: process.env.AUTODNS_API_USER,
    autodnsApiPass: process.env.AUTODNS_API_PASS,
    autodnsNs1: process.env.AUTODNS_NS_1,
    autodnsNs2: process.env.AUTODNS_NS_2,
    qboxmailApiKey: process.env.QBOXMAIL_API_KEY,
    chatwootInboxId: process.env.CHATWOOT_INBOX_ID,
    chatwootHmacSecret: process.env.CHATWOOT_HMAC_SECRET,
    chatwootApiKey: process.env.CHATWOOT_API_KEY,
    session: {
      password: process.env.SESSION_PASSWORD || '',
      cookie: {
        // Devnote: Set .de to .local for preview mode
        domain: process.env.NODE_ENV === 'production' ? 'solohost.de' : 'solohost.local',
        sameSite: 'strict',
      },
    },
    public: {
      s3Endpoint: process.env.S3_ENDPOINT,
      stripeApiKey: process.env.STRIPE_API_KEY,
      stripePortalUrl: process.env.STRIPE_PORTAL_URL,
      appHost: process.env.APP_HOST || 'localhost:3000',
      lbIp: process.env.LB_IP || '127.0.0.1',
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
          'connect-src \'self\' https://api.stripe.com https://chat.markus-kottlaender.de',
          'frame-src \'self\' https://*.js.stripe.com https://js.stripe.com https://hooks.stripe.com https://chat.markus-kottlaender.de',
          'script-src \'self\' \'unsafe-inline\' https://*.js.stripe.com https://js.stripe.com https://chat.markus-kottlaender.de',
        ].join('; '),
      },
    },
  },
  devServer: {
    host: 'solohost.local',
    https: {
      key: '.localcert/solohost.local+1-key.pem',
      cert: '.localcert/solohost.local+1.pem',
    },
  },
  compatibilityDate: '2024-11-01',
  vite: {
    server: {
      allowedHosts: true,
      hmr: { host: 'solohost.local' },
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
