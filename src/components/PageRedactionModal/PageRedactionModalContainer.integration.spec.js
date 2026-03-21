import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DataElements from 'constants/dataElement';
import { createPageRedactions, redactPages } from 'helpers/pageManipulationFunctions';
import PageRedactionModalContainer from './PageRedactionModalContainer';

jest.mock('helpers/pageManipulationFunctions', () => ({
  createPageRedactions: jest.fn(),
  redactPages: jest.fn(),
}));

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockGetDocument = jest.fn(() => ({
  getPageInfo: () => ({ width: 200, height: 300 }),
  loadCanvas: ({ drawComplete }) => drawComplete(document.createElement('canvas')),
  getDocumentCompletePromise: () => Promise.resolve(),
  getPageCount: () => 5,
}));

jest.mock('hooks/useCore', () => () => ({
  core: {
    getDocument: mockGetDocument,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  },
}));

const TestPageRedactionModalContainer = withProviders(PageRedactionModalContainer, {
  viewer: {
    isMultiViewerMode: true,
    activeDocumentViewerKey: 2,
    customPanels: [],
    openElements: {
      [DataElements.PAGE_REDACT_MODAL]: true,
    },
    currentPage: { 1: 1, 2: 7 },
    pageLabels: {
      1: ['1', '2'],
      2: ['A', 'B', 'C', 'D', 'E'],
    },
    selectedThumbnailPageIndexes: [0],
    activeToolName: 'AnnotationCreateRedaction',
    activeToolStyles: { FillColor: 'black' },
  },
});

describe('PageRedactionModalContainer integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls redactPages with selected current page and active document viewer key', () => {
    const { container } = render(<TestPageRedactionModalContainer />);

    const redactButton = container.querySelector('button[data-element="modalRedactButton"]');
    fireEvent.click(redactButton);

    expect(redactPages).toHaveBeenCalledWith([7], { FillColor: 'black' }, 2);
  });

  it('calls createPageRedactions with selected odd pages and active key', () => {
    const { container } = render(<TestPageRedactionModalContainer />);

    const options = container.querySelectorAll('input[name="page-redaction-option"]');
    fireEvent.click(options[2]);

    const markButton = container.querySelector('button[data-element="modalMarkRedactButton"]');
    fireEvent.click(markButton);

    expect(createPageRedactions).toHaveBeenCalledWith([1, 3, 5], { FillColor: 'black' }, 2);
  });
});
