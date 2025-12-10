import React from 'react';
import { Link } from 'next-view-transitions';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';

async function getWritings() {
  const directory = path.join(process.cwd(), 'app/blog');
  const filenames = fs.readdirSync(directory);
  
  const writings = await Promise.all(
    filenames
      .filter(filename => {
        const filePath = path.join(directory, filename);
        const stats = fs.statSync(filePath);
        // Only include directories that have a page.mdx file
        if (stats.isDirectory()) {
          const pagePath = path.join(filePath, 'page.mdx');
          return fs.existsSync(pagePath);
        }
        return false;
      })
      .map(async (filename) => {
        const filePath = path.join(directory, filename);
        const pagePath = path.join(filePath, 'page.mdx');
        const slug = path.parse(filename).name;
        
        // Try to read metadata from MDX file
        let date: string;
        let title: string = slug.replace(/-/g, ' ');
        
        try {
          const fileContent = fs.readFileSync(pagePath, 'utf-8');
          // Extract metadata export (using [\s\S] instead of . with s flag for compatibility)
          const metadataMatch = fileContent.match(/export\s+const\s+metadata\s*=\s*\{([\s\S]+?)\}/);
          if (metadataMatch) {
            const metadataContent = metadataMatch[1];
            // Extract date field
            const dateMatch = metadataContent.match(/date:\s*['"]([^'"]+)['"]/);
            if (dateMatch) {
              date = dateMatch[1];
            } else {
              // Fallback to file modification time
              const stats = fs.statSync(filePath);
              date = stats.mtime.toISOString().split('T')[0];
            }
            // Extract title if available
            const titleMatch = metadataContent.match(/title:\s*['"]([^'"]+)['"]/);
            if (titleMatch) {
              title = titleMatch[1];
            }
          } else {
            // Fallback to file modification time
            const stats = fs.statSync(filePath);
            date = stats.mtime.toISOString().split('T')[0];
          }
        } catch (error) {
          // Fallback to file modification time
          const stats = fs.statSync(filePath);
          date = stats.mtime.toISOString().split('T')[0];
        }
        
        return {
          slug,
          title,
          date
        };
      })
  );

  return writings.sort((a, b) => b.date.localeCompare(a.date));
}

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

export default async function Home() {
  const writings = await getWritings();

  return (
    <>
      <AnimatedName />
      <div className="text-gray-800 space-y-4 leading-snug">
        <br></br>
        <p>Welcome to my little piece of the internet. I'm currently the Head of Growth at <Link href="https://www.cerebras.ai" className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline">Cerebras Systems</Link>, the world's fastest provider of AI Inference built on the Cerebras Wafer-Scale Engine. Before this, I led Developer Relations at <Link href="https://www.newrelic.com" className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline">New Relic</Link>.</p>
        <img 
            src="https://danielkimblog.b-cdn.net/profile.jpg" 
            alt="Profile"
            width="1000" 
            height="100"
          />
          <p>I live in sunny and foggy San Francisco, CA. You can find me relaxing in the park, eating spicy noodles, and recently running!
          </p>  
        <p>
          Here are some of my writings:
        </p>
        <ul className="space-y-2 list-none pl-0">
          {writings.map(({ slug, title, date }) => (
            <li key={slug}>
              <Link href={`/blog/${slug}`} className="text-blue-500 hover:text-blue-700 no-underline hover:no-underline">
                {title}
              </Link>
              <span className="text-gray-500 text-sm ml-2">{date}</span>
            </li>
          ))}
        </ul>  
      </div>
    </>
  );
}