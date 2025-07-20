
const config = {
  reactStrictMode: true,
  env: {
    STAGE: process.env.STAGE,
    NEXT_PUBLIC_ACCESS_API: process.env.NEXT_PUBLIC_ACCESS_API,
    NEXT_PUBLIC_LESSONS_API: process.env.NEXT_PUBLIC_LESSONS_API,
    NEXT_PUBLIC_CONTENT_ROOT: process.env.NEXT_PUBLIC_CONTENT_ROOT,
    NEXT_PUBLIC_ACCOUNTS_APP_URL: process.env.NEXT_PUBLIC_ACCOUNTS_APP_URL,
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
  transpilePackages: ["@churchapps/apphelper", "@churchapps/apphelper-markdown", "mui-tel-input"],
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material']
  }
}

module.exports = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })(config)
  : config

