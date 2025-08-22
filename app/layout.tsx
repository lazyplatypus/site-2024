import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Link, ViewTransitions } from 'next-view-transitions';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://danielkim.sh'),
  title: {
    default: './danielkim.sh',
    template: '%s | ./danielkim.sh',
  },
  description: 'Daniel Kim. Software Engineer. Creator. Vibes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${inter.className} [scrollbar-gutter:stable]`}>
        <head>
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍜</text></svg>"
          />
        </head>
        <body className="antialiased tracking-tight">
          <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 bg-white text-gray-900">
            <main className="max-w-[60ch] mx-auto w-full space-y-6">
              {children}
            </main>
            <Footer />
            <Analytics />
          </div>
          <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-312S1SP8T7"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-312S1SP8T7');
            `}
          </Script>
        </body>
      </html>
    </ViewTransitions>
  );
}

function Footer() {
  const links = [
    { name: '@learnwdaniel', url: 'https://x.com/learnwdaniel' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/journeyer' },
    { name: 'github', url: 'https://github.com/lazyplatypus' },
  ];

  return (
    <footer className="mt-12 text-center">
      <h3 className="text-lg font-medium mb-4">Where I've Been</h3>
      <div className="flex justify-center space-x-4 tracking-tight mt-8">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
      <p className="text-gray-400">This website was forked from  <Link href="https://github.com/leerob/site" className="text-blue-500 hover:text-blue-700">Lee Robinson</Link>'s website.
      </p>
    </footer>
  );
}