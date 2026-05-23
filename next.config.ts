import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Real high-res files live in /public/paintings. next/image generates
    // responsive AVIF/WebP variants for raster files automatically.
    formats: ["image/avif", "image/webp"],
    // The starter ships SVG color-field placeholders; allow next/image to serve
    // them. These are first-party assets, and the CSP below neutralizes scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
