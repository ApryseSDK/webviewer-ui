import { renderHook } from '@testing-library/react-hooks';
import useWidgetHighlightingSync from '../useWidgetHighlightingSync';
import core from 'core';
import * as reactRedux from 'react-redux';

describe('useWidgetHighlightingSync', () => {
  let fieldManager;
  let useSelectorMock;

  beforeEach(() => {
    useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    fieldManager = {
      isWidgetHighlightingEnabled: jest.fn(),
      enableWidgetHighlighting: jest.fn(),
      disableWidgetHighlighting: jest.fn(),
    };
    core.getAnnotationManager = jest.fn(() => ({
      getFieldManager: jest.fn(() => fieldManager),
    }));
    jest.clearAllMocks();
  });

  it('syncs by enabling widget highlighting when Redux state is true but core is disabled', () => {
    fieldManager.isWidgetHighlightingEnabled.mockReturnValue(false);
    useSelectorMock.mockReturnValue(true);

    renderHook(() => useWidgetHighlightingSync());

    expect(fieldManager.enableWidgetHighlighting).toHaveBeenCalledTimes(1);
    expect(fieldManager.disableWidgetHighlighting).not.toHaveBeenCalled();
  });

  it('syncs by disabling widget highlighting when Redux state is false but core is enabled', () => {
    fieldManager.isWidgetHighlightingEnabled.mockReturnValue(true);
    useSelectorMock.mockReturnValue(false);

    renderHook(() => useWidgetHighlightingSync());

    expect(fieldManager.disableWidgetHighlighting).toHaveBeenCalledTimes(1);
    expect(fieldManager.enableWidgetHighlighting).not.toHaveBeenCalled();
  });

  it('does not update widget highlighting when Redux and core are both enabled', () => {
    fieldManager.isWidgetHighlightingEnabled.mockReturnValue(true);
    useSelectorMock.mockReturnValue(true);

    renderHook(() => useWidgetHighlightingSync());

    expect(fieldManager.enableWidgetHighlighting).not.toHaveBeenCalled();
    expect(fieldManager.disableWidgetHighlighting).not.toHaveBeenCalled();
  });

  it('does not update widget highlighting when Redux and core are both disabled', () => {
    fieldManager.isWidgetHighlightingEnabled.mockReturnValue(false);
    useSelectorMock.mockReturnValue(false);

    renderHook(() => useWidgetHighlightingSync());

    expect(fieldManager.enableWidgetHighlighting).not.toHaveBeenCalled();
    expect(fieldManager.disableWidgetHighlighting).not.toHaveBeenCalled();
  });
});
