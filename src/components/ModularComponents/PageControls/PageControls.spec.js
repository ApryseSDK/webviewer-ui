import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageControls from './PageControls';
import core from 'core';

const mockState = {
  viewer: {
    isMultiViewerMode: false,
    activeDocumentViewerKey: 1,
    currentPage: {
      1: 7,
      2: 3,
    },
    isCustomPageLabelsEnabled: {
      1: false,
      2: false,
    },
    totalPages: {
      1: 9,
      2: 5,
    },
    customPanels: [],
    pageLabels: {
      1: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      2: ['1', '2', '3', '4', '5'],
    },
  }
};

const PageControlWithRedux = withProviders(PageControls, mockState);

const props = {
  dataElement: 'page-controls-container',
  size: 0,
  previousPageButton: {
    dataElement: 'previousPageButton',
    title: 'action.pagePrev',
    label: null,
    img: 'icon-chevron-up',
    type: 'pageNavigationButton',
    disabled: false,
    ariaLabel: 'action.pagePrev',
    onClick: jest.fn(),
  },
  nextPageButton: {
    dataElement: 'nextPageButton',
    title: 'action.pageNext',
    label: null,
    img: 'icon-chevron-right',
    type: 'pageNavigationButton',
    disabled: false,
    ariaLabel: 'action.pageNext',
    onClick: jest.fn(),
  },
  input: '7',
  totalPages: 9,
  onChange: jest.fn(),
};

describe('Page Controls Container component', () => {
  beforeEach(() => {
    const documentViewer = core.setDocumentViewer(1, new window.Core.DocumentViewer());
    documentViewer.doc = new window.Core.Document('dummy', 'pdf');
  });

  it('Should be able to find input and check input value', () => {
    render(<PageControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    expect(input.value).toEqual(props.input);
  });

  it('Should be able to type into input of Page Controls', () => {
    render(<PageControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    userEvent.type(input, '8');
    expect(input.value).toEqual(props.input);
  });

  it('Should call onClick on left/right button on Page Controls component', () => {
    render(<PageControlWithRedux {...props} />);
    const leftBtn = screen.getByRole('button', { name: 'action.pagePrev' });
    const rightBtn = screen.getByRole('button', { name: 'action.pageNext' });
    expect(leftBtn).toBeInTheDocument();
    expect(rightBtn).toBeInTheDocument();
    fireEvent.click(leftBtn);
    fireEvent.click(rightBtn);
    expect(props.previousPageButton.onClick).toHaveBeenCalledTimes(1);
    expect(props.nextPageButton.onClick).toHaveBeenCalledTimes(1);
  });

  describe('MultiViewer mode', () => {
    it("reflects the active document's page count in the page controls container", () => {
      const wrapped1State = {
        viewer: {
          ...mockState.viewer,
          isMultiViewerMode: true,
        },
      };
      const Wrapped1 = withProviders(PageControls, wrapped1State);
      const { rerender } = render(<Wrapped1 {...props} />);
      expect(screen.getByRole('textbox').value).toBe('7');

      const wrapped2State = {
        viewer: {
          ...wrapped1State.viewer,
          activeDocumentViewerKey: 2,
        },
      };
      const Wrapped2 = withProviders(PageControls, wrapped2State);
      rerender(<Wrapped2 {...props} />);
      expect(screen.getByRole('textbox').value).toBe('3');
    });

    it("reflects the active document's custom page labels in the page controls container", () => {
      const wrapped1State = {
        viewer: {
          ...mockState.viewer,
          isMultiViewerMode: true,
          isCustomPageLabelsEnabled: {
            1: true,
            2: true,
          },
          pageLabels: {
            1: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'],
            2: ['a', 'b', 'c', 'd', 'e'],
          },
        },
      };
      const Wrapped1 = withProviders(PageControls, wrapped1State);
      const { rerender } = render(<Wrapped1 {...props} />);
      expect(screen.getByRole('textbox').value).toBe('vii');

      const wrapped2State = {
        viewer: {
          ...wrapped1State.viewer,
          activeDocumentViewerKey: 2,
        },
      };
      const Wrapped2 = withProviders(PageControls, wrapped2State);
      rerender(<Wrapped2 {...props} />);
      expect(screen.getByRole('textbox').value).toBe('c');
    });
  });
});