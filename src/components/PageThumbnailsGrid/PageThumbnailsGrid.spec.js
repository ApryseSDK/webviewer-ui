import React from 'react';
import { render, screen } from '@testing-library/react';
import PageThumbnailsGrid from './PageThumbnailsGrid';
import userEvent from '@testing-library/user-event';

const TestPageThumbnailsGrid = withProviders(PageThumbnailsGrid);

const mockDocument = {
  getPageCount: () => 10,
  getFilename: () => 'helloDarknessMyOldFriend.pdf',
  loadThumbnail: (pageNumber, callback) => (Promise.resolve(callback({ pageNumber, currentSrc: 'https://placekitten.com/200/300?image=2' }))),
};

const noop = () => { };

describe('PageThumbnailsGrid', () => {
  describe('Component', () => {
    it('While we wait for thumbnails to render a progress message is shown', () => {
      render(<TestPageThumbnailsGrid />);
      screen.getByText('Processing... 0/0');
    });

    it('renders the correct number of thumbnails', async () => {
      const fileLoadedProps = {
        document: mockDocument,
        selectedThumbnails: {},
        onThumbnailSelected: noop,
        onfileLoadedHandler: noop,
      };

      render(<TestPageThumbnailsGrid {...fileLoadedProps} />);
      const checkboxes = await screen.findAllByRole('checkbox');
      expect(checkboxes).toHaveLength(mockDocument.getPageCount());
    });


    it('when we select a thumbnail, it correctly checks it and calls the callback for onThumbnailSelected', async () => {
      const onThumbnailSelectedMock = jest.fn();

      const fileLoadedProps = {
        document: mockDocument,
        selectedThumbnails: {},
        onThumbnailSelected: onThumbnailSelectedMock,
        onfileLoadedHandler: noop,
      };

      render(<TestPageThumbnailsGrid {...fileLoadedProps} />);
      const checkboxes = await screen.findAllByRole('checkbox');
      expect(checkboxes).toHaveLength(mockDocument.getPageCount());

      expect(checkboxes[1]).not.toBeChecked();
      userEvent.click(checkboxes[1]);

      // Maps to page number
      expect(onThumbnailSelectedMock).toBeCalledWith(2);
    });
  });
});
