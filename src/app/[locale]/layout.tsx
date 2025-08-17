import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import type { Metadata } from 'next';

import '@/app/globals.css';

import StoreProvider from '@/providers/StoreProvider';
import Header from '@/components/Header';
import { routing } from '@/i18n/routing';
import { classNames } from '@/utils/classNames';
import ThemeInitScript from '@/utils/themeInitScript';

export const metadata: Metadata = { title: 'RS School React Project' };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <div
              className={classNames('max-w-7xl w-full mx-auto', 'p-4 md:p-8')}
            >
              <Header />
              {children}
            </div>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
