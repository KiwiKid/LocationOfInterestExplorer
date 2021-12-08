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
        source: 'sitemap.xml',
        destination: '/api/sitemap',
        permanent: true
      }
    ]
  }
});
