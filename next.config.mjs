/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  serverExternalPackages: ['@mikro-orm/core', '@mikro-orm/postgresql', 'pg'],
  eslint: {
    dirs: ['src']
  }
};

export default nextConfig;
