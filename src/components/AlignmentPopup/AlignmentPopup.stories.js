import React from 'react';
import AlignmentPopup from './AlignmentPopup';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const noop = () => { };

export default {
  title: 'Components/AlignmentPopup',
  component: AlignmentPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    annotationPopup: [
    ],
    activeDocumentViewerKey: 1,
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

export const Basic = () => {
  const props = {
    alignmentConfig: [
      {
        alignment: 'left',
        icon: 'ic-alignment-left',
        title: 'alignmentPopup.alignLeft',
      },
      {
        alignment: 'centerHorizontal',
        icon: 'ic-alignment-center-horizontal',
        title: 'alignmentPopup.alignHorizontalCenter',
      },
      {
        alignment: 'right',
        icon: 'ic-alignment-right',
        title: 'alignmentPopup.alignRight',
      },
      {
        alignment: 'top',
        icon: 'ic-alignment-top',
        title: 'alignmentPopup.alignTop',
      },
      {
        alignment: 'centerVertical',
        icon: 'ic-alignment-center-vertical',
        title: 'alignmentPopup.alignVerticalCenter',
      },
      {
        alignment: 'bottom',
        icon: 'ic-alignment-bottom',
        title: 'alignmentPopup.alignBottom',
      }
    ],
    distributeConfig: [
      {
        alignment: 'distributeVertical',
        icon: 'ic-distribute-vertical',
        title: 'alignmentPopup.distributeVertical',
      },
      {
        alignment: 'distributeHorizontal',
        icon: 'ic-distribute-horizontal',
        title: 'alignmentPopup.distributeHorizontal',
      }
    ],
    alignmentOnClick: noop,
    distributeOnClick: noop,
    backToMenuOnClick: noop,
    isAnnotation: true,
  };
  return (
    <Provider store={store}>
      <div className="AlignAnnotationPopupContainer">
        <AlignmentPopup {...props} />
      </div>
    </Provider>
  );
};
