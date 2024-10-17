import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileSelectedPanel from './FileSelectedPanel';
import { FileSelectedDesktop, ProcessingFileDesktop } from './FileSelectedPanel.stories';

const getMockDocument = ({ pageCount, documentName = 'test.pdf' }) => {
  return {
    getPageCount: () => (pageCount),
    getFilename: () => documentName,
    loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/g/200/300' })))
  };
};

const getMockLoadedAndSourceDocument = ({ pageCountLoadedDocument, pageCountSourceDocument }) => {
  const mockLoadedDocument = getMockDocument({ pageCount: pageCountLoadedDocument });
  const mockSourceDocument = getMockDocument({ pageCount: pageCountSourceDocument });

  return {
    mockLoadedDocument,
    mockSourceDocument,
  };
};

function noop() { }

const FileSelectedPanelWithRedux = withProviders(FileSelectedPanel);

describe('FileSelectedPanel', () => {
  describe('Storybook component', () => {
    it('Renders StoryBook component with file selected with no errors', async () => {
      // waitFor is needed as we must do the assertion once the promises in flight resolve
      // and the component has rendered all updates based on state changes
      await waitFor(() => {
        expect(() => {
          render(<FileSelectedDesktop />);
        }).not.toThrow();
      });
    });

    it('Renders StoryBook component with file processing screen with no errors', async () => {
      await waitFor(() => {
        expect(() => {
          render(<ProcessingFileDesktop />);
        }).not.toThrow();
      });
    });
  });

  describe('when file is loaded', () => {
    it('renders the correct number of thumbnails', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />,
      );

      // Since the thumbnails render asynchronously, we use find, since it returns a promise
      // it is ideal for things that are not available immediately, and is already wrapped in waitFor
      const checkboxes = await screen.findAllByRole('checkbox');
      expect(checkboxes).toHaveLength(pageCountSourceDocument);
    });

    it('when thumbnails are finished loading switch from a "Processing..." message to the thumbnails screen', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />,
      );

      // This tests two things
      // 1) That we finish loading our thumbnails and render them
      // 2) That we update our component state correctly and remove the Processing message
      await waitForElementToBeRemoved(() => screen.getByText(/Processing.../i));
    });

    it('selects all pages by default when the file is finished loading', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      // Source doc input is the second element of the array
      const sourceDocInput = screen.getAllByRole('textbox')[1];
      // We need to run waitFor once. This ensures all the promises in flight
      // that render the thumbnails are resolved before we start asserting
      await waitFor(() => expect(sourceDocInput).toHaveValue('1-10'));
    });

    it('when I select several thumbnails, it updates the input box of pages selected from source document', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      // Source doc input is the second element of the array
      const sourceDocInput = screen.getAllByRole('textbox')[1];
      // We need to run waitFor once. This ensures all the promises in flight
      // that render the thumbnails are resolved before we start asserting
      await waitFor(() => expect(sourceDocInput).toHaveValue('1-10'));

      // Now deselect all pages
      userEvent.click(screen.getByText(/Deselect All/i));

      const thumbnails = screen.getAllByRole('checkbox');
      expect(thumbnails).toHaveLength(pageCountSourceDocument);
      // Click on first thumbnail
      userEvent.click(thumbnails[0]);
      expect(sourceDocInput).toHaveValue('1');

      // Click on second thumbnail
      userEvent.click(thumbnails[1]);
      expect(sourceDocInput).toHaveValue('1-2');

      // Click on thumbnail for page 4
      userEvent.click(thumbnails[3]);
      expect(sourceDocInput).toHaveValue('1-2, 4');
    });

    it('when I have selected multiple pages from the thumbnail panel to replace, the modal renders this correctly', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });
      const selectedPageIndicesToReplace = [0, 1, 3, 5, 6];
      // We massage the string to look nicer. (We also test this thoroughly in  the PageInput component)
      const expectedString = '1-2, 4, 6-7';

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={selectedPageIndicesToReplace}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      // The text input for the loaded doc (doc we are manipulating) is the first one
      const loadedDocInput = screen.getAllByRole('textbox')[0];
      await waitFor(() => expect(loadedDocInput).toHaveValue(expectedString));
    });

    it('when a user presses the replace button, the replace handler gets called with the correct arguments', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });
      const selectedPageIndicesToReplace = [0, 1];
      const selectedPageNumbersToReplace = selectedPageIndicesToReplace.map((i) => i + 1);
      const replaceHandler = jest.fn();

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={selectedPageIndicesToReplace}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={replaceHandler}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      // Deselect all pages
      userEvent.click(await screen.findByText(/Deselect All/i));

      // Select a couple of thumbnails first
      // the difference between get* and find* is that find returns a promise
      // find is better for things that may not be available right away (it is wrapped in waitFor under the hood)
      const thumbnails = await screen.findAllByRole('checkbox');
      expect(thumbnails).toHaveLength(pageCountSourceDocument);

      // Select a few thumbnails
      userEvent.click(thumbnails[0]);// Select page 1
      userEvent.click(thumbnails[1]);// Select page 2
      userEvent.click(thumbnails[3]);// Select page 4

      // Now hit the replace button
      const replaceButton = screen.getByRole('button', { name: 'Replace' });
      userEvent.click(replaceButton);
      // Replace handler signature (all in page numbers)
      // replacePages(sourceDocument, pageToRemove, pagesToReplaceIntoDocument)
      expect(replaceHandler).toBeCalledWith(mockSourceDocument, selectedPageNumbersToReplace, [1, 2, 4]);
    });

    it('when a user presses "Deselect All"  button  it unticks all the checkboxes and clears the input', async () => {
      const pageCountSourceDocument = 4;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      const sourceDocInput = screen.getAllByRole('textbox')[1];
      // Make sure nothing is selected in the sourceDocument input
      await waitFor(() => expect(sourceDocInput).toHaveValue('1-4'));

      // Now deselect all pages
      const deselectAll = screen.getByRole('button', { name: 'Deselect All' });
      userEvent.click(deselectAll);

      const thumbnails = screen.getAllByRole('checkbox');
      expect(thumbnails).toHaveLength(pageCountSourceDocument);
      // Click on first thumbnail
      userEvent.click(thumbnails[0]);
      // Click on second thumbnail
      userEvent.click(thumbnails[1]);
      // Click on thumbnail for page 4
      userEvent.click(thumbnails[3]);

      // Check that we correctly show a nice formatted string in the input and that the correct number of checkboxes are ticked
      expect(sourceDocInput).toHaveValue('1-2, 4');
      const checkedThumbs = thumbnails.filter((thumb) => thumb.checked === true);
      expect(checkedThumbs.length).toEqual(3);

      // Now we press the "Deselect All" button
      userEvent.click(deselectAll);

      // Ensure all thumbnails are not checked
      thumbnails.forEach((thumb) => expect(thumb.checked).toBeFalsy());
      // And check the input was cleared
      waitFor(() => expect(sourceDocInput).toHaveValue(''));
    });

    it('renders an abbreviated filename correctly if filename longer than set threshold', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const mockLoadedDocument = getMockDocument({ pageCount: pageCountLoadedDocument, documentName: 'hellodarknessmyoldfriend.pdf' });
      const mockSourceDocument = getMockDocument({ pageCount: pageCountSourceDocument, documentName: 'thehitchhikersguidetothegalaxy.pdf' });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      // You only need to call waitFor once, and should keep it to one assertion per call
      await waitFor(() => {
        screen.getByText('"hellodarkn...friend.pdf"');
      });
      screen.getByText('"thehitchhi...galaxy.pdf"');
    });

    it('The replace button is disabled if no thumbnails are selected', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({
        pageCountLoadedDocument,
        pageCountSourceDocument,
      });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[1]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      const checkboxes = await screen.findAllByRole('checkbox');
      expect(checkboxes).toHaveLength(pageCountSourceDocument);

      // Deselect all pages
      userEvent.click(screen.getByText(/Deselect All/i));

      const replaceButton = screen.getByRole('button', { name: /Replace/i });
      expect(replaceButton).toBeDisabled();
    });

    it('The replace button is disabled if no pages to replace are selected', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({
        pageCountLoadedDocument,
        pageCountSourceDocument,
      });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      const checkboxes = await screen.findAllByRole('checkbox');
      expect(checkboxes).toHaveLength(pageCountSourceDocument);

      const replaceButton = screen.getByRole('button', { name: /Replace/i });
      expect(replaceButton).toBeDisabled();
    });

    it('The replace button is not disabled if at least one thumbnail is selected and there are pages selected to replace', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({
        pageCountLoadedDocument,
        pageCountSourceDocument,
      });

      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[1]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      const checkboxes = await screen.findAllByRole('checkbox');
      expect(checkboxes).toHaveLength(pageCountSourceDocument);
      userEvent.click(checkboxes[0]);

      const replaceButton = screen.getByRole('button', { name: /Replace/i });
      expect(replaceButton).not.toBeDisabled();
    });

    it('while the thumbnails are being processed, we disable the "Deselect All" button as there is nothing to select or deselect', () => {
      const mockLoadedDocument = getMockDocument({ pageCount: 10, documentName: 'hellodarknessmyoldfriend.pdf' });
      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          // sourceDocument={} //Simulate a perpetual loading state by not passing this prop
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      const deselectAllButton = screen.getByRole('button', { name: /Deselect All/i });
      expect(deselectAllButton).toBeDisabled();
    });

    it('once thumbnails are processed and rendered, we enable the "Deselect All" button', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });
      render(
        <FileSelectedPanelWithRedux
          closeThisModal={noop}
          clearLoadedFile={noop}
          pageIndicesToReplace={[]}
          sourceDocument={mockSourceDocument}
          replacePagesHandler={noop}
          documentInViewer={mockLoadedDocument}
          closeModalWarning={noop}
        />
      );

      const deselectAllButton = await screen.findByRole('button', { name: /Deselect All/i });
      waitFor(() => expect(deselectAllButton).not.toBeDisabled());
    });

    it('check all handlers are correctly called', async () => {
      const pageCountSourceDocument = 10;
      const pageCountLoadedDocument = 5;
      const { mockLoadedDocument, mockSourceDocument } = getMockLoadedAndSourceDocument({ pageCountLoadedDocument, pageCountSourceDocument });

      const closeModalMock = jest.fn();
      const clearLoadedFileMock = jest.fn();
      const replacePagesMock = jest.fn();
      const closeModalWarningMock = jest.fn();

      const props = {
        closeThisModal: closeModalMock,
        clearLoadedFile: clearLoadedFileMock,
        pageIndicesToReplace: [1],
        sourceDocument: mockSourceDocument,
        replacePagesHandler: replacePagesMock,
        documentInViewer: mockLoadedDocument,
        closeModalWarning: closeModalWarningMock,
      };

      render(<FileSelectedPanelWithRedux {...props} />);

      const buttons = await screen.findAllByRole('button');
      // There are four buttons on this modal
      // Back, Close, Deselect, Add Pages
      expect(buttons.length).toBe(4);

      const backButton = screen.getByLabelText('Back');
      userEvent.click(backButton);
      expect(clearLoadedFileMock).toBeCalled();

      // Close button shows a warning
      const closeButton = document.getElementsByClassName('close-button')[0];
      userEvent.click(closeButton);
      expect(closeModalWarningMock).toBeCalled();

      // Select a checkbox and press Add Page
      const checkboxes = await screen.findAllByRole('checkbox');
      userEvent.click(checkboxes[0]);
      const replaceButton = screen.getByRole('button', { name: 'Replace' });
      userEvent.click(replaceButton);
      expect(replacePagesMock).toBeCalled();
      expect(closeModalMock).toBeCalled();
    });
  });
});