/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    "react-syntax-highlighter",
    "swagger-client",
    "swagger-ui-react",
  ],
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'X-Powered-By',
          value: 'It is API, but not Express',
        },
        {
          // Don't do this at home,
          // But as you see - this one is calculated on build time
          key: 'X-Build-Date',
          value: new Date().toISOString(),
        },
      ],
    },
  ],
};

export default nextConfig;
