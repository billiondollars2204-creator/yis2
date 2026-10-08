/** Public assets need the repository prefix on GitHub Pages. */
export function assetPath(src: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return src.startsWith("/") && !src.startsWith("//") && !(base && src.startsWith(`${base}/`)) ? `${base}${src}` : src;
}
