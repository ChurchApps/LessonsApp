// Signed-in and debug areas: keep crawlers out and keep them out of the sitemap.
const privatePaths = ["/admin$", "/admin/", "/portal$", "/portal/", "/login$", "/b1$", "/b1/"];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://lessons.church",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/portal", "/portal/*", "/login", "/b1", "/b1/*", "*/alt", "/sitemap-content.xml"],
  additionalPaths: async (config) => [
    await config.transform(config, "/compare/answers-in-genesis"),
    await config.transform(config, "/compare/think-orange"),
    await config.transform(config, "/compare/rightnow-media"),
    await config.transform(config, "/compare/grow-curriculum"),
  ],
  robotsTxtOptions: {
    additionalSitemaps: ["https://lessons.church/sitemap-content.xml"],
    policies: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      { userAgent: 'GPTBot', allow: '/', disallow: privatePaths },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: privatePaths },
      { userAgent: 'Claude-Web', allow: '/', disallow: privatePaths },
      { userAgent: 'Anthropic-AI', allow: '/', disallow: privatePaths },
      { userAgent: 'PerplexityBot', allow: '/', disallow: privatePaths },
      { userAgent: 'Bytespider', allow: '/', disallow: privatePaths },
      { userAgent: 'CCBot', allow: '/', disallow: privatePaths },
      { userAgent: 'Google-Extended', allow: '/', disallow: privatePaths },
    ],
  },
};
