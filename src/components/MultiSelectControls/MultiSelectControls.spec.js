/* eslint-disable no-unsanitized/property */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MultiSelectControls from './MultiSelectControls';


function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const DEFAULT_NOTES_PANEL_WIDTH = 293;

const initialState = {
  viewer: {
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    isNotesPanelMultiSelectEnabled: true,
    disabledElements: {},
    openElements: {
      notesPanel: true
    },
    panelWidths: {
      notesPanel: DEFAULT_NOTES_PANEL_WIDTH
    },
    sortStrategy: 'position',
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
    flyoutPosition: {}, // Add necessary mock state here
    flyoutMap: {
      noteStateFlyout: {} // Mock the flyoutMap with necessary elements
    },
  },
  officeEditor: {},
  featureFlags: {},
};

const store = configureStore({ reducer: () => initialState });

jest.mock('core', () => ({
  getNumberOfGroups: () => 0,
  addEventListener: jest.fn()
}));
describe('MultiSelectControls', () => {

  it('MultiSelectControls close button is role button', () => {
    render(
      <Provider store={store}>
        <MultiSelectControls
          showMultiReply={false}
          setShowMultiReply={noop}
          setShowMultiState={noop}
          showMultiStyle={true}
          setShowMultiStyle={noop}
          setMultiSelectMode={noop}
          isMultiSelectedMap={{}}
          setIsMultiSelectedMap={noop}
          multiSelectedAnnotations={[]}
        />
      </Provider>
    );

    const button = screen.getByRole('button', { name: 'Close multiselect' });
    expect(button).toBeInTheDocument();
  });
});
