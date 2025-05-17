import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { Editable } from './OutlinesPanel.stories';
import outlineUtils from '../../helpers/OutlineUtils';
import core from 'core';

// const BasicOutlinesPanel = withProviders(Editable);
const BasicOutlinesPanel = {};

const NOOP = () => { };
jest.mock('core', () => ({
  getTool: (toolName) => ({
    clearOutlineDestination: NOOP,
  }),
  setToolMode: NOOP,
  goToOutline: jest.fn(),
  addEventListener: NOOP,
  removeEventListener: NOOP,
  getOutlines: NOOP,
  getDocumentViewer: () => ({
    getDocument: () => ({
      getViewerCoordinates: () => ({ x: 0, y: 0 }),
      getPageRotation: () => 0,
    }),
    getAccessibleReadingOrderManager: NOOP,
  }),
}));

// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('OutlinesPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutlinesPanel />);
    }).not.toThrow();
  });

  it('Clicks on one outline should make it active and clicks on the panel empty area should deselect the selected outline', async () => {
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

    const outlinePanelEmptyArea = container.querySelector('.bookmark-outline-row');
    fireEvent.click(outlinePanelEmptyArea);
    const outlineSingleAfterClickingOutside = outlineElements[0].querySelector('.bookmark-outline-single-container');
    await waitFor(() => {
      expect(outlineSingleAfterClickingOutside.className).not.toContain('selected');
    });
  });

  it('Clicks on expand button should not call goToOutline', async () => {
    const { container } = render(<BasicOutlinesPanel />);
    const outlineElements = container.querySelectorAll('.outline-drag-container');
    const outlineSingle = outlineElements[0].querySelector('.bookmark-outline-single-container');
    const expandButton = outlineSingle.querySelector('.panel-list-button');

    userEvent.click(expandButton);

    await new Promise((resolve) => setTimeout(resolve, 400));
    await waitFor(() => {
      expect(core.goToOutline).not.toHaveBeenCalled();
    });
    core.goToOutline.mockClear();

  });

  it('Clicks on flyout button should not call goToOutline', async () => {
    const { container } = render(<BasicOutlinesPanel />);
    const outlineElements = container.querySelectorAll('.outline-drag-container');
    const outlineSingle = outlineElements[0].querySelector('.bookmark-outline-single-container');
    userEvent.hover(outlineSingle);
    const flyoutButton = outlineSingle.querySelector('.toggle-more-button');

    userEvent.click(flyoutButton);

    await new Promise((resolve) => setTimeout(resolve, 400));
    await waitFor(() => {
      expect(core.goToOutline).not.toHaveBeenCalled();
    });
    core.goToOutline.mockClear();
  });

  it('Clicks the Add Outline button should show an input element and add an outline', async () => {
    render(<BasicOutlinesPanel />);

    const addNewOutline = jest.spyOn(outlineUtils, 'addNewOutline');
    addNewOutline.mockImplementation(() => { });

    const addItemButton = screen.getByRole('button', { name : 'Add Outlines' });
    expect(addItemButton).toBeInTheDocument();
    addItemButton.click();

    const textInput = screen.getByRole('textbox', { name: 'New Outline Title' });
    expect(textInput).not.toBeNull();
    fireEvent.change(textInput, { target: { value: 'new outline' } });
    fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter' });

    expect(addNewOutline).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(addNewOutline).toHaveBeenCalledWith('new outline', null, 1, 0, 0, 0);
    });

    addNewOutline.mockRestore();
  });

  it('In multi-select mode, add button is enabled when no outline is selected and delete button is enabled when at least one outline is selected', async () => {
    const { container } = render(<BasicOutlinesPanel />);
    const multiSelectButton = container.querySelector('[data-element="outlineMultiSelect"]');
    expect(multiSelectButton.className).toContain('Button TextButton modular-ui');
    await multiSelectButton.click();

    const addNewContainer = container.querySelector('[data-element="addNewOutlineButtonContainer"]');
    const addNewButton = addNewContainer.firstChild;
    const deleteButton = addNewContainer.lastChild;
    expect(addNewButton).not.toBeDisabled();
    expect(deleteButton).toBeDisabled();

    screen.getByRole('checkbox', { name : 'Introduction' }).click();

    expect(screen.getByRole('checkbox', { name : 'Introduction' })).toBeChecked();
    expect(addNewButton).toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });

  it('In multi-select mode, Add Outline button should have aria label', async () => {
    render(<BasicOutlinesPanel />);
    const multiSelectButton = screen.getByRole('button' , { name: 'Edit Outlines' });
    userEvent.click(multiSelectButton);
    screen.getByRole('button', { name: 'Add Outlines' });
  });

  it('Should have h2 element for title', async () => {
    render(<BasicOutlinesPanel />);
    const title = screen.getByRole('heading', { name: 'Outlines' });
    expect(title).toHaveClass('header-title');
  });
});
