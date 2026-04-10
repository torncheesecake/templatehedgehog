const ABSOLUTE_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

function normaliseBasePath(rawBasePath: string | undefined): string {
  if (!rawBasePath) return "";

  const trimmed = rawBasePath.trim();
  if (!trimmed || trimmed === "/") return "";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

const basePath = normaliseBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function withBasePath(path: string): string {
  if (!path) return path;

  if (
    path.startsWith("#")
    || path.startsWith("//")
    || ABSOLUTE_PROTOCOL_PATTERN.test(path)
  ) {
    return path;
  }

  if (!basePath) {
    return path;
  }

  if (path === basePath || path.startsWith(`${basePath}/`)) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${basePath}${path}`;
  }

  return `${basePath}/${path.replace(/^\/+/, "")}`;
}

export function rewriteHtmlAssetPaths(html: string): string {
  if (!html) return html;

  return html
    .replace(
      /\b(src|href)=["'](\/[^"']*)["']/g,
      (_, attribute: string, path: string) => `${attribute}="${withBasePath(path)}"`,
    )
    .replace(
      /url\((['"]?)(\/[^)'"]+)\1\)/g,
      (_, quote: string, path: string) => `url(${quote}${withBasePath(path)}${quote})`,
    );
}
