export default function OffsiteLayout({ children }: { children: React.ReactNode }) {
  const preloadImages = [
    'https://danielkimblog.b-cdn.net/offsite/offsite1.jpg',
    'https://danielkimblog.b-cdn.net/offsite/224B9A63-87D6-43E9-BD1F-92087EDC0182_1_105_c.jpeg',
    'https://danielkimblog.b-cdn.net/offsite/DSC07297.JPG',
    'https://danielkimblog.b-cdn.net/offsite/DSC06831.JPG',
  ];

  return (
    <>
      {preloadImages.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
      {children}
    </>
  );
}
