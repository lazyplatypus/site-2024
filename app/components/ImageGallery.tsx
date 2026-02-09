'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export function ImageGallery({ images, alt = '' }: ImageGalleryProps) {
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
