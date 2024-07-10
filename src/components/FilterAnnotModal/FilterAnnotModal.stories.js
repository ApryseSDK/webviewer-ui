import React from 'react';
import FilterAnnotModal from './FilterAnnotModal';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'Components/FilterAnnotModal',
  component: FilterAnnotModal
};

const initialState = {
  viewer: {
    openElements: { filterModal: true },
    disabledElements: {},
    colorMap: {
      rectangle: {
        currentStyleTab: 'StrokeColor',
        iconColor: 'StrokeColor'
      },
      freeText: {
        currentStyleTab: 'TextColor',
        iconColor: 'TextColor'
      }
    },
    customElementOverrides: {},
    tab: {},
    annotationFilters: {
      isDocumentFilterActive: false,
      includeReplies: true,
      authorFilter: [],
      colorFilter: [],
      typeFilter: [],
      statusFilter: []
    },
  }
};

export function UserPanel() {
  const props = {
    isOpen: true
  };

  const initialStateUserPanel = {
    viewer: {
      ...initialState.viewer,
      tab: {
        filterAnnotModal: 'annotationUserFilterPanelButton'
      }
    }
  };

  return (
    <Provider store={configureStore({ reducer: () => initialStateUserPanel })}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}

export function ColorPanel() {
  const props = {
    isOpen: true
  };

  const initialStateColorPanel = {
    viewer: {
      ...initialState.viewer,
      tab: {
        filterAnnotModal: 'annotationColorFilterPanelButton'
      }
    }
  };

  return (
    <Provider store={configureStore({ reducer: () => initialStateColorPanel })}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}

export function TypePanel() {
  const props = {
    isOpen: true
  };

  const initialStateTypePanel = {
    viewer: {
      ...initialState.viewer,
      tab: {
        filterAnnotModal: 'annotationTypeFilterPanelButton'
      }
    }
  };

  return (
    <Provider store={configureStore({ reducer: () => initialStateTypePanel })}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}

export function MeasurementAnnotationsFilterEnabled() {
  const props = {
    isOpen: true
  };

  const initialStateMeasurementFilterEnabled = {
    viewer: {
      ...initialState.viewer,
      tab: {
        filterAnnotModal: 'annotationTypeFilterPanelButton'
      },
      isMeasurementAnnotationFilterEnabled: true,
    }
  };


  return (
    <Provider store={configureStore({ reducer: () => initialStateMeasurementFilterEnabled })}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}

export function DocumentFilterActive() {
  const props = {
    isOpen: true
  };

  const initialStateDocumentFilterActive = {
    viewer: {
      ...initialState.viewer,
      tab: {
        filterAnnotModal: 'annotationUserFilterPanelButton'
      },
      annotationFilters: {
        ...initialState.viewer.annotationFilters,
        isDocumentFilterActive: true,
      }
    }
  };

  return (
    <Provider store={configureStore({ reducer: () => initialStateDocumentFilterActive })}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}