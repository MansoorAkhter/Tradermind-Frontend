/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL_DEV: "http://192.168.100.41:8000",
    API_BASE_URL_PRO: "https://api.tradermind.ai",
    // SOCKET_BASE_URL: "Enter Here Production Server URL",
    MODE: "development", // developement | production
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
