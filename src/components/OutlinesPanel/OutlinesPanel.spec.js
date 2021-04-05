import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Basic } from './OutlinesPanel.stories';
import core from 'core';

const BasicOutlinesPanel = withI18n(Basic);

jest.mock('core');

describe('OutlinesPanel', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutlinesPanel />);
    }).not.toThrow();
  });

  it('Clicks on one outline should make it selected', () => {
    const { container } = render(<BasicOutlinesPanel />);

    let outlineElements = container.querySelectorAll('.Outline');
    const contentButton = outlineElements[0].querySelector('.content .row .contentButton');
    const firstRow = outlineElements[0].querySelector('.content .row');

    expect(firstRow.className).toBe('row');
    fireEvent.click(contentButton);
    expect(firstRow.className).toBe('row selected');
  });
});
