import { addEventListener, removeEventListener } from './eventListener';
import {
  registerInstance,
  resetInstances,
  runWithInstance,
  setCurrentInstanceId,
  setDocumentViewer,
  getDocumentViewer,
} from './documentViewers';

jest.mock('core', () => ({ __esModule: true, default: jest.requireActual('./documentViewers') }));

const createDocumentViewer = () => {
  const emitter = new window.Core.EventHandler();
  const annotationManager = { getEditBoxManager: () => ({}), getFormFieldCreationManager: () => ({}) };
  return Object.assign(emitter, {
    getAnnotationManager: () => annotationManager,
    getContentEditManager: () => ({}),
    getAnnotationHistoryManager: () => ({}),
    getMeasurementManager: () => ({}),
    getAccessibleReadingOrderManager: () => ({}),
    getSpreadsheetEditorManager: () => ({}),
  });
};

describe('core event listeners across instances', () => {
  let viewerA;
  let viewerB;

  beforeEach(() => {
    registerInstance(1);
    registerInstance(2);
    viewerA = setDocumentViewer(1, createDocumentViewer(), 1);
    viewerB = setDocumentViewer(1, createDocumentViewer(), 2);
  });

  afterEach(() => {
    resetInstances();
  });

  it('should run a listener against the instance that registered it, not the one last interacted with', () => {
    let resolvedViewer;
    runWithInstance(1, () => addEventListener('documentLoaded', () => {
      resolvedViewer = getDocumentViewer();
    }));

    setCurrentInstanceId(2);
    viewerA.trigger('documentLoaded');

    expect(resolvedViewer).toBe(viewerA);
  });

  it('should attach the same handler independently to each instance and remove only the requested one', () => {
    const handler = jest.fn();
    runWithInstance(1, () => addEventListener('documentLoaded', handler));
    runWithInstance(2, () => addEventListener('documentLoaded', handler));

    runWithInstance(1, () => removeEventListener('documentLoaded', handler));
    viewerA.trigger('documentLoaded');
    viewerB.trigger('documentLoaded');

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
