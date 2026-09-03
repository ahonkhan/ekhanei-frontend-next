/**
 * Helper to convert relative or backend image URLs into absolute URL pointing to backend storage
 */
export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';

  // Return SVG data URLs or base64 directly
  if (url.startsWith('data:')) {
    return url;
  }

  // If already full HTTP / HTTPS URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('localhost:8000')) {
      return url.replace('http://localhost:8000', 'https://admin.ekhanei.bd');
    }
    return url;
  }

  // Clean lead slash
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;

  // Add storage prefix if missing
  const storagePath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;

  // Get API base URL or default to production admin domain
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://admin.ekhanei.bd/api/v1';
  const backendBase = apiBase.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');

  return `${backendBase}/${storagePath}`;
};
