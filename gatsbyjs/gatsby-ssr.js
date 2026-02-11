import React from 'react';

export const onRenderBody = ({ setHeadComponents, setPreBodyComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <link
      key="preconnect-google"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="preconnect-gstatic"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="google-fonts"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />,
  ]);
  
  setHeadComponents([
    <link
      key="icon"
      rel="icon"
      href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍜</text></svg>"
    />,
  ]);

  setPostBodyComponents([
    <script
      key="simpleanalytics"
      src="https://scripts.simpleanalyticscdn.com/latest.js"
      async
    />,
    <script
      key="gtm"
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-312S1SP8T7"
    />,
    <script
      key="gtag-config"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-312S1SP8T7');
        `,
      }}
    />,
  ]);
};