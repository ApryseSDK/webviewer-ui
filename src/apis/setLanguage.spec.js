import { updateArcMeasurementLabels } from './setLanguage';
import selectors from 'selectors';
import core from 'core';

jest.mock('selectors');
jest.mock('core');

const t = (key) => `translated:${key}`;

const makeStore = () => ({
  getState: () => ({}),
});

describe('updateArcMeasurementLabels', () => {
  let setDefaultMeasurementLabelsHandler;
  let originalIsApryseWebViewerWebComponent;

  beforeEach(() => {
    setDefaultMeasurementLabelsHandler = jest.fn();
    window.Core = {
      Tools: {
        ArcMeasurementCreateTool: { setDefaultMeasurementLabelsHandler },
      },
    };
    originalIsApryseWebViewerWebComponent = window.isApryseWebViewerWebComponent;
    selectors.getActiveDocumentViewerKey.mockReturnValue(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.isApryseWebViewerWebComponent = originalIsApryseWebViewerWebComponent;
  });

  it('scopes the handler to the active DocumentViewer when one is resolvable', () => {
    const documentViewer = {};
    core.hasDocumentViewer.mockReturnValue(true);
    core.getDocumentViewer.mockReturnValue(documentViewer);

    updateArcMeasurementLabels(t, makeStore());

    expect(setDefaultMeasurementLabelsHandler).toHaveBeenCalledTimes(1);
    const [handler, scopedDocumentViewer] = setDefaultMeasurementLabelsHandler.mock.calls[0];
    expect(scopedDocumentViewer).toBe(documentViewer);
    expect(handler()).toEqual({
      length: 'translated:option.measurementOverlay.length',
      radius: 'translated:option.measurementOverlay.radius',
      angle: 'translated:option.measurementOverlay.angle',
    });
  });

  it('does not register a global handler in Web Component multi-instance mode when no DocumentViewer is resolvable, to avoid leaking labels across instances', () => {
    window.isApryseWebViewerWebComponent = true;
    core.hasDocumentViewer.mockReturnValue(false);

    updateArcMeasurementLabels(t, makeStore());

    expect(setDefaultMeasurementLabelsHandler).not.toHaveBeenCalled();
  });

  it('falls back to the global handler in single-instance (non-Web Component) mode when no DocumentViewer is resolvable', () => {
    window.isApryseWebViewerWebComponent = false;
    core.hasDocumentViewer.mockReturnValue(false);

    updateArcMeasurementLabels(t, makeStore());

    expect(setDefaultMeasurementLabelsHandler).toHaveBeenCalledTimes(1);
    const [handler, scopedDocumentViewer] = setDefaultMeasurementLabelsHandler.mock.calls[0];
    expect(scopedDocumentViewer).toBe(undefined);
    expect(handler()).toEqual({
      length: 'translated:option.measurementOverlay.length',
      radius: 'translated:option.measurementOverlay.radius',
      angle: 'translated:option.measurementOverlay.angle',
    });
  });
});
