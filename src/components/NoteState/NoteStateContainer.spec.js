import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteStateContainer from './NoteStateContainer';
import { noteStateFlyoutItems } from '../ModularComponents/NoteStateFlyout/NoteStateFlyout';
import core from 'core';
import { createStateAnnotation } from 'helpers/NoteStateUtils';

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const initialState = {
  viewer: {
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {},
    flyoutMap: {
      'noteStateFlyout-123': {
        dataElement: 'noteStateFlyout',
        items: noteStateFlyoutItems,
      }
    },
    activeFlyout: 'noteStateFlyout-123',
    openElements: {
      notesPanel: true
    },
    sortStrategy: 'position',
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    }
  },
  officeEditor: {},
  featureFlags: {},
};

const store = configureStore({ reducer: () => initialState });


jest.mock('helpers/NoteStateUtils', () => ({
  __esModule: true,
  createStateAnnotation: jest.fn(),
}));

jest.mock('./NoteState', () => {
  return function MockNoteState(props) {
    return (
      <button
        aria-label="Status"
        type="button"
        onClick={() => props.handleStateChange('Accepted')}
      >
        Status
      </button>
    );
  };
});


describe('NoteStateContainer', () => {
  beforeEach(() => {
    core.getDocumentViewer = () => ({
      addEventListener: noop,
      removeEventListener: noop,
      getAnnotationHistoryManager: noop,
      getMeasurementManager: noop,
      getContentEditManager: noop,
      getAccessibleReadingOrderManager: noop,
      getSpreadsheetEditorManager: noop,
      getAnnotationManager: () => {
        return {
          getEditBoxManager: noop,
          getFormFieldCreationManager: noop,
          addEventListener: noop,
          getSelectedAnnotations: () => [],
          getAnnotationsList: () => [],
          removeEventListener: noop,
          addAnnotation: jest.fn(),
        };
      }
    });
    core.getIsReadOnly = () => false;
  });

  it('should call addAnnotation once on AnnotationManger without manually triggering addReply on state change', async function() {
    const mockAnnotation = {
      Id: '123',
      PageNumber: 1,
      ToolName: 'AnnotationCreateRectangle',
      getStatus: () => 'None',
      _replies: [],
      addReply: jest.fn(function(reply) {
        this._replies.push(reply);
      }),
    };
    createStateAnnotation.mockReturnValue({ Id: 'stateAnnotation123' });

    const mockAnnotationManager = {
      getEditBoxManager: noop,
      getFormFieldCreationManager: noop,
      getSelectedAnnotations: () => [],
      getAnnotationsList: () => [],
      addAnnotation: jest.fn(() => {}),
      addEventListener: noop,
      removeEventListener: noop,
      getRootAnnotation: () => mockAnnotation,
      trigger: jest.fn(),
    };

    core.getAnnotationManager = () => mockAnnotationManager;

    render(
      <Provider store= {store}>
        <NoteStateContainer annotation={ mockAnnotation } />
      </Provider>
    );
    const stateButton = await screen.findByRole('button', { name: /^Status$/i });
    userEvent.click(stateButton);
    expect(createStateAnnotation).toHaveBeenCalledTimes(1);
    expect(mockAnnotationManager.addAnnotation).toHaveBeenCalledTimes(1);
    expect(mockAnnotationManager.trigger).not.toHaveBeenCalled();
  });
});