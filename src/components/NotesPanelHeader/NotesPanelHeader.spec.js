import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { Basic } from './NotesPanelHeader.stories';
import NotesPanelHeader from './NotesPanelHeader';
import DataElements from 'constants/dataElement';

const BasicStory = withI18n(Basic);

function noop() {
  // Comment needed to suppress SonarCloud code smell.
}

const initialState = {
  viewer: {
    customElementOverrides: {}, // Need to define customElementOverrides otherwise component will fail to render.
    disabledElements: {}
  }
};

describe('NotesPanelHeader', () => {
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
          <NotesPanelHeader notes={[]} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByPlaceholderText('Search comments');
      screen.getByText('Sort:');
      screen.getByText('Comments');
    });

    it('Should not render NotesPanelHeader if disabled', () => {
      initialState.viewer.disabledElements['notesPanelHeader'] = { disabled: true };
      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      expect(screen.queryByPlaceholderText('Search comments')).not.toBeInTheDocument;
      expect(screen.queryByText('Sort:')).not.toBeInTheDocument;
      expect(screen.queryByText('Comments')).not.toBeInTheDocument;
    });

    it('Should not render search input if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.INPUT_CONTAINER
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      expect(screen.queryByPlaceholderText('Search comments')).not.toBeInTheDocument();
      screen.getByText('Sort:');
      screen.getByText('Comments');
    });

    it('Should not render comments counter if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.COMMENTS_COUNTER
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByPlaceholderText('Search comments');
      screen.getByText('Sort:');
      expect(screen.queryByText('Comments')).not.toBeInTheDocument;
    });

    it('Should not render sorting row if disabled', () => {
      initialState.viewer.disabledElements[
        DataElements.NotesPanel.DefaultHeader.SORT_ROW
      ] = { disabled: true };

      const store = configureStore({ reducer: () => initialState });
      render(
        <Provider store={store}>
          <NotesPanelHeader notes={[]} disableFilterAnnotation={false} setSearchInputHandler={noop}/>
        </Provider>
      );

      screen.getByPlaceholderText('Search comments');
      expect(screen.queryByText('Sort:')).not.toBeInTheDocument();
      screen.getByText('Comments');
    });
  });
});
