import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

function AnimatedName() {
  return (
    <h1 className="font-medium pt-12 transition-element">
      <span className="sr-only">./danielkim.sh</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out">
          {'./danielkim.sh'.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}

interface Writing {
  slug: string;
  title: string;
  date: string;
}

interface IndexPageProps {
  data: {
    allMdx: {
      nodes: Array<{
        fileAbsolutePath?: string;
      }>;
    };
    allFile: {
      nodes: Array<{
        name: string;
        relativeDirectory?: string;
        childMdx?: {
          frontmatter?: {
            date?: string;
            title?: string;
          };
        };
      }>;
    };
  };
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const writings: Writing[] = data.allFile.nodes
    .map((node) => {
      const slug = node.name;
      return {
        slug,
        title: node.childMdx?.frontmatter?.title || slug.replace(/-/g, ' '),
        date: node.childMdx?.frontmatter?.date || '',
      };
    })
    .filter((w) => w.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Layout>
      <AnimatedName />
      <div className="text-gray-800 space-y-4 leading-snug">
        <br />
        <p>Welcome to my little piece of the internet. I'm currently the Head of Growth at <Link to="https://www.cerebras.ai" className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline">Cerebras Systems</Link>, the world's fastest provider of AI Inference built on the Cerebras Wafer-Scale Engine. Before this, I led Developer Relations at <Link to="https://www.newrelic.com" className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline">New Relic</Link>.</p>
        <img 
          src="https://danielkimblog.b-cdn.net/profile.jpg" 
          alt="Profile"
          className="w-full max-w-[1000px] h-auto"
        />
        <p>I live in sunny and foggy San Francisco, CA. You can find me relaxing in the park, eating spicy noodles, and recently running!</p>
        <p>Here are some of my writings:</p>
        <ul className="space-y-2 list-none pl-0">
          {writings.map(({ slug, title, date }) => (
            <li key={slug}>
              <Link to={`/blog/${slug}`} className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline">
                {title}
              </Link>
              <span className="text-gray-500 text-sm ml-2">{date}</span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>./danielkim.sh</title>
    <meta name="description" content="Daniel Kim. Software Engineer. Creator. Vibes." />
  </>
);

export const query = graphql`
  query {
    allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "blog" } }) {
      nodes {
        name
        childMdx {
          frontmatter {
            date
            title
          }
        }
      }
    }
  }
`;