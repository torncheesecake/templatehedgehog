import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repositoryName.toLowerCase().endsWith(".github.io");
const basePath = isStaticExport && repositoryName && !isUserOrOrgPagesRepo
  ? `/${repositoryName}`
  : "";

const redirectConfig = isStaticExport
  ? {}
  : {
    async redirects() {
      return [
        {
          source: "/templates",
          destination: "/components",
          permanent: true,
        },
        {
          source: "/templates/:path*",
          destination: "/components",
          permanent: true,
        },
        {
          source: "/demo",
          destination: "/components",
          permanent: true,
        },
        {
          source: "/demo/:path*",
          destination: "/components",
          permanent: true,
        },
        {
          source: "/dashboard",
          destination: "/pricing",
          permanent: true,
        },
        {
          source: "/dashboard/:path*",
          destination: "/pricing",
          permanent: true,
        },
      ];
    },
  } satisfies Pick<NextConfig, "redirects">;

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: isStaticExport,
  skipTrailingSlashRedirect: isStaticExport,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: isStaticExport,
  },
  ...redirectConfig,
};

export default nextConfig;
