import getMeasurementTools, { isMeasurementTool } from './getMeasurementTools';
import core from 'core';

jest.mock('core');

// Save original globals
const originalWindow = global.window;
const originalCore = global.window && global.window.Core;

beforeAll(() => {
  global.window = global.window || {};
  window.Core = window.Core || {};
  window.Core.Annotations = window.Core.Annotations || {};
  window.Core.Annotations.Annotation = window.Core.Annotations.Annotation || {};
  window.Core.Annotations.Annotation.MeasurementUnits = {
    PRIME_FT: 'ft',
    DOUBLE_PRIME_IN: 'in',
  };
});

afterAll(() => {
  if (originalCore === undefined && global.window) {
    delete global.window.Core;
  } else if (global.window) {
    global.window.Core = originalCore;
  }
  if (originalWindow === undefined) {
    delete global.window;
  } else {
    global.window = originalWindow;
  }
});

describe('getMeasurementTools', () => {
  let measurementTool1;
  let measurementTool2;
  let measurementTool3;
  let measurementTool4;
  let nonMeasurementTool1;
  let nonMeasurementTool2;
  let nonMeasurementTool3;

  beforeEach(() => {
    jest.clearAllMocks();

    measurementTool1 = { name: 'DistanceMeasurementTool', Measure: true, setSnapMode: jest.fn() };
    measurementTool2 = { name: 'AreaMeasurementTool', Measure: true, setSnapMode: jest.fn() };
    measurementTool3 = { name: 'PerimeterMeasurementTool', Measure: true, setSnapMode: jest.fn() };
    measurementTool4 = { name: 'RectangularAreaMeasurementTool', Measure: true, setSnapMode: jest.fn() };

    nonMeasurementTool1 = { name: 'AnnotationEdit', setSnapMode: jest.fn() };
    nonMeasurementTool2 = { name: 'Pan' };
    nonMeasurementTool3 = { name: 'TextSelect' };
  });

  it('should return measurement tools from a single viewer', () => {
    const mockViewer = {};

    core.getDocumentViewers.mockReturnValue([mockViewer]);
    core.getToolModeMap.mockReturnValue({
      DistanceMeasurement: measurementTool1,
      AreaMeasurement: measurementTool2,
      AnnotationEdit: nonMeasurementTool1,
    });

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(2);
    expect(tools).toContain(measurementTool1);
    expect(tools).toContain(measurementTool2);
    expect(tools).not.toContain(nonMeasurementTool1);
  });

  it('should return measurement tools from multiple viewers', () => {
    const mockViewer1 = {};
    const mockViewer2 = {};

    core.getDocumentViewers.mockReturnValue([mockViewer1, mockViewer2]);
    core.getToolModeMap.mockImplementation((viewerKey) => {
      if (viewerKey === 1) {
        return {
          DistanceMeasurement: measurementTool1,
          AreaMeasurement: measurementTool2,
          AnnotationEdit: nonMeasurementTool1,
        };
      }
      if (viewerKey === 2) {
        return {
          PerimeterMeasurement: measurementTool3,
          RectangularAreaMeasurement: measurementTool4,
          Pan: nonMeasurementTool2,
        };
      }
      return null;
    });

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(4);
    expect(tools).toContain(measurementTool1);
    expect(tools).toContain(measurementTool2);
    expect(tools).toContain(measurementTool3);
    expect(tools).toContain(measurementTool4);
    expect(tools).not.toContain(nonMeasurementTool1);
    expect(tools).not.toContain(nonMeasurementTool2);
  });

  it('should skip non-measurement tools', () => {
    const mockViewer = {};

    core.getDocumentViewers.mockReturnValue([mockViewer]);
    core.getToolModeMap.mockReturnValue({
      AnnotationEdit: nonMeasurementTool1,
      Pan: nonMeasurementTool2,
      TextSelect: nonMeasurementTool3,
    });

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(0);
  });

  it('should handle viewers with null or undefined toolModeMap', () => {
    const mockViewer1 = {};
    const mockViewer2 = {};
    const mockViewer3 = {};

    core.getDocumentViewers.mockReturnValue([mockViewer1, mockViewer2, mockViewer3]);
    core.getToolModeMap.mockImplementation((viewerKey) => {
      if (viewerKey === 1) {
        return {
          DistanceMeasurement: measurementTool1,
        };
      }
      return null;
    });

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(1);
    expect(tools).toContain(measurementTool1);
  });

  it('should handle empty toolModeMap', () => {
    const mockViewer = {};

    core.getDocumentViewers.mockReturnValue([mockViewer]);
    core.getToolModeMap.mockReturnValue({});

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(0);
  });

  it('should handle empty document viewers array', () => {
    core.getDocumentViewers.mockReturnValue([]);

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(0);
  });

  it('should filter out null or undefined tools', () => {
    const mockViewer = {};

    core.getDocumentViewers.mockReturnValue([mockViewer]);
    core.getToolModeMap.mockReturnValue({
      DistanceMeasurement: measurementTool1,
      NullTool: null,
      UndefinedTool: undefined,
    });

    const tools = getMeasurementTools();

    expect(tools).toHaveLength(1);
    expect(tools).toContain(measurementTool1);
  });
});

describe('isMeasurementTool', () => {
  it('should return true for tools with Measure property', () => {
    const tool = { name: 'DistanceMeasurementTool', Measure: true };
    expect(isMeasurementTool(tool)).toBe(true);
  });

  it('should return false for tools without Measure property', () => {
    const tool = { name: 'AnnotationEdit' };
    expect(isMeasurementTool(tool)).toBe(false);
  });

  it('should return false for null or undefined tools', () => {
    expect(isMeasurementTool(null)).toBe(false);
    expect(isMeasurementTool(undefined)).toBe(false);
  });

  it('should return false for tools with falsy Measure property', () => {
    const tool1 = { name: 'Tool1', Measure: false };
    const tool2 = { name: 'Tool2', Measure: 0 };
    const tool3 = { name: 'Tool3', Measure: '' };

    expect(isMeasurementTool(tool1)).toBe(false);
    expect(isMeasurementTool(tool2)).toBe(false);
    expect(isMeasurementTool(tool3)).toBe(false);
  });
});