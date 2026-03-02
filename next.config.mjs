/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/settings',
                destination: '/dashboard/settings',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
