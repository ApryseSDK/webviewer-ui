import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import RubberStampPanel from './RubberStampPanel';
import StampSearchOverlay from './StampSearchOverlay';
import StampSearchOptionsFlyout from 'components/ModularComponents/StampSearchOptionsFlyout';
import StandardRubberStamps from './StandardRubberStamps';
import CustomRubberStamps from './CustomRubberStamps';
import { getCustomStampCategory } from 'helpers/stamps';

if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const mockStampTool = {
  setRubberStamp: jest.fn(),
  showPreview: jest.fn(),
  getCustomStamps: jest.fn(() => []),
  deleteCustomStamps: jest.fn(),
  formatCustomStampSubtitle: jest.fn((subtitle) => subtitle.replace('$currentUser', 'Current User')),
  isDocumentStampsLoading: jest.fn(() => false),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

jest.mock('core', () => ({
  getToolsFromAllDocumentViewers: jest.fn(() => [mockStampTool]),
  getDocumentViewer: jest.fn(() => ({})),
  getToolMode: jest.fn(() => ({ name: 'Select' })),
  setToolMode: jest.fn(),
  getTool: jest.fn(() => mockStampTool),
}));

jest.mock('helpers/fireEvent', () => ({
  __esModule: true,
  default: jest.fn(),
  getEventHandler: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
}));

jest.mock('helpers/setToolModeAndGroup', () => jest.fn());

const customScrollParentRefs = [];

jest.mock('react-virtuoso', () => {
  const Virtuoso = ({ data = [], itemContent, initialItemCount = 10, customScrollParent, className }) => {
    if (customScrollParent && !customScrollParentRefs.includes(customScrollParent)) {
      customScrollParentRefs.push(customScrollParent);
    }

    const renderedItems = data.slice(0, Math.min(initialItemCount, data.length));

    return (
      <div className={className} data-virtuoso-scroller='true' data-testid='virtuoso-scroller'>
        <div data-testid='virtuoso-item-list'>
          {renderedItems.map((item, index) => (
            <div key={index} data-index={index}>
              {itemContent(index, item)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return { Virtuoso };
});

const TestStandardRubberStamps = withProviders(StandardRubberStamps);
const TestCustomRubberStamps = withProviders(CustomRubberStamps);
const TestStandardRubberStampsWithCategories = withProviders(StandardRubberStamps, {
  viewer: {
    standardStampCategories: ['zeta', 'alpha', 'rubberStampPanel.standard'],
  },
});
const TestCustomRubberStampsWithCategories = withProviders(CustomRubberStamps, {
  viewer: {
    customStampCategories: ['Legal'],
  },
});

const mockInitialState = {
  viewer: {
    standardStamps: [],
    standardStampCategories: [],
    customStamps: [],
    customStampCategories: [],
    customPanels: [],
    genericPanels: [],
    selectedStampIndex: null,
    tab: {
      rubberStampPanel: 'rubberStampPanelPresetTab',
    },
  },
};

const TestRubberStampPanel = withProviders(RubberStampPanel, mockInitialState);
const STRESS_TEST_ITEM_COUNT = 50;

function noop() {}

const createStandardStamps = (count) => Array.from({ length: count }, (_, index) => ({
  imgSrc: null,
  annotation: { Icon: `Stamp-${index}` },
}));

const createCategorizedStandardStamps = (category, count) => Array.from({ length: count }, (_, index) => ({
  imgSrc: null,
  annotation: { Icon: `${category}-Stamp-${index}`, category },
}));

const createCustomStamps = (count) => Array.from({ length: count }, (_, index) => ({
  imgSrc: null,
  annotation: {
    DateCreated: `2024-01-${String((index % 28) + 1).padStart(2, '0')}`,
    getCustomData: () => JSON.stringify({
      title: `Custom Stamp ${index + 1}`,
      author: 'Stress Test',
    }),
  },
}));

const withIndices = (stamps) => stamps.map((stamp, index) => ({ ...stamp, index }));

function buildMockTool(overrides = {}) {
  return {
    setRubberStamp: jest.fn(),
    showPreview: jest.fn(),
    getCustomStamps: jest.fn(() => []),
    hasDocumentStampTemplate: jest.fn(() => false),
    getDocumentStampRegistration: jest.fn(() => ({ sources: [], options: undefined })),
    setDocumentStamps: jest.fn(),
    isDocumentStampsLoading: jest.fn(() => false),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    ...overrides,
  };
}

function renderStampPanel(tools, { icon, category, getCustomData, loadingScreenStyle }) {
  jest.requireMock('core').getToolsFromAllDocumentViewers.mockReturnValue(tools);
  const annotation = {
    Icon: icon,
    category,
    getCustomData,
  };
  const customStamps = (tools[0]?.getCustomStamps() || []).map((customAnnotation) => ({
    imgSrc: null,
    annotation: customAnnotation,
  }));
  const customStampCategories = [...new Set(customStamps.map(getCustomStampCategory))];
  const storeState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      standardStamps: [{ imgSrc: null, annotation }],
      standardStampCategories: [category],
      customStamps,
      customStampCategories,
      selectedStampIndex: null,
      loadingScreenStyle: loadingScreenStyle ?? initialState.viewer.loadingScreenStyle,
      tab: { rubberStampPanel: 'rubberStampPanelPresetTab' },
    },
  };
  const store = configureStore({
    reducer: (state = storeState, action) => {
      if (action.type === 'SET_SELECTED_STAMP_INDEX') {
        return { ...state, viewer: { ...state.viewer, selectedStampIndex: action.payload.selectedStampIndex } };
      }
      if (action.type === 'SET_SELECTED_TAB') {
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
      }
      if (action.type === 'SET_IS_MULTI_VIEWER_MODE') {
        return {
          ...state,
          viewer: {
            ...state.viewer,
            isMultiViewerMode: action.payload.isMultiViewerMode,
          },
        };
      }
      return state;
    },
  });
  const WrappedPanel = withI18n(() => <Provider store={store}><RubberStampPanel /></Provider>);
  return { store, ...render(<WrappedPanel />) };
}

describe('StandardRubberStamps', () => {
  beforeEach(() => {
    customScrollParentRefs.length = 0;
  });

  it('Component should not throw any errors', () => {
    expect(() => {
      render(<TestStandardRubberStamps standardStamps={[]} selectedStampeIndex={0} setSelectedRubberStamp={noop}/>);
    }).not.toThrow();
  });

  it('Component should have Aria Controls defined', () => {
    render(
      <TestStandardRubberStamps
        selectedStampeIndex={0}
        setSelectedRubberStamp={noop}
        searchResults={{ standard: [{ imgSrc: null, annotation: { Icon: 'Approved' }, index: 0 }] }}
      />,
    );

    const element = screen.getByRole('button');
    expect(element).toHaveAttribute('aria-controls');
  });

  it('Component should have Aria current defined', () => {
    render(
      <TestStandardRubberStamps
        selectedStampeIndex={0}
        setSelectedRubberStamp={noop}
        searchResults={{ standard: [{ imgSrc: null, annotation: { Icon: 'Approved' }, index: 0 }] }}
      />,
    );

    const element = screen.getByRole('button', { name: 'Approved' });
    expect(element).toHaveAttribute('aria-current');
  });

  it('virtualizes nested standard stamp lists under stress', async () => {
    const standardStamps = createStandardStamps(STRESS_TEST_ITEM_COUNT);

    render(
      <TestStandardRubberStamps
        standardStamps={standardStamps}
        selectedStampIndex={0}
        setSelectedRubberStamp={noop}
        searchResults = {{ 'rubberStampPanel.standard': standardStamps }}
      />,
    );

    const nestedVirtualScrollers = await screen.findAllByTestId('virtuoso-scroller');
    expect(nestedVirtualScrollers.length).toBeGreaterThan(0);

    expect(screen.getAllByRole('button', { name: 'Stamp-0' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: `Stamp-${STRESS_TEST_ITEM_COUNT - 1}` })).not.toBeInTheDocument();

    const renderedStampButtons = screen
      .getAllByRole('button')
      .filter((button) => (button.getAttribute('aria-label') || '').startsWith('Stamp-'));

    expect(renderedStampButtons.length).toBeLessThan(standardStamps.length * 3);
  });

  it('uses the external rubber-stamps-container as customScrollParent', async () => {
    const scrollerState = {
      ...mockInitialState,
      viewer: {
        ...mockInitialState.viewer,
        standardStamps: createStandardStamps(200),
        standardStampCategories: ['rubberStampPanel.standard'],
        customStamps: [],
        selectedStampIndex: 0,
      },
    };
    const TestRubberStampPanelScroller = withProviders(RubberStampPanel, scrollerState);

    render(<TestRubberStampPanelScroller />);

    const externalScroller = document.querySelector('.rubber-stamps-container');
    expect(externalScroller).toBeTruthy();

    await waitFor(() => {
      expect(customScrollParentRefs).toContain(externalScroller);
    });
  });

  it('virtualizes each category section independently under stress', async () => {
    const categories = ['zeta', 'alpha', 'rubberStampPanel.standard'];
    const standardStamps = categories.flatMap((category) => createCategorizedStandardStamps(category, STRESS_TEST_ITEM_COUNT));
    const searchResultsWithAllCategories = {
      'rubberStampPanel.standard': standardStamps,
      'zeta': standardStamps,
      'alpha': standardStamps,
    };

    render(
      <TestStandardRubberStampsWithCategories
        standardStamps={standardStamps}
        selectedStampIndex={0}
        setSelectedRubberStamp={noop}
        searchResults={searchResultsWithAllCategories}
      />,
    );

    const virtualScrollers = await screen.findAllByTestId('virtuoso-scroller');
    expect(virtualScrollers.length).toBe(categories.length);

    categories.forEach((category) => {
      const categoryLabel = category === 'rubberStampPanel.standard' ? 'Standard Stamps' : category;
      expect(screen.getAllByRole('button', { name: categoryLabel }).length).toBeGreaterThan(0);
      expect(screen.queryByRole('button', { name: `${category}-Stamp-${STRESS_TEST_ITEM_COUNT - 1}` })).not.toBeInTheDocument();
    });
  });

  it('recomputes sibling category virtualization when one category section is collapsed', async () => {
    const categories = ['zeta', 'alpha'];
    const scrollerState = {
      ...mockInitialState,
      viewer: {
        ...mockInitialState.viewer,
        standardStamps: categories.flatMap((category) => createCategorizedStandardStamps(category, STRESS_TEST_ITEM_COUNT)),
        standardStampCategories: categories,
        customStamps: [],
        selectedStampIndex: 0,
      },
    };
    const TestRubberStampPanelCategories = withProviders(RubberStampPanel, scrollerState);

    render(<TestRubberStampPanelCategories />);

    const externalScroller = document.querySelector('.rubber-stamps-container');
    await waitFor(() => expect(customScrollParentRefs).toContain(externalScroller));

    const dispatchEventSpy = jest.spyOn(externalScroller, 'dispatchEvent');

    await userEvent.click(screen.getByRole('button', { name: 'zeta' }));

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'scroll' }));
    });

    dispatchEventSpy.mockRestore();
  });

  it('translates category keys with key fallback', () => {
    const alphaStamp = { imgSrc: null, annotation: { Icon: 'Draft', category: 'alpha' } };
    const zetaStamp = { imgSrc: null, annotation: { Icon: 'Approved', category: 'zeta' } };
    const standardStamp = { imgSrc: null, annotation: { Icon: 'Final', category: 'rubberStampPanel.standard' } };
    render(
      <TestStandardRubberStampsWithCategories
        standardStamps={[
          zetaStamp,
          alphaStamp,
          standardStamp,
        ]}
        selectedStampIndex={0}
        setSelectedRubberStamp={noop}
        searchResults={{
          alpha: [alphaStamp],
          'rubberStampPanel.standard': [standardStamp],
          zeta: [zetaStamp],
        }}
      />,
    );

    const categoryButtons = screen.getAllByRole('button').filter((button) => (
      ['alpha', 'zeta', 'Standard Stamps'].includes(button.getAttribute('aria-label'))
    ));

    expect(categoryButtons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'alpha',
      'Standard Stamps',
      'zeta',
    ]);
  });
  it('should return null when there are no standard stamps', () => {
    render(<TestStandardRubberStamps standardStamps={[]} selectedStampIndex={null} setSelectedRubberStamp={noop}/>);

    const standardStampList = screen.queryByTestId('standard-rubber-stamps-list');
    expect(standardStampList).not.toBeInTheDocument();
  });

  it('returns null when there are no search results', () => {
    const categories = ['zeta', 'alpha', 'rubberStampPanel.standard'];
    const standardStamps = categories.flatMap((category) => createCategorizedStandardStamps(category, STRESS_TEST_ITEM_COUNT));

    render(
      <TestStandardRubberStampsWithCategories
        standardStamps={standardStamps}
        selectedStampIndex={0}
        setSelectedRubberStamp={noop}
        searchResults={{}}
      />,
    );

    const standardStampList = screen.queryByTestId('standard-rubber-stamps-list');
    expect(standardStampList).not.toBeInTheDocument();
  });

  it('displays the standard rubber stamps by category from searchResults prop', () => {
    const alphaStamp = { imgSrc: null, annotation: { Icon: 'Alpha', category: 'alpha' } };
    const zetaStamp = { imgSrc: null, annotation: { Icon: 'Zeta', category: 'zeta' } };
    const excludedStamp = { imgSrc: null, annotation: { Icon: 'Excluded', category: 'alpha' } };

    render(
      <TestStandardRubberStampsWithCategories
        standardStamps={[alphaStamp, zetaStamp, excludedStamp]}
        selectedStampIndex={0}
        setSelectedRubberStamp={noop}
        searchResults={{ alpha: [{ ...alphaStamp, index: 0 }], zeta: [{ ...zetaStamp, index: 1 }] }}
      />,
    );

    expect(within(document.getElementById('rubber-stamps-list-0')).getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
    expect(within(document.getElementById('rubber-stamps-list-1')).getByRole('button', { name: 'Zeta' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Excluded' })).not.toBeInTheDocument();
  });

  it('preserves the original index when selecting a filtered standard stamp', async () => {
    const alphaStamp = { imgSrc: null, annotation: { Icon: 'Alpha', category: 'alpha' } };
    const zetaStamp = { imgSrc: null, annotation: { Icon: 'Zeta', category: 'zeta' } };
    const excludedStamp = { imgSrc: null, annotation: { Icon: 'Excluded', category: 'alpha' } };
    const setSelectedRubberStamp = jest.fn();

    render(
      <TestStandardRubberStampsWithCategories
        selectedStampIndex={0}
        setSelectedRubberStamp={setSelectedRubberStamp}
        searchResults={{ alpha: [{ ...alphaStamp, index: 0 }], zeta: [{ ...zetaStamp, index: 1 }] }}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: 'Zeta' }));
    expect(setSelectedRubberStamp).toHaveBeenCalledWith(zetaStamp.annotation, 1);
  });
});

describe('CustomRubberStamps', () => {
  it('virtualizes custom stamp rows under stress', async () => {
    const customStamps = createCustomStamps(STRESS_TEST_ITEM_COUNT);

    render(
      <TestCustomRubberStamps
        selectedStampIndex={null}
        setSelectedRubberStamp={noop}
        standardStampsOffset={0}
        searchResults={{ Legal: withIndices(customStamps) }}
      />
    );

    expect(await screen.findByRole('button', { name: /^Delete Stamp 1$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: new RegExp(`^Delete Stamp ${STRESS_TEST_ITEM_COUNT}$`, 'i') })).not.toBeInTheDocument();

    const renderedDeleteButtons = screen.getAllByRole('button', { name: /Delete Stamp/i });
    expect(renderedDeleteButtons.length).toBeLessThan(customStamps.length);
  });

  it('renders a categorized custom stamp preview in its category section', () => {
    const customStamps = [{
      imgSrc: 'data:image/png;base64,custom-stamp-preview',
      annotation: {
        category: 'Legal',
        DateCreated: '2024-01-01',
        getCustomData: () => JSON.stringify({ title: 'Legal Stamp' }),
      },
    }];
    render(
      <TestCustomRubberStampsWithCategories
        selectedStampIndex={null}
        setSelectedRubberStamp={noop}
        standardStampsOffset={0}
        searchResults={{ Legal: withIndices(customStamps) }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Legal' })).toBeInTheDocument();
    expect(document.querySelector('.custom-rubber-stamps-list img')).toHaveAttribute(
      'src',
      'data:image/png;base64,custom-stamp-preview',
    );
  });

  it('CustomRubberStamps should return null when there are no custom stamps', () => {
    render(<TestCustomRubberStamps customStamps={[]} selectedStampIndex={null} setSelectedRubberStamp={noop} standardStampsOffset={0}/>);

    const customStampList = screen.queryByTestId('custom-rubber-stamps-list');
    expect(customStampList).not.toBeInTheDocument();
  });

  it('CustomRubberStamps should return null when there are no visible stamp categories', () => {
    render(<TestCustomRubberStamps
      customStamps={[{
        imgSrc: 'data:image/png;base64,custom-stamp-preview',
        annotation: {
          category: 'Legal',
          DateCreated: '2024-01-01',
          getCustomData: () => JSON.stringify({ title: 'Legal Stamp' }),
        },
      }]}
      selectedStampIndex={null}
      setSelectedRubberStamp={noop}
      standardStampsOffset={0}
    />);

    const customStampList = screen.queryByTestId('custom-rubber-stamps-list');
    expect(customStampList).not.toBeInTheDocument();
  });

  it('delete handler should call tool.deleteCustomStamps with the correct stamp when delete button is clicked when there are multiple categories', async () => {
    const stamp1 = {
      title: 'Stamp to keep',
      category: 'Category 1',
      getCustomData: () => JSON.stringify({
        title: 'Stamp to keep',
      }),
    };
    const stamp2 = {
      title: 'Stamp to delete',
      category: 'Legal',
      getCustomData: () => JSON.stringify({
        title: 'Stamp to delete',
      }),
    };
    const mockTool = buildMockTool({
      getCustomStamps: jest.fn(() => [stamp1, stamp2]),
    });
    mockTool.deleteCustomStamps = jest.fn();

    renderStampPanel([mockTool], { icon: 'Approved', category: 'Standard Stamps' });
    userEvent.click(screen.getByRole('button', { name: /^Custom$/i }));
    const deleteButton = screen.getByRole('button', { name: /Delete Stamp 2/i });
    userEvent.click(deleteButton);

    expect(mockTool.deleteCustomStamps).toHaveBeenCalledWith([stamp2]);
    expect(mockTool.deleteCustomStamps).not.toHaveBeenCalledWith([stamp1]);
  });

  it('returns null when there are no search results', async () => {
    const customStamps = createCustomStamps(STRESS_TEST_ITEM_COUNT);

    render(
      <TestCustomRubberStamps
        customStamps={customStamps}
        selectedStampIndex={null}
        setSelectedRubberStamp={noop}
        standardStampsOffset={0}
        searchResults={{}}
      />
    );

    const customStampList = screen.queryByTestId('custom-rubber-stamps-list');
    expect(customStampList).not.toBeInTheDocument();
  });

  it('displays the custom rubber stamps by category from searchResults prop', () => {
    const alphaStamp = {
      imgSrc: null,
      annotation: {
        category: 'Alpha',
        getCustomData: () => JSON.stringify({ title: 'Alpha' }),
      },
    };
    const legalStamp = {
      imgSrc: null,
      annotation: {
        category: 'Legal',
        getCustomData: () => JSON.stringify({ title: 'Legal' }),
      },
    };
    const excludedStamp = {
      imgSrc: null,
      annotation: {
        category: 'Alpha',
        getCustomData: () => JSON.stringify({ title: 'Excluded' }),
      },
    };

    render(
      <TestCustomRubberStampsWithCategories
        selectedStampIndex={null}
        setSelectedRubberStamp={noop}
        standardStampsOffset={0}
        searchResults={{ Alpha: [{ ...alphaStamp, index: 0 }], Legal: [{ ...legalStamp, index: 1 }] }}
      />,
    );

    expect(within(document.getElementById('rubber-stamps-list-custom-0')).getByRole('button', { name: /Delete Stamp 1/i })).toBeInTheDocument();
    expect(within(document.getElementById('rubber-stamps-list-custom-1')).getByRole('button', { name: /Delete Stamp 2/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Stamp 3/i })).not.toBeInTheDocument();
  });

  it('preserves the original index when selecting a filtered custom stamp', async () => {
    const alphaStamp = {
      imgSrc: null,
      annotation: {
        category: 'Alpha',
        getCustomData: () => JSON.stringify({ title: 'Alpha' }),
      },
    };
    const legalStamp = {
      imgSrc: null,
      annotation: {
        category: 'Legal',
        getCustomData: () => JSON.stringify({ title: 'Legal' }),
      },
    };
    const setSelectedRubberStamp = jest.fn();

    render(
      <TestCustomRubberStampsWithCategories
        selectedStampIndex={null}
        setSelectedRubberStamp={setSelectedRubberStamp}
        standardStampsOffset={10}
        searchResults={{ Legal: [{ ...legalStamp, index: 1 }] }}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /^Stamp Legal/ }));

    expect(setSelectedRubberStamp).toHaveBeenCalledWith(legalStamp.annotation, 11);
  });

  it('should hide the preview and clear the tool when the currently previewed custom stamp is deleted', () => {
    const stamp1 = {
      title: 'Stamp to keep',
      getCustomData: () => JSON.stringify({ title: 'Stamp to keep' }),
    };
    const stamp2 = {
      title: 'Stamp to delete',
      getCustomData: () => JSON.stringify({ title: 'Stamp to delete' }),
    };
    const mockTool = buildMockTool({
      getCustomStamps: jest.fn(() => [stamp1, stamp2]),
    });
    mockTool.deleteCustomStamps = jest.fn();
    mockTool.hidePreview = jest.fn();
    jest.requireMock('core').getToolsFromAllDocumentViewers.mockReturnValue([mockTool]);

    render(
      <TestCustomRubberStamps
        selectedStampIndex={1}
        setSelectedRubberStamp={noop}
        standardStampsOffset={0}
        searchResults={{
          Legal: [
            { imgSrc: null, annotation: stamp1, index: 0 },
            { imgSrc: null, annotation: stamp2, index: 1 },
          ],
        }}
      />
    );

    userEvent.click(screen.getByRole('button', { name: /Delete Stamp 2/i }));

    expect(mockTool.hidePreview).toHaveBeenCalled();
    expect(mockTool.setRubberStamp).toHaveBeenCalledWith(null);
  });

  it('should not touch the preview or the tool when a non-active custom stamp is deleted', () => {
    const stamp1 = {
      title: 'Stamp to keep',
      getCustomData: () => JSON.stringify({ title: 'Stamp to keep' }),
    };
    const stamp2 = {
      title: 'Stamp to delete',
      getCustomData: () => JSON.stringify({ title: 'Stamp to delete' }),
    };
    const mockTool = buildMockTool({
      getCustomStamps: jest.fn(() => [stamp1, stamp2]),
    });
    mockTool.deleteCustomStamps = jest.fn();
    mockTool.hidePreview = jest.fn();
    jest.requireMock('core').getToolsFromAllDocumentViewers.mockReturnValue([mockTool]);

    render(
      <TestCustomRubberStamps
        selectedStampIndex={0}
        setSelectedRubberStamp={noop}
        standardStampsOffset={0}
        searchResults={{
          Legal: [
            { imgSrc: null, annotation: stamp1, index: 0 },
            { imgSrc: null, annotation: stamp2, index: 1 },
          ],
        }}
      />
    );

    userEvent.click(screen.getByRole('button', { name: /Delete Stamp 2/i }));

    expect(mockTool.hidePreview).not.toHaveBeenCalled();
    expect(mockTool.setRubberStamp).not.toHaveBeenCalled();
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

  it('allows searching stamps through the accessible search input', async () => {
    renderRubberStampPanel();

    const searchInput = screen.getByRole('textbox', { name: /search/i });
    userEvent.type(searchInput, 'approved');

    expect(searchInput).toHaveValue('approved');
  });

  it('disables the filter button only when there are no stamp categories', async () => {
    const store = configureStore({ reducer: rootReducer() });
    const WrappedStampSearchOverlay = withI18n(({ categoryMap, isFlyout }) => (
      <Provider store={store}>
        <StampSearchOverlay categoryMap={categoryMap} isFlyout={isFlyout} />
      </Provider>
    ));

    const { rerender } = render(<WrappedStampSearchOverlay categoryMap={{}} />);

    expect(screen.getByRole('button', { name: /filter/i })).toBeDisabled();

    rerender(<WrappedStampSearchOverlay categoryMap={{ alpha: { isCheckboxVisible: true } }} />);

    expect(screen.getByRole('button', { name: /filter/i })).toBeEnabled();

    rerender(<WrappedStampSearchOverlay categoryMap={{}} isFlyout />);

    const nestedFlyoutFilterButton = screen.getByRole('button', { name: /filter/i });
    expect(nestedFlyoutFilterButton).toBeDisabled();

    await userEvent.click(nestedFlyoutFilterButton);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();

    rerender(<WrappedStampSearchOverlay categoryMap={{ alpha: { isCheckboxVisible: true } }} isFlyout />);

    expect(screen.getByRole('button', { name: /filter/i })).toBeEnabled();
  });

  it('shows a document stamp skeleton without hiding available stamps', () => {
    const loadingTool = buildMockTool({
      isDocumentStampsLoading: jest.fn(() => true),
    });

    renderStampPanel([loadingTool], { icon: 'Approved', category: 'Standard Stamps' });

    expect(screen.getByTestId('document-stamps-loading')).toBeInTheDocument();
    expect(document.querySelectorAll('.document-stamp-skeleton')).toHaveLength(2);
    expect(document.querySelector('.document-stamps-loading .spinner')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approved' })).toBeInTheDocument();
    expect(loadingTool.addEventListener).toHaveBeenCalledWith('documentStampsLoadingChanged', expect.any(Function));
  });

  it('shows the legacy spinner when the loading screen style is legacy', () => {
    const loadingTool = buildMockTool({
      isDocumentStampsLoading: jest.fn(() => true),
    });

    renderStampPanel([loadingTool], {
      icon: 'Approved',
      category: 'Standard Stamps',
      loadingScreenStyle: 'legacy',
    });

    expect(document.querySelector('.document-stamps-loading .spinner')).toBeInTheDocument();
    expect(document.querySelector('.document-stamp-skeleton')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approved' })).toBeInTheDocument();
  });

  it('refreshes document stamp loading listeners when multi-viewer mode changes', async () => {
    const firstTool = buildMockTool();
    const secondTool = buildMockTool();
    const { store } = renderStampPanel([firstTool], { icon: 'Approved', category: 'Standard Stamps' });

    expect(firstTool.addEventListener).toHaveBeenCalledWith('documentStampsLoadingChanged', expect.any(Function));
    jest.requireMock('core').getToolsFromAllDocumentViewers.mockReturnValue([secondTool]);

    await act(async () => {
      store.dispatch({
        type: 'SET_IS_MULTI_VIEWER_MODE',
        payload: { isMultiViewerMode: true },
      });
    });

    expect(firstTool.removeEventListener).toHaveBeenCalledWith('documentStampsLoadingChanged', expect.any(Function));
    expect(secondTool.addEventListener).toHaveBeenCalledWith('documentStampsLoadingChanged', expect.any(Function));
  });

  it('removes the stamp search options flyout state on unmount', () => {
    const store = configureStore({ reducer: rootReducer() });
    const categoryMap = { alpha: { isCheckboxVisible: true, isCheckboxEnabled: true } };
    const WrappedStampSearchOptionsFlyout = withI18n(() => (
      <Provider store={store}>
        <StampSearchOptionsFlyout
          isPanelOpen
          categoryMap={categoryMap}
        />
      </Provider>
    ));

    const { unmount } = render(<WrappedStampSearchOptionsFlyout />);

    expect(store.getState().viewer.flyoutMap[DataElements.STAMP_SEARCH_OPTIONS_FLYOUT]).toBeDefined();

    store.dispatch(actions.openElement(DataElements.STAMP_SEARCH_OPTIONS_FLYOUT));
    expect(store.getState().viewer.activeFlyout).toBe(DataElements.STAMP_SEARCH_OPTIONS_FLYOUT);
    expect(store.getState().viewer.openElements[DataElements.STAMP_SEARCH_OPTIONS_FLYOUT]).toBe(true);

    unmount();

    expect(store.getState().viewer.flyoutMap[DataElements.STAMP_SEARCH_OPTIONS_FLYOUT]).toBeUndefined();
    expect(store.getState().viewer.activeFlyout).toBe(null);
    expect(store.getState().viewer.openElements[DataElements.STAMP_SEARCH_OPTIONS_FLYOUT]).toBe(false);
  });

  it('keeps the parent flyout active and supports keyboard category selection from a nested stamp panel', async () => {
    const store = configureStore({ reducer: rootReducer() });
    const categoryMap = {
      alpha: { isCheckboxVisible: true, isCheckboxEnabled: true },
      beta: { isCheckboxVisible: true, isCheckboxEnabled: true },
    };
    const onCategoryCheckboxChange = jest.fn();
    store.dispatch(actions.addFlyout({ dataElement: 'rubberStampFlyout', items: [] }));
    store.dispatch(actions.openElement('rubberStampFlyout'));

    const WrappedStampSearchOverlay = withI18n(() => (
      <Provider store={store}>
        <StampSearchOverlay
          isPanelOpen
          isFlyout
          categoryMap={categoryMap}
          onCategoryCheckboxChange={onCategoryCheckboxChange}
        />
      </Provider>
    ));

    render(<WrappedStampSearchOverlay />);
    userEvent.click(screen.getByRole('button', { name: /filter/i }));

    expect(store.getState().viewer.activeFlyout).toBe('rubberStampFlyout');
    expect(store.getState().viewer.flyoutMap[DataElements.STAMP_SEARCH_OPTIONS_FLYOUT]).toBeUndefined();
    const categoryCheckbox = screen.getByRole('checkbox', { name: /alpha/i });
    expect(categoryCheckbox).toHaveFocus();

    userEvent.tab();
    expect(screen.getByRole('checkbox', { name: /beta/i })).toHaveFocus();

    fireEvent.keyDown(categoryCheckbox, { key: 'Enter' });

    expect(onCategoryCheckboxChange).toHaveBeenCalledWith('alpha');
  });

  it('closes nested stamp search options when clicking outside the overlay', async () => {
    const store = configureStore({ reducer: rootReducer() });
    const categoryMap = { alpha: { isCheckboxVisible: true, isCheckboxEnabled: true } };
    store.dispatch(actions.addFlyout({ dataElement: 'rubberStampFlyout', items: [] }));
    store.dispatch(actions.openElement('rubberStampFlyout'));

    const WrappedStampSearchOverlay = withI18n(() => (
      <Provider store={store}>
        <StampSearchOverlay
          isPanelOpen
          isFlyout
          categoryMap={categoryMap}
        />
      </Provider>
    ));

    render(<><WrappedStampSearchOverlay /><button type="button">Outside</button></>);
    await userEvent.click(screen.getByRole('button', { name: /filter/i }));

    expect(screen.getByRole('checkbox', { name: /alpha/i })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('checkbox', { name: /alpha/i })).not.toBeInTheDocument();
    expect(store.getState().viewer.activeFlyout).toBe('rubberStampFlyout');
  });

  const renderRubberStampPanel = (viewerOverrides = {}) => {
    const storeInitialState = {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        ...mockInitialState.viewer,
        ...viewerOverrides,
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

  it('renders preset selected and custom unselected', () => {
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
    const customStamps = createCustomStamps(1);
    const customStampCategories = [...new Set(customStamps.map(getCustomStampCategory))];
    renderRubberStampPanel({ customStamps, customStampCategories });

    await userEvent.click(screen.getByRole('button', { name: /^Custom$/i }));

    expect(screen.getByRole('button', { name: /^Custom$/i })).toHaveClass('selected');
    expect(screen.getByRole('button', { name: /^Custom$/i })).toHaveAttribute('aria-selected', 'true');

    expect(screen.getAllByRole('button', { name: /Custom Stamp/i }).length).toBeGreaterThan(0);
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

    renderStampPanel([sourceTool, targetTool], {
      icon: 'Approved',
      category: 'Document Stamps',
      getCustomData: (key) => (key === 'trn-pdf-stamp-template-id' ? 'template-id-1' : null),
    });
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

    renderStampPanel([sourceTool, targetTool], { icon: 'Approved', category: 'Document Stamps', getCustomData: (key) => (key === 'trn-pdf-stamp-template-id' ? 'template-id-1' : null) });
    await userEvent.click(screen.getAllByRole('button', { name: /^Approved$/i })[0]);

    expect(targetTool.setDocumentStamps).not.toHaveBeenCalled();
  });

  it('re-syncs a sibling when its registration was replaced by a different document sharing the same label', async () => {
    const newRegistration = { sources: [{ source: 'https://example.com/new-seal.pdf', title: 'Seal', pages: [1] }], options: {} };
    const oldRegistration = { sources: [{ source: 'https://example.com/old-seal.pdf', title: 'Seal', pages: [1] }], options: {} };
    const sourceTool = buildMockTool({ hasDocumentStampTemplate: jest.fn(() => true), getDocumentStampRegistration: jest.fn(() => newRegistration) });
    const targetTool = buildMockTool({ getDocumentStampRegistration: jest.fn(() => oldRegistration) });

    renderStampPanel([sourceTool, targetTool], {
      icon: 'Seal 1',
      category: 'Document Stamps',
      getCustomData: (key) => (key === 'trn-pdf-stamp-template-id' ? 'template-id-new' : null),
    });
    await userEvent.click(screen.getAllByRole('button', { name: /^Seal 1$/i })[0]);

    expect(targetTool.setDocumentStamps).toHaveBeenCalledWith(newRegistration.sources, newRegistration.options);
  });

  it('re-syncs a sibling when the same source was re-registered under a different category', async () => {
    const newRegistration = {
      sources: [{ source: 'https://example.com/source.pdf', pages: [1], category: 'Legal' }],
      options: { cropVisibleContent: true },
    };
    const oldRegistration = {
      sources: [{ source: 'https://example.com/source.pdf', pages: [1], category: 'Standard' }],
      options: { cropVisibleContent: true },
    };
    const sourceTool = buildMockTool({ hasDocumentStampTemplate: jest.fn(() => true), getDocumentStampRegistration: jest.fn(() => newRegistration) });
    const targetTool = buildMockTool({ getDocumentStampRegistration: jest.fn(() => oldRegistration) });

    renderStampPanel([sourceTool, targetTool], {
      icon: 'Approved',
      category: 'Legal',
      getCustomData: (key) => (key === 'trn-pdf-stamp-template-id' ? 'template-id-1' : null),
    });
    await userEvent.click(screen.getAllByRole('button', { name: /^Approved$/i })[0]);

    expect(targetTool.setDocumentStamps).toHaveBeenCalledWith(newRegistration.sources, newRegistration.options);
  });
});