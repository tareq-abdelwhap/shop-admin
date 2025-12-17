import Aura from '@primeuix/themes/aura';

// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  ssr: false,

  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePriceBasic: process.env.STRIPE_PRICE_BASIC,
    stripePricePro: process.env.STRIPE_PRICE_PRO,

    apsAccessCode: process.env.APS_ACCESS_CODE,
    apsMerchantId: process.env.APS_MERCHANT_ID,
    apsMerchantRef: process.env.APS_MERCHANT_REF,
    apsSignature: process.env.APS_SIGNATURE,

    apsApiBase: process.env.APS_API_BASE,
    apsCurrency: process.env.APS_CURRENCY,

    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    appUrl: process.env.APP_URL,

    public: {
      appUrl: process.env.APP_URL,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  css: ['primeicons/primeicons.css'],

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    },
  },

  colorMode: { preference: 'dark', storage: 'cookie' },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ar',
    locales: [
      {
        code: 'ar',
        name: 'العربية',
        file: 'ar.json',
        flag: '/flags/ar.png',
        dir: 'rtl',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
        flag: '/flags/en.png',
        dir: 'ltr',
      },
    ],
    langDir: 'locales',
  },
});
