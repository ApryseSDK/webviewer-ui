import React, { useRef, useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import DataElement from 'constants/dataElement';
import OfficeEditorToolsHeader from './OfficeEditorToolsHeader';
import core from 'core';
import { workerTypes } from 'src/constants/types';

export default {
  title: 'Components/OfficeEditorToolsHeader',
  component: OfficeEditorToolsHeader,
};

initialState.viewer.openElements[DataElement.OFFICE_EDITOR_TOOLS_HEADER] = true;
initialState.viewer.openElements.colorPickerOverlay = false;
const store = configureStore({ reducer: () => initialState });

const BasicComponent = ({ children }) => {
  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
    isCursorInTable: () => false
  });
  core.getDocument = () => ({
    getType: () => workerTypes.OFFICE_EDITOR,
    addEventListener: () => { },
    removeEventListener: () => { },
  });

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export function Basic() {
  return (
    <BasicComponent>
      <OfficeEditorToolsHeader />
    </BasicComponent>
  );
}
Basic.parameters = {
  chromatic: {
    viewports: [1400]
  }
};

export function Overflow() {
  const headerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      headerRef.current.querySelector('[data-element=office-editor-more-tools]').click();
    }, 2000);
  }, []);

  return (
    <BasicComponent>
      <div ref={headerRef}>
        <OfficeEditorToolsHeader />
      </div>
    </BasicComponent>
  );
}
Overflow.parameters = {
  chromatic: {
    viewports: [850],
    delay: 3000
  }
};
