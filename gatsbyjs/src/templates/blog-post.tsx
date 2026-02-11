import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/layout';
import { Link } from 'gatsby';

interface TextHighlightingProps {
  children: React.ReactNode;
}

function TextHighlighting({ children }: TextHighlightingProps) {
  const [selectedText, setSelectedText] = useState<string>('');
  const [showHighlightButton, setShowHighlightButton] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowHighlightButton(false);
        return;
      }

      const selectedText = selection.toString().trim();
      if (selectedText.length === 0) {
        setShowHighlightButton(false);
        return;
      }

      setSelectedText(selectedText);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setHighlightPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 5,
      });
      setShowHighlightButton(true);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.highlight-button')) {
        return;
      }
      setShowHighlightButton(false);
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    if (selectedText.length === 0) {
      return;
    }

    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'text-highlight bg-yellow-200 px-1 rounded';
    highlightSpan.setAttribute('data-highlighted', 'true');

    try {
      range.surroundContents(highlightSpan);
    } catch (e) {
      const contents = range.extractContents();
      highlightSpan.appendChild(contents);
      range.insertNode(highlightSpan);
    }

    selection.removeAllRanges();
    setShowHighlightButton(false);
  };

  return (
    <>
      {children}
      {showHighlightButton && selectedText && (
        <div
          className="highlight-button fixed z-50"
          style={{
            left: `${highlightPosition.x}px`,
            top: `${highlightPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
            onClick={handleHighlight}
          >
            Highlight
          </button>
        </div>
      )}
    </>
  );
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

function SidebarNav({ headings }: { headings: Heading[] }) {
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

  useEffect(() => {
    if (!activeId) return;

    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const sidebarContent = document.querySelector('.sidebar-content') as HTMLElement;
    if (!sidebarContent) return;

    const activeItem = sidebarContent.querySelector(`[data-section-id="${activeId}"]`) as HTMLElement;
    if (!activeItem) return;

    const containerRect = sidebarContent.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const scrollLeft = sidebarContent.scrollLeft;
    const itemLeft = itemRect.left - containerRect.left + scrollLeft;
    const itemWidth = itemRect.width;
    const containerWidth = containerRect.width;
    
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

function BlogLayout({ children }: { children: React.ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const extractHeadings = () => {
      const mainContent = document.querySelector('main') || document.body;
      const headingElements = mainContent.querySelectorAll('h1, h2, h3');
      const extractedHeadings: Heading[] = [];

      headingElements.forEach((element) => {
        let id = element.id;
        
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
        
        if (!id) return;
        
        const level = parseInt(element.tagName.charAt(1));
        const text = element.textContent?.trim() || '';
        
        if (text) {
          extractedHeadings.push({ id, text, level });
        }
      });

      setHeadings(extractedHeadings);
    };

    const timeoutId1 = setTimeout(extractHeadings, 100);
    const timeoutId2 = setTimeout(extractHeadings, 500);
    const timeoutId3 = setTimeout(extractHeadings, 1000);
    
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

function AnimatedName() {
  return (
    <Link to="/" className="flex mb-8 font-medium text-gray-400 fade-in">
      ./danielkim.sh
    </Link>
  );
}

interface CommentsProps {
  page: string;
}

function Comments({ page }: CommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments?page=${encodeURIComponent(page)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [page]);

  const curlCommand = origin 
    ? `curl -X POST ${origin}/api/comments -H "Content-Type: application/json" -d '{"page":"${page}","author":"Your Name","content":"Your comment here"}'`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="mt-16 pt-8 border-t-2 border-gray-300">
      <h2 className="text-gray-900 font-semibold text-2xl mt-8 mb-6">Comments</h2>
      
      {curlCommand && (
        <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Copy this command to add a comment:</p>
            <button
              onClick={copyToClipboard}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 bg-white rounded-md border border-gray-300 hover:border-blue-400"
            >
              Copy
            </button>
          </div>
          <pre className="curl-command-pre text-xs overflow-x-auto p-4 rounded-md border border-gray-400 font-mono shadow-inner">
            <code>{curlCommand}</code>
          </pre>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm">Loading comments...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {!loading && !error && comments.length > 0 && (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-white border-l-4 border-blue-500 pl-5 py-4 pr-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <p className="font-semibold text-gray-900 text-base">{comment.author}</p>
                <span className="text-xs text-gray-500 font-medium">{formatDate(comment.timestamp)}</span>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

function ImageGallery({ images, alt = '' }: ImageGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-6">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src={src}
              alt={alt ? `${alt} ${i + 1}` : ''}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-light cursor-pointer z-[1000] bg-transparent border-none"
            onClick={() => setSelected(null)}
          >
            &times;
          </button>
          <img
            src={images[selected]}
            alt={alt ? `${alt} ${selected + 1}` : ''}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

interface BlogPostTemplateProps {
  data: {
    mdx: {
      frontmatter: {
        title?: string;
        date?: string;
      };
      body: string;
    };
  };
  pageContext: {
    slug: string;
  };
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ data, pageContext }) => {
  const { frontmatter, body } = data.mdx;
  const slug = pageContext.slug;

  const components = {
    AnimatedName,
    Comments: (props: any) => <Comments page={slug} />,
    ImageGallery,
  };

  return (
    <Layout>
      <BlogLayout>
        <AnimatedName />
        <h1 className="font-medium text-gray-900 text-3xl mb-4">
          {frontmatter.title || 'Untitled Post'}
        </h1>
        {frontmatter.date && (
          <p className="text-gray-500 text-sm mb-8">{frontmatter.date}</p>
        )}
        <MDXRenderer components={components}>
          {body}
        </MDXRenderer>
      </BlogLayout>
    </Layout>
  );
};

export default BlogPostTemplate;

export const Head = ({ data }: BlogPostTemplateProps) => (
  <>
    <title>{data.mdx.frontmatter.title || 'Blog Post'} - ./danielkim.sh</title>
    <meta 
      name="description" 
      content={`${data.mdx.frontmatter.title || 'Blog post'} by Daniel Kim`} 
    />
  </>
);

export const query = graphql`
  query ($slug: String!) {
    mdx(fileAbsolutePath: { regex: $slug }) {
      body
      frontmatter {
        title
        date
      }
    }
  }
`;