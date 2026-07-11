
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
  serverExternalPackages: ["@xenova/transformers"],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
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
