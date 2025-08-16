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
