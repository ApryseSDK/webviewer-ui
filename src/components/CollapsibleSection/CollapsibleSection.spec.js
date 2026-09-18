import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CollapsibleSection from './CollapsibleSection'; // Adjust import to match your file structure

test('should collapse or expand when the header is clicked', () => {
  // Render the CollapsibleSection initially collapsed
  const { queryByTestId } = render(
    <CollapsibleSection data-testid="collapsible-section" header={() => 'test collapsible section'} isInitiallyExpanded={false}>
      <div data-testid="child-items">Child items</div>
    </CollapsibleSection>
  );

  const collapsibleSection = screen.getByRole('button', { name: /test collapsible section/i });

  expect(collapsibleSection).toHaveAttribute('aria-expanded', 'false');

  expect(queryByTestId('child-items')).not.toBeInTheDocument();

  fireEvent.click(collapsibleSection);

  expect(collapsibleSection).toHaveAttribute('aria-expanded', 'true');

  expect(queryByTestId('child-items')).toBeInTheDocument();

  fireEvent.click(collapsibleSection);

  expect(collapsibleSection).toHaveAttribute('aria-expanded', 'false');

  expect(queryByTestId('child-items')).not.toBeInTheDocument();
});

test('retains the complete long header text', () => {
  const header = 'Once upon a time there was a lovely princess. But she had an enchantment upon her.';

  const { container } = render(
    <CollapsibleSection header={header}>
      <div>Child items</div>
    </CollapsibleSection>
  );

  const headerTextWrapper = container.querySelector('.collapsible-section-header-text');

  expect(headerTextWrapper).toBeInTheDocument();
  expect(headerTextWrapper).toHaveTextContent(header);
  expect(screen.getByRole('button', { name: header })).toBeInTheDocument();
});