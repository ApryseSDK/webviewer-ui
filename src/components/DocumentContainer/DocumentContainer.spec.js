import React from 'react';
import { render, waitFor } from '@testing-library/react';
import DocumentContainer, { UnconnectedDocumentContainer } from './DocumentContainer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import core from 'core';

jest.mock('core', () => ({
  scrollViewUpdated: jest.fn(),
  setScrollViewElement: jest.fn(),
  setViewerElement: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getDocument: jest.fn(() => ({ filename: 'test.pdf' })),
  zoomToMouse: jest.fn(),
  isContinuousDisplayMode: jest.fn(() => false),
  isScrollableDisplayMode: jest.fn(() => true),
}));

jest.mock('react-redux', () => ({
  connect: () => (Component) => Component,
  Provider: ({ children }) => children,
}));

jest.mock('react-measure', () => {
  return ({ children }) => children({ measureRef: () => { } });
});

jest.mock('components/PageNavOverlay', () => {
  const PageNavOverlayMock = () => <div data-testid="page-nav-overlay">PageNavOverlay</div>;
  PageNavOverlayMock.displayName = 'PageNavOverlay';
  return PageNavOverlayMock;
});
jest.mock('components/ToolsOverlay', () => {
  const ToolsOverlayMock = () => <div>ToolsOverlay</div>;
  ToolsOverlayMock.displayName = 'ToolsOverlay';
  return ToolsOverlayMock;
});
jest.mock('components/ReaderModeViewer', () => {
  const ReaderModeViewerMock = () => <div>ReaderModeViewer</div>;
  ReaderModeViewerMock.displayName = 'ReaderModeViewer';
  return ReaderModeViewerMock;
});
jest.mock('components/LazyLoadWrapper', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
    LazyLoadComponents: {
      ScaleOverlayContainer: () => <div>ScaleOverlayContainer</div>,
      MeasurementOverlay: () => <div>MeasurementOverlay</div>
    }
  };
});

const renderWithRedux = (component, initialState = {}) => {
  const store = createStore(() => initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

const createTransitionEvent = (propertyName) => {
  const event = new Event('transitionend', { bubbles: true });
  Object.defineProperty(event, 'propertyName', {
    value: propertyName,
    enumerable: true
  });
  return event;
};

describe('DocumentContainer', () => {
  const defaultProps = {
    isLeftPanelOpen: false,
    isRightPanelOpen: false,
    isSearchOverlayOpen: false,
    doesDocumentAutoLoad: true,
    zoom: 1,
    currentPage: 1,
    totalPages: 10,
    isHeaderOpen: true,
    dispatch: jest.fn(),
    openElement: jest.fn(),
    closeElements: jest.fn(),
    displayMode: 'Single',
    leftPanelWidth: 300,
    allowPageNavigation: true,
    isMouseWheelZoomEnabled: true,
    isReaderMode: false,
    setDocumentContainerWidth: jest.fn(),
    setDocumentContainerHeight: jest.fn(),
    isInDesktopOnlyMode: false,
    isRedactionPanelOpen: false,
    isTextEditingPanelOpen: false,
    isWv3dPropertiesPanelOpen: false,
    featureFlags: { customizableUI: false },
    bottomHeaderHeight: 40,
    activeDocumentViewerKey: 1,
    isLogoBarEnabled: true,
    currentTabs: [],
    activeTab: 0,
    documentContentContainerWidthStyle: '100%',
    documentContainerLeftMargin: 0,
    isMultiTabEmptyPageOpen: false,
    isMobile: false,
    isSpreadsheetEditorModeEnabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    core.scrollViewUpdated.mockClear();
  });

  test('should render without crashing', () => {
    const { container } = renderWithRedux(<DocumentContainer {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  describe('onTransitionEnd method', () => {
    describe('when in spreadsheet editor mode', () => {
      const spreadsheetProps = {
        ...defaultProps,
        isSpreadsheetEditorModeEnabled: true,
      };

      test('should not call scrollViewUpdated for top property transitions', () => {
        const { container } = renderWithRedux(<DocumentContainer {...spreadsheetProps} />);
        container.dispatchEvent(createTransitionEvent('top'));
        expect(core.scrollViewUpdated).not.toHaveBeenCalled();
      });

      test('should not call scrollViewUpdated for left property transitions', () => {
        const { container } = renderWithRedux(<DocumentContainer {...spreadsheetProps} />);
        container.dispatchEvent(createTransitionEvent('left'));
        expect(core.scrollViewUpdated).not.toHaveBeenCalled();
      });

      test('should not be able to scroll the DocumentContainer element', () => {
        const componentInstance = new UnconnectedDocumentContainer(spreadsheetProps);
        const result = componentInstance.getClassName();
        expect(result).toContain('disable-page-scroll');
      });

      test('should not change document container width', async () => {
        const { container } = renderWithRedux(<DocumentContainer {...spreadsheetProps} />);
        const widthBeforeEvent = container.firstElementChild.clientWidth;
        const wheelEvent = new WheelEvent('wheel', {
          deltaY: 100,
          deltaX: 0,
          ctrlKey: true,
          metaKey: true,
          cancelable: true,
        });
        container.dispatchEvent(wheelEvent);
        await waitFor(() => {
          expect(container.firstElementChild.clientWidth).toBe(widthBeforeEvent);
        });
      });
    });

    describe('when not in spreadsheet editor mode', () => {
      test('should call scrollViewUpdated for top property transitions', () => {
        const { container } = renderWithRedux(<DocumentContainer {...defaultProps} />);
        const documentContainer = container.querySelector('.document-content-container');
        documentContainer.dispatchEvent(createTransitionEvent('top'));
        expect(core.scrollViewUpdated).toHaveBeenCalled();
      });

      test('should call scrollViewUpdated for left property transitions', () => {
        const { container } = renderWithRedux(<DocumentContainer {...defaultProps} />);
        const documentContainer = container.querySelector('.document-content-container');
        documentContainer.dispatchEvent(createTransitionEvent('left'));
        expect(core.scrollViewUpdated).toHaveBeenCalled();
      });
    });
  });
});