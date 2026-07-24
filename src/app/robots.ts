import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/auth', '/checkout/success'],
    },
    sitemap: 'https://superencasa.com/sitemap.xml',
  };
}
