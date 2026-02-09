'use client';

import { useState, useEffect, useRef } from 'react';

const BASE_URL = 'https://danielkimblog.b-cdn.net/offsite/walking/DSC';
const EXT = '.JPG';
const START = 882;
const END = 906;
const FRAME_MS = 10;

function frameUrl(n: number) {
  return `${BASE_URL}${String(n).padStart(5, '0')}${EXT}`;
}

export function HoverImageSequence({
  className = '',
  alt = '',
}: {
  className?: string;
  alt?: string;
}) {
  const [frame, setFrame] = useState(START);
  const nextFrameRef = useRef(START);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    for (let i = START; i <= END; i++) {
      const img = new Image();
      img.src = frameUrl(i);
    }
  }, []);

  useEffect(() => {
    const tick = (time: number) => {
      if (time - lastTimeRef.current >= FRAME_MS) {
        lastTimeRef.current = time;
        nextFrameRef.current += 1;
        if (nextFrameRef.current > END) nextFrameRef.current = START;
        setFrame(nextFrameRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <figure className={`my-6 w-full ${className}`}>
      <div className="w-full rounded-lg overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameUrl(frame)}
          alt={alt}
          className="w-full h-auto object-cover block"
          draggable={false}
        />
      </div>
    </figure>
  );
}
