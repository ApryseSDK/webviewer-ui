import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import DocumentCropPopup from './DocumentCropPopup';
import { Basic } from './DocumentCropPopup.stories';
import useCore from 'hooks/useCore';

const BasicDocumentCropPopupStory = withI18n(Basic);

const TestDocumentCropPopup = withProviders(DocumentCropPopup);

function noop() { }

let currentCore;
let currentDocumentViewer;

jest.mock('core');
jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const createMockCore = (cropMode = 'ALL_PAGES') => {
  const mockCropTool = {
    getCropMode: jest.fn(() => cropMode),
    setCropMode: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getIsCropping: jest.fn(() => false),
    getPagesToCrop: jest.fn(() => []),
    setPagesToCrop: jest.fn(),
    reset: jest.fn(),
  };

  return {
    getTool: jest.fn(() => mockCropTool),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getDocument: jest.fn(() => ({})),
  };
};

const createMockAnnotation = () => {
  return {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    getPageNumber() {
      return 1;
    },
    getRect() {
      return {
        x1: 1,
        x2: 2,
        y1: 3,
        y2: 4,
      };
    },
    getX() {
      return this.x;
    },
    getY() {
      return this.y;
    },
    getWidth() {
      return this.width;
    },
    getHeight() {
      return this.height;
    },
    setX(x) {
      this.x = Number(x);
    },
    setY(y) {
      this.y = Number(y);
    },
    setWidth(w) {
      this.width = Number(w);
    },
    setHeight(h) {
      this.height = Number(h);
    },
  };
};

const DEFAULT_CROP_TYPE = {
  text: 'All',
  mode: 'ALL_PAGES',
};

const NON_DEFAULT_CROP_TYPE = {
  text: 'Current Page',
  mode: 'SINGLE_PAGE',
};

const CROP_DIMENSIONS = {
  'Letter': {
    'yOffset': 0,
    'height': 11,
    'xOffset': 0,
    'width': 8.5,
  },
  'Half letter': {
    'yOffset': 0,
    'height': 5.5,
    'xOffset': 0,
    'width': 8.5,
  },
  'Junior legal': {
    'yOffset': 0,
    'height': 5,
    'xOffset': 0,
    'width': 8,
  }
};

const DEFAULT_UNITS = 'Inches (in)';
const DEFAULT_UNIT_IN_INPUT = '"';

const unitConversions = {
  '"': 1,
  'cm': 2.54,
  'mm': 25.4,
  'pt': 72,
};

const COLLAPSIBLE_MENU_TITLE = 'Crop Dimensions';

const DEFAULT_AUTO_TRIM = 'Letter';

const popupProps = {
  cropAnnotation: createMockAnnotation(),
  cropMode: 'ALL_PAGES',
  onCropModeChange: noop,
  closeDocumentCropPopup: noop,
  applyCrop: noop,
  isCropping: true,
  getPageHeight() {
    return 792;
  },
  getPageWidth() {
    return 612;
  },
  isPageRotated() {
    return false;
  },
  redrawCropAnnotations: noop,
  isInDesktopOnlyMode: false,
  isMobile: false,
  getPageCount: () => {
    9;
  },
  getCurrentPage: () => {
    1;
  },
  selectedPages: [],
  onSelectedPagesChange: noop,
  presetCropDimensions: CROP_DIMENSIONS,
  shouldShowApplyCropWarning: false
};

const testPopup = (
  <div className="DocumentCropPopupContainer">
    <TestDocumentCropPopup {...popupProps} />
  </div>
);

describe('DocumentCropPopup', () => {
  beforeEach(() => {
    currentDocumentViewer = {};
    currentCore = createMockCore();
    useCore.mockReturnValue({
      core: currentCore,
      documentViewer: currentDocumentViewer
    });
  });

  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicDocumentCropPopupStory />);
      }).not.toThrow();
    });

    it(`Renders with ${DEFAULT_CROP_TYPE['text']} Checked`, () => {
      render(testPopup);
      const cropTypeRadioButtons = screen.getAllByRole('radio');
      const defaultCropTypeButton = screen.getByRole('radio', { name: DEFAULT_CROP_TYPE['text'] });
      expect(cropTypeRadioButtons[0]).toEqual(defaultCropTypeButton);
      expect(defaultCropTypeButton).toBeChecked();
    });

    it(`Renders with ${NON_DEFAULT_CROP_TYPE['text']} Unchecked `, () => {
      render(testPopup);

      const cropTypeRadioButtons = screen.getAllByRole('radio');
      const nondefaultCropTypeButton = screen.getByRole('radio', { name: NON_DEFAULT_CROP_TYPE['text'] });
      expect(cropTypeRadioButtons[0]).not.toEqual(nondefaultCropTypeButton);
      expect(nondefaultCropTypeButton).not.toBeChecked();
    });

    it('Renders with Crop Dimensions collapsed', () => {
      render(testPopup);

      expect(screen.queryAllByRole('spinbutton').length).toEqual(0);
    });

    it('Renders with proper group label', () => {
      render(testPopup);
      const groupLabel = screen.getByRole('group', { name: 'Pages to Crop' });
      expect(groupLabel).toBeInTheDocument();
    });
  });
});

describe('Dimensions Input Menu', () => {
  it(`Should open when ${COLLAPSIBLE_MENU_TITLE} is clicked`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    expect(screen.getAllByRole('spinbutton').length).toEqual(4);
    expect(screen.getAllByRole('listbox').length).toEqual(2);
  });

  it(`Should close when ${COLLAPSIBLE_MENU_TITLE} is clicked after being open`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    expect(screen.getAllByRole('spinbutton').length).toEqual(4);
    expect(screen.getAllByRole('listbox').length).toEqual(2);
    fireEvent.click(collapsibleMenu);
    expect(screen.queryAllByRole('spinbutton').length).toEqual(0);
    expect(screen.queryAllByRole('listbox').length).toEqual(0);
  });

  it('Should be autopopulated by Annotation size', () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    const yOffset = screen.getByTestId('yOffset-input');
    expect(yOffset).toHaveValue(Math.trunc((createMockAnnotation().getY() / unitConversions['pt']) * 10000) / 10000);
    const width = screen.getByTestId('width-input');
    expect(width).toHaveValue(Math.trunc((createMockAnnotation().getWidth() / unitConversions['pt']) * 10000) / 10000);
    const height = screen.getByTestId('height-input');
    expect(height).toHaveValue(
      Math.trunc((createMockAnnotation().getHeight() / unitConversions['pt']) * 10000) / 10000,
    );
    const xOffset = screen.getByTestId('xOffset-input');
    expect(xOffset).toHaveValue(Math.trunc((createMockAnnotation().getX() / unitConversions['pt']) * 10000) / 10000);
  });

  it(`Should open with ${DEFAULT_UNITS} selected and enabled`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    const unitDropdown = screen.getAllByRole('option', { name: DEFAULT_UNITS })[0];
    expect(unitDropdown).toBeEnabled();
    expect(unitDropdown).toHaveTextContent(DEFAULT_UNITS);
  });

  it(`Should open with ${DEFAULT_AUTO_TRIM} selected and enabled`, () => {
    render(testPopup);
    const collapsibleMenu = screen.getByText('Crop Dimensions');
    fireEvent.click(collapsibleMenu);
    const autoTrimDropdown = screen.getAllByRole('option', { name: DEFAULT_AUTO_TRIM })[0];
    expect(autoTrimDropdown).toBeEnabled();
  });
});

describe('Multiviewer mode', () => {
  let store;
  let mockCore1;
  let mockCore2;
  let mockDocViewer1;
  let mockDocViewer2;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock document viewers with unique IDs
    mockDocViewer1 = { id: 'viewer-1', getPageCount: () => 10, getCurrentPage: () => 1 };
    mockDocViewer2 = { id: 'viewer-2', getPageCount: () => 10, getCurrentPage: () => 1 };

    // Create mock cores for each viewer
    mockCore1 = createMockCore('ALL_PAGES');
    mockCore2 = createMockCore('SINGLE_PAGE');

    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
    });

    store.dispatch(actions.setIsMultiViewerMode(true));
    store.dispatch(actions.setActiveDocumentViewerKey(1));

    // Set initial mock for viewer 1
    useCore.mockReturnValue({
      core: mockCore1,
      documentViewer: mockDocViewer1,
    });
  });

  // Helper to create default DocumentCropPopup props
  const createCropPopupProps = (overrides = {}) => ({
    cropMode: 'MULTI_PAGE',
    onCropModeChange: jest.fn(),
    closeDocumentCropPopup: jest.fn(),
    applyCrop: jest.fn(),
    isCropping: true,
    getPageHeight: jest.fn(() => 792),
    getPageWidth: jest.fn(() => 612),
    isPageRotated: jest.fn(() => false),
    redrawCropAnnotations: jest.fn(),
    isInDesktopOnlyMode: false,
    getPageCount: jest.fn(() => 10),
    getCurrentPage: jest.fn(() => 1),
    selectedPages: [],
    onSelectedPagesChange: jest.fn(),
    shouldShowApplyCropWarning: false,
    presetCropDimensions: {},
    ...overrides,
  });

  const TestDocumentCropPopupContainer = withProviders(require('./DocumentCropPopupContainer').default);
  const TestDocumentCropPopup = withProviders(require('./DocumentCropPopup').default);

  const renderCropPopupContainer = (store) => {
    return render(
      <Provider store={store}>
        <TestDocumentCropPopupContainer />
      </Provider>,
    );
  };

  const renderCropPopup = (store, propsOverrides = {}) => {
    return render(
      <Provider store={store}>
        <TestDocumentCropPopup {...createCropPopupProps(propsOverrides)} />
      </Provider>,
    );
  };

  it('updates event listeners when switching viewers', () => {
    const { rerender } = renderCropPopupContainer(store);

    const mockCropTool1 = mockCore1.getTool();
    expect(mockCropTool1.addEventListener).toHaveBeenCalledWith('cropModeChanged', expect.any(Function));
    expect(mockCore1.addEventListener).toHaveBeenCalledWith('toolModeUpdated', expect.any(Function));

    // Switch to viewer 2
    useCore.mockReturnValue({
      core: mockCore2,
      documentViewer: mockDocViewer2,
    });
    store.dispatch(actions.setActiveDocumentViewerKey(2));

    rerender(
      <Provider store={store}>
        <TestDocumentCropPopupContainer />
      </Provider>,
    );

    const mockCropTool2 = mockCore2.getTool();
    expect(mockCropTool1.removeEventListener).toHaveBeenCalledWith('cropModeChanged', expect.any(Function));
    expect(mockCore1.removeEventListener).toHaveBeenCalledWith('toolModeUpdated', expect.any(Function));
    expect(mockCropTool2.addEventListener).toHaveBeenCalledWith('cropModeChanged', expect.any(Function));
    expect(mockCore2.addEventListener).toHaveBeenCalledWith('toolModeUpdated', expect.any(Function));
  });

  it('fetches crop tool from correct viewer core', () => {
    const { rerender } = renderCropPopupContainer(store);

    expect(mockCore1.getTool).toHaveBeenCalledWith(window.Core.Tools.ToolNames['CROP']);

    // Switch to viewer 2
    useCore.mockReturnValue({
      core: mockCore2,
      documentViewer: mockDocViewer2,
    });
    store.dispatch(actions.setActiveDocumentViewerKey(2));

    rerender(
      <Provider store={store}>
        <TestDocumentCropPopupContainer />
      </Provider>,
    );

    expect(mockCore2.getTool).toHaveBeenCalledWith(window.Core.Tools.ToolNames['CROP']);
  });

  it('applies popup crop mode to all viewers', () => {
    const { rerender } = renderCropPopupContainer(store);

    const mockCropTool1 = mockCore1.getTool();
    // Verify viewer 1 initializes with default ALL_PAGES
    expect(mockCropTool1.setCropMode).toHaveBeenCalledWith('ALL_PAGES');

    // Simulate the mode being changed in the popup (e.g., user selects SINGLE_PAGE)
    const cropModeChangedHandler = mockCropTool1.addEventListener.mock.calls.find(
      (call) => call[0] === 'cropModeChanged'
    )[1];

    cropModeChangedHandler('SINGLE_PAGE');

    // Switch to viewer 2 - should get the changed mode (SINGLE_PAGE), not the default
    jest.clearAllMocks();
    useCore.mockReturnValue({
      core: mockCore2,
      documentViewer: mockDocViewer2,
    });
    store.dispatch(actions.setActiveDocumentViewerKey(2));
    rerender(
      <Provider store={store}>
        <TestDocumentCropPopupContainer />
      </Provider>,
    );

    const mockCropTool2 = mockCore2.getTool();
    // Verify viewer 2 gets SINGLE_PAGE (the changed mode)
    expect(mockCropTool2.setCropMode).toHaveBeenCalledWith('SINGLE_PAGE');

    // Switch back to viewer 1 - should still have the changed mode
    jest.clearAllMocks();
    useCore.mockReturnValue({
      core: mockCore1,
      documentViewer: mockDocViewer1,
    });
    store.dispatch(actions.setActiveDocumentViewerKey(1));
    rerender(
      <Provider store={store}>
        <TestDocumentCropPopupContainer />
      </Provider>,
    );

    expect(mockCropTool1.setCropMode).toHaveBeenCalledWith('SINGLE_PAGE');
  });

  it('clears page number input error state when switching viewers via key prop change', () => {
    const { rerender } = renderCropPopup(store);

    // Enter invalid text to trigger error
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid123' } });
    fireEvent.blur(input);

    // Verify error is shown
    expect(screen.getByText(/invalid page number/i)).toBeInTheDocument();

    // Simulate change to viewer 2 (which changes the key prop for the page number input and causes it to remount)
    useCore.mockReturnValue({
      core: mockCore2,
      documentViewer: mockDocViewer2,
    });

    rerender(
      <Provider store={store}>
        <TestDocumentCropPopup {...createCropPopupProps()} />
      </Provider>
    );

    // Error should be cleared due to component remounting with new key
    expect(screen.queryByText(/invalid page number/i)).not.toBeInTheDocument();
  });
});