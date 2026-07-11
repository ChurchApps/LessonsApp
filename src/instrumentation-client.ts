import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6e29ed2781f29262aca838e13cb76bea@o4510432524107776.ingest.us.sentry.io/4510435252568064",
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
