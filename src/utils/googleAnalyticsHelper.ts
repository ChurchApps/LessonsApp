import { EnvironmentHelper } from "@/utils"

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', EnvironmentHelper.GoogleAnalyticsTag, {
    page_path: url,
  })
}
