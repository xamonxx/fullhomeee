/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * The production host runs CloudLinux, which caps how many processes the
   * account may spawn. Next's default build fan-out (18 workers here) tripped
   * that limit with `spawn node EAGAIN` right after "Collecting page data".
   * Building single-threaded costs a few seconds and always completes.
   */
  experimental: { cpus: 1, workerThreads: false },
  /**
   * sharp ships a native binding. Left to the bundler, Turbopack pulled it in
   * through its ESM `externalImport` path and the addon failed to load
   * (ERR_DLOPEN_FAILED on win32-x64), taking the server process down whenever
   * /api/portfolio/image had to transcode. Marking it external makes Next load
   * it as a plain runtime require, which resolves the platform package correctly.
   */
  serverExternalPackages: ["sharp"],
  // Allow dev resources (CSS, JS, HMR) for LAN access & tunneling (ngrok, Cloudflare, localtunnel, etc.)
  allowedDevOrigins: [
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
    '0.0.0.0',
    '0.0.0.0:3000',
    '192.168.1.2',
    '192.168.1.2:3000',
    '192.168.1.129',
    '192.168.1.129:3000',
    '192.168.1.57',
    '192.168.1.57:3000',
    '*.ngrok-free.app',
    '*.ngrok.io',
    '*.loca.lt',
    '*.trycloudflare.com',
    '*.zrok.io',
    '*.tunnelto.dev',
  ],
  async headers() {
    // Baseline hardening. The site serves no authenticated content, so these are
    // about limiting what a hostile page can do with it (framing, MIME sniffing,
    // referrer leakage) rather than protecting a session.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
      // Framing is the one thing worth enforcing via CSP too; a full script CSP
      // would need nonces for Next's inline bootstrap and is a separate change.
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
    ];

    // Wildcard CORS was applied to `/:path*`, which included every API route.
    // It exists for LAN/tunnel access while developing, so keep it there only —
    // shipping `Access-Control-Allow-Origin: *` alongside `Authorization` in
    // allowed headers is a trap the moment any authenticated endpoint is added.
    const devCors =
      process.env.NODE_ENV === 'production'
        ? []
        : [
            {
              source: '/:path*',
              headers: [
                { key: 'Access-Control-Allow-Origin', value: '*' },
                { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                {
                  key: 'Access-Control-Allow-Headers',
                  value: 'X-Requested-With, Content-Type, Authorization, Accept',
                },
              ],
            },
          ];

    return [{ source: '/:path*', headers: securityHeaders }, ...devCors];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // The hero frame renders ~420px wide on desktop, but the smallest device
    // size is 640, so `sizes` had nothing smaller to select and always pulled
    // the 640px variant. 448 and 512 give it somewhere to land.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 448, 512],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
