import React from 'react';
import { render } from '@testing-library/react';
import DataElements from 'constants/dataElement';
import { createPageRedactions, redactPages } from 'helpers/pageManipulationFunctions';
import PageRedactionModalContainer from './PageRedactionModalContainer';

jest.mock('helpers/pageManipulationFunctions', () => ({
  createPageRedactions: jest.fn(),
  redactPages: jest.fn(),
}));

jest.mock('hooks/useCore', () => () => ({
  core: {
    getDocument: () => ({
      getDocumentCompletePromise: () => Promise.resolve(),
      getPageCount: () => 3,
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

const mockPageRedactionModal = jest.fn(() => null);
jest.mock('components/PageRedactionModal/PageRedactionModal', () => (props) => mockPageRedactionModal(props));

const PageRedactionModalContainerWithProviders = (mockInitialState = {}) =>
  withProviders(PageRedactionModalContainer, mockInitialState);

describe('PageRedactionModalContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes current page and page labels for the active document viewer key', () => {
    const Wrapped = PageRedactionModalContainerWithProviders({
      viewer: {
        isMultiViewerMode: true,
        activeDocumentViewerKey: 2,
        customPanels: [],
        openElements: {
          [DataElements.PAGE_REDACT_MODAL]: false,
        },
        selectedThumbnailPageIndexes: [0],
        currentPage: { 1: 5, 2: 9 },
        pageLabels: {
          1: ['1', '2', '3', '4', '5'],
          2: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        },
      },
    });

    render(<Wrapped />);

    expect(mockPageRedactionModal).toHaveBeenCalled();
    const props = mockPageRedactionModal.mock.calls[0][0];
    expect(props.currentPage).toBe(9);
    expect(props.pageLabels).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
  });

  it('passes activeDocumentViewerKey to redaction helper calls', () => {
    const toolStyles = { FillColor: 'black' };
    const Wrapped = PageRedactionModalContainerWithProviders({
      viewer: {
        isMultiViewerMode: true,
        activeDocumentViewerKey: 2,
        customPanels: [],
        openElements: {
          [DataElements.PAGE_REDACT_MODAL]: false,
        },
        selectedThumbnailPageIndexes: [0],
        activeToolName: 'AnnotationCreateRedaction',
        activeToolStyles: toolStyles,
      },
    });

    render(<Wrapped />);

    const props = mockPageRedactionModal.mock.calls[0][0];
    props.redactPages([2, 4]);
    props.markPages([1, 3]);

    expect(redactPages).toHaveBeenCalledWith([2, 4], toolStyles, 2);
    expect(createPageRedactions).toHaveBeenCalledWith([1, 3], toolStyles, 2);
  });
});
