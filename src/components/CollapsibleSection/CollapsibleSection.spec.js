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