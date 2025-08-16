import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(uk|en|ru|pt|be)/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
