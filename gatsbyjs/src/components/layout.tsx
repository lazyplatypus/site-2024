import React from 'react';
import { Link } from 'gatsby';

interface LayoutProps {
  children: React.ReactNode;
}

function Footer() {
  const links = [
    { name: '@learnwdaniel', url: 'https://x.com/learnwdaniel' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/journeyer' },
    { name: 'github', url: 'https://github.com/lazyplatypus' },
  ];

  return (
    <footer className="mt-12 text-center">
      <div className="flex justify-center space-x-4 tracking-tight mt-8">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors duration-200 no-underline hover:no-underline"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 bg-white text-gray-900">
      <main className="max-w-[60ch] mx-auto w-full space-y-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}