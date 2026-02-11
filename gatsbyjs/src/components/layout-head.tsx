export const LayoutHead = () => (
  <>
    <html lang="en" className="[scrollbar-gutter:stable]">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍜</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
        <script
          src="https://scripts.simpleanalyticscdn.com/latest.js"
          async
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-312S1SP8T7"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-312S1SP8T7');
            `,
          }}
        />
      </body>
    </html>
  </>
);