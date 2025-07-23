import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AboutPage from '@pages/AboutPage';
import MainPage from '@pages/MainPage';
import NotFoundPage from '@pages/NotFoundPage';

import App from './App';

const router = createBrowserRouter([
  {
    children: [
      {
        element: <MainPage />,
        index: true,
      },
      {
        element: <AboutPage />,
        path: 'about',
      },
    ],
    element: <App />,
    errorElement: <NotFoundPage />,
    path: '/',
  },
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.warn('Root element with ID "root" not found in the document.');
  throw new Error('Root element not found!');
}
