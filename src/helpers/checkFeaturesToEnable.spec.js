import checkFeaturesToEnable from './checkFeaturesToEnable';
import { getInstanceNode } from './getRootNode';

jest.mock('./getRootNode', () => {
  const original = jest.requireActual('./getRootNode'); // Step 2.

  return {
    ...original,
    getInstanceNode: jest.fn(() => {})
  };
});

describe('checkFeaturesToEnable', () => {
  it('Should call checkFeaturesToEnable functions', () => {
    const mockMethod = jest.fn();
    const mockMethod2 = jest.fn();
    const mockMethod3 = jest.fn();
    const mockMethod4 = jest.fn();
    getInstanceNode.mockImplementation(() => {
      return {
        instance: {
          UI: {
            enableFeatures: mockMethod,
            enableFilePicker: mockMethod2,
            enableRedaction: mockMethod3,
            enableMeasurement: mockMethod4,
          }
        }
      };
    });
    const instance = getInstanceNode().instance;
    checkFeaturesToEnable({
      arcMeasurementToolButton: {
        toolName: 'AnnotationCreateArcMeasurement',
        dataElement: 'arcMeasurementToolButton',
      },
      contentEditButton: {
        toolName: 'ContentEditTool',
        dataElement: 'contentEditButton',
      }
    });

    expect(instance.UI.enableFeatures).toHaveBeenCalledTimes(1);
    expect(instance.UI.enableFilePicker).not.toBeCalled();
    expect(instance.UI.enableMeasurement).toHaveBeenCalledTimes(1);
    expect(instance.UI.enableRedaction).not.toBeCalled();
  });
});