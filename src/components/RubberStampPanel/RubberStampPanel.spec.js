import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import RubberStampPanel from './RubberStampPanel';
import StandardRubberStamps from './StandardRubberStamps';

const mockStampTool = {
  setRubberStamp: jest.fn(),
  showPreview: jest.fn(),
  getCustomStamps: jest.fn(() => []),
  deleteCustomStamps: jest.fn(),
};

jest.mock('core', () => ({
  getToolsFromAllDocumentViewers: jest.fn(() => [mockStampTool]),
  getDocumentViewer: jest.fn(() => ({})),
  getToolMode: jest.fn(() => ({ name: 'Select' })),
  setToolMode: jest.fn(),
}));

jest.mock('helpers/fireEvent', () => ({
  getEventHandler: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
}));

jest.mock('helpers/setToolModeAndGroup', () => jest.fn());

const TestStandardRubberStamps = withProviders(StandardRubberStamps);

const mockInitialState = {
  featureFlags: {
    newStampPanel: true,
  },
  viewer: {
    standardStamps: [
      { imgSrc: null, annotation: { Icon: 'Approved' } },
    ],
    customStamps: [
      {
        imgSrc: null,
        annotation: {
          Icon: 'Approved',
          DateCreated: '2024-01-01',
          getCustomData: () => JSON.stringify({
            title: 'Custom Stamp',
            author: 'Jane Doe',
          }),
        },
      },
    ],
    selectedStampIndex: null,
    tab: {
      rubberStampPanel: 'rubberStampPanelPresetTab',
    },
  },
};

const TestRubberStampPanel = withProviders(RubberStampPanel, mockInitialState);

function noop() {}

function buildMockTool(overrides = {}) {
  return {
    setRubberStamp: jest.fn(),
    showPreview: jest.fn(),
    getCustomStamps: jest.fn(() => []),
    hasDocumentStampTemplate: jest.fn(() => false),
    getDocumentStampRegistration: jest.fn(() => ({ sources: [], options: undefined })),
    setDocumentStamps: jest.fn(),
    ...overrides,
  };
}

function renderStampPanel(tools, { icon, templateId }) {
  jest.requireMock('core').getToolsFromAllDocumentViewers.mockReturnValue(tools);
  const annotation = {
    Icon: icon,
    getCustomData: (key) => (key === 'trn-pdf-stamp-template-id' ? templateId : null),
  };
  const storeState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      standardStamps: [{ imgSrc: null, annotation }],
      customStamps: [],
      selectedStampIndex: null,
      tab: { rubberStampPanel: 'rubberStampPanelPresetTab' },
    },
    featureFlags: { ...initialState.featureFlags, newStampPanel: true },
  };
  const store = configureStore({
    reducer: (state = storeState, action) => {
      if (action.type === 'SET_SELECTED_STAMP_INDEX') {
        return { ...state, viewer: { ...state.viewer, selectedStampIndex: action.payload.selectedStampIndex } };
      }
      return state;
    },
  });
  const WrappedPanel = withI18n(() => <Provider store={store}><RubberStampPanel /></Provider>);
  render(<WrappedPanel />);
}

describe('StandardRubberStamps', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<TestStandardRubberStamps standardStamps={[]} selectedStampeIndex={0} setSelectedRubberStamp={noop}/>);
    }).not.toThrow();
  });

  it('Component should have Aria Controls defined', () => {
    render(<TestStandardRubberStamps standardStamps={[]} selectedStampeIndex={0} setSelectedRubberStamp={noop}/>);

    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-controls');
  });

  it('Component should have Aria current defined', () => {
    render(<TestStandardRubberStamps standardStamps={[{ imgSrc: null, annotation: { Icon:'Approved' }, index: 0, onClick: noop, isActive: false }]} selectedStampeIndex={0} setSelectedRubberStamp={noop}/>);

    const element = screen.getByRole('button', { name: 'Approved' });
    expect(element).toHaveAttribute('aria-current');
  });
});

describe('RubberStampPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Component should not throw any errors', () => {
    expect(() => {
      render(<TestRubberStampPanel />);
    }).not.toThrow();
  });

  const renderRubberStampPanel = () => {
    const storeInitialState = {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        ...mockInitialState.viewer,
      },
      featureFlags: {
        ...initialState.featureFlags,
        ...mockInitialState.featureFlags,
      },
    };

    const store = configureStore({
      reducer: (state = storeInitialState, action) => {
        switch (action.type) {
          case 'SET_SELECTED_TAB':
            return {
              ...state,
              viewer: {
                ...state.viewer,
                tab: {
                  ...state.viewer.tab,
                  [action.payload.id]: action.payload.dataElement,
                },
              },
            };
          case 'SET_SELECTED_STAMP_INDEX':
            return {
              ...state,
              viewer: {
                ...state.viewer,
                selectedStampIndex: action.payload.selectedStampIndex,
              },
            };
          default:
            return state;
        }
      },
    });

    const WrappedRubberStampPanel = withI18n(() => (
      <Provider store={store}>
        <RubberStampPanel />
      </Provider>
    ));

    return render(<WrappedRubberStampPanel />);
  };

  it('should render preset selected and custom unselected in the new stamp panel', () => {
    renderRubberStampPanel();

    const presetButton = screen.getByRole('button', { name: /^Preset$/i });
    const customButton = screen.getByRole('button', { name: /^Custom$/i });

    expect(presetButton).toHaveClass('selected');
    expect(presetButton).toHaveAttribute('aria-selected', 'true');
    expect(presetButton).toHaveAttribute('aria-current', 'page');
    expect(presetButton).toHaveAttribute('data-element', 'rubberStampPanelPresetTab');
    expect(customButton).not.toHaveClass('selected');
    expect(customButton).toHaveAttribute('aria-selected', 'false');
    expect(customButton).toHaveAttribute('data-element', 'rubberStampPanelCustomTab');
  });

  it('should dispatch custom tab selection when clicking the second button', async () => {
    renderRubberStampPanel();

    await userEvent.click(screen.getByRole('button', { name: /^Custom$/i }));

    expect(screen.getByRole('button', { name: /^Custom$/i })).toHaveClass('selected');
    expect(screen.getByRole('button', { name: /^Custom$/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /Custom Stamp/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete Stamp 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Preset$/i })).not.toHaveClass('selected');
    expect(screen.queryByRole('button', { name: /Approved/i })).not.toBeInTheDocument();
  });

  it('syncs document stamp registry to sibling viewer tools when a document-backed stamp is selected', async () => {
    const registration = {
      sources: [{ source: 'https://example.com/source.pdf', pages: [1] }],
      options: { cropVisibleContent: false, pages: [1] },
    };
    const sourceTool = buildMockTool({ hasDocumentStampTemplate: jest.fn(() => true), getDocumentStampRegistration: jest.fn(() => registration) });
    const targetTool = buildMockTool();

    renderStampPanel([sourceTool, targetTool], { icon: 'Approved', templateId: 'template-id-1' });
    await userEvent.click(screen.getAllByRole('button', { name: /^Approved$/i })[0]);

    expect(sourceTool.getDocumentStampRegistration).toHaveBeenCalledTimes(1);
    expect(targetTool.setDocumentStamps).toHaveBeenCalledWith(registration.sources, registration.options);
    expect(sourceTool.setDocumentStamps).not.toHaveBeenCalled();
  });

  it('skips sync for a sibling whose registration already matches the source', async () => {
    const registration = {
      sources: [{ source: 'https://example.com/source.pdf', pages: [1] }],
      options: { cropVisibleContent: true },
    };
    const sourceTool = buildMockTool({ hasDocumentStampTemplate: jest.fn(() => true), getDocumentStampRegistration: jest.fn(() => registration) });
    const targetTool = buildMockTool({ getDocumentStampRegistration: jest.fn(() => registration) });

    renderStampPanel([sourceTool, targetTool], { icon: 'Approved', templateId: 'template-id-1' });
    await userEvent.click(screen.getAllByRole('button', { name: /^Approved$/i })[0]);

    expect(targetTool.setDocumentStamps).not.toHaveBeenCalled();
  });

  it('re-syncs a sibling when its registration was replaced by a different document sharing the same label', async () => {
    const newRegistration = { sources: [{ source: 'https://example.com/new-seal.pdf', title: 'Seal', pages: [1] }], options: {} };
    const oldRegistration = { sources: [{ source: 'https://example.com/old-seal.pdf', title: 'Seal', pages: [1] }], options: {} };
    const sourceTool = buildMockTool({ hasDocumentStampTemplate: jest.fn(() => true), getDocumentStampRegistration: jest.fn(() => newRegistration) });
    const targetTool = buildMockTool({ getDocumentStampRegistration: jest.fn(() => oldRegistration) });

    renderStampPanel([sourceTool, targetTool], { icon: 'Seal 1', templateId: 'template-id-new' });
    await userEvent.click(screen.getAllByRole('button', { name: /^Seal 1$/i })[0]);

    expect(targetTool.setDocumentStamps).toHaveBeenCalledWith(newRegistration.sources, newRegistration.options);
  });
});