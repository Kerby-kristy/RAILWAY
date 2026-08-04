/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['pdfkit', 'fontkit', 'png-js'],
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
