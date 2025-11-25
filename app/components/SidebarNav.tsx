'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface SidebarNavProps {
  headings: Heading[];
}

export function SidebarNav({ headings }: SidebarNavProps) {
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="sidebar-nav" id="sidebar-nav">
      <div className="sidebar-indicator" id="sidebar-indicator">
        {headings.map((heading) => (
          <div
            key={heading.id}
            className={`sidebar-indicator-line ${activeId === heading.id ? 'active' : ''}`}
            data-section-id={heading.id}
          />
        ))}
      </div>
      <div className="sidebar-content">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`sidebar-nav-item ${activeId === heading.id ? 'active' : ''}`}
            data-section-id={heading.id}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(heading.id);
            }}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </aside>
  );
}

