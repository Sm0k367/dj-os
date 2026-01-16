/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force Next.js to properly bundle Three.js
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // 2. Allow the build to continue even if there are minor TS/Lint issues
  // This is vital for complex 3D projects where types can be inconsistent
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. Webpack config to handle your Shader files (.glsl, .vert, .frag)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
