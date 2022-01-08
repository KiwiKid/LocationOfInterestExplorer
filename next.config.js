const WithPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const {InjectManifest} = require('workbox-webpack-plugin');
const optimizedImages = require('next-optimized-images');

/** @type {import('next').NextConfig} */

module.exports = withPlugins([
  [WithPWA, {
    reactStrictMode: true,
    pwa: {
      dest: 'public'
    }
  }],
  [optimizedImages, {}]
], {
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
  ]}
);

