import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `X-Powered-By: Next.js` header hata deta hai. Ye sirf batata hai ki
  // andar kya chal raha hai — attacker ko version-specific exploit dhoondhne
  // mein madad milti hai, hamein iska koi fayda nahi.
  // IIS/ARR apne `ARR/3.0` aur `ASP.NET` headers alag se bhejte hain —
  // wo IIS side se hatane padenge, Next.js se nahi.
  poweredByHeader: false,
};

export default nextConfig;
