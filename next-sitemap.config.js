/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://lessons.church",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/cp", "/cp/*", "/login", "/logout", "/register", "*/alt"]
}
