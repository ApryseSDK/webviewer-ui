import React from 'react';
import { render, screen } from '@testing-library/react';

import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('announces that the document is loading', () => {
    render(<LoadingSkeleton />);

    expect(screen.getByRole('status', { name: 'Loading document' })).toHaveAttribute('aria-busy', 'true');
  });

  it('supports a context-specific accessible label', () => {
    render(<LoadingSkeleton ariaLabel="Loading WebViewer" />);

    expect(screen.getByRole('status', { name: 'Loading WebViewer' })).toBeInTheDocument();
  });

  it('renders without the global toolbar in viewer mode', () => {
    const { container } = render(<LoadingSkeleton variant="viewer" />);

    expect(container.querySelector('.LoadingSkeleton')).toHaveClass('LoadingSkeleton--viewer');
    expect(container.querySelector('.LoadingSkeleton__toolbar')).not.toBeInTheDocument();
  });
});
