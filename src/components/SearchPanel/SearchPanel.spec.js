import React from 'react';
import * as reactRedux from 'react-redux';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchPanelWithOutI18n from './SearchPanel';
import SearchPanelContainerWithOutI18n from './SearchPanelContainer';
import useMedia from 'hooks/useMedia';
import useSearch from 'hooks/useSearch';
import useCore from 'hooks/useCore';
import actions from 'actions';
import core from 'core';

const SearchPanel = withI18n(SearchPanelWithOutI18n);
const SearchPanelContainer = withI18n(SearchPanelContainerWithOutI18n);

jest.mock('core');
jest.mock('hooks/useMedia');
jest.mock('hooks/useSearch');
jest.mock('hooks/useCore');
jest.mock('actions');

jest.mock('components/SearchOverlay', () => {
  return function MockComponent() {
    return (<div>SearchOverlayMock</div>);
  };
});
jest.mock('components/SearchResult', () => {
  return function MockComponent(props) {
    const { onClickResult } = props;// eslint-disable-line react/prop-types
    return (
      <div>
        <span>SearchResultMock</span>
        <button className="mock-active-result" onClick={onClickResult} aria-current={true}>mock active result</button>
      </div>
    );
  };
});

function createDisabledStateForDataElement(dataElement) {
  const state = createState();
  state.viewer.disabledElements[dataElement] = { disabled: true };
  return state;
}

function createState(overrides = {}) {
  const {
    viewer: viewerOverrides = {},
    search: searchOverrides = {},
    ...rest
  } = overrides;
  return {
    viewer: {
      openElements: { searchPanel: true },
      disabledElements: {},
      panelWidths: { searchPanel: 330 },
      pageLabels: [],
      isInDesktopOnlyMode: false,
      isMultiViewerMode: false,
      activeDocumentViewerKey: 1,
      ...viewerOverrides,
    },
    search: {
      clearSearchPanelOnClose: false,
      isSearchInProgress: false,
      isProcessingSearchResults: false,
      ...searchOverrides,
    },
    ...rest,
  };
}

function mockUseSelectorWithState(state) {
  jest.spyOn(reactRedux, 'useSelector').mockImplementation((selector) => selector(state));
}

describe('SearchPanel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => { });
    mockUseSelectorWithState(createState());
    useCore.mockReturnValue({ core });
    // test would break if we don't make default return from useSearch as code is trying to destruct undefined value
    useSearch.mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw error if no props given', () => {
    expect(() => {
      render(<SearchPanel />);
    }).not.toThrow();
  });

  it('Should not render if component disabled', () => {
    const state = createDisabledStateForDataElement('searchPanel');
    mockUseSelectorWithState(state);
    const { container } = render(<SearchPanel />);
    expect(container.querySelector('.SearchPanel')).not.toBeInTheDocument();
  });

  it('Should render if component enabled', () => {
    const { container } = render(<SearchPanel />);
    expect(container.querySelector('.SearchPanel')).toBeInTheDocument();
  });

  it('Should not render close button if not mobile', () => {
    const { container } = render(<SearchPanel />);
    expect(container.querySelector('.SearchPanel')).toBeInTheDocument();
    expect(container.querySelector('.close-icon-container')).not.toBeInTheDocument();
  });

  it('Should set minWidth and width if not mobile device', () => {
    const { container } = render(<SearchPanel currentWidth={100} />);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    expect(searchPanel).toHaveStyle('width: 100px');
    expect(searchPanel).toHaveStyle('min-width: 100px');
  });

  it('Should render close button if mobile device', () => {
    const { container } = render(<SearchPanel isMobile />);
    expect(container.querySelector('.SearchPanel')).toBeInTheDocument();
    expect(container.querySelector('.close-icon-container')).toBeInTheDocument();
  });

  it('Should not set minWidth and width if mobile device', () => {
    const currentWidth = 100;
    const { container } = render(<SearchPanel currentWidth={currentWidth} isMobile />);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    // getPropertyValue returns empty string if value is not set
    expect(searchPanel.style.getPropertyValue('width')).toBe('');
    expect(searchPanel.style.getPropertyValue('min-width')).toBe('');
  });

  it('Should have class \'open\' if isOpen=true passed as props', () => {
    const { container } = render(<SearchPanel isOpen />);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    expect(searchPanel).toHaveClass('open');
  });

  it('Should have class \'closed\' if isOpen=false passed as props', () => {
    const { container } = render(<SearchPanel isOpen={false} />);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    expect(searchPanel).toHaveClass('closed');
  });

  it('Should render SearchOverlay component', () => {
    const { container } = render(<SearchPanel />);
    expect(container).toHaveTextContent('SearchOverlayMock');
  });

  it('Should render SearchResult component', () => {
    const { container } = render(<SearchPanel />);
    expect(container).toHaveTextContent('SearchResultMock');
  });

  it('Should set active result when result is clicked', () => {
    const closeSearchPanelMock = jest.fn();
    const setActiveResultMock = jest.fn();
    const setActiveSearchResultIndex = jest.fn();
    useSearch.mockReturnValue({ setActiveSearchResultIndex });

    const { container } = render(
      <SearchPanel
        isOpen
        closeSearchPanel={closeSearchPanelMock}
        setActiveResult={setActiveResultMock}
      />
    );
    const activeResultButton = container.querySelector('.mock-active-result');
    expect(activeResultButton).toBeInTheDocument();
    fireEvent.click(activeResultButton);
    expect(setActiveResultMock).toBeCalled();
    expect(closeSearchPanelMock).not.toBeCalled();
  });

  it('Should have aria-current on search result', () => {
    render(
      <SearchPanel
        isOpen
      />
    );

    const activeResultButton = screen.queryByRole('button');
    expect(activeResultButton).toHaveAttribute('aria-current');
  });

  it('Should close search panel when result is clicked using mobile device', () => {
    const closeSearchPanelMock = jest.fn();
    const setActiveResultMock = jest.fn();
    const setActiveSearchResultIndex = jest.fn();
    useSearch.mockReturnValue({ setActiveSearchResultIndex });
    const { container } = render(
      <SearchPanel
        isMobile
        isOpen
        closeSearchPanel={closeSearchPanelMock}
        setActiveResult={setActiveResultMock}
      />
    );
    const activeResultButton = container.querySelector('.mock-active-result');
    expect(activeResultButton).toBeInTheDocument();
    fireEvent.click(activeResultButton);
    expect(setActiveResultMock).toBeCalled();
    expect(closeSearchPanelMock).toBeCalled();
  });

  it('Should close panel when mobile and close button clicked', () => {
    const closeSearchPanelMock = jest.fn();
    const { container } = render(<SearchPanel closeSearchPanel={closeSearchPanelMock} isOpen isMobile />);
    const searchPanel = container.querySelector('.SearchPanel');
    const mobileCloseButton = container.querySelector('.close-icon-container');
    expect(searchPanel).toBeInTheDocument();
    expect(searchPanel).toHaveClass('open');
    expect(mobileCloseButton).toBeInTheDocument();
    fireEvent.click(mobileCloseButton);
    expect(closeSearchPanelMock).toHaveBeenCalled();
  });
});

describe('SearchPanelContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // test would break if we don't make default return from useSearch as code is trying to destruct undefined value
    useSearch.mockReturnValue({});
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => { });
    useCore.mockReturnValue({ core });
    mockUseSelectorWithState(createState());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw error if now props given', () => {
    expect(() => {
      render(<SearchPanelContainer />);
    }).not.toThrow();
  });

  it('Should clear search results if not open and enabled by API', () => {
    const state = createState({
      viewer: { openElements: { searchPanel: false } },
      search: { clearSearchPanelOnClose: true },
    });
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    mockUseSelectorWithState(state);
    const actionsSetSearchValueActionMock = jest.spyOn(actions, 'setSearchValue');
    const coreClearSearchResultsMock = jest.spyOn(core, 'clearSearchResults');

    render(<SearchPanelContainer />);
    expect(actionsSetSearchValueActionMock).toHaveBeenCalledWith('');
    expect(coreClearSearchResultsMock).toHaveBeenCalled();
  });

  it('Should not clear search results if not open but disabled by API', () => {
    const state = createState({
      viewer: { openElements: { searchPanel: false } },
      search: { clearSearchPanelOnClose: false },
    });
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    mockUseSelectorWithState(state);
    const actionsSetSearchValueActionMock = jest.spyOn(actions, 'setSearchValue');
    const coreClearSearchResultsMock = jest.spyOn(core, 'clearSearchResults');

    render(<SearchPanelContainer />);
    expect(actionsSetSearchValueActionMock).not.toHaveBeenCalled();
    expect(coreClearSearchResultsMock).not.toHaveBeenCalled();
  });

  it('Should not clear result if mobile device', () => {
    const state = createState({
      viewer: { openElements: { searchPanel: false } },
      search: { clearSearchPanelOnClose: true },
    });
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    mockUseSelectorWithState(state);
    const actionsSetSearchValueActionMock = jest.spyOn(actions, 'setSearchValue');
    const coreClearSearchResultsMock = jest.spyOn(core, 'clearSearchResults');
    useMedia.mockReturnValue(true);

    render(<SearchPanelContainer />);
    expect(actionsSetSearchValueActionMock).not.toHaveBeenCalled();
    expect(coreClearSearchResultsMock).not.toHaveBeenCalled();
  });

  it('should call setActiveSearchResult on the correct document viewer when switching viewers', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(() => {});
    useSearch.mockReturnValue({ setActiveSearchResultIndex: () => null });

    const mockSetActiveSearchResult1 = jest.fn();
    const mockSetActiveSearchResult2 = jest.fn();
    const mockGetDocumentViewer = (key) => {
      return { setActiveSearchResult: key === 2 ? mockSetActiveSearchResult2 : mockSetActiveSearchResult1 };
    };

    let activeKey = 1;
    useCore.mockImplementation(() => ({
      core: {
        ...core,
        getDocumentViewer: () => mockGetDocumentViewer(activeKey),
        clearSearchResults: core.clearSearchResults,
      },
    }));
    mockUseSelectorWithState(createState({ viewer: { activeDocumentViewerKey: 1 } }));
    const { container, rerender } = render(<SearchPanelContainer />);

    // Click the mock result button to trigger setActiveResult
    const activeResultButton = container.querySelector('.mock-active-result');
    expect(activeResultButton).toBeInTheDocument();
    fireEvent.click(activeResultButton);

    expect(mockSetActiveSearchResult1).toHaveBeenCalled();
    expect(mockSetActiveSearchResult2).not.toHaveBeenCalled();

    activeKey = 2;
    mockSetActiveSearchResult1.mockClear();
    mockUseSelectorWithState(createState({ viewer: { activeDocumentViewerKey: 2 } }));

    rerender(<SearchPanelContainer />);

    const activeResultButton2 = container.querySelector('.mock-active-result');
    fireEvent.click(activeResultButton2);

    expect(mockSetActiveSearchResult2).toHaveBeenCalled();
    expect(mockSetActiveSearchResult1).not.toHaveBeenCalled();
  });
});

describe('adjustSpreadsheetTableWidth', () => {
  let isSpreadsheetEditorModeMock;
  let getDocumentMock;
  let editorWrapper;
  let spreadsheetEditorMock;

  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => { });
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(false);
    useSearch.mockReturnValue({
      searchStatus: 'SEARCH_NOT_INITIATED',
      searchResults: [],
      activeSearchResultIndex: -1,
      setSearchStatus: jest.fn(),
    });
    isSpreadsheetEditorModeMock = jest.spyOn(require('src/helpers/officeEditor'), 'isSpreadsheetEditorMode');
    isSpreadsheetEditorModeMock.mockReturnValue(true);

    editorWrapper = {
      style: { width: '100%' },
    };
    document.getElementById = jest.fn(() => editorWrapper);

    spreadsheetEditorMock = { onSizeChanged: jest.fn() };
    getDocumentMock = jest.spyOn(require('src/core/getDocument'), 'default');
    getDocumentMock.mockReturnValue({
      getSpreadsheetEditorDocument: () => ({
        getEditor: () => spreadsheetEditorMock,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should adjust container width based on panel width on component mount', () => {
    render(<SearchPanel currentWidth={200} />);
    expect(document.getElementById).toHaveBeenCalledWith('editorWrapper');
    expect(editorWrapper.style.width).toBe('824px');
    expect(spreadsheetEditorMock.onSizeChanged).toHaveBeenCalled();
  });

  it('should not adjust container width if not in spreadsheet editor', () => {
    isSpreadsheetEditorModeMock.mockReturnValue(false);
    render(<SearchPanel currentWidth={100} />);
    expect(document.getElementById).not.toHaveBeenCalled();
    expect(spreadsheetEditorMock.onSizeChanged).not.toHaveBeenCalled();
  });

  it('should adjust container width back to original on component unmount', () => {
    const removePropertyMock = jest.fn();
    editorWrapper.style.removeProperty = removePropertyMock;
    const { unmount } = render(<SearchPanel currentWidth={200} />);
    expect(editorWrapper.style.width).toBe('824px');
    unmount();
    expect(removePropertyMock).toHaveBeenCalledWith('width');
  });
});
