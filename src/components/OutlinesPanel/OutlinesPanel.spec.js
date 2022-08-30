import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Basic } from './OutlinesPanel.stories';
import outlineUtils from '../../helpers/OutlineUtils';

const BasicOutlinesPanel = withProviders(Basic);

const NOOP = () => { };

jest.mock('core', () => ({
  getTool: (toolName) => ({
    clearOutlineDestination: NOOP,
  }),
  setToolMode: NOOP,
  goToOutline: NOOP,
  addEventListener: NOOP,
  removeEventListener: NOOP,
  getOutlines: NOOP,
  getDocumentViewer: () => ({
    getDocument: () => ({
      getViewerCoordinates: () => ({ x: 0, y: 0 }),
    }),
  }),
}));

describe('OutlinesPanel', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutlinesPanel />);
    }).not.toThrow();
  });

  it('Clicks on one outline should make it selected', async () => {
    const { container } = render(<BasicOutlinesPanel />);

    const outlineElements = container.querySelectorAll('.outline-drag-container');
    const outlineSingle = outlineElements[0].querySelector('.bookmark-outline-single-container');

    expect(outlineSingle.className).toContain('default');

    // use userEvent since .bookmark-outline-single-container is not a button
    userEvent.click(outlineSingle);

    await waitFor(() => {
      // use waitFor since there's a 300ms delay before setting an outline as active
      expect(outlineSingle.className).toContain('default selected');
    });
  });

  it('Clicks the Add Outline button should show an input element', async () => {
    const { container } = render(<BasicOutlinesPanel />);

    const addNewOutline = jest.spyOn(outlineUtils, 'addNewOutline');
    addNewOutline.mockImplementation(() => { });

    let textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).toBeNull();

    const addItemButton = container.querySelector('.add-new-button');
    expect(addItemButton.className).toContain('Button');
    fireEvent.click(addItemButton);

    textInput = container.querySelector('.bookmark-outline-input');
    expect(textInput).not.toBeNull();
    fireEvent.change(textInput, { target: { value: 'new outline' } });
    fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter' });

    expect(addNewOutline).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(addNewOutline).toHaveBeenCalledWith('new outline', null, undefined, 0, 0, 0);
    });

    addNewOutline.mockRestore();
  });
});
