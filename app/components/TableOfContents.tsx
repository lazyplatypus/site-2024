'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden lg:block fixed right-8 top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="sticky top-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Contents
        </h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-0.5 px-2 rounded transition-all no-underline hover:no-underline ${
                  heading.level === 1
                    ? 'pl-2 font-medium text-gray-900'
                    : heading.level === 2
                      ? 'pl-6 text-gray-700'
                      : 'pl-10 text-gray-600 text-xs'
                } ${
                  activeId === heading.id
                    ? 'text-blue-600 font-medium bg-gray-100'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

