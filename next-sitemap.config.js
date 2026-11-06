// Signed-in and debug areas: keep crawlers out and keep them out of the sitemap.
const privatePaths = ["/admin$", "/admin/", "/portal$", "/portal/", "/login$", "/b1$", "/b1/"];

// Named AI crawlers get the same access as everyone else; listing them states that intent explicitly.
const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://lessons.church",
  generateRobotsTxt: true,
  // Google ignores changefreq and priority, and a build-time lastmod on every URL is not a real modification date.
  autoLastmod: false,
  changefreq: null,
  priority: null,
  exclude: ["/admin", "/admin/*", "/portal", "/portal/*", "/login", "/b1", "/b1/*", "*/alt", "/sitemap-content.xml", "/search"],
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
      ...aiCrawlers.map(userAgent => ({ userAgent, allow: '/', disallow: privatePaths })),
    ],
    // Drop next-sitemap's "Host:" line; it is a retired Yandex directive that Google and Bing ignore.
    transformRobotsTxt: async (_config, robotsTxt) => robotsTxt.replace(/# Host\nHost: .*\n\n?/, ""),
  },
};
