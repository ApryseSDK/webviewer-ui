import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useOnFormFieldAnnotationAddedOrSelected from './useOnFormFieldAnnotationAddedOrSelected';
import useCore from 'hooks/useCore';
import useOnRightClick from '../useOnRightClick';
import { getInstanceNode } from 'helpers/getRootNode';

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../useOnRightClick', () => jest.fn());
jest.mock('helpers/getRootNode', () => ({
  __esModule: true,
  default: jest.fn(() => globalThis),
  getInstanceNode: jest.fn(),
  getInstanceID: jest.fn(),
  getWebViewerRect: jest.fn(),
}));

const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

describe('useOnFormFieldAnnotationAddedOrSelected hook', () => {
  const expectedEvents = ['annotationChanged', 'annotationSelected', 'toolModeUpdated'];

  let mockCore;
  beforeEach(() => {
    jest.clearAllMocks();
    mockCore = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getAnnotationManager: jest.fn(() => ({
        getSelectedAnnotations: jest.fn(() => []),
      })),
      getAnnotationByMouseEvent: jest.fn(),
    };
    useCore.mockReturnValue({ core: mockCore });
    useOnRightClick.mockImplementation(() => {});

    getInstanceNode.mockReturnValue({
      instance: {
        Core: {
          annotationManager: {
            getFormFieldCreationManager: () => ({
              isInFormFieldCreationMode: () => false,
            }),
          },
        },
      },
    });

    global.window.Core = {
      Annotations: {
        WidgetAnnotation: function() {}
      },
      Tools: {
        FormFieldCreateTool: function() {}
      }
    };
  });

  afterEach(() => {
    delete global.window.Core;
  });

  it('adds event listeners for all expected events', () => {
    const { result } = renderHook(function() {
      return useOnFormFieldAnnotationAddedOrSelected();
    }, { wrapper });

    expect(result.error).toBeUndefined();

    expectedEvents.forEach((eventName) => {
      const found = mockCore.addEventListener.mock.calls.some((call) =>
        call[0] === eventName && typeof call[1] === 'function'
      );
      expect(found).toBe(true);
    });
  });

  it('removes event listeners for all expected events when component is unmounted', () => {
    const { result, unmount } = renderHook(function() {
      return useOnFormFieldAnnotationAddedOrSelected();
    }, { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expectedEvents.forEach((eventName) => {
      const found = mockCore.removeEventListener.mock.calls.some((call) =>
        call[0] === eventName && typeof call[1] === 'function'
      );
      expect(found).toBe(true);
    });
  });
});