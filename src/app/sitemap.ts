import type { MetadataRoute } from 'next';
import { SITE_URL, projects } from '@/lib/content';
import { publishedPosts } from '@/lib/growth';

// Notes come from D1, so this can't be baked at build time.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/work', '/services', '/about', ...projects.en.map((p) => `/work/${p.id}`)];

  const bilingual = pages.flatMap((path) => {
    // x-default tells Google which URL to serve when no declared language
    // matches the user's. Without it a four-way ES/EN cluster leaves Google to
    // guess, and it often picks the non-English variant for neutral locales.
    const languages = {
      en: `${SITE_URL}${path || '/'}`,
      es: `${SITE_URL}/es${path}`,
      'x-default': `${SITE_URL}${path || '/'}`,
    };
    return [
      { url: `${SITE_URL}${path || '/'}`, alternates: { languages } },
      { url: `${SITE_URL}/es${path}`, alternates: { languages } },
    ];
  });

  // English-only — notes are written in one language, so no hreflang pair.
  const notes = (await publishedPosts()).map((p) => ({
    url: `${SITE_URL}/notes/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : undefined,
  }));

  return [...bilingual, { url: `${SITE_URL}/notes` }, ...notes];
}
