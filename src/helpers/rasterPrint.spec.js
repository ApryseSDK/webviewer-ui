import { createRasterizedPrintPages, cancelPrint } from './rasterPrint';
import { registerInstance, resetInstances, runWithInstance, setCurrentInstanceId, setDocumentViewer } from 'core/documentViewers';

const createPrintingViewer = (canvasId) => {
  const document = {
    loadCanvas: jest.fn(() => canvasId),
    cancelLoadCanvas: jest.fn(),
    getPageInfo: () => ({ width: 100, height: 100 }),
  };
  const core = {
    getDocument: () => document,
    getCompleteRotation: () => 0,
    getRotation: () => 0,
    getPageInfo: () => ({ width: 100, height: 100 }),
    getAnnotationsList: () => [],
    getDocumentViewer: () => ({ isAlwaysPrintAnnotationsInColorEnabled: () => false }),
    drawAnnotations: jest.fn(() => Promise.resolve()),
  };
  return { document, core, documentViewer: { getDocument: () => document } };
};

describe('raster print with two WebViewer instances', () => {
  beforeEach(() => {
    registerInstance(1);
    registerInstance(2);
  });

  afterEach(() => {
    resetInstances();
  });

  it('should cancel only the pending pages of the instance that cancels the print', () => {
    const first = createPrintingViewer('first-canvas');
    const second = createPrintingViewer('second-canvas');
    setDocumentViewer(1, first.documentViewer, 1);
    setDocumentViewer(1, second.documentViewer, 2);

    runWithInstance(1, () => createRasterizedPrintPages(first.core, [1], {}));
    runWithInstance(2, () => createRasterizedPrintPages(second.core, [1], {}));
    runWithInstance(1, cancelPrint);

    expect(first.document.cancelLoadCanvas).toHaveBeenCalledWith('first-canvas');
    expect(first.document.cancelLoadCanvas).not.toHaveBeenCalledWith('second-canvas');
    expect(second.document.cancelLoadCanvas).not.toHaveBeenCalled();
  });

  it('should track the print job in the instance it was started for when another instance is current', () => {
    const first = createPrintingViewer('first-canvas');
    const second = createPrintingViewer('second-canvas');
    setDocumentViewer(1, first.documentViewer, 1);
    setDocumentViewer(1, second.documentViewer, 2);

    setCurrentInstanceId(2);
    createRasterizedPrintPages(first.core, [1], {}, undefined, 1);
    runWithInstance(2, cancelPrint);
    expect(first.document.cancelLoadCanvas).not.toHaveBeenCalled();

    runWithInstance(1, cancelPrint);
    expect(first.document.cancelLoadCanvas).toHaveBeenCalledWith('first-canvas');
  });

  it('should stop tracking a finished page only in the instance that printed it', async () => {
    const first = createPrintingViewer('first-canvas');
    const second = createPrintingViewer('second-canvas');
    setDocumentViewer(1, first.documentViewer, 1);
    setDocumentViewer(1, second.documentViewer, 2);

    const [firstPage] = createRasterizedPrintPages(first.core, [1], { includeAnnotations: false, createCanvases: true }, undefined, 1);
    createRasterizedPrintPages(second.core, [1], {}, undefined, 2);
    setCurrentInstanceId(2);
    const canvas = document.createElement('canvas');
    canvas.toDataURL = () => 'data:image/png;base64,';
    first.document.loadCanvas.mock.calls[0][0].drawComplete(canvas);
    await firstPage;
    runWithInstance(1, cancelPrint);
    runWithInstance(2, cancelPrint);

    expect(first.document.cancelLoadCanvas).not.toHaveBeenCalled();
    expect(second.document.cancelLoadCanvas).toHaveBeenCalledWith('second-canvas');
  });
});
