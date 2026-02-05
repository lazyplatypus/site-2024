'use client';

import { AnimatedName } from '../animated-name';

interface OffsitePageTitleProps {
  /** Second line below ./danielkim.sh (e.g. "offsite postmortem"). When title is not provided, only this and AnimatedName are shown. */
  subtitle: string;
  /** Optional first block; when omitted, top is just AnimatedName + subtitle. */
  title?: string;
}

function linesAfterPeriod(text: string) {
  const parts = text.split(/\.\s+/).filter(Boolean);
  return parts.map((part) => (part.endsWith('.') ? part : `${part}.`));
}

export function OffsitePageTitle({ title, subtitle }: OffsitePageTitleProps) {
  const subtitleLines = linesAfterPeriod(subtitle);

  if (!title) {
    return (
      <header>
        <h4 className="font-medium pt-12 mb-0 fade-in">
          {subtitleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < subtitleLines.length - 1 && <br />}
            </span>
          ))}
        </h4>
        <AnimatedName />
      </header>
    );
  }

  const titleLines = linesAfterPeriod(title);

  return (
    <header className="pt-12 pb-4 fade-in">
      <h1 className="font-medium text-3xl sm:text-4xl text-wrap balance mb-0">
        {titleLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < titleLines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      <p className="mt-2 text-gray-600 text-base sm:text-lg mb-0">
        {subtitleLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < subtitleLines.length - 1 && <br />}
          </span>
        ))}
      </p>
      <div className="mt-2">
        <AnimatedName />
      </div>
    </header>
  );
}
