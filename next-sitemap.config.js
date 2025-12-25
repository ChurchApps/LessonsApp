/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://lessons.church",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/portal", "/portal/*", "/login", "*/alt"],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'Anthropic-AI', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    additionalPaths: async (config) => [
      { loc: '/faq', priority: 0.8 },
      { loc: '/compare/answers-in-genesis', priority: 0.7 },
      { loc: '/compare/think-orange', priority: 0.7 },
      { loc: '/compare/rightnow-media', priority: 0.7 },
      { loc: '/compare/grow-curriculum', priority: 0.7 },
    ],
  },
};
