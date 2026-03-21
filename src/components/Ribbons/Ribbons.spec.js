import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Ribbons from './Ribbons';
import useCore from 'hooks/useCore';
import selectors from 'selectors';

jest.mock('hooks/useCore');

jest.mock('selectors', () => ({
  getEnabledToolbarGroups: jest.fn(() => ['toolbarGroup-Forms', 'toolbarGroup-Annotate']),
  getCurrentToolbarGroup: jest.fn(() => 'toolbarGroup-Annotate'),
  isMultiViewerMode: jest.fn(() => false),
  getCustomHeadersAdditionalProperties: jest.fn(() => ({})),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, ready: true }),
}));

jest.mock('helpers/officeEditor', () => ({
  isOfficeEditorMode: () => false,
}));

jest.mock('react-measure', () => ({
  __esModule: true,
  default: ({ children, innerRef, onResize }) => {
    if (innerRef) {
      innerRef.current = {
        getBoundingClientRect: () => ({ width: 200, left: 0 }),
        style: {},
      };
    }
    if (onResize) {
      onResize({ bounds: { width: 200 } });
    }
    return children({ measureRef: jest.fn() });
  },
}));

describe('Ribbons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starting Forms group starts formFieldCreationMode on all viewers if any viewer is not in mode', () => {
    const formFieldCreationManager1 = {
      isInFormFieldCreationMode: jest.fn(() => false),
      startFormFieldCreationMode: jest.fn(),
      endFormFieldCreationMode: jest.fn(),
    };
    const formFieldCreationManager2 = {
      isInFormFieldCreationMode: jest.fn(() => true),
      startFormFieldCreationMode: jest.fn(),
      endFormFieldCreationMode: jest.fn(),
    };

    const core = {
      getDocumentViewers: jest.fn(() => [
        {
          getAnnotationManager: jest.fn(() => ({
            getFormFieldCreationManager: jest.fn(() => formFieldCreationManager1),
          })),
        },
        {
          getAnnotationManager: jest.fn(() => ({
            getFormFieldCreationManager: jest.fn(() => formFieldCreationManager2),
          })),
        },
      ]),
      getContentEditManager: jest.fn(() => ({
        isInContentEditMode: jest.fn(() => false),
        startContentEditMode: jest.fn(),
        endContentEditMode: jest.fn(),
      })),
    };

    useCore.mockReturnValue({ core });

    const mockInitialState = {
      viewer: {
        customPanels: [],
        panels: [],
        genericPanels: [],
        openElements: {},
        activeLeftPanel: null,
        notesInLeftPanel: false,
        lastPickedToolGroup: {},
        lastPickedToolForGroup: {},
        headers: {},
        toolButtonObjects: {},
        disabledElements: {},
      },
      featureFlags: {
        customizableUI: false,
      },
    };
    const RibbonsWithProviders = withProviders(Ribbons, mockInitialState);
    const { container } = render(<RibbonsWithProviders />);

    const formsButton = container.querySelector('[data-element="toolbarGroup-Forms"]');
    fireEvent.click(formsButton);

    expect(formFieldCreationManager1.startFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager2.startFormFieldCreationMode).toHaveBeenCalledTimes(1);
    expect(formFieldCreationManager1.endFormFieldCreationMode).not.toHaveBeenCalled();
    expect(formFieldCreationManager2.endFormFieldCreationMode).not.toHaveBeenCalled();
  });
});
