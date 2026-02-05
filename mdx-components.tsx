import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'next-view-transitions';
import type { MDXComponents } from 'mdx/types';
import { highlight } from 'sugar-high';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children) {
      return extractText(props.children);
    }
  }
  return '';
};

const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const components: MDXComponents = {
  h1: (props: HeadingProps) => {
    const text = extractText(props.children);
    const id = props.id || generateId(text);
    return (
      <h1 id={id} className="font-medium text-3xl pt-8 mb-4 fade-in scroll-mt-8" {...props} />
    );
  },
  h2: (props: HeadingProps) => {
    const text = extractText(props.children);
    const id = props.id || generateId(text);
    return (
      <h2 id={id} className="text-gray-800 font-medium text-2xl mt-8 mb-3 scroll-mt-8" {...props} />
    );
  },
  h3: (props: HeadingProps) => {
    const text = extractText(props.children);
    const id = props.id || generateId(text);
    return (
      <h3 id={id} className="text-gray-800 font-medium text-xl mt-6 mb-2 scroll-mt-8" {...props} />
    );
  },
  h4: (props: HeadingProps) => <h4 className="font-medium pt-12 mb-0 fade-in" {...props} />,
  p: (props: ParagraphProps) => (
    <p className="text-gray-800 leading-relaxed mb-4" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="text-gray-800 list-decimal pl-5 space-y-2" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="text-gray-800 list-disc pl-5 space-y-1" {...props} />
  ),
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-bold bg-yellow-200 px-1 rounded" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className = 'text-blue-500 hover:text-blue-700';
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
    const codeHTML = highlight(children as string);
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700"
      {...props}
    />
  ),
  img: (props: ComponentPropsWithoutRef<'img'>) => {
    const { alt, src, ...rest } = props;
    if (alt) {
      return (
        <div className="my-6">
          <figure>
            <img
              src={src}
              alt={alt}
              className="w-full rounded-lg"
              {...rest}
            />
            <figcaption className="mt-2 text-sm text-gray-600 text-center italic">
              {alt}
            </figcaption>
          </figure>
        </div>
      );
    }
    return <img src={src} alt={alt} className="w-full rounded-lg my-6" {...rest} />;
  },
};

export function useMDXComponents(
  otherComponents: MDXComponents,
): MDXComponents {
  return {
    ...otherComponents,
    ...components,
  };
}
