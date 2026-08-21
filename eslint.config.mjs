import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Retire ho chuki scripts — sirf reference ke liye rakhi hain, chalti nahi.
    "tools/archive/**",
  ]),
  {
    // components/marketing/* purane index_3.html se migrate kiye gaye the.
    // Generator retire ho chuka hai (tools/archive/html-to-jsx.js) — ab ye
    // .tsx files hi asli source hain, seedha inhe edit karo.
    files: ["components/marketing/**/*.tsx", "components/SafeImg.tsx"],
    rules: {
      // Marketing copy mein bahut saare ' aur " hain. Ye rule sirf
      // cosmetic hai — render dono tarah se sahi hota hai.
      "react/no-unescaped-entities": "off",
      // Unsplash images ab self-hosted hain (public/images/), par CiCLO® ke
      // logo/photos abhi bhi ciclotechnology.com se hotlink hote hain.
      // next/image pe shift karne ke liye next.config.ts mein remotePatterns
      // chahiye — wo baad ke phase ka kaam hai.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
