import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { InsertBlankPagePanel, InsertUploadedPagePanel as InsertUploadedPagePanelStory } from './InsertPageModal.stories';
import userEvent from '@testing-library/user-event';
import { insertAbove } from 'helpers/pageManipulationFunctions';
import InsertPageModalComponent from './InsertPageModal';
import InsertUploadedPagePanel from './InsertUploadedPagePanel/InsertUploadedPagePanel';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'src/redux/actions';

jest.mock('helpers/pageManipulationFunctions', () => ({
  ...jest.requireActual('helpers/pageManipulationFunctions'),
  insertAbove: jest.fn(),
  insertBelow: jest.fn(),
  exitPageInsertionWarning: jest.fn(),
}));

jest.mock('src/helpers/isDataElementLeftPanel', () => ({
  __esModule: true,
  default: jest.fn(() => true),
}));

jest.mock('core', () => ({
  getDocumentViewer: () => ({
    getAnnotationManager: jest.fn(),
    getDocument: jest.fn(),
  }),
  getAllowedFileExtensions: jest.fn(),
  insertBlankPages: jest.fn(),
}));

describe('InsertPageModal', () => {
  describe('Storybook component', () => {
    it('Renders InsertBlankPagePanel StoryBook component with file selected with no errors', async () => {
      expect(() => {
        render(<InsertBlankPagePanel />);
      }).not.toThrow();
    });

    it('Renders InsertUploadedPagePanel StoryBook component with file selected with no errors', async () => {
      expect(() => {
        render(<InsertUploadedPagePanelStory />);
      }).not.toThrow();
    });

    it('Opens custom dimension options when Custom is selected', () => {
      render(<InsertBlankPagePanel />);

      const customOption = screen.getByRole('option', { name: 'Custom' });
      expect(customOption).toBeInTheDocument();
      fireEvent.click(customOption);

      const unitSelector = screen.getByText('Units');
      expect(unitSelector).toBeInTheDocument();

      const widthInput = screen.getByDisplayValue('8.5');
      expect(widthInput).toBeInTheDocument();

      const heightInput = screen.getByDisplayValue('11');
      expect(heightInput).toBeInTheDocument();

      const addButton = document.getElementsByClassName('insertPageModalConfirmButton')[0];

      // add button gets disabled when width is set to 0
      fireEvent.change(widthInput, { target: { value: 0 } });
      expect(addButton).toBeDisabled();

      fireEvent.change(widthInput, { target: { value: 1 } });
      expect(addButton).not.toBeDisabled();

      // add button gets disabled when height is set to 0
      fireEvent.change(heightInput, { target: { value: 0 } });
      expect(addButton).toBeDisabled();

      fireEvent.change(heightInput, { target: { value: 1 } });
      expect(addButton).not.toBeDisabled();

      // click 'Letter' to make custom options go away
      const letterOption = screen.getByRole('option', { name: 'Letter' });
      expect(letterOption).toBeInTheDocument();
      fireEvent.click(letterOption);

      expect(unitSelector).not.toBeVisible();
      expect(widthInput).not.toBeVisible();
      expect(heightInput).not.toBeVisible();
    });

    it('Can use arrows to increment number of pages', () => {
      render(<InsertBlankPagePanel />);
      const numberInput = screen.getByDisplayValue(1);
      expect(numberInput).toBeInTheDocument();

      const upArrow = document.getElementsByClassName('increment-arrow-button')[0];
      const downArrow = document.getElementsByClassName('increment-arrow-button')[1];
      expect(upArrow).toBeInTheDocument();
      expect(downArrow).toBeInTheDocument();
      fireEvent.click(upArrow);
      expect(numberInput).toHaveValue(2);
      fireEvent.click(downArrow);
      expect(numberInput).toHaveValue(1);

      fireEvent.change(numberInput, { target: { value: 23 } });
      expect(numberInput).toHaveValue(23);
    });

    it('Add pages button is disabled by default in the upload page panel', () => {
      render(<InsertUploadedPagePanelStory />);
      const addButton = screen.getByRole('button', { name: 'Add Page(s)' });
      expect(addButton).toBeDisabled();
    });

    it('Add pages button is disabled if user enters an invalid page location', () => {
      render(<InsertBlankPagePanel />);

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const textboxes = screen.getAllByRole('textbox');
      const pageInput = textboxes[0];
      // Loaded doc only has 9 pages
      userEvent.clear(pageInput);
      userEvent.type(pageInput, '20');

      screen.getByText('Invalid page number. Limit is 9.');
      fireEvent.blur(pageInput);

      expect(pageInput.value).toEqual('');

      const addButton = screen.getByRole('button', { name: 'Add Page(s)' });
      expect(addButton).toBeDisabled();

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('MultiViewer mode', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
      });
      store.dispatch(actions.setIsMultiViewerMode(true));
      store.dispatch(actions.setActiveDocumentViewerKey(1));
    });

    afterEach(() => {
      store = null;
      jest.clearAllMocks();
    });

    it('inserts blank page into the active document viewer', async () => {
      const props = { isOpen: true, loadedDocumentPageCount: 9 };
      render(
        <Provider store={store}>
          <InsertPageModalComponent {...props} />
        </Provider>
      );

      let addPageButton = await screen.findByRole('button', { name: 'Add Page(s)' });
      userEvent.click(addPageButton);
      expect(insertAbove).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), 1);

      store.dispatch(actions.setActiveDocumentViewerKey(2));

      addPageButton = await screen.findByRole('button', { name: 'Add Page(s)' });
      userEvent.click(addPageButton);
      expect(insertAbove).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), 2);
      expect(insertAbove).toHaveBeenCalledTimes(2);
    });

    it('inserts uploaded page into the active document viewer', async () => {
      const insertPages = jest.fn();
      const mockDocument = {
        getPageCount: () => 20,
        getFilename: () => 'helloDarknessMyOldFriend.pdf',
        loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/200/300?image=2' }))),
        cancelLoadThumbnail: () => {},
      };
      const props = {
        insertPages,
        loadedDocumentPageCount: 10,
        sourceDocument: mockDocument,
        closeModal: () => {},
        clearLoadedFile: () => {},
        closeModalWarning: () => {},
      };
      store.dispatch(actions.setSelectedTab('insertUploadedPagePanelButton', 'insertPageModal'));

      render(
        <Provider store={store}>
          <InsertUploadedPagePanel {...props} />
        </Provider>
      );

      let addPageButton = await screen.findByRole('button', { name: 'Add Page(s)' });
      userEvent.click(addPageButton);
      expect(insertPages).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), 1);

      store.dispatch(actions.setActiveDocumentViewerKey(2));

      addPageButton = await screen.findByRole('button', { name: 'Add Page(s)' });
      userEvent.click(addPageButton);
      expect(insertPages).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), 2);
      expect(insertPages).toHaveBeenCalledTimes(2);
    });
  });
});
