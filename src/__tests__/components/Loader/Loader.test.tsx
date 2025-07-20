import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from '../../../components/Loader/Loader';

describe('Loader', () => {
  it('renders the loading indicator and text', () => {
    render(<Loader />);

    expect(screen.getByText(/Loading Pokemon\.\.\./i)).toBeInTheDocument();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has appropriate ARIA labels for screen readers', () => {
    render(<Loader />);

    const loaderContainer = screen.getByRole('status');

    expect(loaderContainer).toHaveAttribute('role', 'status');

    expect(loaderContainer).toHaveAttribute('aria-live', 'polite');
  });
});
