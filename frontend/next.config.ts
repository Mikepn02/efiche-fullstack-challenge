const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_LOCAL_STORAGE_KEY: process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY,
    NEXT_PUBLIC_SESSION_KEY_KEY: process.env.NEXT_PUBLIC_SESSION_KEY_KEY
  },
}

module.exports = nextConfig
