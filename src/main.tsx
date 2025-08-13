import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import PokemonDetails from '@/components/PokemonDetails';
import AboutPage from '@/pages/AboutPage';
import MainPage from '@/pages/MainPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    children: [
      {
        children: [
          {
            element: <PokemonDetails />,
            path: 'details/:detailsId',
          },
        ],
        element: <MainPage />,
        path: '/',
      },
      {
        element: <AboutPage />,
        path: '/about',
      },
      {
        element: <NotFoundPage />,
        path: '*',
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
