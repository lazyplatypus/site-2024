"use client";

import React, { useState } from 'react';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white p-6 rounded-lg border border-gray-200 w-80">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        <img 
          src="https://utfs.io/f/Ftq6SQId0j8SjfJYUDNpdZxPseMzDB9S8iHtvYhnKQX0LIuO" 
          alt="Newsletter banner"
          className="w-1/2 mb-4 rounded-lg mx-auto block"
        />
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/dgkim197"
          method="post"
          target="popupwindow"
          onSubmit={() => {
            setIsLoading(true);
            window.open('https://buttondown.email/dgkim197', 'popupwindow', 'scrollbars=yes,width=800,height=600');
            return true;
          }}
          className="space-y-4 embeddable-buttondown-form"
        >
          <input
            type="email"
            name="email"
            id="bd-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors underline decoration-wavy disabled:opacity-50"
          >
            {isLoading ? 'Subscribing...' : 'gimme more'}
          </button>
        </form>
      </div>
    </div>
  );
}
