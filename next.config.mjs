/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for development
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'data',
        hostname: '**',
      },
    ],
    sizes: [
      50, 100, 150, 200, 300, 400, 500, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Production source maps (helpful for errors)
  productionBrowserSourceMaps: false,

  // SWR (Stale-While-Revalidate) for ISR
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Custom webpack config for optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        firebase: {
          test: /[\\/]node_modules[\\/]firebase[\\/]/,
          name: 'firebase',
          priority: 20,
          reuseExistingChunk: true,
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
          reuseExistingChunk: true,
        },
      };
    }
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' data: https:; font-src 'self' data:;",
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/api/feed',
        permanent: false,
      },
    ];
  },

  // Rewrites for API
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
        {
          source: '/robots.txt',
          destination: '/api/robots',
        },
      ],
    };
  },
};

export default nextConfig;