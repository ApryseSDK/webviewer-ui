import React from 'react';
import { render, screen } from '@testing-library/react';
import StandardRubberStamps from './StandardRubberStamps';

const TestStandardRubberStamps = withProviders(StandardRubberStamps);

function noop() {}

describe('StandardRubberStamps', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<TestStandardRubberStamps standardStamps={[]} selectedStampeIndex={0} setSelectedRubberStamp={noop}/>);
    }).not.toThrow();
  });

  it('Component should have Aria Controls defined', () => {
    render(<TestStandardRubberStamps standardStamps={[]} selectedStampeIndex={0} setSelectedRubberStamp={noop}/>);

    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-controls');
  });
});
