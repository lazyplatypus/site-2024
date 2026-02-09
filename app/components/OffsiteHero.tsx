'use client';

import { AnimatedName } from '../animated-name';

interface OffsiteHeroProps {
  imageSrc: string;
  title?: string;
  subtitle?: string;
  imageOnly?: boolean;
  /** When true, do not render ./danielkim.sh in the right column (e.g. when it's already at page top). */
  hideAnimatedName?: boolean;
}

function linesAfterPeriod(text: string) {
  const parts = text.split(/\.\s+/).filter(Boolean);
  return parts.map((part) => (part.endsWith('.') ? part : `${part}.`));
}

export function OffsiteHero({ imageSrc, title = '', subtitle = '', imageOnly = false, hideAnimatedName = false }: OffsiteHeroProps) {
  if (imageOnly) {
    return (
      <div className="mb-8 fade-in">
        <div className="w-full max-w-[280px]">
          <div className="aspect-[3/4] w-full relative rounded-lg overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    );
  }

  const titleLines = linesAfterPeriod(title);
  const subtitleLines = linesAfterPeriod(subtitle);

  return (
    <header className="pt-8 mb-8 fade-in">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
        <div className="w-full sm:w-auto sm:flex-shrink-0 sm:max-w-[280px]">
          <div className="aspect-[3/4] w-full sm:w-[280px] relative rounded-lg overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h1 className="font-medium text-3xl sm:text-4xl text-wrap balance mb-0 space-y-3 flex flex-col">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg mb-0 space-y-2 flex flex-col">
            {subtitleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          {!hideAnimatedName && (
            <div className="mt-2">
              <AnimatedName />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
