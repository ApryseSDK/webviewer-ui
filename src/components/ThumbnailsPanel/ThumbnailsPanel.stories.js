import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import ThumbnailsPanel from './ThumbnailsPanel';

export default {
  title: 'Components/Thumbnails',
  component: ThumbnailsPanel,
};

export const Thumbnails = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {
          logoBar: { disabled: true },
        },
        customElementOverrides: {},
        openElements: {
          thumbnailsPanel: true,
          leftPanel: true,
        },
        panelWidths: {
          leftPanel: 264,
          thumbnailsPanel: 300,
        },
        selectedThumbnailPageIndexes: [],
        isThumbnailMerging: true,
        isThumbnailReordering: false,
        thumbnailSelectingPages: false,
        isMultipleViewerMerging: false,
        isReaderMode: false,
        isReadOnly: false,
        activeDocumentViewerKey: 1,
        pageManipulationOverlayOpenByRightClick: true,
        modularHeaders: []
      },
      document: {
        totalPages: {
          1: 2,
          2: 3,
        },
      },
      featureFlags: {
        customizableUI: false,
      },
    };
  };
  return (
    <>
      <Provider store={createStore(reducer)}>
        <Panel dataElement="thumbnailsPanel">
          <ThumbnailsPanel />
        </Panel>
      </Provider>
    </>
  );
};