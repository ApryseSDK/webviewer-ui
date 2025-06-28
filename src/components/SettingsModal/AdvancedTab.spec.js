import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AdvancedTab from 'components/SettingsModal/AdvancedTab';
import * as actions from 'actions';
import core from 'core';

jest.mock('selectors', () => ({
  shouldFadePageNavigationComponent: jest.fn().mockReturnValue(true),
  isNoteSubmissionWithEnterEnabled: jest.fn().mockReturnValue(false),
  isCommentThreadExpansionEnabled: jest.fn().mockReturnValue(false),
  isNotesPanelRepliesCollapsingEnabled: jest.fn().mockReturnValue(false),
  isNotesPanelTextCollapsingEnabled: jest.fn().mockReturnValue(false),
  shouldClearSearchPanelOnClose: jest.fn().mockReturnValue(true),
  pageDeletionConfirmationModalEnabled: jest.fn().mockReturnValue(true),
  isThumbnailSelectingPages: jest.fn().mockReturnValue(false),
  getCustomSettings: jest.fn().mockReturnValue([]),
  isToolDefaultStyleUpdateFromAnnotationPopupEnabled: jest.fn().mockReturnValue(false),
  isWidgetHighlightingEnabled: jest.fn().mockReturnValue(true),
  getUIConfiguration: jest.fn().mockReturnValue('default'),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => [
    (key) => key,
    { language: 'en' }
  ],
}));

jest.mock('core', () => ({
  getAnnotationManager: jest.fn(() => ({
    getFieldManager: jest.fn(() => ({
      isWidgetHighlightingEnabled: jest.fn(() => true),
      enableWidgetHighlighting: jest.fn(),
      disableWidgetHighlighting: jest.fn(),
    })),
  })),
}));

jest.mock('actions', () => ({
  enableWidgetHighlighting: jest.fn(() => ({ type: 'ENABLE_WIDGET_HIGHLIGHTING' })),
  disableWidgetHighlighting: jest.fn(() => ({ type: 'DISABLE_WIDGET_HIGHLIGHTING' })),
  disableFadePageNavigationComponent: jest.fn(),
  enableFadePageNavigationComponent: jest.fn(),
  setToolDefaultStyleUpdateFromAnnotationPopupEnabled: jest.fn(),
  setNoteSubmissionEnabledWithEnter: jest.fn(),
  setCommentThreadExpansion: jest.fn(),
  setNotesPanelRepliesCollapsing: jest.fn(),
  setNotesPanelTextCollapsing: jest.fn(),
  setClearSearchOnPanelClose: jest.fn(),
  disablePageDeletionConfirmationModal: jest.fn(),
  enablePageDeletionConfirmationModal: jest.fn(),
  setThumbnailSelectingPages: jest.fn(),
}));

jest.mock('helpers/TouchEventManager', () => ({
  useNativeScroll: true
}));

// Mock Choice component for easier testing
jest.mock('components/Choice', () => {
  return function MockChoice({ checked, onChange, 'aria-label': ariaLabel }) {
    return (
      <div data-testid="choice">
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e)}
            data-testid={`${ariaLabel}-checkbox`}
          />
          <span>{ariaLabel}</span>
        </label>
      </div>
    );
  };
});

jest.mock('./SearchWrapper', () => ({
  SearchWrapper: ({ children }) => <div>{children}</div>
}));

const renderWithRedux = (component, initialState = {}) => {
  const store = createStore(() => initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('AdvancedTab Component', () => {
  const createInitialState = (overrides = {}) => ({
    viewer: {
      fadePageNavigationComponent: true,
      isNoteSubmissionWithEnterEnabled: false,
      isCommentThreadExpansionEnabled: false,
      isNotesPanelRepliesCollapsingEnabled: false,
      isNotesPanelTextCollapsingEnabled: false,
      pageDeletionConfirmationModalEnabled: true,
      isThumbnailSelectingPages: false,
      isToolDefaultStyleUpdateFromAnnotationPopupEnabled: false,
      isWidgetHighlightingEnabled: true,
      getUIConfiguration: 'default',
      ...overrides.viewer
    },
    search: {
      value: '',
      clearSearchPanelOnClose: true,
      ...overrides.search
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const selectors = require('selectors');
    Object.values(selectors).forEach((selector) => {
      if (typeof selector === 'function' && jest.isMockFunction(selector)) {
        if (selector === selectors.getCustomSettings) {
          selector.mockReturnValue([]);
        } else if (
          selector === selectors.isNoteSubmissionWithEnterEnabled ||
          selector === selectors.isCommentThreadExpansionEnabled ||
          selector === selectors.isNotesPanelRepliesCollapsingEnabled ||
          selector === selectors.isNotesPanelTextCollapsingEnabled ||
          selector === selectors.isThumbnailSelectingPages ||
          selector === selectors.isToolDefaultStyleUpdateFromAnnotationPopupEnabled
        ) {
          selector.mockReturnValue(false);
        } else {
          selector.mockReturnValue(true);
        }
      }
    });
  });

  test('renders without crashing', () => {
    const initialState = createInitialState();
    const { container } = renderWithRedux(<AdvancedTab />, initialState);
    expect(container).toBeTruthy();
  });

  test('renders all sections correctly', () => {
    const initialState = createInitialState();
    renderWithRedux(<AdvancedTab />, initialState);

    // Check that all section titles are rendered
    expect(screen.getByText('option.settings.viewing')).toBeInTheDocument();
    expect(screen.getByText('option.settings.annotations')).toBeInTheDocument();
    expect(screen.getByText('option.settings.notesPanel')).toBeInTheDocument();
    expect(screen.getByText('option.settings.search')).toBeInTheDocument();
    expect(screen.getByText('option.settings.pageManipulation')).toBeInTheDocument();
  });

  // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
  test.skip('initializes widget highlighting based on core settings', () => {
    jest.spyOn(core, 'getAnnotationManager').mockImplementation(() => {
      return {
        getFieldManager: jest.fn(() => ({
          isWidgetHighlightingEnabled: () => true,
          enableWidgetHighlighting: jest.fn(),
          disableWidgetHighlighting: jest.fn(),
        })),
      };
    });
    renderWithRedux(<AdvancedTab />);
    expect(actions.enableWidgetHighlighting).toHaveBeenCalled();

    jest.clearAllMocks();

    jest.spyOn(core, 'getAnnotationManager').mockImplementation(() => {
      return {
        getFieldManager: jest.fn(() => ({
          isWidgetHighlightingEnabled: () => false,
          enableWidgetHighlighting: jest.fn(),
          disableWidgetHighlighting: jest.fn(),
        })),
      };
    });
    renderWithRedux(<AdvancedTab />);
    expect(actions.disableWidgetHighlighting).toHaveBeenCalled();
  });

  // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
  test.skip('disables widget highlighting when toggle is turned off', () => {
    const selectors = require('selectors');

    selectors.isWidgetHighlightingEnabled.mockReturnValue(true);

    renderWithRedux(<AdvancedTab />);

    const checkbox = screen.getByTestId('option.settings.enabledFormFieldHighlighting-checkbox');
    fireEvent.change(checkbox, { target: { checked: false } });

    expect(actions.disableWidgetHighlighting).toHaveBeenCalled();
  });

  // To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
  test.skip('enables widget highlighting when toggle is turned on', () => {
    jest.spyOn(core, 'getAnnotationManager').mockImplementation(() => {
      return {
        getFieldManager: jest.fn(() => ({
          isWidgetHighlightingEnabled: () => true,
          enableWidgetHighlighting: jest.fn(),
          disableWidgetHighlighting: jest.fn(),
        })),
      };
    });
    const selectors = require('selectors');

    selectors.isWidgetHighlightingEnabled.mockReturnValue(false);

    renderWithRedux(<AdvancedTab />);

    const checkbox = screen.getByTestId('option.settings.enabledFormFieldHighlighting-checkbox');
    fireEvent.change(checkbox, { target: { checked: true } });

    expect(actions.enableWidgetHighlighting).toHaveBeenCalled();
  });

  test('shows the correct description for widget highlighting', () => {
    const initialState = createInitialState();
    renderWithRedux(<AdvancedTab />, initialState);

    expect(screen.getByText('option.settings.enabledFormFieldHighlightingDesc')).toBeInTheDocument();
  });
});

// Test for the event handler
describe('Widget Highlighting Event Handler', () => {
  const createEventHandler = () => {
    return (dispatch) => (data) => {
      if (data && data.isEnabled) {
        dispatch(actions.enableWidgetHighlighting());
      } else {
        dispatch(actions.disableWidgetHighlighting());
      }
    };
  };

  test('dispatches the correct action based on event data', () => {
    const handler = createEventHandler();
    const mockDispatch = jest.fn();
    const eventHandler = handler(mockDispatch);

    eventHandler({ isEnabled: true });
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'ENABLE_WIDGET_HIGHLIGHTING'
    }));

    // Reset mock
    mockDispatch.mockClear();

    eventHandler({ isEnabled: false });
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DISABLE_WIDGET_HIGHLIGHTING'
    }));
  });
});

describe('Widget Highlighting Reducer', () => {
  const mockReducer = (state = {}, action) => {
    switch (action.type) {
      case 'ENABLE_WIDGET_HIGHLIGHTING':
        return { ...state, isWidgetHighlightingEnabled: true };
      case 'DISABLE_WIDGET_HIGHLIGHTING':
        return { ...state, isWidgetHighlightingEnabled: false };
      default:
        return state;
    }
  };

  test('ENABLE_WIDGET_HIGHLIGHTING sets isWidgetHighlightingEnabled to true', () => {
    const initialState = { isWidgetHighlightingEnabled: false };
    const action = { type: 'ENABLE_WIDGET_HIGHLIGHTING' };

    const newState = mockReducer(initialState, action);
    expect(newState.isWidgetHighlightingEnabled).toBe(true);
  });

  test('DISABLE_WIDGET_HIGHLIGHTING sets isWidgetHighlightingEnabled to false', () => {
    const initialState = { isWidgetHighlightingEnabled: true };
    const action = { type: 'DISABLE_WIDGET_HIGHLIGHTING' };

    const newState = mockReducer(initialState, action);
    expect(newState.isWidgetHighlightingEnabled).toBe(false);
  });
});