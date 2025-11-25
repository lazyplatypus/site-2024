'use client';

import { useEffect, useState } from 'react';

export function TextHighlighting({ children }: { children: React.ReactNode }) {
  const [selectedText, setSelectedText] = useState<string>('');
  const [showHighlightButton, setShowHighlightButton] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowHighlightButton(false);
        return;
      }

      const selectedText = selection.toString().trim();
      if (selectedText.length === 0) {
        setShowHighlightButton(false);
        return;
      }

      setSelectedText(selectedText);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setHighlightPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 5,
      });
      setShowHighlightButton(true);
    };

    const handleClick = (e: MouseEvent) => {
      // Don't hide if clicking on the highlight button
      const target = e.target as HTMLElement;
      if (target.closest('.highlight-button')) {
        return;
      }
      setShowHighlightButton(false);
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    if (selectedText.length === 0) {
      return;
    }

    // Create a highlight span
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'text-highlight bg-yellow-200 px-1 rounded';
    highlightSpan.setAttribute('data-highlighted', 'true');

    try {
      range.surroundContents(highlightSpan);
    } catch (e) {
      // If surroundContents fails, try a different approach
      const contents = range.extractContents();
      highlightSpan.appendChild(contents);
      range.insertNode(highlightSpan);
    }

    // Clear selection
    selection.removeAllRanges();
    setShowHighlightButton(false);
  };

  return (
    <>
      {children}
      {showHighlightButton && selectedText && (
        <div
          className="highlight-button fixed z-50"
          style={{
            left: `${highlightPosition.x}px`,
            top: `${highlightPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
            onClick={handleHighlight}
          >
            Highlight
          </button>
        </div>
      )}
    </>
  );
}

