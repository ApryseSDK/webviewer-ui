import React from 'react';
import { render, screen } from '@testing-library/react';
import Tab from './Tab';

const TestTab = withProviders(Tab);

const tabObject = {
  options: {
    filename: 'testfile',
  }
};

describe('Tab', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<TestTab tab={tabObject} />);
    }).not.toThrow();
  });

  it('Component should have Aria Controls defined', () => {
    render(<TestTab tab={tabObject} />);

    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-controls');
  });

  it('Component should have an Aria Label for the filename', () => {
    render(<TestTab tab={tabObject} />);

    const element = screen.getByLabelText('Close testfile');
    expect(element).toBeInTheDocument();
  });
});