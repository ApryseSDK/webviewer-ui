import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, act } from '@testing-library/react';
import i18next from 'i18next';
import FormFieldPanelContainer from './FormFieldPanelContainer';
import initialState from 'src/redux/initialState';
const FormFieldPanelContainerWithi18n = withI18n(FormFieldPanelContainer);

jest.mock('core', () => {
  const addEventListener = jest.fn();
  const removeEventListener = jest.fn();
  const drawAnnotationsFromList = jest.fn();
  const getToolMode = jest.fn();
  const getFormFieldCreationManager = jest.fn();

  return {
    getToolMode,
    getFormFieldCreationManager,
    deleteAnnotations: jest.fn(),
    addEventListener,
    removeEventListener,
    getAnnotationsList: jest.fn(() => []),
    getAnnotationManager: jest.fn(() => ({
      drawAnnotationsFromList,
    })),
    getPageHeight: jest.fn(() => 1000),
    getPageWidth: jest.fn(() => 1000),
    getCurrentPage: jest.fn(() => 1),
    __mocks: {
      addEventListener,
      removeEventListener,
      drawAnnotationsFromList,
      getToolMode,
      getFormFieldCreationManager,
    },
  };
});

class MockFormFieldCreateTool {
  constructor(toolName) {
    this.name = toolName;
  }
}

const coreMocks = require('core').__mocks;
const addEventListenerMock = coreMocks.addEventListener;
const removeEventListenerMock = coreMocks.removeEventListener;
const drawAnnotationsMock = coreMocks.drawAnnotationsFromList;
const getToolModeMock = coreMocks.getToolMode;
const getFormFieldCreationManagerMock = coreMocks.getFormFieldCreationManager;

const formFieldCreationManagerMock = {
  getRadioButtonGroups: jest.fn(() => []),
  setFieldName: jest.fn(() => ({ isValid: true })),
  setShowIndicator: jest.fn(),
  setIndicatorText: jest.fn(),
  getShowIndicator: jest.fn(() => false),
  getIndicatorText: jest.fn(() => ''),
  setSignatureOption: jest.fn(),
  getSignatureOption: jest.fn(() => 'signature'),
};

getFormFieldCreationManagerMock.mockReturnValue(formFieldCreationManagerMock);

jest.mock('helpers/getToolStyles', () => jest.fn());
jest.mock('helpers/setToolStyles', () => jest.fn());
const mockGetToolStylesModule = require('helpers/getToolStyles');
const mockSetToolStylesModule = require('helpers/setToolStyles');
const mockGetToolStyles = mockGetToolStylesModule.default || mockGetToolStylesModule;
const mockSetToolStyles = mockSetToolStylesModule.default || mockSetToolStylesModule;
jest.mock('helpers/getDeviceSize', () => ({
  isMobileSize: jest.fn(() => false),
}));
jest.mock('hooks/useIsRTL', () => jest.fn(() => false));

let currentTool;

const baseState = {
  viewer: {
    ...initialState.viewer,
    openElements: {
      ...initialState.viewer.openElements,
      formFieldPanel: true,
    },
    disabledElements: {},
    toolButtonObjects: {
      ...initialState.viewer.toolButtonObjects,
      CheckBoxFormFieldCreateTool: {
        dataElement: 'checkBoxFieldCreateToolButton',
        title: 'annotation.checkBoxFormField',
        img: 'icon-form-field-checkbox',
        group: 'checkBoxFieldTools',
        showColor: 'always',
      },
      ComboBoxFormFieldCreateTool: {
        dataElement: 'comboBoxFieldCreateToolButton',
        title: 'annotation.comboBoxFormField',
        img: 'icon-form-field-combobox',
        group: 'comboBoxFieldTools',
        showColor: 'always',
      },
    },
    isInDesktopOnlyMode: false,
    mobilePanelSize: 'medium',
  },
  featureFlags: {
    customizableUI: false,
  },
  search: {},
  document: {},
};

const renderWithState = (stateOverrides = {}) => {
  const state = {
    ...baseState,
    ...stateOverrides,
    viewer: {
      ...baseState.viewer,
      ...stateOverrides.viewer,
    },
  };

  const store = configureStore({ reducer: () => state });

  const mockFormFieldAnnotation = {
    getFieldFlags: () => ({ READ_ONLY: false, MULTI_SELECT: false, MULTILINE: false, REQUIRED: false }),
    getField: () => ({
      getFieldType: () => 'CheckBoxFormField',
    }),
    getFieldOptions: () => [],
  };

  return render(
    <Provider store={store}>
      <FormFieldPanelContainerWithi18n annotation={mockFormFieldAnnotation} />
    </Provider>
  );
};

describe('FormFieldPanelContainer', () => {
  beforeEach(() => {
    addEventListenerMock.mockClear();
    removeEventListenerMock.mockClear();
    drawAnnotationsMock.mockClear();
    mockGetToolStyles.mockReset();
    mockSetToolStyles.mockClear();
    Object.values(formFieldCreationManagerMock).forEach((mockFn) => mockFn.mockClear());
    getFormFieldCreationManagerMock.mockClear();
    getToolModeMock.mockReset();
    getToolModeMock.mockImplementation(() => currentTool);
    currentTool = new MockFormFieldCreateTool('CheckBoxFormFieldCreateTool');
  });

  afterEach(async () => {
    await act(async () => {
      await i18next.changeLanguage('en');
    });
  });

  it('renders panel title based on the passed annotation', async () => {
    renderWithState();
    expect(await screen.findByText(/Checkbox Field/)).toBeInTheDocument();
  });

  it('updates panel title when the language changes', async () => {
    renderWithState();

    expect(await screen.findByText(/Checkbox Field/)).toBeInTheDocument();

    await act(async () => {
      await i18next.changeLanguage('es');
    });
    expect(await screen.findByText(/Anotación de campo de casilla de verificación/)).toBeInTheDocument();
  });
});
