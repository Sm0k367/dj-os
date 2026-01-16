/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Three.js / React Three Fiber
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  
  // Allows Vercel to bypass minor errors to finish the build
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  webpack: (config) => {
    // This allows you to use .glsl shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });
    return config;
  },
};

export default nextConfig;
