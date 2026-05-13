import fireActiveDocumentViewerChanged from './fireActiveDocumentViewerChanged';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import core from 'core';

jest.mock('core');
jest.mock('helpers/fireEvent');

describe('fireActiveDocumentViewerChanged', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should deselect annotations in inactive viewers when switching', () => {
    const mockDeselectAllAnnotations1 = jest.fn();
    const mockDeselectAllAnnotations2 = jest.fn();
    const mockDeselectAllAnnotations3 = jest.fn();
    const mockDeselectAllAnnotations4 = jest.fn();


    const createMockTool = () => ({
      annotation: null,
      reset: jest.fn(),
      clearPendingAnnotations: jest.fn(),
    });

    const mockViewer1 = {
      getTool: jest.fn(() => createMockTool()),
      getAnnotationManager: jest.fn(() => ({
        deselectAllAnnotations: mockDeselectAllAnnotations1,
      })),
    };

    const mockViewer2 = {
      getTool: jest.fn(() =>  createMockTool()),
      getAnnotationManager: jest.fn(() => ({
        deselectAllAnnotations: mockDeselectAllAnnotations2,
      })),
    };

    const mockViewer3 = {
      getTool: jest.fn(() =>  createMockTool()),
      getAnnotationManager: jest.fn(() => ({
        deselectAllAnnotations: mockDeselectAllAnnotations3,
      })),
    };

    const mockViewer4 = {
      getTool: jest.fn(() =>  createMockTool()),
      getAnnotationManager: jest.fn(() => ({
        deselectAllAnnotations: mockDeselectAllAnnotations4,
      })),
    };

    core.getDocumentViewers.mockReturnValue([mockViewer1, mockViewer2, mockViewer3, mockViewer4]);

    fireActiveDocumentViewerChanged(1, 3);

    // Viewers 1, 2, and 4 are inactive, so they SHOULD deselect
    expect(mockDeselectAllAnnotations1).toHaveBeenCalledTimes(1);
    expect(mockDeselectAllAnnotations2).toHaveBeenCalledTimes(1);
    expect(mockDeselectAllAnnotations4).toHaveBeenCalledTimes(1);

    // Viewer 3 is active (key = 3), so it should NOT deselect
    expect(mockDeselectAllAnnotations3).not.toHaveBeenCalled();

    // Event should be fired
    expect(fireEvent).toHaveBeenCalledWith(Events.ACTIVE_DOCUMENT_VIEWER_CHANGED, {
      activeDocumentViewerKey: 3,
      previousDocumentViewerKey: 1,
    });
  });

  it('should reset crop and snipping tools in inactive viewers when switching', () => {
    const mockResetCrop = jest.fn();
    const mockResetSnipping = jest.fn();
    const mockViewer1 = {
      getTool: jest.fn((toolName) => {
        if (toolName === window.Core.Tools.ToolNames['CROP']) {
          return { annotation: null, reset: mockResetCrop };
        }
        if (toolName === window.Core.Tools.ToolNames['SNIPPING']) {
          return { annotation: null, reset: mockResetSnipping };
        }
        return { annotation: null, reset: jest.fn() };
      }),
      getAnnotationManager: jest.fn(() => ({ deselectAllAnnotations: jest.fn() })),
    };
    const mockViewer2 = {
      getTool: jest.fn(),
      getAnnotationManager: jest.fn(() => ({ deselectAllAnnotations: jest.fn() })),
    };
    core.getDocumentViewers.mockReturnValue([mockViewer1, mockViewer2]);

    fireActiveDocumentViewerChanged(1, 2);

    // Viewer 1 is inactive, so its tools should be reset
    expect(mockResetCrop).toHaveBeenCalledTimes(1);
    expect(mockResetSnipping).toHaveBeenCalledTimes(1);
    // Viewer 2 is active, so its tools should not be reset
    expect(mockViewer2.getTool).not.toHaveBeenCalled();
  });

  it('should reset polyline tool in inactive viewers when switching', () => {
    const { PolylineCreateTool } = window.Core.Tools;

    class TestPolylineTool extends PolylineCreateTool {
      constructor() {
        super({}, 'TestPolyline');
      }
    }

    const mockReset = jest.fn();

    const polylineToolInstance = new TestPolylineTool();
    polylineToolInstance.annotation = {};
    polylineToolInstance.reset = mockReset;

    const mockViewer1 = {
      getTool: jest.fn((toolName) => {
        if (toolName === window.Core.Tools.ToolNames['POLYLINE']) {
          return polylineToolInstance;
        }
        return { annotation: null, reset: jest.fn() };
      }),
      getAnnotationManager: jest.fn(() => ({ deselectAllAnnotations: jest.fn() })),
    };

    const mockViewer2 = {
      getTool: jest.fn(),
      getAnnotationManager: jest.fn(() => ({ deselectAllAnnotations: jest.fn() })),
    };
    core.getDocumentViewers.mockReturnValue([mockViewer1, mockViewer2]);

    fireActiveDocumentViewerChanged(1, 2);

    // Viewer 1 is inactive, so its polyline tool should clear pending annotations
    expect(mockReset).toHaveBeenCalledTimes(1);
    // Viewer 2 is active, so its tools should not be interacted with
    expect(mockViewer2.getTool).not.toHaveBeenCalled();
  });
});
