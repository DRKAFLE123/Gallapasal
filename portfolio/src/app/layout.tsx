import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://damodarkafle.com.np'),
  title: 'Damodar Kafle | Senior Full-Stack Developer & AI/ML Engineer',
  description:
    'Damodar Kafle — Senior Full-Stack Developer, AI/ML Engineer, QA Specialist, and IT Project Manager based in Kathmandu, Nepal. Creator of Gallapasal, Digital Nomads in Nepal, and Language Guru.',
  keywords: [
    'Damodar Kafle',
    'Full-Stack Developer Nepal',
    'AI Engineer Kathmandu',
    'Laravel Developer',
    'React Next.js Developer',
    'Gallapasal',
    'Digital Nomads in Nepal',
    'QA Engineer Nepal',
    'BSc CSIT Tribhuvan University'
  ],
  authors: [{ name: 'Damodar Kafle', url: 'https://damodarkafle.com.np' }],
  creator: 'Damodar Kafle',
  alternates: {
    canonical: 'https://damodarkafle.com.np/',
  },
  openGraph: {
    title: 'Damodar Kafle | Senior Full-Stack Developer & AI/ML Engineer',
    description:
      'Building Digital Products, Web Applications and Intelligent Solutions. Explore live products, engineering repositories, and technical background.',
    url: 'https://damodarkafle.com.np/',
    siteName: 'Damodar Kafle Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Damodar Kafle | Senior Full-Stack Developer & AI/ML Engineer',
    description:
      'Building Digital Products, Web Applications and Intelligent Solutions. Kathmandu, Nepal.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Damodar Kafle',
    jobTitle: 'Senior Full-Stack Developer & AI/ML Engineer',
    url: 'https://damodarkafle.com.np/',
    sameAs: [
      'https://github.com/DRKAFLE123',
      'https://www.digitalnomadsinnepal.com/',
      'https://language-guru-one.vercel.app/'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'Nepal',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Tribhuvan University',
    },
    knowsAbout: [
      'Full-Stack Web Development',
      'Artificial Intelligence & Machine Learning',
      'Software Architecture',
      'Laravel & PHP',
      'React & Next.js',
      'Quality Assurance Testing'
    ],
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Damodar Kafle Portfolio',
    url: 'https://damodarkafle.com.np/',
    description: 'Personal portfolio and engineering showcase of Damodar Kafle.',
    author: {
      '@type': 'Person',
      name: 'Damodar Kafle',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090d16] text-[#f8fafc] antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
