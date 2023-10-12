
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
    domains: ["content.lessons.church", "content.staging.lessons.church", "i.vimeocdn.com", "d347bo4ltvvnaz.cloudfront.net", "files.churchpdf.com"]
  },
  transpilePackages: ["@churchapps/apphelper"]
}


module.exports = config;

//const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true })
//module.exports = withBundleAnalyzer(config)

