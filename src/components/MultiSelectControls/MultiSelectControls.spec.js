/* eslint-disable no-unsanitized/property */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import MultiSelectControls from './MultiSelectControls';
import core from 'core';


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
  getNumberOfGroups: jest.fn(() => 0),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getDocumentViewer: jest.fn(),
  canModify: jest.fn(),
  getGroupAnnotations: jest.fn(() => []),
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
          multiSelectedMap={{}}
          setMultiSelectedMap={noop}
          multiSelectedAnnotations={[]}
        />
      </Provider>
    );

    const button = screen.getByRole('button', { name: 'Close multiselect' });
    expect(button).toBeInTheDocument();
  });

  it('should disable status button when no annotations are multi selected', () => {
    const { container } = render(
      <Provider store={store}>
        <MultiSelectControls
          showMultiReply={false}
          setShowMultiReply={noop}
          setShowMultiState={noop}
          showMultiStyle={true}
          setShowMultiStyle={noop}
          setMultiSelectMode={noop}
          multiSelectedMap={{}}
          setMultiSelectedMap={noop}
          multiSelectedAnnotations={[]}
        />
      </Provider>
    );

    const statusButton = container.querySelector('[data-element="multiStateButton"]');
    expect(statusButton).toBeInTheDocument();
    expect(statusButton).toBeDisabled();
  });

  describe('non-author user with selected annotations', () => {
    let mockAnnotation;
    let otherMockAnnotation;

    beforeEach(() => {
      core.canModify.mockReturnValue(false);
      // Count only the annotations passed in, so the group button's state depends on the author check filtering them out.
      core.getNumberOfGroups.mockImplementation((annotations) => annotations.length);
      mockAnnotation = { Id: 'annot-1', isGrouped: () => false };
      otherMockAnnotation = { Id: 'annot-2', isGrouped: () => false };
    });

    afterEach(() => {
      core.canModify.mockReset();
      core.getNumberOfGroups.mockReset().mockReturnValue(0);
    });

    const renderControls = (annotations) => render(
      <Provider store={store}>
        <MultiSelectControls
          showMultiReply={false}
          setShowMultiReply={noop}
          setShowMultiState={noop}
          showMultiStyle={false}
          setShowMultiStyle={noop}
          setMultiSelectMode={noop}
          multiSelectedMap={Object.fromEntries(annotations.map((annotation) => [annotation.Id, annotation]))}
          setMultiSelectedMap={noop}
          multiSelectedAnnotations={annotations}
        />
      </Provider>
    );

    it('should enable the status button for annotations the user did not author', () => {
      const { container } = renderControls([mockAnnotation, otherMockAnnotation]);
      const statusButton = container.querySelector('[data-element="multiStateButton"]');
      expect(statusButton).toBeInTheDocument();
      expect(statusButton).not.toBeDisabled();
    });

    it('should disable the delete button for annotations the user did not author', () => {
      const { container } = renderControls([mockAnnotation, otherMockAnnotation]);
      const deleteButton = container.querySelector('[data-element="multiDeleteButton"]');
      expect(deleteButton).toBeDisabled();
    });

    it('should disable the style button for annotations the user did not author', () => {
      const { container } = renderControls([mockAnnotation, otherMockAnnotation]);
      const styleButton = container.querySelector('[data-element="multiStyleButton"]');
      expect(styleButton).toBeDisabled();
    });

    it('should disable the group button for annotations the user did not author', () => {
      const { container } = renderControls([mockAnnotation, otherMockAnnotation]);
      const groupButton = container.querySelector('[data-element="multiGroupButton"]');
      expect(groupButton).toBeDisabled();
    });
  });
});
