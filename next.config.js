const WithPWA = require('next-pwa')
/** @type {import('next').NextConfig} */

module.exports = WithPWA({
  reactStrictMode: true,
  async redirects(){
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
        permanent: true
      },{
        source: '/api/sitemap',
        destination: 'sitemap.xml',
        permanent: true
      }
    ]
  }
});
