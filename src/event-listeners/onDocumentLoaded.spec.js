import { shouldDisableLayersPanel } from './onDocumentLoaded';
import { workerTypes } from '../constants/types';

describe('shouldDisableLayersPanel', function() {
  it('should return true if document is not client side initialized (forceClientSideInit is false) and WebViewer Server is running', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => true,
      getType: () => workerTypes.WEBVIEWER_SERVER,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(true);
  });

  it('should return false if WebViewer Server is not running even if somehow the document type is WVS', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => true,
      getType: () => workerTypes.PDF,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(false);
  });

  it('should return false if document is client side initialized (forceClientSideInit is true)', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => false,
      getType: () => workerTypes.WEBVIEWER_SERVER,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(false);
  });

  it('should return false if document is client side initialized (forceClientSideInit is true) and WebViewer Server is not running', async () => {
    const mockDoc = {
      isWebViewerServerDocument: () => false,
      getType: () => workerTypes.PDF,
    };

    const result = shouldDisableLayersPanel(mockDoc);
    expect(result).toEqual(false);
  });
});
