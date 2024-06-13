import React from 'react';
import LinkAnnotationPopup from './LinkAnnotationPopup';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const noop = () => { };

export default {
  title: 'Components/LinkAnnotationPopup',
  component: LinkAnnotationPopup,
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

export const Basic = () => {
  const props = {
    linkText: 'https://www.Apryse.com',
    handleUnLink: noop,
    handleOnMouseEnter: noop,
    handleOnMouseLeave: noop,
    handleMouseMove: noop,
    isAnnotation: true,
    isMobileDevice: false,
  };
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div className='Popup LinkAnnotationPopupContainer'>
        <LinkAnnotationPopup {...props} />
      </div>
    </Provider>
  );
};
