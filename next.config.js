/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Transpile Three.js for better compatibility with Next.js App Router
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // 2. Custom Webpack configuration for Shaders
  webpack: (config, { isServer }) => {
    // Add support for GLSL files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-loader'
      ],
    });

    return config;
  },

  // 3. (Optional) Disable linting during build to speed up Vercel deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
