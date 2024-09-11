import React from 'react';
import { Link } from 'next-view-transitions';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';

async function getWritings() {
  const directory = path.join(process.cwd(), 'app/blog');
  const filenames = fs.readdirSync(directory);
  
  const writings = filenames.map(filename => {
    const filePath = path.join(directory, filename);
    const stats = fs.statSync(filePath);
    return {
      slug: path.parse(filename).name,
      title: path.parse(filename).name.replace(/-/g, ' '),
      date: stats.mtime.toISOString().split('T')[0]
    };
  });

  return writings.sort((a, b) => b.date.localeCompare(a.date));
}

function AnimatedName() {
  return (
    <h1 className="font-medium pt-12 transition-element">
      <span className="sr-only">by Daniel Kim</span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out">
          {'by Daniel Kim'.split('').map((letter, index) => (
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
        <p>Welcome to my little piece of the internet. I'm currently the Head of Developer Relations at <Link href="https://www.cerebras.ai" className="text-blue-500 hover:text-blue-700">Cerebras Systems</Link>, the world's fastest provider of AI Inference built on the Cerebras Wafer-Scale Engine. Before this, I led Developer Relations at <Link href="https://www.newrelic.com" className="text-blue-500 hover:text-blue-700">New Relic</Link>.</p>
        <p>I live in sunny and foggy San Francisco, CA. You can find me relaxing in the park, eating spicy noodles, and recently running!
          </p>
          <p>
            This website was forked from  <Link href="https://leerob.io" className="text-blue-500 hover:text-blue-700">Lee Robinson</Link>'s website.
          </p>        
        <p>
          Here are some of my writings:
        </p>
        <ul className="space-y-2 list-none pl-0">
          {writings.map(({ slug, title, date }) => (
            <li key={slug}>
              <Link href={`/blog/${slug}`} className="text-blue-500 hover:text-blue-700">
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
