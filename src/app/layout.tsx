import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Newsreader, Public_Sans } from 'next/font/google';
import { env } from '@/lib/env';
import { site } from '@/content/site';
import { offices } from '@/content/locations';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: 'BGC Holding',
    template: '%s | BGC Holding',
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: env.siteUrl,
    siteName: site.name,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.legalName,
  description: site.description,
  email: site.contact.email,
  telephone: site.contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '114 West Street c/o Katherine and West, 6th Floor, Suite 43',
    addressLocality: 'Sandton',
    postalCode: '2196',
    addressCountry: 'ZA',
  },
  location: offices.map((o) => `${o.city}, ${o.country}`),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Opts this route into dynamic rendering — required for the per-request CSP
  // nonce (src/proxy.ts). Next.js then stamps the nonce onto framework scripts
  // during SSR. See nextjs.org/docs/app/guides/content-security-policy.
  await connection();
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Static, build-time JSON only — no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
