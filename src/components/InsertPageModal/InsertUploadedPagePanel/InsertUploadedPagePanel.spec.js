import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InsertUploadedPagePanel from './InsertUploadedPagePanel';
import userEvent from '@testing-library/user-event';

const TestInsertUploadedPagePanel = withProviders(InsertUploadedPagePanel);


const mockDocument = {
  getPageCount: () => 20,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/200/300?image=2' }))),
  cancelLoadThumbnail: noop,
};

const noop = () => { };


describe('InsertUploadedPagePanel', () => {
  it('renders the thumbnnails as expected and various inputs', async () => {
    const props = {
      sourceDocument: mockDocument,
      closeModal: noop,
      clearLoadedFile: noop,
      insertPages: noop,
      loadedDocumentPageCount: 10,
      closeModalWarning: noop,
    };

    render(<TestInsertUploadedPagePanel {...props} />);

    const checkboxes = await screen.findAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockDocument.getPageCount());

    const radios = await screen.findAllByRole('radio');
    expect(radios).toHaveLength(2);

    const textbox = await screen.findAllByRole('textbox');
    expect(textbox).toHaveLength(1);

    screen.getByText('Deselect All');
    screen.getByText('Add Page(s)');
    screen.getByText(`Select Pages to Add (${mockDocument.getPageCount()})`);
  });

  it('If no thumbnails are selected, the add pages button is disabled', async () => {
    const props = {
      sourceDocument: mockDocument,
      closeModal: noop,
      clearLoadedFile: noop,
      insertPages: noop,
      loadedDocumentPageCount: 10,
      closeModalWarning: noop,
    };

    render(<TestInsertUploadedPagePanel {...props} />);

    const addPagesButton = await screen.findByRole('button', { name: 'Add Page(s)' });
    expect(addPagesButton).not.toBeDisabled();

    const deselectAll = await screen.findByRole('button', { name: 'Deselect All' });
    userEvent.click(deselectAll);
    expect(addPagesButton).toBeDisabled();
  });

  it('All thumbnails are selected by default when the document is loaded', async () => {
    const props = {
      sourceDocument: mockDocument,
      closeModal: noop,
      clearLoadedFile: noop,
      insertPages: noop,
      loadedDocumentPageCount: 10,
      closeModalWarning: noop,
    };

    render(<TestInsertUploadedPagePanel {...props} />);

    const checkboxes = await screen.findAllByRole('checkbox');
    screen.getByText(`Select Pages to Add (${mockDocument.getPageCount()})`);

    const addPagesButton = await screen.findByRole('button', { name: 'Add Page(s)' });
    expect(addPagesButton).not.toBeDisabled();

    userEvent.click(checkboxes[1]);
    screen.getByText(`Select Pages to Add (${mockDocument.getPageCount() - 1})`);
  });

  it('pressing the deselect all button deselects all thumbnails', async () => {
    const props = {
      sourceDocument: mockDocument,
      closeModal: noop,
      clearLoadedFile: noop,
      insertPages: noop,
      loadedDocumentPageCount: 10,
      closeModalWarning: noop,
    };

    render(<TestInsertUploadedPagePanel {...props} />);

    const checkboxes = await screen.findAllByRole('checkbox');
    screen.getByText(`Select Pages to Add (${mockDocument.getPageCount()})`);

    const deselectAll = await screen.findByRole('button', { name: 'Deselect All' });
    userEvent.click(deselectAll);
    screen.getByText('Select Pages to Add (0)');

    const checkedBoxes = checkboxes.filter((checkbox) => checkbox.checked);
    expect(checkedBoxes.length).toBe(0);
  });

  it('if a user inputs an invalid page location, the input defaults to empty string, an error is shown and the add button is disabled', async () => {
    const props = {
      sourceDocument: mockDocument,
      closeModal: noop,
      clearLoadedFile: noop,
      insertPages: noop,
      loadedDocumentPageCount: 10,
      closeModalWarning: noop,
    };

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    render(<TestInsertUploadedPagePanel {...props} />);

    const textboxes = await screen.findAllByRole('textbox');
    const pageInput = textboxes[0];

    // Loaded doc only has 10 pages
    userEvent.clear(pageInput);
    userEvent.type(pageInput, '20');

    screen.getByText('Invalid page number. Limit is 10');
    fireEvent.blur(pageInput);

    expect(pageInput.value).toEqual('');

    userEvent.clear(pageInput);
    userEvent.type(pageInput, '2024, easter bunny');
    screen.getByText('Invalid page number. Limit is 10');

    fireEvent.blur(pageInput);

    expect(pageInput.value).toEqual('');
    const addPagesButton = await screen.findByRole('button', { name: 'Add Page(s)' });
    expect(addPagesButton).toBeDisabled();

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('check all handlers are correctly called', async () => {
    const closeModalMock = jest.fn();
    const clearLoadedFileMock = jest.fn();
    const insertPagesMock = jest.fn();
    const closeModalWarningMock = jest.fn();

    const props = {
      sourceDocument: mockDocument,
      closeModal: closeModalMock,
      clearLoadedFile: clearLoadedFileMock,
      insertPages: insertPagesMock,
      loadedDocumentPageCount: 10,
      closeModalWarning: closeModalWarningMock,
    };

    render(<TestInsertUploadedPagePanel {...props} />);

    const buttons = await screen.findAllByRole('button');
    // There are four buttons on this modal
    // Back, Close, Deselect, Add Pages
    expect(buttons.length).toBe(4);

    const backButton = screen.getByLabelText('Back');
    userEvent.click(backButton);
    expect(clearLoadedFileMock).toBeCalled();

    // Close button shows a warning
    const closeButton = screen.getByLabelText('Cancel');
    userEvent.click(closeButton);
    expect(closeModalWarningMock).toBeCalled();

    // Select a checkbox and press Add Page
    const checkboxes = await screen.findAllByRole('checkbox');
    userEvent.click(checkboxes[0]);
    const addPagesButton = await screen.findByRole('button', { name: 'Add Page(s)' });
    userEvent.click(addPagesButton);
    expect(insertPagesMock).toBeCalled();
    expect(closeModalMock).toBeCalled();
  });
});
