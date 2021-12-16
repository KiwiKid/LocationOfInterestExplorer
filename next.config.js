const WithPWA = require('next-pwa');
const {InjectManifest} = require('workbox-webpack-plugin');
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
        source: '/sitemap.xml',
        destination: '/api/sitemap',
        permanent: true
      }
    ]
  },
  plugins: [
    new InjectManifest({
      swSrc: './lib/sw.js',
    })
  ]
});
