/**
 * Image optimization helper for Cloudinary and responsive web delivery.
 * Ensures images are delivered with automatic optimal format (f_auto / WebP / AVIF),
 * automatic quality compression (q_auto), and capped width (w_800, c_limit).
 */
export function optimizeImageUrl(src: string, isVideo: boolean = false): string {
  if (!src) return src;

  // 1. Cloudinary optimization
  if (src.includes("/upload/")) {
    // Video-specific optimization
    if (isVideo) {
      if (!src.includes("w_800") && !src.includes("q_auto")) {
        return src.replace("/upload/", "/upload/w_800,q_auto/");
      }
      return src;
    }

    // Already optimized with format, quality, and width bounds
    if (src.includes("f_auto") && src.includes("q_auto") && src.includes("w_800")) {
      return src;
    }

    // Replace /upload/ or any single malformed transform prefix with optimal transforms
    return src.replace(
      /\/upload\/(?:c_limit,w_\d+,[a-z_0-9,]+\/)?/,
      "/upload/f_auto,q_auto,w_800,c_limit/"
    );
  }

  // 2. Wikimedia Commons dev thumbnail optimization
  if (src.includes("upload.wikimedia.org/wikipedia/commons/") && !src.includes("/thumb/")) {
    const parts = src.split("/commons/");
    if (parts.length === 2) {
      const path = parts[1];
      const filename = path.split("/").pop();
      if (filename) {
        return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/800px-${filename}`;
      }
    }
  }

  return src;
}
