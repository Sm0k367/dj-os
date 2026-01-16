/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force Next.js to properly bundle Three.js and React Three Fiber
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // 2. Optimize for Vercel deployment
  // Only ignore build errors if absolutely necessary - better to fix them
  typescript: {
    // Set to false to catch TypeScript errors during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to false to catch linting errors during build
    ignoreDuringBuilds: false,
  },

  // 3. Image optimization for better performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize images for faster loading
    formats: ['image/avif', 'image/webp'],
  },

  // 4. Webpack optimizations for Vercel
  webpack: (config, { isServer }) => {
    // Optimize for production builds
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate Three.js into its own chunk for better caching
            three: {
              test: /[\/]node_modules[\/](three|@react-three)[\/]/,
              name: 'three-vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Separate other vendors
            vendors: {
              test: /[\/]node_modules[\/]/,
              name: 'vendors',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // 5. Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },

  // 6. Headers for better caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // 7. Redirects (if needed)
  async redirects() {
    return [];
  },

  // 8. Rewrites (if needed)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
