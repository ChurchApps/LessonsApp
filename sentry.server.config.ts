import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6e29ed2781f29262aca838e13cb76bea@o4510432524107776.ingest.us.sentry.io/4510435252568064",
  enabled: process.env.NODE_ENV === "production",
  environment: process.env.STAGE || "prod",
  tracesSampleRate: 0.1,
  enableLogs: true,
  sendDefaultPii: true
});
