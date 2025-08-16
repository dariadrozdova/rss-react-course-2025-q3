import type { Metadata } from 'next';

import '@/app/globals.css';

import StoreProvider from '@/app/StoreProvider';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'RS School React Project',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
