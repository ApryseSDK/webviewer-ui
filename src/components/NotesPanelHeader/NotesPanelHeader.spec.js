import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { Basic } from './NotesPanelHeader.stories';
import NotesPanelHeader from './NotesPanelHeader';
import DataElements from 'constants/dataElement';
import actions from 'actions';
import { BASE_SORT_STRATEGIES, OFFICE_EDITOR_SORT_STRATEGIES, SPREADSHEET_EDITOR_SORT_STRATEGIES } from 'constants/sortStrategies';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR } from 'constants/spreadsheetEditor';

const BasicStory = withI18n(Basic);

// Mirrors how the Spreadsheet Editor disables elements in production.
const spreadsheetDisabledElements = Object.fromEntries(
  ELEMENTS_TO_DISABLE_IN_SPREADSHEET_EDITOR.map((dataElement) => [dataElement, { disabled: true }])
);

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const initialState = {
  viewer: {
    customElementOverrides: {}, // Need to define customElementOverrides otherwise component will fail to render.
    disabledElements: {},
    isNotesPanelMultiSelectEnabled: true,
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
  },
  officeEditor: {},
  featureFlags: {
    customizableUI: false,
  }
};

describe('NotesPanelHeader', () => {
  const renderHeader = (viewerOverrides = {}, officeEditor = {}, props = {}) => {
    const state = {
      ...initialState,
      viewer: { ...initialState.viewer, disabledElements: {}, ...viewerOverrides },
      officeEditor,
    };
    const store = configureStore({ reducer: () => state });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <NotesPanelHeader
          notes={[{}]}
          isMultiSelectEnabled={true}
          disableFilterAnnotation={false}
          setSearchInputHandler={noop}
          {...props}
        />
      </Provider>
    );
    return { dispatchSpy };
  };

  const getSortDropdown = () => screen.getByRole('combobox', { name: 'Sort:' });
  const expectNoSortStrategyDispatch = (dispatchSpy) => {
    const sortStrategyActionType = actions.setNotesPanelSortStrategy('position').type;
    const sortStrategyActions = dispatchSpy.mock.calls.filter(([action]) => action?.type === sortStrategyActionType);
    expect(sortStrategyActions).toEqual([]);
  };
  const getSortOptionKeys = () => Array.from(document.querySelectorAll('[data-element^="dropdown-item-"]'))
    .map((el) => el.getAttribute('data-element').replace('dropdown-item-', ''));

  describe('Storybook Component', () => {
    it('Basic story should not throw any errors', () => {
      expect(() => {
        render(<BasicStory />);
      }).not.toThrow();
    });
  });

  describe('UI Tests', () => {
    beforeEach(() => {
      initialState.viewer.disabledElements = {};
    });

    it('Should render all sections of NotesPanelHeader', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByLabelText('Search comments');
      screen.getByText('Sort:');
      screen.getByText('Comments (0)');
    });

    it('Should not render NotesPanelHeader if disabled', () => {
      initialState.viewer.disabledElements['notesPanelHeader'] = { disabled: true };
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      expect(screen.queryByLabelText('Search comments')).not.toBeInTheDocument();
      expect(screen.queryByText('Sort:')).not.toBeInTheDocument();
      expect(screen.queryByText('Comments (0)')).not.toBeInTheDocument();
    });

    it('Should not render search input if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.INPUT_CONTAINER
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      expect(screen.queryByLabelText('Search comments')).not.toBeInTheDocument();
      screen.getByText('Sort:');
      screen.getByText('Comments (0)');
    });

    it('Should not render comments counter if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.COMMENTS_COUNTER
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByLabelText('Search comments');
      screen.getByText('Sort:');
      expect(screen.queryByText('Comments (0)')).not.toBeInTheDocument();
    });

    it('Should not render sorting row if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.SORT_ROW
      ] = { disabled: true };
      initialState.viewer.isNotesPanelMultiSelectEnabled = true;
      const store = configureStore({ reducer: () => initialState });
      const { container } = render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={false}
            disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByLabelText('Search comments');
      expect(screen.queryByText('Sort:')).not.toBeInTheDocument();
      screen.getByText('Comments (0)');
    });

    it('Should have Aria Label on the dropdown', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      const element = screen.getByText('Sort:');
      expect(element).toBeInTheDocument();
    });

    it('Should have h2 on header', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} isMultiSelectEnabled={true} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      const element = screen.getByText('Comments (0)');
      expect(element.tagName.toLocaleLowerCase()).toEqual('h2');
    });

    it('Should have aria-pressed labels', () => {
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <BasicStory />
        </Provider>
      );

      const element = screen.queryByRole('button', { name: 'Filter' });
      expect(element.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('in spreadsheet editor mode', () => {
    const spreadsheetViewer = {
      isSpreadsheetEditorModeEnabled: true,
      sortStrategy: 'spreadsheetPosition',
      disabledElements: spreadsheetDisabledElements,
    };
    const spreadsheetState = {
      ...initialState,
      viewer: {
        ...initialState.viewer,
        ...spreadsheetViewer,
      },
    };

    it('should render sort but not filter or multiselect controls', () => {
      const store = configureStore({ reducer: () => spreadsheetState });
      render(
        <Provider store={store}>
          <NotesPanelHeader
            notes={[]}
            isMultiSelectEnabled={true}
            disableFilterAnnotation={false}
            setSearchInputHandler={noop}
          />
        </Provider>
      );

      expect(screen.getByText('Sort:')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Filter' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Multi Select' })).not.toBeInTheDocument();
    });

    it('should still render search input and comment counter', () => {
      const store = configureStore({ reducer: () => spreadsheetState });
      render(
        <Provider store={store}>
          <NotesPanelHeader
            notes={[]}
            isMultiSelectEnabled={true}
            disableFilterAnnotation={false}
            setSearchInputHandler={noop}
          />
        </Provider>
      );

      screen.getByLabelText('Search comments');
      screen.getByText('Comments (0)');
    });

    it('should keep search and sort enabled and offer the spreadsheet sort options', () => {
      renderHeader(spreadsheetViewer);

      expect(screen.getByLabelText('Search comments')).toBeEnabled();
      expect(getSortDropdown()).toHaveAttribute('aria-disabled', 'false');
      expect(getSortOptionKeys()).toEqual(SPREADSHEET_EDITOR_SORT_STRATEGIES);
    });

    it('should switch an unsupported sort strategy to the first spreadsheet strategy', () => {
      const { dispatchSpy } = renderHeader({ ...spreadsheetViewer, sortStrategy: 'position' });

      expect(dispatchSpy).toHaveBeenCalledWith(actions.setNotesPanelSortStrategy('spreadsheetPosition'));
    });
  });

  describe('mode-driven affordances', () => {
    describe('default mode', () => {
      it('should enable search and sort, show multi-select, and keep the current sort strategy', () => {
        const { dispatchSpy } = renderHeader({ sortStrategy: 'position' });

        expect(screen.getByLabelText('Search comments')).toBeEnabled();
        expect(getSortDropdown()).toHaveAttribute('aria-disabled', 'false');
        expect(screen.getByRole('button', { name: 'Multi Select' })).toBeInTheDocument();
        expectNoSortStrategyDispatch(dispatchSpy);
        expect(getSortOptionKeys()).toEqual(BASE_SORT_STRATEGIES);
      });

      it('should not render multi-select when it is not enabled', () => {
        renderHeader({}, {}, { isMultiSelectEnabled: false });

        expect(screen.queryByRole('button', { name: 'Multi Select' })).not.toBeInTheDocument();
      });

      it('should keep the number strategy when annotation numbering is enabled', () => {
        const withNumbering = renderHeader({ sortStrategy: 'number', isAnnotationNumberingEnabled: true });
        expectNoSortStrategyDispatch(withNumbering.dispatchSpy);
        expect(getSortOptionKeys()).toEqual([...BASE_SORT_STRATEGIES, 'number']);
      });

      it('should reset the number strategy to the first base strategy when numbering is disabled', () => {
        const { dispatchSpy } = renderHeader({ sortStrategy: 'number', isAnnotationNumberingEnabled: false });
        expect(dispatchSpy).toHaveBeenCalledWith(actions.setNotesPanelSortStrategy('position'));
      });
    });

    describe('Office editor mode', () => {
      const officeViewer = { isOfficeEditorMode: true, sortStrategy: 'linePosition' };

      it('should hide multi-select while keeping search and sort enabled when not previewing', () => {
        renderHeader(officeViewer, { editMode: OfficeEditorEditMode.REVIEWING });

        expect(screen.queryByRole('button', { name: 'Multi Select' })).not.toBeInTheDocument();
        expect(screen.getByLabelText('Search comments')).toBeEnabled();
        expect(getSortDropdown()).toHaveAttribute('aria-disabled', 'false');
        expect(getSortOptionKeys()).toEqual(OFFICE_EDITOR_SORT_STRATEGIES);
      });

      it('should switch an unsupported sort strategy to the first Office strategy', () => {
        const { dispatchSpy } = renderHeader({ ...officeViewer, sortStrategy: 'position' }, { editMode: OfficeEditorEditMode.REVIEWING });

        expect(dispatchSpy).toHaveBeenCalledWith(actions.setNotesPanelSortStrategy('linePosition'));
      });

      it('should disable search and sort in preview mode and clear the search', () => {
        const setSearchInputHandler = jest.fn();
        renderHeader(officeViewer, { editMode: OfficeEditorEditMode.PREVIEW }, { setSearchInputHandler });

        expect(screen.getByLabelText('Search comments')).toBeDisabled();
        expect(getSortDropdown()).toHaveAttribute('aria-disabled', 'true');
        expect(setSearchInputHandler).toHaveBeenCalledWith('');
        expect(screen.queryByRole('button', { name: 'Multi Select' })).not.toBeInTheDocument();
      });
    });
  });
});
