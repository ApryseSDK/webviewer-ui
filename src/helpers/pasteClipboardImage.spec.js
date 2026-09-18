import core from 'core';
import pasteClipboardImage from './pasteClipboardImage';

describe('pasteClipboardImage', () => {
  let annotationManager;
  let clipboardDescriptor;
  let documentViewer;
  let stampTool;
  let event;

  beforeAll(() => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  });

  beforeEach(() => {
    window.Core = {
      Tools: {
        ToolNames: {
          STAMP: 'AnnotationCreateStamp',
        },
      },
    };
    annotationManager = {
      deselectAllAnnotations: jest.fn(),
      isReadOnlyModeEnabled: jest.fn(() => false),
      selectAnnotation: jest.fn(),
    };
    stampTool = {
      createAnnotationFromFile: jest.fn().mockResolvedValue({ Id: 'stamp' }),
    };
    documentViewer = {
      getAnnotationManager: jest.fn(() => annotationManager),
      getViewerCoordinatesFromMouseLocation: jest.fn(() => ({ x: 25, y: 50, pageNumber: 2 })),
      getTool: jest.fn(() => stampTool),
    };
    core.getDocumentViewer = jest.fn(() => documentViewer);
    event = {
      clipboardData: {
        items: [{
          getAsFile: jest.fn(() => ({ type: 'image/png' })),
          kind: 'file',
          type: 'image/png',
        }],
      },
      preventDefault: jest.fn(),
    };
  });

  afterEach(() => {
    if (clipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    } else {
      delete navigator.clipboard;
    }
  });

  it('creates and selects a stamp at the current mouse position', async () => {
    const result = await pasteClipboardImage(event, 3);

    expect(result).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(documentViewer.getTool).toHaveBeenCalledWith('AnnotationCreateStamp');
    expect(stampTool.createAnnotationFromFile).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'image/png' }),
      { x: 25, y: 50, pageNumber: 2 },
    );
    expect(annotationManager.deselectAllAnnotations).toHaveBeenCalled();
    expect(annotationManager.selectAnnotation).toHaveBeenCalledWith({ Id: 'stamp' });
  });

  it('prevents the default browser paste synchronously for event clipboard images', async () => {
    const pastePromise = pasteClipboardImage(event, 3);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    await expect(pastePromise).resolves.toBe(true);
  });

  it('ignores image formats unsupported by the Stamp tool', async () => {
    event.clipboardData.items[0].type = 'image/gif';
    event.clipboardData.items[0].getAsFile.mockReturnValue({ type: 'image/gif' });

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(stampTool.createAnnotationFromFile).not.toHaveBeenCalled();
  });

  it('creates a stamp from clipboard files exposed by Firefox', async () => {
    event.clipboardData = {
      files: [{ type: 'image/png' }],
      items: [],
    };

    expect(await pasteClipboardImage(event, 3)).toBe(true);
    expect(stampTool.createAnnotationFromFile).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'image/png' }),
      { x: 25, y: 50, pageNumber: 2 },
    );
  });

  it('uses the extracted file MIME type when the clipboard item MIME type is empty', async () => {
    event.clipboardData.items[0].type = '';

    expect(await pasteClipboardImage(event, 3)).toBe(true);
    expect(stampTool.createAnnotationFromFile).toHaveBeenCalled();
  });

  it('creates a stamp from an image exposed by the navigator clipboard', async () => {
    event.clipboardData = { files: [], items: [] };
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: jest.fn().mockResolvedValue([{
          getType: jest.fn().mockResolvedValue(new Blob(['image'], { type: 'image/png' })),
          types: ['text/html', 'image/png'],
        }]),
      },
    });

    expect(await pasteClipboardImage(event, 3)).toBe(true);
    expect(stampTool.createAnnotationFromFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'clipboard-image.png', type: 'image/png' }),
      { x: 25, y: 50, pageNumber: 2 },
    );
  });

  it('creates a stamp from an image-only HTML clipboard payload', async () => {
    event.clipboardData = {
      files: [],
      getData: jest.fn(() => '<meta charset="utf-8"><span style="display: inline-block"><img style="width: 10px" src="data:image/png;base64,aW1hZ2U="></span>'),
      items: [],
    };

    expect(await pasteClipboardImage(event, 3)).toBe(true);
    expect(stampTool.createAnnotationFromFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'clipboard-image.png', type: 'image/png' }),
      { x: 25, y: 50, pageNumber: 2 },
    );
  });

  it('does not materialize clipboard HTML in the DOM', async () => {
    event.clipboardData = {
      files: [],
      getData: jest.fn(() => '<img style="width: 10px" src="data:image/png;base64,aW1hZ2U=">'),
      items: [],
    };
    const parseFromStringSpy = jest.spyOn(DOMParser.prototype, 'parseFromString');

    expect(await pasteClipboardImage(event, 3)).toBe(true);
    expect(parseFromStringSpy).not.toHaveBeenCalled();
    parseFromStringSpy.mockRestore();
  });

  it('creates a stamp from image-only HTML exposed by the navigator clipboard', async () => {
    event.clipboardData = { files: [], items: [] };
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: jest.fn().mockResolvedValue([{
          getType: jest.fn().mockResolvedValue({
            text: jest.fn().mockResolvedValue('<img src="data:image/jpeg;base64,aW1hZ2U=">'),
          }),
          types: ['text/html'],
        }]),
      },
    });

    expect(await pasteClipboardImage(event, 3)).toBe(true);
    expect(stampTool.createAnnotationFromFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'clipboard-image.jpg', type: 'image/jpeg' }),
      { x: 25, y: 50, pageNumber: 2 },
    );
  });

  it('does not extract an image from mixed HTML content', async () => {
    event.clipboardData = {
      files: [],
      getData: jest.fn(() => '<p>Caption</p><img src="data:image/png;base64,aW1hZ2U=">'),
      items: [],
    };

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(stampTool.createAnnotationFromFile).not.toHaveBeenCalled();
  });

  it('rejects malformed HTML without scanning tags through backtracking', async () => {
    event.clipboardData = {
      files: [],
      getData: jest.fn(() => '<'.repeat(100000)),
      items: [],
    };

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(stampTool.createAnnotationFromFile).not.toHaveBeenCalled();
  });

  it('does not consume the paste when navigator clipboard access is denied', async () => {
    event.clipboardData = { files: [], items: [] };
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: jest.fn().mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError')),
      },
    });

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(stampTool.createAnnotationFromFile).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('warns when reading the navigator clipboard fails unexpectedly', async () => {
    event.clipboardData = { files: [], items: [] };
    const error = new TypeError('Clipboard item is malformed');
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        read: jest.fn().mockRejectedValue(error),
      },
    });

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to read an image from the navigator clipboard.',
      error,
    );
    consoleWarnSpy.mockRestore();
  });

  it('does not create a stamp outside a document page', async () => {
    documentViewer.getViewerCoordinatesFromMouseLocation.mockReturnValue(null);

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(stampTool.createAnnotationFromFile).not.toHaveBeenCalled();
  });

  it('does not create a stamp in read-only mode', async () => {
    annotationManager.isReadOnlyModeEnabled.mockReturnValue(true);

    expect(await pasteClipboardImage(event, 3)).toBe(false);
    expect(stampTool.createAnnotationFromFile).not.toHaveBeenCalled();
  });
});