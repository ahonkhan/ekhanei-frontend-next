/**
 * Helper to convert relative or backend image URLs into absolute URL pointing to backend storage
 */
export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';

  // Return SVG data URLs or base64 directly
  if (url.startsWith('data:')) {
    return url;
  }

  // Get API base URL or default to production admin domain
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://admin.ekhanei.bd/api/v1';
  const backendBase = apiBase.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');

  // Handle local dev URLs (localhost:8000 or 127.0.0.1:8000) when client connects from outside
  if (url.includes('localhost:8000') || url.includes('127.0.0.1:8000')) {
    const relativePath = url.replace(/^https?:\/\/[^\/]+/, '');
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const storagePath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
    return `${backendBase}/${storagePath}`;
  }

  // If already full HTTP / HTTPS URL (e.g. Unsplash, AWS S3, Cloudfront)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Clean lead slash
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;

  // Add storage prefix if missing
  const storagePath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;

  return `${backendBase}/${storagePath}`;
};
