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

  // Auto-scroll active item into view on mobile horizontal scroll
  useEffect(() => {
    if (!activeId) return;

    // Only run on mobile (screen width <= 768px)
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const sidebarContent = document.querySelector('.sidebar-content') as HTMLElement;
    if (!sidebarContent) return;

    const activeItem = sidebarContent.querySelector(`[data-section-id="${activeId}"]`) as HTMLElement;
    if (!activeItem) return;

    // Calculate scroll position to center the active item
    const containerRect = sidebarContent.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const scrollLeft = sidebarContent.scrollLeft;
    const itemLeft = itemRect.left - containerRect.left + scrollLeft;
    const itemWidth = itemRect.width;
    const containerWidth = containerRect.width;
    
    // Center the item in the container
    const targetScroll = itemLeft - (containerWidth / 2) + (itemWidth / 2);
    
    sidebarContent.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }, [activeId]);

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

