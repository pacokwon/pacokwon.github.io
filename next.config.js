/* eslint-disable @typescript-eslint/no-var-requires */
const withOptimizedImages = require('next-optimized-images');

// const isProd = process.env.NODE_ENV === 'production';

module.exports = withOptimizedImages({
  images: {
    domains: ['github.com'],
    disableStaticImages: true,
  },
  handleImages: ['jpeg', 'png', 'svg'],
});
