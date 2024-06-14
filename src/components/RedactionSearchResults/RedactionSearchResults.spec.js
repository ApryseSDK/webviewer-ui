import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockSearchResults } from '../RedactionSearchPanel/RedactionSearchPanel.stories';
import RedactionSearchResults from './RedactionSearchResults';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';
import { createRedactionAnnotations, defaultRedactionStyles } from './RedactionSearchResultsContainer';

const RedactionSearchResultsWithRedux = withProviders(RedactionSearchResults);


const noop = () => {
};

jest.mock('core', () => ({
  addEventListener: noop,
  removeEventListener: noop,
  jumpToAnnotation: noop,
  getDocumentViewer: () => ({
    getAnnotationManager: () => ({
      deselectAllAnnotations: noop,
      selectAnnotation: noop,
    })
  }),
  isFullPDFEnabled: () => true,
  setCurrentPage: () => { },
  selectAnnotation: () => { },
  getCurrentUser: () => 'foo',
}));

const customRenderWithContext = (component, providerProps = {}) => {
  return render(
    <RedactionPanelContext.Provider value={providerProps}>
      {component}
    </RedactionPanelContext.Provider>,
  );
};

describe('RedactionSearchResults component', () => {
  it('calls the correct handlers for markSelectedResultsForRedaction and redactAllResults', () => {
    const props = {
      redactionSearchResults: mockSearchResults,
      isProcessingRedactionResults: false,
      onCancelSearch: noop,
      searchStatus: 'SEARCH_DONE',
      markSelectedResultsForRedaction: jest.fn(),
      redactSelectedResults: jest.fn(),
      isTestMode: true,
    };

    const providerProps = {
      isRedactionSearchActive: true,
      setIsRedactionSearchActive: jest.fn(),
      isTestMode: true,
    };

    customRenderWithContext(<RedactionSearchResultsWithRedux {...props} />, providerProps);

    const markForRedactionButton = screen.getByText(/Add Mark/);
    const redactButton = screen.getByText(/Redact/);

    // Both buttons should be disabled if no results are selected
    expect(markForRedactionButton).toBeDisabled();
    expect(redactButton).toBeDisabled();

    // Select all the results from the first page
    // In total there should be 8 checkboxes, one for each result (5) and
    // one for each page number
    const redactionSearchResults = screen.getAllByRole('checkbox');
    expect(redactionSearchResults.length).toEqual(mockSearchResults.length + 3);
    userEvent.click(redactionSearchResults[0]);

    // Now try to add a mark or redact
    userEvent.click(markForRedactionButton);
    // Should be called with results from page 1
    expect(props.markSelectedResultsForRedaction).toHaveBeenCalledWith([mockSearchResults[0], mockSearchResults[1]]);

    userEvent.click(redactButton);
    expect(props.redactSelectedResults).toHaveBeenCalledWith([mockSearchResults[0], mockSearchResults[1]]);
  });

  it('should be able to create redact annotations from search result using createRedactionAnnotations function', () => {
    const searchResults = [
      {
        page_num: 1,
        quads: [
          { getPoints: () => 44, }
        ],
        result_str: 'foobar',
        type: '',
      }
    ];

    const activeToolStyles = {
      StrokeColor: new window.Core.Annotations.Color(255, 0, 0, 1),
      OverlayText: 'barfoo',
      FillColor: new window.Core.Annotations.Color(0, 0, 0, 1),
      Font: 'Helvetica',
      TextColor: new window.Core.Annotations.Color(77, 77, 0, 1),
    };

    const annots = createRedactionAnnotations(searchResults, activeToolStyles);
    const annot = annots[0];

    expect(annot.getContents()).toEqual(searchResults[0].result_str);
    expect(annot['FillColor']).toEqual(activeToolStyles.FillColor);
    expect(annot['Font']).toEqual(activeToolStyles.Font);
    expect(annot['TextColor']).toEqual(activeToolStyles.TextColor);
  });

  it('should be able to create redact annotations from search result using createRedactionAnnotations function with defaults', () => {
    const searchResults = [
      {
        page_num: 1,
        quads: [
          { getPoints: () => 44, }
        ],
        result_str: 'foobar',
        type: '',
      }
    ];

    const annots = createRedactionAnnotations(searchResults);
    const annot = annots[0];

    expect(annot.getContents()).toEqual(searchResults[0].result_str);
    expect(annot['StrokeColor']).toEqual(defaultRedactionStyles.StrokeColor);
    expect(annot['Font']).toEqual('Helvetica');
    expect(annot['TextColor']).toEqual(defaultRedactionStyles.TextColor);
  });
});