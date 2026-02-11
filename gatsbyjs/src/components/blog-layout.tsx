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
      // Try to find headings in the main content area first
      const mainContent = document.querySelector('main') || document.body;
      const headingElements = mainContent.querySelectorAll('h1, h2, h3');
      const extractedHeadings: Heading[] = [];

      headingElements.forEach((element) => {
        let id = element.id;
        
        // If no ID, try to generate one from the text
        if (!id) {
          const text = element.textContent?.trim() || '';
          if (text) {
            id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            element.id = id;
          }
        }
        
        if (!id) return; // Skip if still no ID
        
        const level = parseInt(element.tagName.charAt(1));
        const text = element.textContent?.trim() || '';
        
        if (text) {
          extractedHeadings.push({ id, text, level });
        }
      });

      console.log('Extracted headings:', extractedHeadings);
      setHeadings(extractedHeadings);
    };

    // Extract headings after multiple attempts to ensure DOM is ready
    const timeoutId1 = setTimeout(extractHeadings, 100);
    const timeoutId2 = setTimeout(extractHeadings, 500);
    const timeoutId3 = setTimeout(extractHeadings, 1000);
    
    // Also extract on any content changes
    const observer = new MutationObserver(() => {
      extractHeadings();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
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

