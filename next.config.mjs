/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['s3.ap-northeast-2.amazonaws.com'], // 허용할 도메인 추가
    },
};

export default nextConfig;
