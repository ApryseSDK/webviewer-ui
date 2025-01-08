import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic } from './IndexPanelContent.stories';

jest.mock('core', () => ({
  getGroupAnnotations: () => [],
  getDisplayAuthor: () => '',
  canModify: () => true,
  canModifyContents: () => true,
  addEventListener: () => { },
  removeEventListener: () => { },
}));

describe('IndexPanelContent Component', () => {
  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<Basic />);
    }).not.toThrow();
  });

  it('Should show correct field name', () => {
    render(
      <Basic />
    );
    expect(screen.getByText('Signature Field 1')).toBeInTheDocument();
  });

  it('enters edit mode on double click', () => {
    render(
      <Basic />
    );
    const fieldNameElement = screen.getByText('Signature Field 1');
    fireEvent.doubleClick(fieldNameElement);
    expect(screen.getByDisplayValue('Signature Field 1')).toBeInTheDocument();
  });
});