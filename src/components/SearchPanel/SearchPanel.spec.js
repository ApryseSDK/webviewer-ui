import React from 'react';
import * as reactRedux from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import SearchPanelWithOutI18n from './SearchPanel';
import SearchPanelContainerWithOutI18n from './SearchPanelContainer';
import useMedia from 'hooks/useMedia';
import useSearch from 'hooks/useSearch';
import actions from 'actions';
import core from 'core';

const SearchPanel = withI18n(SearchPanelWithOutI18n);
const SearchPanelContainer = withI18n(SearchPanelContainerWithOutI18n);

jest.mock('core');
jest.mock('hooks/useMedia');
jest.mock('hooks/useSearch');
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
        <button className="mock-active-result" onClick={onClickResult}>mock active result</button>
      </div>
    );
  };
});

function createDisabledStateForDataElement(dataElement) {
  const state = { viewer: { disabledElements: {} } };
  state.viewer.disabledElements[dataElement] = { disabled: true };
  return state;
}

describe('SearchPanel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // test would break if we don't make default return from useSearch as code is trying to destruct undefined value
    useSearch.mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not throw error if now props given', () => {
    expect(() => {
      render(<SearchPanel />);
    }).not.toThrow();
  });

  it('Should not render if component disabled', () => {
    const state = createDisabledStateForDataElement('searchPanel');
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation(function(selector) {
      return selector(state);
    });
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
    const { container } = render(<SearchPanel currentWidth={100}/>);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    expect(searchPanel).toHaveStyle('width: 100px');
    expect(searchPanel).toHaveStyle('min-width: 100px');
  });

  it('Should render close button if mobile device', () => {
    const { container } = render(<SearchPanel isMobile/>);
    expect(container.querySelector('.SearchPanel')).toBeInTheDocument();
    expect(container.querySelector('.close-icon-container')).toBeInTheDocument();
  });

  it('Should not set minWidth and width if mobile device', () => {
    const currentWidth = 100;
    const { container } = render(<SearchPanel currentWidth={currentWidth} isMobile/>);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    // getPropertyValue returns empty string if value is not set
    expect(searchPanel.style.getPropertyValue('width')).toBe('');
    expect(searchPanel.style.getPropertyValue('min-width')).toBe('');
  });

  it('Should have class \'open\' if isOpen=true passed as props', () => {
    const { container } = render(<SearchPanel isOpen/>);
    const searchPanel = container.querySelector('.SearchPanel');
    expect(searchPanel).toBeInTheDocument();
    expect(searchPanel).toHaveClass('open');
  });

  it('Should have class \'closed\' if isOpen=false passed as props', () => {
    const { container } = render(<SearchPanel isOpen={false}/>);
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

  it('Should close search panel when result is clicked using mobile device', () => {
    const closeSearchPanelMock = jest.fn();
    const setActiveResultMock = jest.fn();
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
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => {});
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    const isOpen = true;
    const currentWidth = 1280;
    const pageLabels = [];
    const shouldClearSearchPanelOnClose = false;
    useSelectorMock.mockReturnValue([isOpen, currentWidth, pageLabels, shouldClearSearchPanelOnClose]);
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
    const isOpen = false;
    const shouldClear = true;
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([isOpen, null, null, shouldClear]);
    const actionsSetSearchValueActionMock = jest.spyOn(actions, 'setSearchValue');
    const coreClearSearchResultsMock = jest.spyOn(core, 'clearSearchResults');

    render(<SearchPanelContainer />);
    expect(actionsSetSearchValueActionMock).toHaveBeenCalledWith('');
    expect(coreClearSearchResultsMock).toHaveBeenCalled();
  });

  it('Should not clear search results if not open but disabled by API', () => {
    const isOpen = false;
    const shouldClear = false;
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([isOpen, null, null, shouldClear]);
    const actionsSetSearchValueActionMock = jest.spyOn(actions, 'setSearchValue');
    const coreClearSearchResultsMock = jest.spyOn(core, 'clearSearchResults');

    render(<SearchPanelContainer />);
    expect(actionsSetSearchValueActionMock).not.toHaveBeenCalled();
    expect(coreClearSearchResultsMock).not.toHaveBeenCalled();
  });

  it('Should not clear result if mobile device', () => {
    const isOpen = false;
    const shouldClear = true;
    const mockDispatch = jest.fn();
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    useDispatchMock.mockReturnValue(mockDispatch);
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([isOpen, null, null, shouldClear]);
    const actionsSetSearchValueActionMock = jest.spyOn(actions, 'setSearchValue');
    const coreClearSearchResultsMock = jest.spyOn(core, 'clearSearchResults');
    useMedia.mockReturnValue(true);

    render(<SearchPanelContainer />);
    expect(actionsSetSearchValueActionMock).not.toHaveBeenCalled();
    expect(coreClearSearchResultsMock).not.toHaveBeenCalled();
  });
});
