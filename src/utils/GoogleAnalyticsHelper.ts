import { EnvironmentHelper } from "@/utils";

interface Event {
  action?: string;
  category?: string;
  label?: string;
  value?: number;
}

export class GoogleAnalyticsHelper {
  static pageview(url: string) {
    if(typeof window.gtag !== "undefined")
      window.gtag("config", EnvironmentHelper.GoogleAnalyticsTag, {
        page_path: url,
      });
  }

  static gaEvent({ action, category, label, value }: Event) {
    if(typeof window.gtag !== "undefined")
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
  }
}
