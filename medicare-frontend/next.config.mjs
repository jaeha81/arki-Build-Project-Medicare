import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Explicit server-side env (non-NEXT_PUBLIC) can be added here.
    // NEXT_PUBLIC_* vars are automatically forwarded to the browser
    // as long as they are defined in .env / .env.local / platform settings.
  },
  // Allow cross-origin image sources if needed (add Supabase storage domain etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
