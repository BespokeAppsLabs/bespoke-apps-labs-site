import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* v1 and v2 were earlier versions of this site; old links land on the current homepage. */
  async redirects() {
    return [
      { source: "/v1", destination: "/", permanent: true },
      { source: "/v2", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
