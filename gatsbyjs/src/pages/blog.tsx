import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

interface BlogPost {
  slug: string;
  frontmatter: {
    title?: string;
    date?: string;
  };
}

interface BlogPageProps {
  data: {
    allFile: {
      nodes: Array<{
        name: string;
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

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  const posts: BlogPost[] = data.allFile.nodes
    .map((node) => ({
      slug: `/blog/${node.name}`,
      frontmatter: {
        title: node.childMdx?.frontmatter?.title || node.name.replace(/-/g, ' '),
        date: node.childMdx?.frontmatter?.date || '',
      },
    }))
    .filter((post) => post.frontmatter.date)
    .sort((a, b) => (b.frontmatter.date || '').localeCompare(a.frontmatter.date || ''));

  return (
    <Layout>
      <h1 className="font-medium pt-12">Blog</h1>
      <div className="text-gray-800 space-y-6 leading-snug">
        <br />
        <ul className="space-y-4 list-none pl-0">
          {posts.map(({ slug, frontmatter: { title, date } }) => (
            <li key={slug} className="block">
              <Link 
                to={slug} 
                className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline text-lg font-medium"
              >
                {title}
              </Link>
              <br />
              <span className="text-gray-500 text-sm">{date}</span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default BlogPage;

export const Head = () => (
  <>
    <title>Blog - ./danielkim.sh</title>
    <meta name="description" content="Blog posts by Daniel Kim" />
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