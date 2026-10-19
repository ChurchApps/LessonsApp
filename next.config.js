
const config = {
  reactStrictMode: true,
  env: {
    STAGE: process.env.STAGE,
    NEXT_PUBLIC_LESSONS_API: process.env.NEXT_PUBLIC_LESSONS_API,
    NEXT_PUBLIC_CONTENT_ROOT: process.env.NEXT_PUBLIC_CONTENT_ROOT,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "content.lessons.church" },
      { protocol: "https", hostname: "content.staging.lessons.church" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
      { protocol: "https", hostname: "d347bo4ltvvnaz.cloudfront.net" },
      { protocol: "https", hostname: "files.churchpdf.com" }
    ]
  },
  transpilePackages: ["@churchapps/apphelper", "mui-tel-input", "react-ga4", "@mui/material", "@mui/styled-engine"],
  async headers() {
    const common = [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
    ];
    // Embeds and classroom pages are iframed on church sites; only the signed-in areas refuse framing.
    const noFraming = [{ key: "Content-Security-Policy", value: "frame-ancestors 'self'" }, { key: "X-Frame-Options", value: "SAMEORIGIN" }];
    return [
      { source: "/:path*", headers: common },
      ...["/admin", "/admin/:path*", "/portal", "/portal/:path*", "/login"].map(source => ({ source, headers: noFraming }))
    ];
  },
}

module.exports = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })(config)
  : config

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    org: "churchapps",
    project: "lessons",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    // tunnelRoute: "/monitoring",
    webpack: {
      treeshake: { removeDebugLogging: true },
      automaticVercelMonitors: true
    }
  }
);
