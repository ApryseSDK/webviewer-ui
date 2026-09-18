import core from 'core';
import pasteClipboardText from './pasteClipboardText';

describe('pasteClipboardText', () => {
  let annotationManager;
  let documentViewer;
  let event;
  let freeTextTool;

  beforeEach(() => {
    window.Core = {
      Tools: {
        ToolNames: {
          FREETEXT: 'AnnotationCreateFreeText',
          FREETEXT2: 'AnnotationCreateFreeText2',
          FREETEXT3: 'AnnotationCreateFreeText3',
          FREETEXT4: 'AnnotationCreateFreeText4',
        },
      },
    };
    annotationManager = {
      deselectAllAnnotations: jest.fn(),
      isReadOnlyModeEnabled: jest.fn(() => false),
      selectAnnotation: jest.fn(),
    };
    freeTextTool = {
      createAnnotation: jest.fn(() => ({ Id: 'free-text' })),
    };
    documentViewer = {
      getAnnotationManager: jest.fn(() => annotationManager),
      getTool: jest.fn(() => freeTextTool),
      getToolMode: jest.fn(() => ({ name: 'AnnotationEdit' })),
      getViewerCoordinatesFromMouseLocation: jest.fn(() => ({ x: 25, y: 50, pageNumber: 2 })),
    };
    core.getDocumentViewer = jest.fn(() => documentViewer);
    event = {
      clipboardData: {
        getData: jest.fn(() => 'Clipboard text'),
      },
      preventDefault: jest.fn(),
    };
  });

  it('creates and selects a FreeText annotation at the current mouse position', () => {
    expect(pasteClipboardText(event, 3)).toBe(true);

    expect(documentViewer.getTool).toHaveBeenCalledWith('AnnotationCreateFreeText');
    expect(freeTextTool.createAnnotation).toHaveBeenCalledWith(
      'Clipboard text',
      { x: 25, y: 50, pageNumber: 2 },
    );
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(annotationManager.deselectAllAnnotations).toHaveBeenCalled();
    expect(annotationManager.selectAnnotation).toHaveBeenCalledWith({ Id: 'free-text' });
  });

  it('uses the active FreeText preset', () => {
    const activeFreeTextTool = {
      createAnnotation: jest.fn(() => ({ Id: 'active-free-text' })),
      name: 'AnnotationCreateFreeText3',
    };
    documentViewer.getToolMode.mockReturnValue(activeFreeTextTool);

    expect(pasteClipboardText(event, 3)).toBe(true);

    expect(activeFreeTextTool.createAnnotation).toHaveBeenCalledWith(
      'Clipboard text',
      { x: 25, y: 50, pageNumber: 2 },
    );
    expect(documentViewer.getTool).not.toHaveBeenCalled();
  });

  it('uses text captured before asynchronous clipboard handling', () => {
    event.clipboardData.getData.mockReturnValue('');

    expect(pasteClipboardText(event, 3, 'Captured clipboard text')).toBe(true);

    expect(freeTextTool.createAnnotation).toHaveBeenCalledWith(
      'Captured clipboard text',
      { x: 25, y: 50, pageNumber: 2 },
    );
  });

  it('does not create an annotation for an empty clipboard', () => {
    event.clipboardData.getData.mockReturnValue('');

    expect(pasteClipboardText(event, 3)).toBe(false);
    expect(core.getDocumentViewer).not.toHaveBeenCalled();
  });

  it('does not create an annotation outside a document page', () => {
    documentViewer.getViewerCoordinatesFromMouseLocation.mockReturnValue(null);

    expect(pasteClipboardText(event, 3)).toBe(false);
    expect(freeTextTool.createAnnotation).not.toHaveBeenCalled();
  });

  it('does not create an annotation in read-only mode', () => {
    annotationManager.isReadOnlyModeEnabled.mockReturnValue(true);

    expect(pasteClipboardText(event, 3)).toBe(false);
    expect(freeTextTool.createAnnotation).not.toHaveBeenCalled();
  });
});