import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PortfolioPanel from './PortfolioPanel';
import { render, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const noop = () => {};

jest.mock('core', () => {
  const noop = () => {};
  return {
    addEventListener: noop,
    removeEventListener: noop,
    getDocument: () => ({
      getPDFDoc: () => Promise.resolve({})
    })
  };
});

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: () => ({
    core: require('core')
  })
}));

jest.mock('helpers/portfolio', () => ({
  getPortfolioFiles: jest.fn(),
  addFile: jest.fn(),
  deletePortfolioFile: jest.fn(),
  downloadPortfolioFile: jest.fn(),
  isOpenableFile: jest.fn(() => true),
  renamePortfolioFile: jest.fn(),
  reorderPortfolioFile: jest.fn()
}));

describe('PortfolioPanel', () => {
  describe('MultiViewerMode compatibility', () => {
    it('should fetch portfolio from viewer 2 correctly', async () => {
      const portfolioHelpers = require('helpers/portfolio');

      const viewer2Portfolio = [
        { id: 'viewer2-file-1', name: 'viewer2-document.docx', extension: 'docx', order: 0 }
      ];

      portfolioHelpers.getPortfolioFiles.mockResolvedValue(viewer2Portfolio);

      const initialState = {
        viewer: {
          isMultiViewerMode: true,
          activeDocumentViewerKey: 2,
          disabledElements: {},
          customElementOverrides: {},
          tabManager: null,
          openElements: {},
          flyoutMap: {},
          flyoutPosition: {}
        },
        document: {
          portfolio: { 1: [], 2: viewer2Portfolio }
        }
      };

      const store = configureStore({
        reducer: (state = initialState) => state,
      });

      const { getByText } = render(
        <DndProvider backend={HTML5Backend}>
          <Provider store={store}>
            <PortfolioPanel />
          </Provider>
        </DndProvider>
      );

      await waitFor(() => {
        expect(getByText('viewer2-document.docx')).toBeInTheDocument();
      });
    });
  });
});













