import type { MetadataRoute } from 'next';
import { SITE_URL, projects } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/work', '/services', '/about', ...projects.en.map((p) => `/work/${p.id}`)];

  return pages.flatMap((path) => [
    {
      url: `${SITE_URL}${path || '/'}`,
      alternates: { languages: { en: `${SITE_URL}${path || '/'}`, es: `${SITE_URL}/es${path}` } },
    },
    {
      url: `${SITE_URL}/es${path}`,
      alternates: { languages: { en: `${SITE_URL}${path || '/'}`, es: `${SITE_URL}/es${path}` } },
    },
  ]);
}
