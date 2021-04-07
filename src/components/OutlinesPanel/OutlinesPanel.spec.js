import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Basic } from './OutlinesPanel.stories';
import core from 'core';
import outlineUtils from '../../helpers/OutlineUtils';

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

  it('Clicks the Add item button should show an input element', () => {
    const addNewOutline = jest.spyOn(outlineUtils, 'addNewOutline');
    addNewOutline.mockImplementation(() => {});

    const { container } = render(<BasicOutlinesPanel />);

    let textInput = container.querySelector('.OutlineTextInput');
    expect(textInput).toBeNull();

    const addItemButton = container.querySelector(`[data-element="addNewOutlineButton"]`);
    fireEvent.click(addItemButton);

    textInput = container.querySelector('.OutlineTextInput');
    expect(textInput).not.toBeNull();

    fireEvent.change(textInput, { target: { value: 'new bookmark' } });
    fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter' });

    expect(addNewOutline).toHaveBeenCalledTimes(1);
    expect(addNewOutline).toHaveBeenCalledWith("new bookmark", null, undefined);

    addNewOutline.mockRestore();
  });
});
