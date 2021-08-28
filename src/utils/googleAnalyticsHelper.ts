import { EnvironmentHelper } from "@/utils"

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', EnvironmentHelper.GoogleAnalyticsTag, {
    page_path: url,
  })
}

interface Event {
  action?: string;
  category?: string;
  label?: string;
  value?: number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gaEvent = ({ action, category, label, value }: Event) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}