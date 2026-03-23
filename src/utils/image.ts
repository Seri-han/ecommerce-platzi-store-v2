export function getSafeImageUrl(
  image?: string,
  images?: Array<{ url: string }>
): string | null {
  const candidates = [
    image?.trim(),
    images?.[0]?.url?.trim(),
  ].filter(Boolean) as string[];

  for (const url of candidates) {
    try {
      const parsed = new URL(url);

      // Skip hosts you know are failing
      if (parsed.hostname.includes("imgur.com")) {
        continue;
      }

      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return url;
      }
    } catch {
      continue;
    }
  }

  return null;
}