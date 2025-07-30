import { store } from '@store/index';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@/context/ThemeContext';

interface AllTheProvidersProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>{children}</ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

const customRender = (ui: ReactElement) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllTheProviders>{children}</AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper });
};

export * from '@testing-library/react';

export { customRender as render };
