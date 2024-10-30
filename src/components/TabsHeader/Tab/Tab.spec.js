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

    const element = screen.getByRole('tab', { name: 'testfile' });
    expect(element).toHaveAttribute('aria-controls', 'document-container-testfile');
  });

  it('Component should have an Aria Label for the close button', () => {
    render(<TestTab tab={tabObject} />);

    const element = screen.getByLabelText('Close testfile');
    expect(element).toHaveAttribute('aria-label', 'Close testfile');
    expect(element).toBeInTheDocument();
  });

  it('Component should have an Aria Label for the filename', () => {
    render(<TestTab tab={tabObject} isActive={true} ariaSelected={true}/>);

    const element = screen.getByRole('tab', { name: 'testfile' });
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-label', 'testfile');
    expect(element).toHaveAttribute('aria-selected', 'true');
  });
});