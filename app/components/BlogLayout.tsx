'use client';

import { useEffect, useState } from 'react';
import { TextHighlighting } from './TextHighlighting';
import { SidebarNav } from './SidebarNav';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Wait a bit for content to render, then extract headings
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3');
      const extractedHeadings: Heading[] = [];

      headingElements.forEach((element) => {
        const id = element.id;
        if (!id) return; // Skip if no ID (shouldn't happen with our MDX components)
        
        const level = parseInt(element.tagName.charAt(1));
        const text = element.textContent?.trim() || '';
        
        if (text) {
          extractedHeadings.push({ id, text, level });
        }
      });

      setHeadings(extractedHeadings);
    };

    // Extract headings after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(extractHeadings, 100);
    
    // Also extract on any content changes
    const observer = new MutationObserver(extractHeadings);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div className="w-full">
        <TextHighlighting>
          {children}
        </TextHighlighting>
      </div>
      <SidebarNav headings={headings} />
    </div>
  );
}

