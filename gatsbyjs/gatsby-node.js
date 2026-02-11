const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve('./src/templates/blog-post.tsx');

  const result = await graphql(`
    query {
      allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "blog" } }) {
        nodes {
          name
          childMdx {
            frontmatter {
              title
              date
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error(result.errors);
    return;
  }

  const blogPosts = result.data.allFile.nodes;
  const postsWithDate = blogPosts.filter(node => 
    node.childMdx?.frontmatter?.date
  );

  postsWithDate.forEach((node) => {
    createPage({
      path: `/blog/${node.name}`,
      component: blogPostTemplate,
      context: {
        slug: node.name,
      },
    });
  });
};