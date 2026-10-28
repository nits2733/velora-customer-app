import { env } from '@/config/env';

interface ImageOpts {
  width: number;
  /** Height for fixed-ratio crops; omit to keep the original aspect ratio. */
  height?: number;
  /** Crop mode when a height is given. */
  crop?: 'fill' | 'limit';
}

const MAX_DPR = 2;

/**
 * Returns an optimized delivery URL.
 * - Cloudinary URL (res.cloudinary.com/.../upload/...): inject f_auto,q_auto + sizing.
 * - Bare public ID: build a Cloudinary URL when a cloud name is configured.
 * - Any other http(s) URL (e.g. placeholder photos): sized via ?w= when it is Unsplash, else untouched.
 */
export function optimizedImage(src: string, { width, height, crop = 'fill' }: ImageOpts): string {
  const w = Math.round(width * MAX_DPR);
  const h = height ? Math.round(height * MAX_DPR) : undefined;
  const transform = ['f_auto', 'q_auto', `w_${w}`, h ? `h_${h}` : null, h ? `c_${crop}` : 'c_limit', h ? 'g_auto' : null]
    .filter(Boolean)
    .join(',');

  if (/^https?:\/\/res\.cloudinary\.com\/.+\/image\/upload\//.test(src)) {
    return src.replace('/image/upload/', `/image/upload/${transform}/`);
  }
  if (/^https?:\/\//.test(src)) {
    if (src.includes('images.unsplash.com')) {
      const base = src.split('?')[0];
      return `${base}?auto=format&fit=crop&q=70&w=${w}${h ? `&h=${h}` : ''}`;
    }
    return src;
  }
  if (env.cloudinaryCloudName) {
    return `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/${transform}/${src}`;
  }
  return src;
}
