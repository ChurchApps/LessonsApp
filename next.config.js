
const config = {
  reactStrictMode: true,
  env: {
    STAGE: process.env.STAGE,
    NEXT_PUBLIC_ACCESS_API: process.env.NEXT_PUBLIC_ACCESS_API,
    NEXT_PUBLIC_LESSONS_API: process.env.NEXT_PUBLIC_LESSONS_API,
    NEXT_PUBLIC_CONTENT_ROOT: process.env.NEXT_PUBLIC_CONTENT_ROOT,
    NEXT_PUBLIC_CHURCH_APPS_URL: process.env.NEXT_PUBLIC_CHURCH_APPS_URL,
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
  transpilePackages: ["@churchapps/apphelper", "@churchapps/apphelper-markdown", "mui-tel-input", "react-ga4", "@mui/material", "@mui/styled-engine"],
  // Configuration for Transformers.js (ONNX runtime)
  serverExternalPackages: ["@xenova/transformers"],
  webpack: (config, { isServer }) => {
    // Handle .node files for ONNX runtime
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



// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "churchapps",
    project: "lessons",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
