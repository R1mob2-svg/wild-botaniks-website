import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const googleSiteVerification = env.VITE_GOOGLE_SITE_VERIFICATION?.trim()
  const googleTagId = env.VITE_GOOGLE_TAG_ID?.trim()

  return {
    plugins: [
      react(),
      {
        name: 'wild-botanix-head-integrations',
        transformIndexHtml() {
          const tags = []

          if (googleSiteVerification) {
            tags.push({
              tag: 'meta',
              attrs: {
                name: 'google-site-verification',
                content: googleSiteVerification,
              },
              injectTo: 'head',
            })
          }

          if (googleTagId) {
            tags.push(
              {
                tag: 'script',
                attrs: {
                  async: true,
                  src: `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`,
                },
                injectTo: 'head',
              },
              {
                tag: 'script',
                children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', '${googleTagId}', { send_page_view: false });`,
                injectTo: 'head',
              },
            )
          }

          return tags
        },
      },
    ],
  }
})
