import type { NextConfig } from "next"

const isGithubActions = process.env.GITHUB_ACTIONS === "true"
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? ""
const isUserSite = repositoryName.endsWith(".github.io")
const basePath =
  isGithubActions && repositoryName && !isUserSite ? `/${repositoryName}` : ""

const config: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default config
