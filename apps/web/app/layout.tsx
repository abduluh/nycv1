import './globals.css';

export const metadata = {
  title: 'NYC Rent Search - Find Your Perfect NYC Rental',
  description: 'Search verified, furnished NYC rentals across Zillow, Airbnb, StreetEasy, and Craigslist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-gray-900 antialiased font-sans">{children}</body>
    </html>
  );
}
