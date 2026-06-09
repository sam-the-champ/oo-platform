import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'react-hot-toast';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Olalekan Ogundimu – Full Stack & AWS Cloud Engineer',
    template: '%s | Olalekan Ogundimu',
  },
  description:
    'Full Stack Software Engineer and AWS Cloud Architect. Building resilient, scalable systems. Mentor, open source contributor, and technology leader based in Lagos, Nigeria.',
  keywords: [
    'Full Stack Engineer', 'AWS Cloud Architect', 'Software Engineer Nigeria',
    'React Developer', 'Next.js', 'TypeScript', 'Cloud Engineer Lagos',
    'Technical Mentor', 'Olalekan Ogundimu',
  ],
  authors: [{ name: 'Olalekan Ogundimu', url: 'https://olalekan.dev' }],
  creator: 'Olalekan Ogundimu',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Olalekan Ogundimu – Full Stack & AWS Cloud Engineer',
    description: 'Building the future of African tech through code, mentorship, and open source.',
    siteName: 'Olalekan Ogundimu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olalekan Ogundimu – Full Stack & AWS Cloud Engineer',
    creator: '@mr_sams01',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border2)',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#00d68f', secondary: '#000' } },
              error:   { iconTheme: { primary: '#ff4757', secondary: '#000' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
