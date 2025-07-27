import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkeletonCardList from '@components/SkeletonCardList';

describe('SkeletonCardList', () => {
  it('renders with default count of 20 skeleton cards', () => {
    const cardsNumber = 20;
    const { container } = render(<SkeletonCardList />);

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer.children).toHaveLength(cardsNumber);
  });

  it('renders with count of 0 when provided', () => {
    const { container } = render(<SkeletonCardList count={0} />);

    const gridContainer = container.firstChild as HTMLElement;
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer.children).toHaveLength(0);
  });
});
