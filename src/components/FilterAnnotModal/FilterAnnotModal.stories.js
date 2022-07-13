import React from 'react';
import FilterAnnotModal from './FilterAnnotModal'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import core from 'core';

export default {
  title: 'Components/FilterAnnotModal',
  component: FilterAnnotModal
};

const rectAnnot = new window.Annotations.RectangleAnnotation();
rectAnnot.Author = 'Guest_1';
rectAnnot.getStatus = () => null;
rectAnnot.getCustomData = () => '';
rectAnnot.StrokeColor = new window.Annotations.Color(255, 0, 0);

const freeTextAnnot = new window.Annotations.FreeTextAnnotation();
freeTextAnnot.Author = 'Guest_2';
freeTextAnnot.getStatus = () => null;
freeTextAnnot.TextColor = new window.Annotations.Color(0, 255, 0);

core.getAnnotationsList = () => [
  rectAnnot,
  freeTextAnnot
];

const getStore = (num) => {
  const initialState = {
    viewer: {
      openElements: { filterModal: true },
      disabledElements: {},
      colorMap: {
        rectangle: {
          currentPalette: 'StrokeColor',
          iconColor: 'StrokeColor'
        },
        freeText: {
          currentPalette: 'TextColor',
          iconColor: 'TextColor'
        }
      },
      customElementOverrides: {},
      tab: {},
      annotationFilters: {
        includeReplies: true,
        authorFilter: [],
        colorFilter: [],
        typeFilter: [],
        statusFilter: []
      },
    }
  };

  if (num === 1) {
    initialState.viewer.tab.filterAnnotModal = 'annotationUserFilterPanelButton';
  } else if (num === 2) {
    initialState.viewer.tab.filterAnnotModal = 'annotationColorFilterPanelButton';
  } else if (num === 3) {
    initialState.viewer.tab.filterAnnotModal = 'annotationTypeFilterPanelButton';
  }

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

// State 1
export function UserPanel() {
  const props = {
    isOpen: true
  };

  return (
    <Provider store={getStore(1)}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}

// State 2
export function ColorPanel() {
  const props = {
    isOpen: true
  };

  return (
    <Provider store={getStore(2)}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}

// State 3
export function TypePanel() {
  const props = {
    isOpen: true
  };

  return (
    <Provider store={getStore(3)}>
      <FilterAnnotModal {...props} />
    </Provider>
  );
}
